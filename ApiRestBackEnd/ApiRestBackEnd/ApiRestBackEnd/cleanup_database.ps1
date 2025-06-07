# Script de PowerShell para limpiar anuncios huérfanos en la base de datos
# Requiere tener MySQL instalado y accesible desde línea de comandos

Write-Host "=== Limpieza de Anuncios Huérfanos ===" -ForegroundColor Green

# Configuración de la base de datos
$dbHost = "localhost"
$dbPort = "3306"
$dbName = "asturdron"
$dbUser = "root"
$dbPassword = "12345"

# Crear archivo temporal con las consultas SQL
$sqlFile = "temp_cleanup.sql"
$sqlContent = @"
USE asturdron;

-- Mostrar anuncios huérfanos antes de eliminar
SELECT 'ANUNCIOS HUÉRFANOS ENCONTRADOS:' as mensaje;
SELECT a.id, a.title, a.user_id, 'HUÉRFANO' as status
FROM announcements a
LEFT JOIN users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Contar anuncios huérfanos
SELECT COUNT(*) as total_huerfanos
FROM announcements a
LEFT JOIN users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Eliminar anuncios huérfanos
DELETE a FROM announcements a
LEFT JOIN users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Verificar que se eliminaron
SELECT 'ANUNCIOS RESTANTES DESPUÉS DE LIMPIEZA:' as mensaje;
SELECT COUNT(*) as anuncios_restantes FROM announcements;

-- Mostrar todos los anuncios válidos restantes
SELECT a.id, a.title, u.username, a.created_at
FROM announcements a
JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC
LIMIT 10;
"@

# Escribir el archivo SQL temporal
$sqlContent | Out-File -FilePath $sqlFile -Encoding UTF8

Write-Host "Ejecutando limpieza de base de datos..." -ForegroundColor Yellow

try {
    # Intentar ejecutar con mysql command line
    if (Get-Command mysql -ErrorAction SilentlyContinue) {
        mysql -h $dbHost -P $dbPort -u $dbUser -p$dbPassword < $sqlFile
        Write-Host "Limpieza completada exitosamente!" -ForegroundColor Green
    } else {
        Write-Host "MySQL command line no encontrado." -ForegroundColor Red
        Write-Host "Por favor, ejecuta manualmente las siguientes consultas en tu cliente MySQL:" -ForegroundColor Yellow
        Write-Host $sqlContent -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error al ejecutar la limpieza: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Consultas SQL para ejecutar manualmente:" -ForegroundColor Yellow
    Write-Host $sqlContent -ForegroundColor Cyan
} finally {
    # Limpiar archivo temporal
    if (Test-Path $sqlFile) {
        Remove-Item $sqlFile
    }
}

Write-Host "`n=== Instrucciones adicionales ===" -ForegroundColor Green
Write-Host "1. Si la limpieza fue exitosa, reinicia el backend de Spring Boot" -ForegroundColor White
Write-Host "2. Prueba el endpoint: GET http://localhost:8080/announcements" -ForegroundColor White
Write-Host "3. Si persisten problemas, revisa el archivo SOLUCION_ERROR_500.md" -ForegroundColor White 