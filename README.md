# da-vinci.ar

Landing art?stica est?tica: telescopio interactivo, universo de siete workers,
orbitales con perspectiva 3D y cierre blanco con formulario Formspree.

## GitHub Pages

El workflow `.github/workflows/pages.yml` publica `dist` con cada push a `main`.
En Settings > Pages, la fuente debe ser **GitHub Actions**. Los recursos tienen
rutas relativas compatibles con el subdirectorio del repositorio.

No se requiere instalaci?n de dependencias ni compilaci?n. Abrir `dist/index.html`
para trabajar localmente. La recarga reinicia la experiencia; el cierre final queda
fijo hasta recargar. El formulario env?a a Formspree sin navegar fuera de la p?gina.

## Verificaci?n

```sh
node check-interaction.cjs
node check-orbital.cjs
node check-scroll.cjs
node check-access.cjs
```

Las m?tricas de workers son simuladas; ver `WORKER-NODES.md` para reemplazarlas.
