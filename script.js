document.getElementById('btn-girar').addEventListener('click', () => {
  const opciones = document.getElementById('opciones').value
    .split('\n')
    .map((o) => o.trim())
    .filter(Boolean);

  const resultado = document.getElementById('resultado');
  if (opciones.length === 0) {
    resultado.textContent = 'Escribí al menos una opción.';
    return;
  }

  const elegido = opciones[Math.floor(Math.random() * opciones.length)];
  resultado.textContent = `👉 ${elegido}`;
});
