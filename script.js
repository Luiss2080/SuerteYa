const CLAVE_STORAGE = 'ruleta-decisiones:opciones';
const opcionesEl = document.getElementById('opciones');

// Restaurar la última lista de opciones guardada, si existe.
try {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (guardado) opcionesEl.value = guardado;
} catch {
  // localStorage no disponible (modo privado, etc.): seguimos con el valor por defecto del textarea
}

opcionesEl.addEventListener('input', () => {
  try {
    localStorage.setItem(CLAVE_STORAGE, opcionesEl.value);
  } catch {
    // sin acceso a localStorage: no persiste entre recargas, pero el resto sigue funcionando
  }
});

document.getElementById('btn-girar').addEventListener('click', () => {
  const opciones = opcionesEl.value
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
