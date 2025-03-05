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
        resultParagraph.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
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
  historyItem.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  historyList.appendChild(historyItem);
}

  // Lógica para mostrar y ocultar el conversor
  document.getElementById("show-converter").addEventListener("click", function() {
    document.getElementById("converter-container").style.display = "block";
});

document.getElementById("close-converter").addEventListener("click", function() {
    document.getElementById("converter-container").style.display = "none";
});

// Lógica para mostrar y ocultar el conversor
document.getElementById("show-converter").addEventListener("click", function() {
  document.getElementById("converter-container").style.display = "block";
});

document.getElementById("close-converter").addEventListener("click", function() {
  document.getElementById("converter-container").style.display = "none";
});


// TODO: Dolar BCV
// Función para obtener datos de la nueva API
async function obtenerDatosBcv() {
  try {
    const respuesta = await fetch(
      "https://pydolarve.org/api/v1/dollar?page=bcv"
    );
    if (!respuesta.ok) {
      const errorDetails = await respuesta.text(); // Obtener detalles del error
      throw new Error(
        "Error en la solicitud: " + respuesta.status + " - " + errorDetails
      );
    }
    const datos = await respuesta.json();
    console.log("Datos cargados:", datos);
    mostrarDatosBcv(datos);
  } catch (error) {
    console.error("Error al obtener datos de BCV:", error);
    document.getElementById("resultadoBcv").textContent =
      "Error al cargar los datos del Dólar BCV.";
  }
}

async function obtenerDatos() {
  try {
    const respuesta = await fetch(
      "https://pydolarve.org/api/v1/dollar?monitor=enparalelovzla"
    );
    if (!respuesta.ok) {
      const errorDetails = await respuesta.text(); // Obtener detalles del error
      throw new Error(
        "Error en la solicitud: " + respuesta.status + " - " + errorDetails
      );
    }
    const datos = await respuesta.json();
    console.log("Datos cargados:", datos);
    mostrarDatos(datos);
  } catch (error) {
    console.error("Error al obtener datos del Dólar Paralelo:", error);
    document.getElementById("resultado").textContent =
      "Error al cargar los datos del Dólar Paralelo.";
  }
}

function mostrarDatosBcv(datos) {
  const contenedor = document.getElementById("resultadoBcv");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  // Crear una tabla para mostrar los datos
  const tabla = document.createElement("table");
  const encabezado = tabla.createTHead();
  const filaEncabezado = encabezado.insertRow(0);

  // Definir encabezados de la tabla
  const encabezados = ["Última Actualización", "Precio (Bs)"];
  encabezados.forEach((encabezado, index) => {
    const celda = filaEncabezado.insertCell(index);
    celda.innerHTML = `<strong>${encabezado}</strong>`;
  });

  // Agregar los datos a la tabla
  const cuerpoTabla = tabla.createTBody();

  // Verificar si la estructura de datos es correcta
  if (datos && datos.monitors && datos.monitors.usd) {
    const usdData = datos.monitors.usd;

    // Crear una fila en la tabla para mostrar los datos de 'usd'
    const filaDatos = cuerpoTabla.insertRow();
    filaDatos.insertCell(0).innerText = usdData.last_update; // Última actualización
    filaDatos.insertCell(1).innerText = usdData.price; // Precio
  } else {
    contenedor.textContent = "No se encontraron datos disponibles.";
  }

  // Agregar la tabla al contenedor
  contenedor.appendChild(tabla);
}

// Agregar evento de clic al botón para actualizar datos
document
  .getElementById("actualizar")
  .addEventListener("click", obtenerDatosBcv);

// Llamar a la función al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  obtenerDatos();
  obtenerDatosBcv();
});

// TODO: Dolar Paralelo
// Función para obtener datos de la API
async function obtenerDatos() {
  try {
    const respuesta = await fetch(
      "https://pydolarve.org/api/v1/dollar?monitor=enparalelovzla"
    );
    if (!respuesta.ok) {
      throw new Error("Error en la solicitud: " + respuesta.status);
    }
    const datos = await respuesta.json();
    console.log("Datos cargados:", datos);
    mostrarDatos(datos);
  } catch (error) {
    console.error("Error:", error);
    const contenedor = document.getElementById("resultado");
    contenedor.innerHTML = `<p>Error al cargar datos: ${error.message}</p>`;
  }
}

function mostrarDatos(datos) {
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  // Crear una tabla para mostrar los datos
  const tabla = document.createElement("table");
  const encabezado = tabla.createTHead();
  const filaEncabezado = encabezado.insertRow(0);

  // Definir encabezados de la tabla
  const encabezados = ["Última Actualización", "Precio (Bs)"];
  encabezados.forEach((encabezado, index) => {
    const celda = filaEncabezado.insertCell(index);
    celda.innerHTML = `<strong>${encabezado}</strong>`;
  });

  // Agregar los datos a la tabla
  const cuerpoTabla = tabla.createTBody();
  const filaDatos = cuerpoTabla.insertRow(0);
  filaDatos.insertCell(0).innerText = datos.last_update; // Cambia 'last_update' según la estructura del JSON
  filaDatos.insertCell(1).innerText = datos.price; // Cambia 'price' según la estructura del JSON

  // Agregar la tabla al contenedor
  contenedor.appendChild(tabla);
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  obtenerDatos();
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
    document.getElementById(
      "valorDolar"
    ).textContent = `El valor del dólar en pesos colombianos es: ${valorDolarEnCOP}`;
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
    document.getElementById("factorBCV").textContent = `Factor (COP/BCV): ${factorBCV}`;
  }

  if (valorDolarEnCOP && valorDolarParalelo) {
    factorParalelo = (valorDolarEnCOP / valorDolarParalelo).toFixed(2); // Asignamos el valor a factorParalelo
    document.getElementById("factorParalelo").textContent = `Factor (COP/Paralelo): ${factorParalelo}`;
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
        document.getElementById("resultadoBCV").textContent = `bcv: ${resultadoBCV} Pesos`;
        document.getElementById("resultadoParalelo").textContent = `paralelo: ${resultadoParalelo} Pesos`;
    } else {
        document.getElementById("resultadoBCV").textContent = `bcv: `;
        document.getElementById("resultadoParalelo").textContent = `paralelo: `;
    }
}

// TODO Función para convertir pesos a bolívares
function convertirPesos() {
    const pesos = parseFloat(document.getElementById("pesosInput").value);
    if (!isNaN(pesos)) {
        const resultadoPesosBCV = (pesos / factorBCV).toFixed(2);
        const resultadoPesosParalelo = (pesos / factorParalelo).toFixed(2);
        document.getElementById("resultadoPesosBCV").textContent = `bcv: ${resultadoPesosBCV} Bolivares`;
        document.getElementById("resultadoPesosParalelo").textContent = `paralelo: ${resultadoPesosParalelo} Bolivares`;
    } else {
        document.getElementById("resultadoPesosBCV").textContent = `bcv: `;
        document.getElementById("resultadoPesosParalelo").textContent = `paralelo: `;
    }
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

setInterval(updateDateTime, 1000);
updateDateTime();




