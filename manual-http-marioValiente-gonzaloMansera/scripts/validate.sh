#!/bin/bash

echo "=== VALIDACIÓN DEL PROYECTO ==="
echo ""

errors=0

echo "📄 Archivos principales:"
for file in "package.json" "src/db/db.json" ".gitignore" ".env.example" "README.md" "checklist.md" "peticiones-crud.http"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file"
        errors=$((errors + 1))
    fi
done

echo ""
echo "-----------------------------"
echo ""
echo "📁 Carpetas:"
for dir in "src" "scripts" "images"; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir/"
    else
        echo "  ✗ $dir/"
        errors=$((errors + 1))
    fi
done

echo ""
echo "-----------------------------"
echo ""
echo "💻 Archivo CRUD:"
if [ -f "src/crud-curl.js" ]; then
    echo "  ✓ src/crud-curl.js"
else
    echo "  ✗ src/crud-curl.js"
    errors=$((errors + 1))
fi

echo ""
echo "-----------------------------"
echo ""
echo "⚙️  Configuración package.json:"
if [ -f "package.json" ]; then
    if grep -q '"type": "module"' package.json; then
        echo "  ✓ type: module"
    else
        echo "  ✗ type: module"
        errors=$((errors + 1))
    fi
    
    if grep -q '"dotenv"' package.json; then
        echo "  ✓ dotenv"
    else
        echo "  ✗ dotenv"
        errors=$((errors + 1))
    fi
    
    if grep -q '"json-server"' package.json; then
        echo "  ✓ json-server"
    else
        echo "  ✗ json-server"
        errors=$((errors + 1))
    fi
    
    if grep -q '"server:up"' package.json; then
        echo "  ✓ server:up"
    else
        echo "  ✗ server:up"
        errors=$((errors + 1))
    fi
    
    if grep -q '"crud:curl"' package.json; then
        echo "  ✓ crud:curl"
    else
        echo "  ✗ crud:curl"
        errors=$((errors + 1))
    fi
    
    if grep -q '"validate"' package.json; then
        echo "  ✓ validate"
    else
        echo "  ✗ validate"
        errors=$((errors + 1))
    fi
fi

echo ""
echo "-----------------------------"
echo ""
echo "📸 Capturas de pantalla:"
if [ -d "images" ]; then
    count=$(ls images/*.{png,jpg,jpeg} 2>/dev/null | wc -l)
    if [ "$count" -ge 6 ]; then
        echo "  ✓ $count imágenes (mínimo 6)"
    else
        echo "  ✗ $count imágenes (mínimo 6)"
        errors=$((errors + 1))
    fi
fi

echo ""
echo "-----------------------------"
if [ $errors -eq 0 ]; then
    echo "✓ VALIDACIÓN EXITOSA"
    exit 0
else
    echo "✗ $errors errores encontrados"
    exit 1
fi