<div align="center">
  <img src="public/favicon.svg" alt="Logo SuerteYa" width="120" height="120" />
  <h1>🎡 SuerteYa</h1>
  <p><strong>Escribe tus opciones, gira la ruleta y deja que la suerte decida.</strong><br/>
  Para grupos de amigos decidiendo dónde comer, profes sorteando turnos en clase,
  o cualquiera que necesite una decisión al azar justa y con estilo.</p>

  <p>
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Vitest-Testing-729B1B?style=flat-square&logo=vitest" alt="Vitest" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
  </p>
</div>

---

## Características

Todo lo de abajo está implementado y verificado contra el código, no es una lista de aspiraciones:

- **Ruleta en canvas con animación real**: giro con easing (`easeOutQuart`), velocidad de giro configurable (Rápido/Normal/Lento) y selección de ganador matemáticamente uniforme (sin sesgo hacia ningún segmento - cubierto por tests, ver más abajo).
- **Gestión de opciones completa**: agregar, quitar, importar desde `.csv`/`.txt`, exportar a `.csv`, y 3 listas predefinidas (comida, películas, "¿quién paga?").
- **Sin duplicados, ni por mayúsculas**: "Pizza" y "pizza" se tratan como la misma opción, tanto al escribir como al importar un CSV.
- **Persistencia automática**: opciones, tema, sonido, modo sorteo, velocidad de giro e historial se guardan en `localStorage` - cierra la pestaña y todo sigue ahí al volver.
- **Modo Sorteo**: el ganador se elimina automáticamente de la lista tras cada giro, ideal para rifas sin repetir premios.
- **Historial de resultados**: guarda los últimos 10 ganadores.
- **Compartir por enlace**: genera una URL que codifica tu lista exacta de opciones para mandarle a alguien más.
- **3 temas visuales**: Neon Cyberpunk, Sunset Candy y Dark Minimalist.
- **Modo presentador**: pantalla completa con un botón.
- **Audio nativo (Web Audio API)**: tick al girar y acorde de victoria sintetizados, sin archivos de audio que cargar. Se puede silenciar.
- **Confeti** al elegir un ganador.
- **Accesible**: el resultado y el estado de giro se anuncian a lectores de pantalla (región `aria-live`), todos los botones de solo-ícono tienen `aria-label`, los modales manejan el foco correctamente al abrir/cerrar, y toda la app es operable por teclado.

## Cómo usar

1. Agrega opciones una por una, cargá una plantilla predefinida, o importá un `.csv`/`.txt` con una opción por línea.
2. Pulsá **"🎲 Girar Ruleta"**.
3. El ganador se muestra en un modal y queda anotado en el historial.
4. Opcional: activá **Modo Sorteo** en Configuración para que cada ganador se elimine automáticamente de la lista (útil para sortear varios premios sin repetir).
5. Compartí tu ruleta exacta con el botón "Compartir Ruleta" en la barra superior.

## Instalación y uso local

```bash
# 1. Clona el repositorio
git clone https://github.com/Luiss2080/ruleta-decisiones.git
cd ruleta-decisiones

# 2. Instala las dependencias
npm install

# 3. Servidor de desarrollo
npm run dev
# abre http://localhost:5173

# 4. Build de producción
npm run build

# 5. Lint
npm run lint
```

## Tecnologías

- **React 19** + **Vite 8** (build y dev server)
- **Canvas 2D API** para dibujar y animar la ruleta
- **Web Audio API** para los efectos de sonido (sin archivos externos)
- [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti) para el efecto de confeti
- [`lucide-react`](https://lucide.dev/) para los íconos
- **oxlint** para linting
- **GitHub Actions** para CI (lint + test + build en cada push/PR a `main`)

> Nota de precisión: este proyecto está construido con React, no en JavaScript
> vanilla sin dependencias. Si buscás una versión sin framework, no es lo que
> hay en este repo hoy.

## Tests

Lógica pura (selección de ganador, distribución de probabilidad del giro, manejo de duplicados) cubierta con **Vitest** + **React Testing Library**, corriendo en CI para Node 20.x y 22.x:

```bash
npm test
```

Incluye una prueba estadística que simula 20.000 giros para 2/4/5/10 opciones y verifica que cada segmento gane aproximadamente la misma proporción de veces (ver `src/lib/wheelMath.test.js`).

## Documentación adicional

- [MANUAL_DE_USO.md](./MANUAL_DE_USO.md) - guía para usuarios finales.
- [DOCUMENTACION_TECNICA.md](./DOCUMENTACION_TECNICA.md) - arquitectura y decisiones técnicas.

## Licencia

MIT - ver [LICENSE](./LICENSE).
