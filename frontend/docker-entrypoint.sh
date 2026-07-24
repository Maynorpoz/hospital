#!/bin/sh
# Comprueba si el proyecto ya fue inicializado
if [ ! -f package.json ]; then
    echo "========================================================="
    echo "Inicializando proyecto base de Angular... esto tomará un momento"
    echo "========================================================="
    npx @angular/cli new frontend-hospital --directory=. --skip-git --routing --style=css --defaults
else
    echo "Proyecto Angular detectado. Instalando dependencias..."
    npm install
fi

echo "Iniciando servidor de desarrollo Angular..."
exec "$@"
