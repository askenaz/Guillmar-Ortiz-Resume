# Guillmar Ortiz CV

Sitio estático bilingüe para publicar el CV de Guillmar Ortiz en GitHub Pages.

## Estructura

- `index.html`: entrada del sitio.
- `assets/css/styles.css`: estilos del CV web e impresión.
- `assets/js/app.js`: render del CV desde JSON.
- `assets/images/guillmar-ortiz.jpeg`: foto de perfil extraída del Word fuente.
- `data/cv.json`: información importable en español e inglés.
- `documents/docx`: documentos Word editables, incluidos los cover letters genéricos.
- `documents/pdf`: CV ATS y cover letters genéricos listos para enviar.
- `CNAME`: dominio custom para GitHub Pages.
- `.nojekyll`: evita procesamiento Jekyll en GitHub Pages.

## Desarrollo local

Sirve el directorio con cualquier servidor estático:

```bash
python -m http.server 4173
```

Luego abre `http://localhost:4173`.

## Idiomas

El sitio soporta:

- Español: `/?lang=es`
- Inglés: `/?lang=en`

La fuente de datos está en `data/cv.json` y puede importarse desde otro sitio o generador.

## GitHub Pages

El dominio configurado es:

```text
guillmar-cv.askenaz.dev
```

Para activarlo en DNS, crea un registro `CNAME` para `guillmar-cv` apuntando a:

```text
askenaz.github.io
```

Alternativas de naming recomendables para un portafolio más amplio:

- `guillmar.askenaz.dev`
- `portfolio.askenaz.dev`
- `cv.askenaz.dev`

Mi recomendación es reservar `guillmar.askenaz.dev` para el portafolio completo y usar `cv.guillmar.askenaz.dev` o `guillmar-cv.askenaz.dev` solo para el CV si quieres separar ambos productos.
