// TODO: Script para el banner en el conversor de divisas - criptomonedas
async function fetchCryptoData() {
  try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const data = await response.json();

      // Crear el contenido del banner
      let bannerContent = '';
      data.forEach(coin => {
          const changeText = coin.price_change_percentage_24h > 0 
              ? `↑ ${coin.price_change_percentage_24h.toFixed(2)}%` 
              : `↓ ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%`;
          bannerContent += `
              <div class="crypto-item">
                  <span class="crypto-name">${coin.name}</span>
                  <span class="crypto-price">$${coin.current_price.toFixed(2)}</span>
                  <span class="crypto-change" style="color: ${coin.price_change_percentage_24h > 0 ? 'green' : 'red'};">(${changeText})</span>
              </div>
          `;
      });

      // Actualizar el contenido del banner
      document.getElementById('banner-content').innerHTML = bannerContent;

      // Iniciar la animación después de un pequeño retraso
      setTimeout(() => {
          document.getElementById('banner-content').classList.add('marquee');
      }, 3000); // 3 segundos de retraso
  } catch (error) {
      console.error("Error fetching crypto data:", error);
      document.getElementById('banner-content').textContent = "Error al cargar datos de criptomonedas.";
  }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", fetchCryptoData);


// TODO: Claves de API
const apiKeyExchangeRate = "f390895452a9366a9eeff7c3"; // Reemplaza con tu propia clave de API
const apiKeyNews = "fb98581019a54258bd249f25b15a0e62"; // Clave de API de NewsAPI

// TODO: Elementos del DOM
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const resultParagraph = document.getElementById("result");
const historyList = document.getElementById("history-list");
const refreshButton = document.getElementById("refresh");

// Almacenar tasas de cambio anteriores
const previousRates = {};

// Carga inicial de datos
document.addEventListener("DOMContentLoaded", async () => {
  await loadCurrencies(); // Cargar las monedas al inicio
});

// Manejo del formulario de conversión de monedas
document
  .getElementById("currency-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const amount = amountInput.value;
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    if (amount && fromCurrency && toCurrency) {
      const conversionRate = await getConversionRate(fromCurrency, toCurrency);
      if (conversionRate) {
        const convertedAmount = (amount * conversionRate).toFixed(2);
        resultParagraph.textContent = `${parseFloat(amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fromCurrency} = ${parseFloat(convertedAmount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`;
        addToHistory(amount, fromCurrency, convertedAmount, toCurrency); // Agregar al historial
      } else {
        resultParagraph.textContent =
          "La moneda de origen o destino no está soportada.";
      }
    } else {
      resultParagraph.textContent = "Por favor, completa todos los campos.";
    }
  });

// Actualizar tasas de conversión
refreshButton.addEventListener("click", async () => {
  await loadCurrencies(); // Cargar las monedas nuevamente
  resultParagraph.textContent = "Tasas de conversión actualizadas.";
});

// Función Carga las monedas y las agrega a los selectores de origen y destino.
async function loadCurrencies() {
  const currencies = [
    { code: "USD", name: "Dólar Estadounidense" },
    { code: "EUR", name: "Euro" },
    { code: "COP", name: "Peso Colombiano" },
    { code: "VES", name: "Bolívar venezolanos" }
  ];

  fromSelect.innerHTML = ""; // Limpiar opciones anteriores
  toSelect.innerHTML = ""; // Limpiar opciones anteriores

  for (const currency of currencies) {
    const currentRate = await getCurrentRate(currency.code);
    const previousRate = previousRates[currency.code] || currentRate;

    // Actualizar la tasa anterior
    previousRates[currency.code] = currentRate;

    const fromOption = document.createElement("option");
    fromOption.value = currency.code;
    fromOption.textContent = `${currency.name} (${currency.code})`;
    fromSelect.appendChild(fromOption);

    const toOption = document.createElement("option");
    toOption.value = currency.code;
    toOption.textContent = `${currency.name} (${currency.code})`;
    toSelect.appendChild(toOption);
  }

  // Establecer valores predeterminados
  fromSelect.value = "USD"; // Dólares como moneda a convertir
  toSelect.value = "COP"; // Pesos Colombianos como moneda a obtener
}

// Función para obtener la tasa de cambio actual de una moneda
async function getCurrentRate(currency) {
  const apiUrl = `https://api.exchangerate-api.com/v4/latest/${currency}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    const data = await response.json();
    return data.rates; // Retorna las tasas de cambio
  } catch (error) {
    console.error("Error al obtener la tasa de cambio actual:", error);
    return null;
  }
}

// Función Obtén la tasa de conversión entre dos monedas desde la API de ExchangeRate-API.
async function getConversionRate(from, to) {
  const apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(
        "Error en la respuesta de la API:",
        response.status,
        response.statusText
      );
      throw new Error("Error en la respuesta de la API");
    }
    const data = await response.json();
    if (data.rates && data.rates[to]) {
      return data.rates[to];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la tasa de conversión:", error);
    resultParagraph.textContent =
      "Error al obtener la tasa de conversión. Intenta de nuevo más tarde.";
  }
}

// Función para agregar un elemento al historial de conversiones
function addToHistory(amount, fromCurrency, convertedAmount, toCurrency) {
  const historyItem = document.createElement("li");
  historyItem.textContent = `${parseFloat(amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fromCurrency} = ${parseFloat(convertedAmount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`;
  historyList.appendChild(historyItem);
}

// Mostrar el conversor al cargar la página
window.onload = function() {
  document.getElementById("converter-container").style.display = "block";
};

// Lógica para mostrar el conversor (no se usará después de cerrarlo)
document.getElementById("show-converter").addEventListener("click", function() {
  document.getElementById("converter-container").style.display = "block";
});

// Lógica para ocultar el conversor
document.getElementById("close-converter").addEventListener("click", function() {
  document.getElementById("converter-container").style.display = "none";
});



// Variables globales para almacenar los precios
let precioBcv = 0;
let precioParalelo = 0;
let precioEuroBcv = 0; // Nueva variable para el precio del euro

const apiKeyExchangeRateEuro = "f390895452a9366a9eeff7c3"; // Reemplaza con tu propia clave de API

async function obtenerDatosBcv() {
  try {
    const respuesta = await fetch("https://pydolarve.org/api/v1/dollar?page=bcv");
    if (!respuesta.ok) {
      const errorDetails = await respuesta.text();
      throw new Error("Error en la solicitud: " + respuesta.status + " - " + errorDetails);
    }
    const datos = await respuesta.json();
    console.log("Datos cargados:", datos);
    mostrarDatosBcv(datos);
  } catch (error) {
    console.error("Error al obtener datos de BCV:", error);
    document.getElementById("resultadoBcv").textContent = "Error al cargar los datos del Dólar BCV.";
  }
}

async function obtenerDatosParalelo() {
  try {
    const respuesta = await fetch("https://pydolarve.org/api/v1/dollar?monitor=enparalelovzla");
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud: " + respuesta.status);
    }
    const datos = await respuesta.json();
    console.log("Datos cargados:", datos);
    mostrarDatos(datos);
  } catch (error) {
    console.error("Error al obtener datos del Dólar Paralelo:", error);
    document.getElementById("resultado").textContent = "Error al cargar los datos del Dólar Paralelo.";
  }
}

async function obtenerDatosEuro() {
  try {
    // Cambia la URL a la API de ExchangeRate para obtener el valor del euro
    const respuesta = await fetch(`https://api.exchangerate-api.com/v4/latest/EUR`); // Asegúrate de que esta URL sea correcta
    if (!respuesta.ok) {
      const errorDetails = await respuesta.text();
      throw new Error("Error en la solicitud: " + respuesta.status + " - " + errorDetails);
    }
    const datos = await respuesta.json();
    console.log("Datos cargados:", datos);
    
    // Suponiendo que el valor del bolívar está en la respuesta
    precioEuroBcv = datos.rates.VES; // Asegúrate de que "VES" sea el código correcto para el bolívar
    mostrarDatosEuro(precioEuroBcv);
  } catch (error) {
    console.error("Error al obtener datos del Euro:", error);
    document.getElementById("resultadoEuro").textContent = "Error al cargar los datos del Euro.";
  }
}

function mostrarDatosBcv(datos) {
  const contenedor = document.getElementById("resultadoBcv");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  if (datos && datos.monitors && datos.monitors.usd) {
    const usdData = datos.monitors.usd;
    precioBcv = usdData.price; // Guardar el precio BCV

    // Mostrar datos en la tabla
    const tabla = crearTabla(usdData.last_update, usdData.price);
    contenedor.appendChild(tabla);
    calcularDiferencia(); // Calcular diferencia después de obtener el precio BCV
  } else {
    contenedor.textContent = "No se encontraron datos disponibles.";
  }
}

function mostrarDatos(datos) {
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  precioParalelo = datos.price; // Guardar el precio paralelo

  const tabla = crearTabla(datos.last_update, datos.price);
  contenedor.appendChild(tabla);
  calcularDiferencia(); // Calcular diferencia después de obtener el precio paralelo
}

function mostrarDatosEuro(precio) {
  const contenedor = document.getElementById("resultadoEuro");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  // Mostrar datos en la tabla
  const tabla = crearTabla(new Date().toLocaleString(), precio); // Usar la fecha actual como última actualización
  contenedor.appendChild(tabla);
}

function crearTabla(ultimaActualizacion, precio) {
  const tabla = document.createElement("table");
  const encabezado = tabla.createTHead();
  const filaEncabezado = encabezado.insertRow(0);
  const encabezados = ["Última Actualización", "Precio (Bs)"];
  
  encabezados.forEach((encabezado, index) => {
    const celda = filaEncabezado.insertCell(index);
    celda.innerHTML = `<strong>${encabezado}</strong>`;
  });

  const cuerpoTabla = tabla.createTBody();
  const filaDatos = cuerpoTabla.insertRow(0);
  filaDatos.insertCell(0).innerText = ultimaActualizacion;
  filaDatos.insertCell(1).innerText = precio;

  return tabla;
}

// Llamadas iniciales para cargar los datos
obtenerDatosBcv();
obtenerDatosParalelo();
obtenerDatosEuro();


// TODO: Diferencia y porcentaje
function calcularDiferencia() {
  if (precioBcv > 0 && precioParalelo > 0) {
    const diferencia = precioParalelo - precioBcv;
    const porcentaje = (( diferencia / precioBcv) * 100).toFixed(2);
    
    document.getElementById("diferenciaValor").textContent = `Diferencia: Bs ${diferencia.toFixed(2)}`;
    document.getElementById("diferenciaPorcentaje").textContent = `Diferencia en porcentaje: ${porcentaje}%`;
  }
}

// Agregar evento de clic al botón para actualizar datos
document.getElementById("actualizar").addEventListener("click", () => {
  obtenerDatosBcv();
  obtenerDatosParalelo();
});

// Llamar a la función al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  obtenerDatosBcv();
  obtenerDatosParalelo();
});



// TODO: Obtener el valor del dolar y los factores de conversion entre Dolar Pesos y Bolivares
// TODO: Valores del dolar
// *** Valor del dolar en pesos colombianos TRM
let valorDolarEnCOP;

async function obtenerValorDolarEnCOP() {
  const url = "https://api.exchangerate-api.com/v4/latest/USD";

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error("Error al obtener los datos");
    }

    const datos = await respuesta.json();
    valorDolarEnCOP = datos.rates.COP;

    // Mostrar el valor en el elemento HTML
    document.getElementById("valorDolar").innerHTML = 
      `El precio dólar en Colombia es: <span class="estiloDolar"> <br> ${valorDolarEnCOP} $</span>`;
    
    calcularFactores(); // Llamar a la función para calcular factores
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("valorDolar").textContent =
      "Error al obtener el valor del dólar.";
  }
}

// *** Valor del dolar en bolivares BCV
let valorDolarEnVES;
async function obtenerValorDolarEnVES() {
  const url = "https://pydolarve.org/api/v1/dollar?page=bcv";

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud: " + respuesta.status);
    }

    const datos = await respuesta.json();
    const usdData = datos.monitors.usd; // Acceder al objeto 'usd'
    valorDolarEnVES = usdData.price; // Precio

    // Mostrar el valor en el elemento HTML
    document.getElementById(
      "valorDolarBs"
    ).textContent = `El valor del dólar en bolívares es: ${valorDolarEnVES}`;
    calcularFactores(); // Llamar a la función para calcular factores
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("valorDolarBs").textContent =
      "Error al obtener el valor del dólar.";
  }
}

// *** Valor del dolar en bolivares Paralelo
let valorDolarParalelo;
async function obtenerValorDolarParalelo() {
  const url = "https://pydolarve.org/api/v1/dollar?monitor=enparalelovzla";

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud: " + respuesta.status);
    }

    const datos = await respuesta.json();
    valorDolarParalelo = datos.price; // Acceder al precio del dólar paralelo

    // Mostrar el valor en el elemento HTML
    document.getElementById(
      "valorDolarParalelo"
    ).textContent = `El valor del dólar paralelo en bolívares es: ${valorDolarParalelo}`;
    calcularFactores(); // Llamar a la función para calcular factores
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("valorDolarParalelo").textContent =
      "Error al obtener el valor del dólar paralelo.";
  }
}

// TODO Factores de conversión
let factorBCV; // Variable global para factorBCV
let factorParalelo; // Variable global para factorParalelo

// Función para calcular y mostrar los factores
function calcularFactores() {
  if (valorDolarEnCOP && valorDolarEnVES) {
    factorBCV = (valorDolarEnCOP / valorDolarEnVES).toFixed(2); // Asignamos el valor a factorBCV
    document.getElementById("factorBCV").innerHTML = `Factor (TRM_COP/BCV): <span class="estiloFactor"> <br> ${factorBCV}</span>`;
  }

  if (valorDolarEnCOP && valorDolarParalelo) {
    factorParalelo = (valorDolarEnCOP / valorDolarParalelo).toFixed(2); // Asignamos el valor a factorParalelo
    document.getElementById("factorParalelo").innerHTML = `Factor (TRM_COP/Paralelo): <span class="estiloFactor"> <br> ${factorParalelo}</span>`;
  }

  // Aquí puedes usar factorBCV y factorParalelo como necesites
  console.log(`Factor BCV: ${factorBCV}, Factor Paralelo: ${factorParalelo}`);
}

// Llamar a las funciones al cargar la página
window.onload = function () {
  obtenerValorDolarEnCOP();
  obtenerValorDolarEnVES();
  obtenerValorDolarParalelo();
  
  // Llamar a calcularFactores después de obtener los valores
  calcularFactores();
};

// TODO Función para convertir bolívares a pesos
function convertirBolivares() {
  const bolivares = parseFloat(document.getElementById("bolivaresInput").value);
  if (!isNaN(bolivares)) {
      const resultadoBCV = (bolivares * factorBCV).toFixed(2);
      const resultadoParalelo = (bolivares * factorParalelo).toFixed(2);
      document.getElementById("resultadoBCV").textContent = `BCV: ${parseFloat(resultadoBCV).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Pesos`;
      document.getElementById("resultadoParalelo").textContent = `PARALELO: ${parseFloat(resultadoParalelo).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Pesos`;
  } else {
      document.getElementById("resultadoBCV").textContent = `BCV: `;
      document.getElementById("resultadoParalelo").textContent = `PARALELO: `;
  }
}

// TODO Función para convertir pesos a bolívares
function convertirPesos() {
  const pesos = parseFloat(document.getElementById("pesosInput").value);
  if (!isNaN(pesos)) {
      const resultadoPesosBCV = (pesos / factorBCV).toFixed(2);
      const resultadoPesosParalelo = (pesos / factorParalelo).toFixed(2);
      document.getElementById("resultadoPesosBCV").textContent = `BCV: ${parseFloat(resultadoPesosBCV).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bolivares`;
      document.getElementById("resultadoPesosParalelo").textContent = `PARALELO: ${parseFloat(resultadoPesosParalelo).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bolivares`;
  } else {
      document.getElementById("resultadoPesosBCV").textContent = `BCV: `;
      document.getElementById("resultadoPesosParalelo").textContent = `PARALELO: `;
  }
}

// Función para resetear los cálculos
function resetearCalculos() {
  document.getElementById("bolivaresInput").value = '';
  document.getElementById("pesosInput").value = '';
  document.getElementById("resultadoBCV").textContent = `BCV: `;
  document.getElementById("resultadoParalelo").textContent = `PARALELO: `;
  document.getElementById("resultadoPesosBCV").textContent = `BCV: `;
  document.getElementById("resultadoPesosParalelo").textContent = `PARALELO: `;
}

// TODO: Cambio de Tema
// Elementos del DOM
const themeToggleButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

// Verifica si hay un tema guardado en localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeIcon.classList.remove("fa-sun");
  themeIcon.classList.add("fa-moon");
}

// Cambia el tema al hacer clic en el botón
themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
    localStorage.setItem("theme", "dark"); // Guarda la preferencia
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    localStorage.setItem("theme", "light"); // Guarda la preferencia
  }
});

// TODO: para actualizar la fecha y la hora:
function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
  });
  const time = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
  });
  document.getElementById("current-date").innerText = date;
  document.getElementById("current-time").innerText = time;
}

// TODO Función para obtener la temperatura
async function getTemperature() {
  const apiKey = '71e0a53f41608a0792ce91cf8914aa43'; // Tu clave de API
  const city = 'San Cristóbal, VE'; // Ciudad deseada
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      const temperature = data.main.temp;
      document.getElementById("temperature").innerText = temperature.toFixed(1); // Muestra la temperatura con un decimal
  } catch (error) {
      console.error("Error al obtener la temperatura:", error);
      document.getElementById("temperature").innerText = "Error";
  }
}

// Actualiza la fecha y la hora cada segundo
setInterval(updateDateTime, 1000);
updateDateTime();

// Obtiene la temperatura al cargar la página
getTemperature();


// TODO Función para obtener la temperatura, según tu Geolocalización
// function getLocation() {
//   if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//           const lat = position.coords.latitude;
//           const lon = position.coords.longitude;
//           const apiKey = '71e0a53f41608a0792ce91cf8914aa43';
//           const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

//           try {
//               const response = await fetch(url);
//               const data = await response.json();
//               const temperature = data.main.temp;
//               document.getElementById("temperature").innerText = temperature.toFixed(1);
//           } catch (error) {
//               console.error("Error al obtener la temperatura:", error);
//               document.getElementById("temperature").innerText = "Error";
//           }
//       });
//   } else {
//       console.log("Geolocalización no es soportada por este navegador.");
//   }
// }

// // Llama a la función para obtener la ubicación
// getLocation();