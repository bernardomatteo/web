#!/usr/bin/env bash
# Descarga las imagenes del sitio original eligiendo, para cada archivo,
# la variante de tamano mas grande que exista hasta 1600 px, y valida que
# lo descargado sea realmente un JPEG/PNG y no una pagina 404.
set -uo pipefail

ORIGEN="${1:?uso: descargar-imagenes.sh <lista-de-urls.txt> <directorio-destino> <slug1=base1> ...}"
DESTINO="${2:?falta el directorio destino}"
shift 2

mkdir -p "$DESTINO"

# slug local a partir del nombre de archivo original
slugificar() {
  printf '%s' "$1" \
    | sed -E 's/\.(jpg|jpeg|png)$//' \
    | tr '[:upper:]' '[:lower:]' \
    | tr -c 'a-z0-9-\n' '-' \
    | sed -E 's/-+/-/g; s/^-|-$//g'
}

# base del archivo quitando el sufijo -WxH que agrega WordPress
base_de() {
  basename "$1" | sed -E 's/-[0-9]+x[0-9]+(\.(jpg|jpeg|png))$/\1/'
}

# puntaje de una variante: ancho*alto, y un valor alto para el original
puntaje_de() {
  local n
  n=$(basename "$1")
  if [[ "$n" =~ -([0-9]+)x([0-9]+)\.(jpg|jpeg|png)$ ]]; then
    local w="${BASH_REMATCH[1]}" h="${BASH_REMATCH[2]}"
    if (( w > 1600 || h > 1600 )); then echo 1; else echo $(( w * h )); fi
  else
    echo 2            # el original: solo si no hay ninguna variante util
  fi
}

es_imagen() {
  local t
  t=$(file -b "$1")
  [[ "$t" == JPEG* || "$t" == PNG* ]]
}

# Elegir la mejor URL por archivo base
declare -A mejor_url mejor_puntaje
while read -r url; do
  [ -z "$url" ] && continue
  b=$(base_de "$url")
  p=$(puntaje_de "$url")
  actual="${mejor_puntaje[$b]:-0}"
  if (( p > actual )); then
    mejor_puntaje["$b"]=$p
    mejor_url["$b"]=$url
  fi
done < "$ORIGEN"

ok=0; fallo=0
for b in "${!mejor_url[@]}"; do
  slug=$(slugificar "$b")
  destino="$DESTINO/$slug.jpg"
  url="${mejor_url[$b]}"

  curl -sL -A "Mozilla/5.0" "$url" -o "$destino"

  # Si la variante elegida no existe, reintentar con el original
  if ! es_imagen "$destino"; then
    orig="https://bernardomatteo.com/wp-content/uploads/$(dirname "${url#https://bernardomatteo.com/wp-content/uploads/}")/$b"
    orig="${orig//\/.\//\/}"
    curl -sL -A "Mozilla/5.0" "$orig" -o "$destino"
  fi

  if es_imagen "$destino"; then
    ok=$((ok+1))
  else
    rm -f "$destino"
    echo "  SIN IMAGEN: $b  (ultima url probada: $url)"
    fallo=$((fallo+1))
  fi
done

echo "descargadas: $ok   fallidas: $fallo   destino: $DESTINO"
