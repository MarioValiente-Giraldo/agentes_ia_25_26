#!/bin/bash
# @autor:Mario Valiente 
# @document:
# @description: Script que valida si tenemos instalados git, node, npm, curl
# Crear un script que utilizando el comando command -v verifique si tengo instalado los paquetes git, node, npm, curl. Si alguno de dichos paquetes no están en el sistema, mostraremos mensaje de error 


clear

echo "Verificando los requisitos previos"

if command -v node > /dev/null 2>&1 ;then
	NODE_VERSION=$(node --version)
	echo "Node instalado: version: $NODE_VERSION"
else
	echo "NodeJS no está instalado"
	exit 1
fi

if command -v git > /dev/null 2>&1 ;then
	GIT_VERSION=$(git --version)
	echo "Git instalado: version: $GIT_VERSION"
else
	echo "Git no está instalado"
	exit 1
fi


if command -v npm > /dev/null 2>&1 ;then
	NPM_VERSION=$( npm --version)
	echo "npm está instalado: version: $NPM_VERSION"
else
	echo "npm no está instalado"
	exit 1
fi

if command -v curl > /dev/null 2>&1 ;then
	CURL_VERSION=$(curl --version)
	echo "Curl está instalado: version: $CURL_VERSION"
else
	echo "Curl no está instalado"

fi

echo "Todos los paquetes están instalados"





