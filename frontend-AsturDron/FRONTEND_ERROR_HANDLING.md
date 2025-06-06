# Manejo de Errores Específicos en el Frontend

## Descripción
Se ha implementado el manejo específico de errores de autenticación en los componentes de login y registro del frontend Angular. Ahora la aplicación puede distinguir entre diferentes tipos de errores y mostrar mensajes específicos al usuario.

## Archivos Modificados

### 1. Componente de Login Principal
**Archivo:** `src/app/login/login.component.ts`

#### Cambios Realizados:
- Modificado el método `handleLoginError()` para detectar el tipo específico de error
- Agregada lógica para interpretar el campo `errorType` del backend
- Mensajes de error más específicos y útiles para el usuario

```typescript
private handleLoginError(error: any) {
  console.error('Error en login:', error);
  
  /* Verificar si el error tiene información específica del backend */
  if (error.error && error.error.errorType) {
    switch (error.error.errorType) {
      case 'INVALID_USERNAME':
        this.errorMessage = 'El nombre de usuario no existe. Verifica que esté escrito correctamente.';
        break;
      case 'INVALID_PASSWORD':
        this.errorMessage = 'La contraseña es incorrecta. Inténtalo de nuevo.';
        break;
      default:
        this.errorMessage = 'Error de autenticación. Verifica tus credenciales.';
    }
  } else {
    /* Manejo de errores genéricos según código de estado HTTP */
    if (error.status === 401) {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    } else if (error.status === 404) {
      this.errorMessage = 'Usuario no encontrado.';
    } else if (error.status === 0) {
      this.errorMessage = 'No se puede conectar con el servidor. Inténtalo más tarde.';
    } else {
      this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
    }
  }
  
  /* Limpiar contraseña por seguridad en caso de error */
  this.password = '';
}
```

### 2. Componente de Login Alternativo
**Archivo:** `src/app/components/auth/login/login.component.ts`

#### Cambios Realizados:
- Agregado campo `errorMessage` para mostrar errores al usuario
- Agregado campo `isLoading` para indicar estado de carga
- Modificado el template para incluir visualización de errores
- Agregada validación de campos obligatorios
- Implementado método `handleLoginError()` completo
- Mejorados los estilos CSS para mostrar errores de forma atractiva

### 3. Componente de Registro
**Archivo:** `src/app/components/auth/register/register.component.ts`

#### Cambios Realizados:
- Agregado campo `errorMessage` para mostrar errores específicos
- Agregado campo `isLoading` para indicar estado de carga
- Implementada validación local de campos obligatorios
- Agregada validación de formato de email
- Implementado método `handleRegisterError()` con manejo específico de errores
- Mejorados los estilos CSS para mostrar errores

#### Método de Manejo de Errores de Registro:
```typescript
private handleRegisterError(error: any) {
  console.error('Error al registrarse:', error);
  
  /* Verificar si el error tiene información específica del backend */
  if (error.error && error.error.errorType) {
    switch (error.error.errorType) {
      case 'USERNAME_IN_USE':
        this.errorMessage = 'El nombre de usuario ya está en uso. Por favor, elige otro.';
        break;
      case 'EMAIL_IN_USE':
        this.errorMessage = 'El email ya está registrado. ¿Ya tienes una cuenta?';
        break;
      case 'MULTIPLE_FIELDS_IN_USE':
        this.errorMessage = 'El nombre de usuario y el email ya están en uso. Por favor, utiliza datos diferentes.';
        break;
      default:
        this.errorMessage = 'Error al registrarse. Verifica tus datos e inténtalo de nuevo.';
    }
  } else {
    /* Manejo de errores genéricos según código de estado HTTP */
    if (error.status === 400) {
      this.errorMessage = 'Datos de registro inválidos. Verifica la información introducida.';
    } else if (error.status === 0) {
      this.errorMessage = 'No se puede conectar con el servidor. Inténtalo más tarde.';
    } else {
      this.errorMessage = 'Error al registrarse. Inténtalo de nuevo más tarde.';
    }
  }
}
```

## Tipos de Mensajes de Error

### 🔐 **Errores de Login**

#### 1. Usuario No Existe
**Condición:** `errorType === 'INVALID_USERNAME'`
**Mensaje:** "El nombre de usuario no existe. Verifica que esté escrito correctamente."

#### 2. Contraseña Incorrecta
**Condición:** `errorType === 'INVALID_PASSWORD'`
**Mensaje:** "La contraseña es incorrecta. Inténtalo de nuevo."

### 📝 **Errores de Registro**

#### 3. Username Duplicado
**Condición:** `errorType === 'USERNAME_IN_USE'`
**Mensaje:** "El nombre de usuario ya está en uso. Por favor, elige otro."

#### 4. Email Duplicado
**Condición:** `errorType === 'EMAIL_IN_USE'`
**Mensaje:** "El email ya está registrado. ¿Ya tienes una cuenta?"

#### 5. Múltiples Campos Duplicados
**Condición:** `errorType === 'MULTIPLE_FIELDS_IN_USE'`
**Mensaje:** "El nombre de usuario y el email ya están en uso. Por favor, utiliza datos diferentes."

### 🛠️ **Errores Generales**

#### 6. Error Genérico de Autenticación
**Condición:** Error 401 sin `errorType` específico
**Mensaje:** "Usuario o contraseña incorrectos."

#### 7. Error de Conexión
**Condición:** `error.status === 0`
**Mensaje:** "No se puede conectar con el servidor. Inténtalo más tarde."

#### 8. Campos Vacíos (Login)
**Condición:** Validación local
**Mensaje:** "Por favor, completa todos los campos."

#### 9. Campos Vacíos (Registro)
**Condición:** Validación local
**Mensaje:** "Por favor, completa todos los campos obligatorios."

#### 10. Email Inválido
**Condición:** Validación local de formato
**Mensaje:** "Por favor, introduce un email válido."

## Mejoras de UI/UX Implementadas

### Estilos CSS para Errores
```css
.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
```

### Estados de Carga
- Botones deshabilitados durante procesamiento
- Texto del botón cambia a "Iniciando sesión..." o "Registrando..."
- Prevención de múltiples envíos simultáneos

### Validaciones Locales
- Verificación de campos obligatorios antes del envío
- Validación de formato de email con expresión regular
- Feedback inmediato sin necesidad de consultar el servidor

## Flujo de Manejo de Errores

### Login
1. **Usuario envía formulario** → `onSubmit()`
2. **Validación local** → Campos obligatorios
3. **Llamada al backend** → `authService.login()`
4. **Si hay error** → `handleLoginError()`
5. **Análisis del error** → Verificar `errorType`
6. **Mostrar mensaje específico** → Según tipo de error
7. **Limpiar contraseña** → Por seguridad

### Registro
1. **Usuario envía formulario** → `onSubmit()`
2. **Validación local** → Campos obligatorios + formato email
3. **Llamada al backend** → `authService.register()`
4. **Si hay error** → `handleRegisterError()`
5. **Análisis del error** → Verificar `errorType`
6. **Mostrar mensaje específico** → Según tipo de error

## Integración con el Backend

### Respuestas Esperadas del Backend

#### Login - Usuario No Encontrado (401)
```json
{
  "message": "El nombre de usuario no existe",
  "errorType": "INVALID_USERNAME",
  "status": 401
}
```

#### Login - Contraseña Incorrecta (401)
```json
{
  "message": "La contraseña es incorrecta",
  "errorType": "INVALID_PASSWORD",
  "status": 401
}
```

#### Registro - Username Duplicado (400)
```json
{
  "message": "El nombre de usuario ya está en uso",
  "errorType": "USERNAME_IN_USE",
  "status": 400
}
```

#### Registro - Email Duplicado (400)
```json
{
  "message": "El email ya está en uso",
  "errorType": "EMAIL_IN_USE",
  "status": 400
}
```

#### Registro - Múltiples Campos Duplicados (400)
```json
{
  "message": "El nombre de usuario y el email ya están en uso",
  "errorType": "MULTIPLE_FIELDS_IN_USE",
  "status": 400
}
```

## Ventajas de la Implementación

### 🎯 **Experiencia de Usuario Mejorada**
- Mensajes específicos y claros
- El usuario sabe exactamente qué corregir
- Validación local para feedback inmediato
- Estados de carga para mejor percepción de rendimiento

### 🔒 **Seguridad**
- La contraseña se limpia automáticamente tras error
- No se expone información sensible
- Validaciones tanto en frontend como backend

### 🛠️ **Mantenibilidad**
- Código centralizado para manejo de errores
- Fácil agregar nuevos tipos de error
- Consistencia entre componentes de login y registro

### 📱 **Diseño Responsive**
- Mensajes de error con estilos atractivos
- Indicadores de carga durante procesamiento
- Botones deshabilitados para prevenir múltiples envíos

## Cómo Probar

### Login
1. Probar con usuario inexistente → Mensaje específico "usuario no existe"
2. Probar con contraseña incorrecta → Mensaje específico "contraseña incorrecta"
3. Dejar campos vacíos → Validación local
4. Desconectar backend → Mensaje de error de conexión

### Registro
1. Registrar usuario con username existente → Mensaje específico
2. Registrar usuario con email existente → Mensaje específico
3. Registrar con ambos duplicados → Mensaje general
4. Introducir email inválido → Validación local
5. Dejar campos vacíos → Validación local

## Próximas Mejoras

- [ ] Agregar animaciones para transiciones de error
- [ ] Implementar sistema de notificaciones toast
- [ ] Agregar verificación de fortaleza de contraseña
- [ ] Implementar confirmación de contraseña en registro
- [ ] Agregar recuperación de contraseña
- [ ] Implementar límite de intentos
- [ ] Agregar autenticación de dos factores 