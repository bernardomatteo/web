#!/usr/bin/env bash
# Arma las paginas internas combinando head.part + <pagina>.body.html + foot.part.
# El header y el footer salen de index.html, asi no se desincronizan.
set -euo pipefail
cd "$(dirname "$0")/.."

# El header y el footer se extraen de index.html en cada corrida, para que
# editar el menu o el pie en index.html alcance y las paginas internas no
# queden con una version vieja.
awk 'NR==1, /<main id="main">/'  index.html > .build/head.part
awk '/^<\/main>/, 0'             index.html > .build/foot.part

# aria-current="page" solo debe marcarse en el menu del header, que vive
# en las primeras lineas del archivo (head.part). El footer repite los
# mismos href y no debe quedar marcado.
HEAD_LEN=$(wc -l < .build/head.part)

armar() {
  local salida="$1" cuerpo="$2" titulo="$3" descripcion="$4" actual="$5"

  {
    cat .build/head.part
    cat ".build/$cuerpo"
    cat .build/foot.part
  } \
  | sed "s#<title>.*</title>#<title>${titulo}</title>#" \
  | sed "s#<meta name=\"description\" content=\"[^\"]*\">#<meta name=\"description\" content=\"${descripcion}\">#" \
  | sed 's# aria-current="page"##g' \
  | sed "1,${HEAD_LEN} s#<a href=\"${actual}\"#<a href=\"${actual}\" aria-current=\"page\"#" \
  > "$salida"

  echo "  generado: $salida"
}

armar tienda.html tienda.body.html \
  "Tienda: azulejos y cuadros cerámicos | Bernardo Matteo Cerámicas" \
  "Colección de azulejos de 10 x 10 cm, cuadros cerámicos y piezas de gran formato decoradas a mano en el taller de Bernardo Matteo, Montevideo." \
  "tienda.html"

armar talleres.html talleres.body.html \
  "Clases de Cerámica en Montevideo | Bernardo Matteo Cerámicas" \
  "Clases presenciales de cerámica en Montevideo: modelado a mano, torno, engobes y esmaltes. Grupos reducidos, materiales incluidos y 30 años de taller." \
  "talleres.html"

armar galeria.html galeria.body.html \
  "Galería de trabajos | Bernardo Matteo Cerámicas" \
  "Galería de azulejería de autor, murales cerámicos, logos institucionales y piezas únicas realizadas en el taller de Bernardo Matteo." \
  "galeria.html"

armar galeria-logos.html galeria-logos.body.html \
  "Logos en cerámica | Bernardo Matteo Cerámicas" \
  "Logos institucionales reproducidos en cerámica esmaltada y pintados a mano, aptos para interior y exterior." \
  "galeria.html"

armar galeria-casas.html galeria-casas.body.html \
  "Casas y Establecimientos | Bernardo Matteo Cerámicas" \
  "Murales, frisos y azulejería de autor aplicados en casas, cocinas, baños, fachadas y establecimientos de Montevideo." \
  "galeria.html"

armar contacto.html contacto.body.html \
  "Contacto | Bernardo Matteo Cerámicas" \
  "Taller en Monte Caseros 3063 esquina Mariano Moreno, Montevideo. Escribinos por WhatsApp al 095 570 751 o a bernardomatteo@gmail.com." \
  "contacto.html"

echo "Listo."
