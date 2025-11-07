# Ejecución local

Para levantar el proyecto de forma local, asegurarse de tener Docker instalado y ejecutar siguiente comando en la carpeta raíz del proyecto.

```bash
docker compose up --build
```

# Lane A - Backend

**¿Qué construimos?**

API REST completa en Go para gestión de AdSpots (espacios publicitarios) con las siguientes características:

- CRUD de AdSpots con validación de datos
- Filtrado por placement (ubicación) y status
- Búsqueda por título (case-insensitive)
- Data store in-memory con sincronización thread-safe
- CORS habilitado para integración con frontend
- Arquitectura en capas (models, store, handlers, middleware)

**Stack:** Go 1.25, HTTP standard library

**Stretch**

- None

# Lane B - Frontend

**¿Qué construimos?**

Dashboard administrativo completo en Next.js para gestionar AdSpots con las siguientes características:

- Listado de AdSpots con filtros (placement, búsqueda, incluir expirados)
- Creación de nuevos AdSpots con formulario validado
- Desactivación de AdSpots activos
- Indicadores visuales de estado (activo, inactivo, expirado)
- Sistema de badges por placement
- Dark mode con toggle
- Notificaciones toast para feedback de usuario
- API Routes integradas (Next.js) como alternativa al backend Go
- SSR + Client-side updates con SWR
- Responsive design

**Stretch**

- Simple search (by title) and placement filter chips.
- Optimistic UI for deactivating.

**Stack:** Next.js 16, React 19, TypeScript, TailwindCSS 4, HeroUI 2.8
