function calcularValorOro() {
  const tipoOro = document.getElementById('tipoOro').value;
  const valorOnzaTroy = parseFloat(document.getElementById('valorOnzaTroyInput').value);
  const cantidadOroOnzas = parseFloat(document.getElementById('cantidadOroInput').value);
  const cantidadGramos = parseFloat(document.getElementById('cantidadGramosInput').value);
  const tipoOperacion = document.getElementById('tipoOperacion').value;

  if (isNaN(valorOnzaTroy) || isNaN(cantidadOroOnzas) || isNaN(cantidadGramos)) {
    alert("Por favor, introduce valores válidos.");
    return;
  }

  const pureza = tipoOro / 24;
  let valorAjustadoPorOnza = valorOnzaTroy * pureza;
  let valorPorGramo = valorAjustadoPorOnza / 31.1035;

  if (tipoOperacion === 'compra') {
    valorAjustadoPorOnza *= 0.85;
    valorPorGramo *= 0.85;
  } else if (tipoOperacion === 'venta') {
    valorAjustadoPorOnza *= 1.15;
    valorPorGramo *= 1.15;
  }

  const valorTotalOnzas = valorAjustadoPorOnza * cantidadOroOnzas;
  const valorTotalGramos = valorPorGramo * cantidadGramos;

  document.getElementById('resultadoTexto').innerText = `Tipo de operación: ${tipoOperacion}`;
  document.getElementById('resultadoPrecioOnza').innerText = `Valor por onza troy: $${valorAjustadoPorOnza.toFixed(2)}`;
  document.getElementById('resultadoPrecioGramo').innerText = `Valor por gramo: $${valorPorGramo.toFixed(2)}`;
  document.getElementById('resultadoValorTotalOnza').innerText = `Valor total en onzas troy: $${valorTotalOnzas.toFixed(2)}`;
  document.getElementById('resultadoValorTotalGramos').innerText = `Valor total en gramos: $${valorTotalGramos.toFixed(2)}`;
  document.getElementById('resultado').style.display = 'block';
}

function limpiarCampos() {
  document.getElementById('tipoOro').selectedIndex = 0;
  document.getElementById('valorOnzaTroyInput').value = '';
  document.getElementById('cantidadOroInput').value = '';
  document.getElementById('cantidadGramosInput').value = '';
  document.getElementById('tipoOperacion').selectedIndex = 0;
  document.getElementById('resultado').style.display = 'none';
}

document.getElementById('calcularBtn').addEventListener('click', calcularValorOro);
document.getElementById('limpiarBtn').addEventListener('click', limpiarCampos);