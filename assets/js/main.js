/* ===========================================================
   Logica del sitio: navegacion, catalogo, galeria, lightbox
   y lista de consulta (reemplaza al carrito de compra).
   Sin dependencias externas.
   =========================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const precio = (n) => '$ ' + n.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nombreCat = (id) => (CATEGORIAS.find(c => c.id === id) || {}).nombre || id;

  /* ---------------------------------------------------------
     Navegacion movil y submenus
     --------------------------------------------------------- */
  function iniciarNav() {
    const header = $('.header');
    const boton = $('.hamburguesa');

    if (boton && header) {
      boton.addEventListener('click', () => {
        const abierto = header.classList.toggle('menu-abierto');
        boton.setAttribute('aria-expanded', String(abierto));
      });
    }

    // En pantallas chicas el submenu se abre al tocar la flecha, no al navegar.
    $$('.tiene-hijos > a').forEach(enlace => {
      const padre = enlace.parentElement;
      enlace.addEventListener('click', (ev) => {
        if (window.innerWidth > 960) return;
        ev.preventDefault();
        const abierto = padre.classList.toggle('submenu-abierto');
        enlace.setAttribute('aria-expanded', String(abierto));
      });
    });
  }

  /* ---------------------------------------------------------
     Lista de consulta: sustituye el carrito con pasarela.
     Se guarda en localStorage y se envia por WhatsApp o email.
     --------------------------------------------------------- */
  const CLAVE = 'bm-consulta';

  const leerLista = () => {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
    catch (e) { return []; }
  };
  const guardarLista = (lista) => {
    try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch (e) { /* modo privado */ }
  };

  function actualizarContador() {
    const total = leerLista().length;
    $$('.contador').forEach(el => { el.textContent = String(total); });
    $$('.boton-consulta').forEach(el => {
      el.setAttribute('aria-label', total === 0
        ? 'Lista de consulta vacia'
        : 'Lista de consulta con ' + total + (total === 1 ? ' pieza' : ' piezas'));
    });
  }

  function textoConsulta() {
    const lista = leerLista();
    if (!lista.length) return '';
    const lineas = lista.map(it => {
      const p = PRODUCTOS.find(pr => pr.slug === it.slug);
      if (!p) return '- ' + it.slug;
      const valor = p.precioHasta ? precio(p.precio) + ' a ' + precio(p.precioHasta) : precio(p.precio);
      return '- ' + p.nombre + ' (' + p.medida + ') ' + valor;
    });
    return 'Hola Bernardo! Me interesan estas piezas:\n' + lineas.join('\n') +
           '\n\nQuedo a la espera de informacion sobre disponibilidad y envio.';
  }

  function dibujarPanel() {
    const cuerpo = $('#panel-cuerpo');
    const pie = $('#panel-pie');
    if (!cuerpo || !pie) return;

    const lista = leerLista();

    if (!lista.length) {
      cuerpo.innerHTML = '<p class="panel-vacio">Todavia no agregaste piezas.<br>' +
        'Recorre la <a href="tienda.html">tienda</a> y sumalas a tu consulta.</p>';
      pie.innerHTML = '';
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'lista-consulta';

    lista.forEach(it => {
      const p = PRODUCTOS.find(pr => pr.slug === it.slug);
      if (!p) return;
      const valor = p.precioHasta
        ? precio(p.precio) + ' - ' + precio(p.precioHasta)
        : precio(p.precio);

      const li = document.createElement('li');

      const img = document.createElement('img');
      img.src = 'assets/img/productos/' + p.img;
      img.alt = p.nombre;
      img.loading = 'lazy';

      const info = document.createElement('div');
      const nom = document.createElement('strong');
      nom.textContent = p.nombre;
      const det = document.createElement('span');
      det.textContent = valor;
      info.append(nom, det);

      const quitar = document.createElement('button');
      quitar.type = 'button';
      quitar.className = 'quitar';
      quitar.innerHTML = '&times;';
      quitar.setAttribute('aria-label', 'Quitar ' + p.nombre + ' de la consulta');
      quitar.addEventListener('click', () => {
        guardarLista(leerLista().filter(x => x.slug !== p.slug));
        actualizarContador();
        dibujarPanel();
        marcarBotones();
      });

      li.append(img, info, quitar);
      ul.appendChild(li);
    });

    cuerpo.innerHTML = '';
    cuerpo.appendChild(ul);

    const mensaje = encodeURIComponent(textoConsulta());
    pie.innerHTML =
      '<a class="btn btn-wa btn-ancho" target="_blank" rel="noopener" ' +
      'href="https://wa.me/' + CONTACTO.whatsapp + '?text=' + mensaje + '">Enviar consulta por WhatsApp</a>' +
      '<p class="panel-aviso">O escribinos a ' +
      '<a href="mailto:' + CONTACTO.email + '?subject=' + encodeURIComponent('Consulta de piezas') +
      '&body=' + mensaje + '">' + CONTACTO.email + '</a>.<br>' +
      'Este sitio no procesa pagos: coordinamos todo de forma personal.</p>';
  }

  function marcarBotones() {
    const enLista = leerLista().map(x => x.slug);
    $$('[data-agregar]').forEach(btn => {
      const dentro = enLista.indexOf(btn.dataset.agregar) !== -1;
      btn.textContent = dentro ? 'En tu consulta' : 'Agregar a la consulta';
      btn.classList.toggle('btn-primario', dentro);
      btn.classList.toggle('btn-borde', !dentro);
    });
  }

  function abrirPanel() {
    dibujarPanel();
    $('#panel').classList.add('visible');
    $('#panel-fondo').classList.add('visible');
    document.body.classList.add('sin-scroll');
    const cerrar = $('.panel-cerrar');
    if (cerrar) cerrar.focus();
  }

  function cerrarPanel() {
    $('#panel').classList.remove('visible');
    $('#panel-fondo').classList.remove('visible');
    document.body.classList.remove('sin-scroll');
  }

  function iniciarConsulta() {
    if (!$('#panel')) return;

    $$('.boton-consulta').forEach(b => b.addEventListener('click', abrirPanel));
    $('.panel-cerrar').addEventListener('click', cerrarPanel);
    $('#panel-fondo').addEventListener('click', cerrarPanel);

    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-agregar]');
      if (!btn) return;
      const slug = btn.dataset.agregar;
      const lista = leerLista();
      if (lista.some(x => x.slug === slug)) {
        abrirPanel();
      } else {
        lista.push({ slug: slug });
        guardarLista(lista);
        actualizarContador();
        marcarBotones();
        abrirPanel();
      }
    });

    actualizarContador();
    marcarBotones();
  }

  /* ---------------------------------------------------------
     Catalogo con filtros por categoria
     --------------------------------------------------------- */
  function tarjetaProducto(p) {
    const valor = p.precioHasta
      ? '<span class="desde">Desde</span> ' + precio(p.precio) + ' <span class="desde">hasta</span> ' + precio(p.precioHasta)
      : precio(p.precio);

    return '<li class="producto" data-cat="' + p.cat + '">' +
      '<article class="producto-tarjeta">' +
        '<figure class="producto-figura">' +
          '<img src="assets/img/productos/' + p.img + '" alt="' + p.nombre + '" loading="lazy" width="600" height="600">' +
          '<span class="producto-cat">' + nombreCat(p.cat) + '</span>' +
        '</figure>' +
        '<div class="producto-cuerpo">' +
          '<h3>' + p.nombre + '</h3>' +
          '<p class="producto-medida">' + p.medida + '</p>' +
          '<p class="producto-precio">' + valor + '</p>' +
          '<button type="button" class="btn btn-borde btn-sm" data-agregar="' + p.slug + '">Agregar a la consulta</button>' +
        '</div>' +
      '</article>' +
    '</li>';
  }

  function iniciarCatalogo() {
    const grilla = $('#grilla-tienda');
    if (!grilla) return;

    grilla.innerHTML = PRODUCTOS.map(tarjetaProducto).join('');

    const filtros = $('#filtros-tienda');
    if (filtros) {
      filtros.innerHTML = CATEGORIAS.map((c, i) =>
        '<button type="button" class="filtro" data-filtro="' + c.id + '" aria-pressed="' +
        (i === 0 ? 'true' : 'false') + '">' + c.nombre + '</button>'
      ).join('');

      filtros.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.filtro');
        if (!btn) return;
        $$('.filtro', filtros).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        aplicarFiltro(btn.dataset.filtro);
      });
    }

    // Si la URL trae ?cat=azulejos se abre ya filtrado (los submenus la usan).
    const cat = new URLSearchParams(location.search).get('cat');
    if (cat && CATEGORIAS.some(c => c.id === cat)) {
      $$('.filtro').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === cat)));
      aplicarFiltro(cat);
    } else {
      aplicarFiltro('todos');
    }

    marcarBotones();
  }

  function aplicarFiltro(cat) {
    let visibles = 0;
    $$('#grilla-tienda .producto').forEach(li => {
      const mostrar = cat === 'todos' || li.dataset.cat === cat;
      li.hidden = !mostrar;
      if (mostrar) visibles++;
    });

    const aviso = $('#sin-resultados');
    if (aviso) aviso.hidden = visibles > 0;

    const cuenta = $('#cuenta-productos');
    if (cuenta) {
      cuenta.textContent = visibles === 1
        ? 'Mostrando 1 pieza'
        : 'Mostrando ' + visibles + ' piezas';
    }
  }

  /* ---------------------------------------------------------
     Productos destacados en la portada
     --------------------------------------------------------- */
  function iniciarDestacados() {
    const grilla = $('#grilla-destacados');
    if (!grilla) return;
    const slugs = (grilla.dataset.slugs || '').split(',').map(s => s.trim()).filter(Boolean);
    const piezas = slugs.length
      ? slugs.map(s => PRODUCTOS.find(p => p.slug === s)).filter(Boolean)
      : PRODUCTOS.slice(0, 4);
    grilla.innerHTML = piezas.map(tarjetaProducto).join('');
    marcarBotones();
  }

  /* ---------------------------------------------------------
     Galeria con filtros y lightbox
     --------------------------------------------------------- */
  let imagenesActivas = [];
  let indiceActual = 0;

  function iniciarGaleria() {
    const grilla = $('#grilla-galeria');
    if (!grilla) return;

    const coleccion = grilla.dataset.coleccion || 'todas';
    const fuente = coleccion === 'todas'
      ? GALERIA
      : GALERIA.filter(g => g.coleccion.indexOf(coleccion) !== -1);

    grilla.innerHTML = fuente.map((g, i) =>
      '<button type="button" class="galeria-item" data-indice="' + i + '" aria-label="Ampliar: ' + g.alt + '">' +
        '<img src="assets/img/galeria/' + g.img + '" alt="' + g.alt + '" loading="lazy">' +
      '</button>'
    ).join('');

    imagenesActivas = fuente;

    grilla.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.galeria-item');
      if (btn) abrirLightbox(Number(btn.dataset.indice));
    });
  }

  function abrirLightbox(i) {
    const caja = $('#lightbox');
    if (!caja || !imagenesActivas.length) return;
    indiceActual = (i + imagenesActivas.length) % imagenesActivas.length;
    const item = imagenesActivas[indiceActual];
    $('#lightbox-img').src = 'assets/img/galeria/' + item.img;
    $('#lightbox-img').alt = item.alt;
    $('#lightbox-pie').textContent = item.alt + '  (' + (indiceActual + 1) + ' de ' + imagenesActivas.length + ')';
    caja.classList.add('visible');
    document.body.classList.add('sin-scroll');
    $('.lightbox-cerrar').focus();
  }

  function cerrarLightbox() {
    const caja = $('#lightbox');
    if (!caja) return;
    caja.classList.remove('visible');
    document.body.classList.remove('sin-scroll');
  }

  function iniciarLightbox() {
    const caja = $('#lightbox');
    if (!caja) return;

    $('.lightbox-cerrar').addEventListener('click', cerrarLightbox);
    $('.lightbox-ant').addEventListener('click', () => abrirLightbox(indiceActual - 1));
    $('.lightbox-sig').addEventListener('click', () => abrirLightbox(indiceActual + 1));
    caja.addEventListener('click', (ev) => { if (ev.target === caja) cerrarLightbox(); });

    document.addEventListener('keydown', (ev) => {
      if (!caja.classList.contains('visible')) return;
      if (ev.key === 'Escape') cerrarLightbox();
      if (ev.key === 'ArrowLeft') abrirLightbox(indiceActual - 1);
      if (ev.key === 'ArrowRight') abrirLightbox(indiceActual + 1);
    });
  }

  /* ---------------------------------------------------------
     Formulario de contacto: sin backend, abre WhatsApp o email
     --------------------------------------------------------- */
  function iniciarFormulario() {
    const form = $('#form-contacto');
    if (!form) return;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const datos = new FormData(form);
      const nombre = (datos.get('nombre') || '').toString().trim();
      const apellido = (datos.get('apellido') || '').toString().trim();
      const email = (datos.get('email') || '').toString().trim();
      const mensaje = (datos.get('mensaje') || '').toString().trim();

      const cuerpo = 'Hola Bernardo!\n\n' + mensaje +
        '\n\n---\nNombre: ' + nombre + ' ' + apellido +
        (email ? '\nEmail: ' + email : '');

      const via = (datos.get('via') || 'whatsapp').toString();
      const aviso = $('#aviso-form');

      if (via === 'email') {
        location.href = 'mailto:' + CONTACTO.email +
          '?subject=' + encodeURIComponent('Consulta web de ' + nombre + ' ' + apellido) +
          '&body=' + encodeURIComponent(cuerpo);
        if (aviso) {
          aviso.textContent = 'Abrimos tu programa de correo con el mensaje listo para enviar.';
          aviso.classList.add('visible');
        }
      } else {
        window.open('https://wa.me/' + CONTACTO.whatsapp + '?text=' + encodeURIComponent(cuerpo), '_blank', 'noopener');
        if (aviso) {
          aviso.textContent = 'Abrimos WhatsApp en otra pestana con tu mensaje listo para enviar.';
          aviso.classList.add('visible');
        }
      }
    });
  }

  /* ---------------------------------------------------------
     Arranque
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    iniciarNav();
    iniciarDestacados();
    iniciarCatalogo();
    iniciarConsulta();
    iniciarGaleria();
    iniciarLightbox();
    iniciarFormulario();

    const anio = $('#anio');
    if (anio) anio.textContent = String(new Date().getFullYear());
  });
})();
