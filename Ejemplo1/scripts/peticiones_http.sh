#!/bin/bash

# Autor: Mario Valeinte Giraldo
# Fecha: 01/10/2025
# Descripción: Script de pruebas CURL para API REST

source .env

# GET
curl -X GET "$BASE_URL/books"

# POST
curl -X POST "$BASE_URL/books" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nuevo libro","authorId":1,"anio":2024,"editorial":"Test","categoria":"Test","isbn":"1234567890","precio":20,"stock":10}'


# PUT
curl -X PUT "$BASE_URL/books/1" \
  -H "Content-Type: application/json" \
  -d '{"id":"1","titulo":"Libro reemplazado","authorId":1,"anio":2024,"editorial":"Nueva","categoria":"Nueva","isbn":"0000000000","precio":30,"stock":5}'

# DELETE
curl -X DELETE "$BASE_URL/books/5"



