-- Script para limpiar anuncios huérfanos (que referencian usuarios inexistentes)
-- Ejecutar este script en la base de datos MySQL 'asturdron'

USE asturdron;

-- Mostrar anuncios huérfanos antes de eliminar
SELECT a.id, a.title, a.user_id, 'HUÉRFANO' as status
FROM announcements a
LEFT JOIN users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Eliminar anuncios huérfanos
DELETE a FROM announcements a
LEFT JOIN users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Verificar que se eliminaron
SELECT COUNT(*) as anuncios_restantes FROM announcements;

-- Mostrar todos los anuncios válidos restantes
SELECT a.id, a.title, u.username, a.created_at
FROM announcements a
JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC; 