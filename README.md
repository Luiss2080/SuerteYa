<div align="center">
  <img src="public/favicon.svg" alt="Logo Ruleta Pro" width="120" height="120" />
  <h1>🎡 Ruleta de Decisiones Pro</h1>
  <p><strong>La herramienta definitiva para tomar decisiones al azar, sortear premios y gamificar tus eventos.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Vitest-Testing-729B1B?style=flat-square&logo=vitest" alt="Vitest" />
    <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Status" />
  </p>
</div>

---

## ✨ Características Principales

Hemos transformado una simple ruleta en un producto robusto y lleno de funcionalidades para *Power Users*.

- 🎨 **Diseño Premium (Glassmorphism):** Interfaz moderna con efecto cristal, animaciones CSS fluidas y paletas de colores llamativas.
- 🌗 **Sistema de Temas Dinámicos:** Cambia la apariencia al instante entre *Neon Cyberpunk*, *Sunset Candy* y *Dark Minimalist*.
- 🔊 **Motor de Audio Nativo:** Efectos de "tick" al girar y acordes de victoria sintetizados directamente con *Web Audio API* (sin necesidad de cargar archivos MP3).
- 🏆 **Modo Sorteo (Auto-eliminar):** Opción para que el ganador desaparezca automáticamente de la lista tras ser elegido. Ideal para rifas y clases.
- 🕒 **Historial de Resultados:** Mantén el registro de las últimas 10 opciones ganadoras para no perder el hilo del sorteo.
- 📤 **Data Portability (CSV):** Importa cientos de nombres en segundos subiendo un `.csv` o `.txt`, y exporta tu lista actual con un solo clic.
- 🔗 **Generación de Enlaces (Viralidad):** Comparte tu ruleta exacta con amigos. El botón de compartir genera una URL única que codifica tus opciones y configuraciones.
- 🖥️ **Modo Presentador:** Botón integrado de Pantalla Completa y control manual de la velocidad de giro (Rápido, Normal, Lento) para mayor suspense.
- 💾 **Persistencia Inteligente:** Todo lo que haces (opciones, temas, historial) se guarda automáticamente en `localStorage`.

---

## 🚀 Inicio Rápido (Instalación Local)

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local.

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/ruleta-decisiones.git

# 2. Navega al directorio
cd ruleta-decisiones

# 3. Instala las dependencias
npm install

# 4. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la app en acción.

---

## 🧪 Testing Automatizado

La lógica de negocio (renderizado inicial, agregación de opciones) está cubierta con pruebas unitarias para garantizar cero regresiones a futuro.

Para ejecutar los tests en tu entorno de desarrollo, utiliza **Vitest**:

```bash
npm run test
```

---

## 📚 Documentación Adicional

Para más detalles sobre la operación del usuario o la arquitectura subyacente, consulta:

- 📖 [MANUAL_DE_USO.md](./MANUAL_DE_USO.md) - Guía paso a paso para usuarios finales.
- 🛠 [DOCUMENTACION_TECNICA.md](./DOCUMENTACION_TECNICA.md) - Explicación detallada de la arquitectura, componentes y decisiones de diseño técnico.

---

<div align="center">
  <p>Construido con ❤️ usando React y Vite. Basado en estándares de especificación SDD.</p>
</div>
