# 💻 Documentación Técnica - SuerteYa

Este documento detalla la arquitectura de la aplicación para desarrolladores y mantenedores.

## 🛠 Arquitectura y Stack Tecnológico
- **Framework:** React 19
- **Build Tool:** Vite
- **Estilos:** Vanilla CSS (con CSS Variables para facilitar la creación de temas).
- **Iconos:** `lucide-react`
- **Animaciones/Efectos:** HTML5 Canvas (`canvas-confetti`) y Web Audio API nativa.

## 📂 Estructura de Componentes
```
src/
├── App.jsx                 # Estado global, inicialización, ruteo por URL y layout principal.
├── index.css               # Estilos globales, variables de tema oscuro y glassmorphism.
├── lib/
│   └── wheelMath.js        # Selección de ganador y cálculo del ángulo de giro (puro, sin canvas/DOM, con tests).
└── components/
    ├── Navbar.jsx          # Barra de navegación superior con acciones globales (modales y share).
    ├── Modal.jsx           # Componente base reutilizable para ventanas emergentes.
    ├── OptionsManager.jsx  # Panel de gestión de la lista de opciones (CRUD) y carga de plantillas.
    ├── RouletteWheel.jsx   # Lógica matemática para dibujar el Canvas, físicas de giro y síntesis de audio.
    └── ShareButton.jsx     # Lógica para codificar la lista de opciones y copiar al portapapeles.
```

## 🔄 Flujo de Datos y Estado
- **`App.jsx`** actúa como el *Single Source of Truth* para el estado de la aplicación (`options`, `soundEnabled`).
- En el montaje (`useEffect`), la aplicación lee primero la URL (`?opts=...`). Si existe, sobrescribe el estado y limpia la barra de direcciones. Si no existe, lee de `localStorage`.
- Los cambios en `options` o `soundEnabled` se sincronizan automáticamente con `localStorage` en un `useEffect` secundario.

## 🔊 Motor de Audio (Web Audio API)
Se decidió no utilizar archivos MP3 externos para evitar solicitudes HTTP innecesarias.
En su lugar, `RouletteWheel.jsx` utiliza:
- `OscillatorNode` (Onda Senoidal) para simular el click de los segmentos de la ruleta.
- `OscillatorNode` (Onda Triangular, múltiple) para simular un acorde mayor (C5, E5, G5, C6) al ganar.

## 🚀 Despliegue (Producción)
Para construir la versión optimizada:
```bash
npm run build
```
Esto generará la carpeta `dist/` con archivos estáticos (HTML/CSS/JS minificados) que pueden ser desplegados en Vercel, Netlify o cualquier servidor estático convencional.
