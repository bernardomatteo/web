# Bernardo Matteo Cerámicas — sitio estático

Recreación estática de <http://bernardomatteo.com/> (WordPress + Astra + WooCommerce)
en HTML, CSS y JavaScript sin dependencias ni build obligatorio.

**Sin pasarela de pago:** el carrito de WooCommerce se reemplazó por una *lista de
consulta*. El visitante agrega piezas, la lista se guarda en `localStorage` y se envía
por WhatsApp o email con el detalle ya redactado. No hay checkout ni cobro en línea.

## Cómo verlo

No necesita servidor para la mayoría de las funciones, pero conviene usar uno porque
las páginas cargan `assets/js/datos.js` y los filtros leen la URL:

```bash
python -m http.server 8000
# luego abrir http://localhost:8000/
```

Para publicarlo basta subir la carpeta entera a cualquier hosting estático
(Netlify, GitHub Pages, Cloudflare Pages, o un subdirectorio de Apache/Nginx).

## Estructura

```
index.html            Portada: hero, destacados, técnica, proyectos, talleres, bio
tienda.html           Catálogo con filtros por categoría y cómo comprar
talleres.html         Clases: técnicas, horarios, costos e inscripción
galeria.html          Galería completa con lightbox
galeria-logos.html    Galería filtrada: logos institucionales
galeria-casas.html    Galería filtrada: casas y establecimientos
contacto.html         Datos de contacto, mapa, formulario y preguntas frecuentes

assets/css/styles.css  Todos los estilos (variables de color en :root)
assets/js/datos.js     Contacto, categorías y galería
assets/js/productos.js Catálogo de piezas (lo escribe el panel)
assets/js/main.js      Navegación, filtros, lightbox, lista de consulta, formulario
assets/img/            logo.png, icono.png, productos/ (20) y galeria/ (50)

.build/               Fuentes del generador de páginas (ver más abajo)

--- solo local, no se sube a GitHub ---
admin.html            Panel para cargar y editar piezas sin programar
assets/js/admin.js    Lógica del panel
administrar.bat       Abre el panel (doble clic)
publicar.bat          Sube los cambios a internet (doble clic)
```

## Panel de administración (para quien no programa)

Hay un editor visual para cargar, modificar y eliminar piezas y precios sin tocar
código: **`admin.html`**. Se usa así:

1. Doble clic en **`administrar.bat`**. Se abre el panel en el navegador y una ventana
   negra que hay que dejar abierta mientras se trabaja.
2. La primera vez, clic en **Conectar carpeta del sitio** y elegir la carpeta
   `bernardomatteo`. Queda recordado.
3. Agregar, editar, reordenar o eliminar piezas, y **Guardar cambios**.
4. Doble clic en **`publicar.bat`** para subirlo a internet.

El panel escribe `assets/js/productos.js` y copia las fotos a
`assets/img/productos/`. Las fotos se recortan a cuadrado y se guardan a 600 × 600 px
solas, así que sirve cualquier foto del celular.

Si el navegador no permite escribir en la carpeta, el panel pasa solo a **modo
descarga**: baja los archivos y explica dónde copiarlos. No se pierde nada.

**El panel no se publica.** `admin.html`, `assets/js/admin.js` y los `.bat` están en
`.gitignore`, así que no llegan a GitHub y nadie puede abrir el editor desde internet.
Viven solo en esta computadora; si clonás el repo en otra máquina, hay que copiarlos
a mano.

## Editar contenido a mano

Lo de abajo es la alternativa para quien sí maneja código; con el panel no hace falta.

### Agregar o cambiar una pieza

El catálogo vive en `assets/js/productos.js`, en el array `PRODUCTOS`:

```js
{ slug: 'andujar', nombre: 'Andújar', cat: 'azulejos',
  precio: 150, precioHasta: 270,            // precioHasta es opcional (rango)
  medida: 'Azulejo 10 x 10 cm', img: 'andujar.jpg' },
```

- `img` es el nombre del archivo dentro de `assets/img/productos/`.
- `cat` debe coincidir con un `id` de `CATEGORIAS`; los filtros se generan solos.
- Las imágenes se recortan a cuadrado por CSS, así que cualquier proporción sirve.

### Agregar una foto a la galería

En el array `GALERIA` del mismo archivo:

```js
{ img: 'triumph.jpg', alt: 'Logo cerámico Triumph', coleccion: ['logos'] },
```

`coleccion` acepta `'logos'`, `'casas'`, ambas, o vacío (aparece solo en la galería
general). El archivo va en `assets/img/galeria/`.

### Cambiar teléfono, email o redes

En la constante `CONTACTO`, arriba de `datos.js`. El número de WhatsApp va en formato
internacional sin signos (`59895570751`). Ojo: ese número también está escrito en el
HTML del header, el footer y la página de contacto.

## Regenerar las páginas internas

El header y el footer son idénticos en todas las páginas y se extraen de `index.html`
en cada corrida, para que no se desincronicen. Las páginas internas se arman así:

```bash
bash .build/build.sh
```

**Por eso, para tocar el menú o el footer hay que editar `index.html` y volver a
correr el script.** Los cambios hechos directamente en `tienda.html`, `galeria.html`,
etc. se pierden al regenerar: el contenido propio de cada página está en
`.build/<pagina>.body.html`.

Si preferís no mantener el generador, podés borrar `.build/` y editar cada `.html`
a mano; el sitio funciona igual.

### Qué versionar

`.build/` **se versiona**: pese al nombre, es fuente y no salida. Los `*.body.html`
son la única copia del contenido de cada página interna. Lo único ignorado en
`.gitignore` son `head.part` y `foot.part`, que `build.sh` regenera solo.

Las páginas `.html` de la raíz son generadas pero **también se versionan**, porque son
lo que se publica: un hosting estático las sirve tal cual, sin correr ningún script.

## Diferencias respecto al original

- **Sin pasarela de pago ni carrito**: lista de consulta que termina en WhatsApp o email.
- **Sin backend**: el formulario de contacto no envía correos por sí mismo, abre
  WhatsApp o el cliente de correo con el mensaje ya escrito.
- **Sin banner de cookies**: el sitio no usa cookies ni analítica, así que no hace falta.
- **Logo invertido por CSS**: el PNG original es oscuro sobre fondo blanco y en el
  header negro del sitio original queda casi ilegible; acá se invierte para que lea.
- **`Cultural-Alfaybeta.jpg` omitida**: esa imagen devuelve 404 en el sitio original.
- **Galería dividida en tres páginas** (general, logos, casas) como en el menú original.
- Las fuentes se cargan desde Google Fonts (Quicksand, la misma del original).

## Contenido e imágenes

Los textos, precios e imágenes se tomaron del sitio original en octubre de 2026 y
pertenecen a Bernardo Matteo Cerámicas.
