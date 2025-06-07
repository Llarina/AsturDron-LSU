# Solución para Error 500 en /announcements

## Problema
El error 500 se produce porque hay anuncios en la base de datos que referencian usuarios que no existen (anuncios huérfanos).

**Error específico:** `Entity 'com.dwes.ApiRestBackEnd.model.User' with identifier value '10' does not exist`

## Soluciones

### Opción 1: Limpiar datos usando SQL (RECOMENDADO)
1. Conectar a la base de datos MySQL
2. Ejecutar el script `cleanup_orphaned_announcements.sql`

```sql
USE asturdron;

-- Ver anuncios huérfanos
SELECT a.id, a.title, a.user_id, 'HUÉRFANO' as status
FROM announcements a
LEFT JOIN users u ON a.user_id = u.id
WHERE u.id IS NULL;

-- Eliminar anuncios huérfanos
DELETE a FROM announcements a
LEFT JOIN users u ON a.user_id = u.id
WHERE u.id IS NULL;
```

### Opción 2: Usar endpoint de limpieza
1. Iniciar el backend
2. Llamar al endpoint: `DELETE http://localhost:8080/announcements/cleanup/orphaned`

### Opción 3: Verificar integridad de datos
```sql
-- Verificar usuarios existentes
SELECT id, username FROM users;

-- Verificar anuncios y sus referencias
SELECT a.id, a.title, a.user_id, u.username
FROM announcements a
LEFT JOIN users u ON a.user_id = u.id;
```

## Prevención
- Usar restricciones de clave foránea en la base de datos
- Implementar validación antes de eliminar usuarios
- Usar transacciones para operaciones relacionadas

## Cambios realizados en el código
1. Modificada la consulta para excluir anuncios huérfanos
2. Agregado manejo de errores robusto
3. Creado endpoint de limpieza
4. Mejorado el mapeo de DTOs para manejar referencias nulas 