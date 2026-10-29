/* ===========================================================
   Datos del sitio: catalogo y galerias.
   Editar aqui para agregar, quitar o actualizar piezas.
   =========================================================== */

const CONTACTO = {
  whatsapp: '59895570751',
  whatsappVisible: '095 570 751',
  email: 'bernardomatteo@gmail.com',
  direccion: 'Monte Caseros 3063 esq. Mariano Moreno, Montevideo - Uruguay',
  instagram: 'https://www.instagram.com/bernardomatteo/',
  facebook: 'https://www.facebook.com/bernardomatteo/',
  formulario: 'https://forms.gle/sb2Kf5DoKxmHs7XD6'
};

const CATEGORIAS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'azulejos', nombre: 'Azulejos' },
  { id: 'cuadros', nombre: 'Cuadros' },
  { id: 'cuadros-grandes', nombre: 'Cuadros Grandes' },
  { id: 'logos', nombre: 'Logos' }
];
/* Galeria. coleccion: 'logos' | 'casas' (una pieza puede estar en ambas) */
const GALERIA = [
  { img: '20240418-202201.jpg', alt: 'Logo cerámico Los Cuervos Rugby', coleccion: ['logos'] },
  { img: '20240412-091345.jpg', alt: 'Logo cerámico sobre azulejos', coleccion: ['logos', 'casas'] },
  { img: '20240412-092138.jpg', alt: 'Logo cerámico institucional', coleccion: ['logos'] },
  { img: '20240412-092838.jpg', alt: 'Logo cerámico en cuerda seca', coleccion: ['logos'] },
  { img: '20240412-203918.jpg', alt: 'Logo cerámico a medida', coleccion: ['logos'] },
  { img: '20240412-204923.jpg', alt: 'Logo cerámico decorado a mano', coleccion: ['logos'] },
  { img: '20240413-181539-1.jpg', alt: 'Logo cerámico para establecimiento', coleccion: ['logos'] },
  { img: '20240413-194123.jpg', alt: 'Logo cerámico sobre placa', coleccion: ['logos'] },
  { img: '20240414-214218.jpg', alt: 'Logo cerámico personalizado', coleccion: ['logos'] },
  { img: '20240414-235841.jpg', alt: 'Logo cerámico esmaltado', coleccion: ['logos'] },
  { img: '20240420-175712.jpg', alt: 'Logo cerámico aplicado en muro', coleccion: ['logos', 'casas'] },
  { img: 'colegio-integral-solymar.jpg', alt: 'Logo cerámico Colegio Integral Solymar', coleccion: ['logos'] },
  { img: 'sifam.jpg', alt: 'Logo cerámico SIFAM', coleccion: ['logos'] },
  { img: 'triumph.jpg', alt: 'Logo cerámico Triumph', coleccion: ['logos'] },
  { img: 'vida-silvestre.jpg', alt: 'Logo cerámico Vida Silvestre', coleccion: ['logos'] },

  { img: '20240411-213944.jpg', alt: 'Azulejería aplicada en vivienda', coleccion: ['casas'] },
  { img: '20240411-230629.jpg', alt: 'Mural cerámico en espacio interior', coleccion: ['casas'] },
  { img: '20240411-231942.jpg', alt: 'Azulejos de autor en pared', coleccion: ['casas'] },
  { img: '20240411-232141.jpg', alt: 'Detalle de azulejería artesanal', coleccion: ['casas'] },
  { img: '20240412-091221.jpg', alt: 'Cerámica aplicada en establecimiento', coleccion: ['casas'] },
  { img: '20240412-092727.jpg', alt: 'Composición de azulejos pintados a mano', coleccion: ['casas'] },
  { img: '20240413-163305.jpg', alt: 'Azulejería en cocina', coleccion: ['casas'] },
  { img: '20240413-182819.jpg', alt: 'Panel cerámico decorativo', coleccion: ['casas'] },
  { img: '20240413-184757.jpg', alt: 'Mural de azulejos a medida', coleccion: ['casas'] },
  { img: '20240413-184757-1.jpg', alt: 'Detalle de mural de azulejos', coleccion: ['casas'] },
  { img: '20240414-174802.jpg', alt: 'Azulejos decorativos en interior', coleccion: ['casas'] },
  { img: '20240414-224255.jpg', alt: 'Cerámica artesanal en fachada', coleccion: ['casas'] },
  { img: '20240414-235511.jpg', alt: 'Placa cerámica para vivienda', coleccion: ['casas'] },
  { img: '20240416-000418.jpg', alt: 'Azulejería de autor aplicada', coleccion: ['casas'] },
  { img: '20240420-175851.jpg', alt: 'Proyecto cerámico en establecimiento', coleccion: ['casas'] },
  { img: '20240420-180246.jpg', alt: 'Mural cerámico institucional', coleccion: ['casas'] },
  { img: '20240420-180923.jpg', alt: 'Azulejos aplicados en escalera', coleccion: ['casas'] },
  { img: '20240420-185011.jpg', alt: 'Composición cerámica en muro', coleccion: ['casas'] },
  { img: '20240420-191531.jpg', alt: 'Azulejería en espacio comercial', coleccion: ['casas'] },
  { img: '20240420-192352.jpg', alt: 'Detalle de cuerda seca en obra', coleccion: ['casas'] },
  { img: '20240420-194102.jpg', alt: 'Cerámica de autor en arquitectura', coleccion: ['casas'] },
  { img: '20240501-125722.jpg', alt: 'Proyecto de azulejería terminado', coleccion: ['casas'] },
  { img: 'cultural-alfabeta.jpg', alt: 'Trabajo cerámico para Cultural Alfabeta', coleccion: ['casas'] },
  { img: 'alfaybeta.jpg', alt: 'Azulejería Alfa y Beta', coleccion: ['casas'] },
  { img: 'img-20210724-wa0003.jpg', alt: 'Azulejos artesanales instalados', coleccion: ['casas'] },
  { img: 'img-20210724-wa0004.jpg', alt: 'Detalle de azulejos artesanales', coleccion: ['casas'] },
  { img: 'img-20210724-wa0006.jpg', alt: 'Mural de cerámica artesanal', coleccion: ['casas'] },
  { img: 'img-20220227-wa0002.jpg', alt: 'Pieza cerámica a medida', coleccion: ['casas'] },
  { img: 'img-20230812-wa0005.jpg', alt: 'Azulejería de autor en interior', coleccion: ['casas'] },
  { img: 'img-20230812-wa0006.jpg', alt: 'Composición de azulejos de autor', coleccion: ['casas'] },
  { img: 'imagen-de-whatsapp-2024-04-12-a-las-12-15-48-2c683924.jpg', alt: 'Proyecto cerámico a medida', coleccion: ['casas'] },

  { img: '20240414-001950.jpg', alt: 'Pieza única de cerámica', coleccion: [] },
  { img: '20240414-171710.jpg', alt: 'Cerámica decorada a mano', coleccion: [] },
  { img: '20240414-182820.jpg', alt: 'Azulejo pintado en cuerda seca', coleccion: [] },
  { img: 'img-20221104-wa0000.jpg', alt: 'Trabajo de azulejería de autor', coleccion: [] }
];
