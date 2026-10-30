# PermisosApp

Aplicación web académica desarrollada con Angular para simular la administración y consulta ciudadana de permisos municipales. Permite recorrer un flujo de solicitud de trámites, gestionar un catálogo de permisos y revisar solicitudes desde perfiles con distintos niveles de acceso.

> **Estado del proyecto:** prototipo demostrativo. No consume una API ni tiene una base de datos remota; usa datos semilla y almacenamiento local del navegador.

## Contenido

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Cuentas de demostración](#cuentas-de-demostración)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Flujos principales](#flujos-principales)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura y conceptos aplicados](#arquitectura-y-conceptos-aplicados)
- [Datos y persistencia](#datos-y-persistencia)
- [Comandos disponibles](#comandos-disponibles)
- [Limitaciones](#limitaciones)

## Características

### Acceso y perfiles

- Inicio de sesión y registro de ciudadanos.
- Control de navegación mediante guards de autenticación, rol y redirección inicial.
- Perfil de **administrador** y perfil de **ciudadano** con rutas protegidas.
- Edición de datos del perfil para cada usuario.

### Perfil ciudadano

- Consulta del catálogo de permisos activos.
- Inicio de una solicitud desde el catálogo.
- Flujo guiado de solicitud: datos del trámite, documentos, pago simulado y confirmación.
- Consulta y filtrado de solicitudes propias.
- Consulta de patentes comerciales asociadas a la cuenta.

### Perfil administrador

- Panel de inicio administrativo.
- Revisión de solicitudes ingresadas.
- Actualización del estado de una solicitud: aprobar, rechazar, observar o emitir.
- Catálogo de tipos de permiso: crear, editar, activar y desactivar.
- Visualización de estadísticas agrupadas por estado y tipo de permiso.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Angular 15.2 | Framework principal de la aplicación |
| TypeScript 4.9 | Lenguaje de desarrollo |
| RxJS 7.8 | Manejo de observables y estado reactivo |
| Angular Router | Navegación, carga diferida y guards |
| Angular Reactive Forms | Formularios de acceso, registro, perfil y trámites |
| CSS | Estilos de componentes y estilos globales |

## Requisitos

Antes de ejecutar el proyecto, instala:

- [Node.js](https://nodejs.org/) 18.20.8
- npm, incluido con Node.js.

Puedes comprobar las versiones instaladas con:

```bash
node --version
npm --version
```

## Instalación y ejecución

1. Clona el repositorio o descarga el código.
2. Abre una terminal en la carpeta del proyecto.
3. Instala las dependencias:

   ```bash
   npm install -g @angular/cli@15
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   ng serve
   ```

5. Abre [http://localhost:4200](http://localhost:4200) en el navegador.

La aplicación se recarga automáticamente al guardar cambios en los archivos fuente.

## Cuentas de demostración

| Perfil | Correo | Contraseña | Información disponible |
| --- | --- | --- | --- |
| Administrador | `admin@municipal.cl` | `1234` | Gestión de solicitudes, catálogo, estadísticas y perfil administrativo. |

También puedes registrar una cuenta nueva desde `/auth/register`. Toda cuenta creada recibe automáticamente el rol de ciudadano.

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/auth/login` | Público | Inicio de sesión. |
| `/auth/register` | Público | Registro de una cuenta ciudadana. |
| `/admin` | Administrador | Inicio del panel administrativo. |
| `/admin/perfil` | Administrador | Perfil administrativo. |
| `/admin/solicitudes` | Administrador | Revisión de todas las solicitudes. |
| `/admin/catalogo` | Administrador | Gestión de tipos de permiso. |
| `/admin/catalogo/nuevo` | Administrador | Creación de un tipo de permiso. |
| `/admin/catalogo/:id/editar` | Administrador | Edición de un tipo de permiso. |
| `/admin/estadisticas` | Administrador | Estadísticas de solicitudes. |
| `/ciudadano` | Ciudadano | Inicio del panel ciudadano. |
| `/ciudadano/permisos` | Ciudadano | Catálogo de permisos disponibles. |
| `/ciudadano/permisos/:permisoId/solicitar` | Ciudadano | Solicitud de un permiso concreto. |
| `/ciudadano/nueva-solicitud` | Ciudadano | Inicio de una nueva solicitud. |
| `/ciudadano/solicitudes` | Ciudadano | Solicitudes del usuario autenticado. |
| `/ciudadano/mis-patentes` | Ciudadano | Patentes comerciales emitidas. |
| `/ciudadano/perfil` | Ciudadano | Perfil ciudadano. |

## Flujos principales

### Solicitud de trámite ciudadana

1. El ciudadano inicia sesión y abre el catálogo de permisos.
2. Selecciona un permiso activo e inicia el trámite.
3. Completa los datos requeridos y adjunta documentos de forma simulada.
4. Realiza un pago simulado.
5. Confirma la solicitud; el sistema genera un folio con el formato `SOL-AÑO-CORRELATIVO` y deja la solicitud en revisión.

### Gestión administrativa

1. El administrador inicia sesión.
2. Accede a la lista de solicitudes para revisar los datos disponibles.
3. Define una acción administrativa: aprobar, rechazar, observar o emitir.
4. Consulta el catálogo para crear o modificar tipos de permiso y administrar su disponibilidad.
5. Revisa las estadísticas calculadas desde las solicitudes cargadas en memoria.

## Estructura del proyecto

```text
src/
└── app/
    ├── auth/                 # Inicio de sesión y registro
    ├── core/
    │   ├── enums/            # Estados, categorías y roles
    │   ├── guards/           # Protección y redirección de rutas
    │   ├── models/           # Interfaces y DTOs
    │   └── services/         # Lógica de autenticación, permisos y solicitudes
    ├── features/
    │   ├── admin/            # Módulo y páginas administrativas
    │   └── ciudadano/        # Módulo y páginas ciudadanas
    ├── shared/               # Componentes reutilizables: header, navbar y footer
    ├── app-routing.module.ts # Rutas raíz y carga diferida de módulos
    └── app.module.ts         # Módulo principal
```

## Arquitectura y conceptos aplicados

- **Módulos funcionales con carga diferida:** `AuthModule`, `AdminModule` y `CiudadanoModule` se cargan bajo demanda desde el enrutamiento principal.
- **Servicios inyectables:** `AuthService`, `PermisosService` y `SolicitudesService` concentran la lógica de negocio y los datos de la demostración.
- **Estado reactivo:** los servicios usan `BehaviorSubject` y exponen datos como `Observable` mediante RxJS.
- **Modelado tipado:** interfaces, DTOs y enums para usuarios, solicitudes, permisos, estados y roles.
- **Formularios:** uso de formularios reactivos; la aplicación también incluye ejemplos de binding, interpolación, directivas estructurales, referencias locales y `ViewChild`.
- **Control de acceso:** `AuthGuard` comprueba la sesión y `RoleGuard` restringe las áreas según el rol del usuario.

## Datos y persistencia

Los datos de demostración se cargan en los servicios del cliente:

- El catálogo inicial incluye patente comercial, autorización de eventos y ocupación de vía pública.
- Las solicitudes iniciales se mantienen en memoria mientras la aplicación está abierta.
- Las modificaciones al catálogo y a las solicitudes no sobreviven una recarga de página.
- La sesión activa, cuentas registradas y cambios de perfil se almacenan en `localStorage` del navegador.

Para restablecer completamente las cuentas y la sesión de prueba, elimina los datos del sitio desde las herramientas de desarrollo del navegador o borra las claves de `localStorage` que comienzan con `permisos_`.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia Angular en modo desarrollo. |
| `npm run build` | Genera una compilación de producción en `dist/permisos-app`. |
| `npm run watch` | Compila continuamente usando la configuración de desarrollo. |
| `npm test` | Ejecuta las pruebas unitarias configuradas con Karma y Jasmine. |
| `npm run ng -- generate component nombre-componente` | Crea un componente mediante Angular CLI. |

## Limitaciones

- No hay backend, API REST ni base de datos.
- Las credenciales de demostración están definidas en el código y no deben utilizarse en un entorno real.
- La carga de documentos, el pago y la descarga de comprobantes son simulados.
- No existe persistencia remota para solicitudes ni cambios del catálogo.
- La aplicación representa un caso académico y requiere medidas adicionales de seguridad, validación, auditoría y manejo de errores antes de usarse en producción.

## Licencia

Este proyecto fue creado con fines académicos. Si se desea distribuir o reutilizar, se recomienda agregar una licencia explícita al repositorio.
