# Ajetrez V5 — Web Prototype 0.2

Base modular de Ajetrez preparada para GitHub → Netlify.

## Publicación sin Node.js en tu PC

Podés subir el proyecto a GitHub y conectarlo con Netlify. Netlify hará el build en sus servidores.

Configuración:
- Build command: `npm run build`
- Publish directory: `dist`

Estos valores ya están definidos en `netlify.toml`.

## Publicar

1. Crear un repositorio nuevo en GitHub.
2. Subir el **contenido de esta carpeta** al repositorio.
3. En Netlify: Add new project → Import an existing project → GitHub.
4. Seleccionar el repositorio.
5. Si Netlify pide valores manualmente: `npm run build` y `dist`.
6. Publicar.

## Importante

La posición inicial y el desplazamiento de secciones son todavía provisionales. Esta versión sirve para validar arquitectura, geometría inicial y flujo de juego. Las reglas oficiales se fijarán antes de convertirlas en definitivas.

## Desarrollo local opcional

Si más adelante solucionás Node.js:

```bash
npm install
npm run dev
npm run build
```
