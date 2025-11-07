POSTMORTEM
==========

## Riesgos anticipados
- Desajuste de TTL en cachés que puede expirar demasiado pronto o seguir activos más tiempo del debido, afectando sesiones y coherencia de datos.
- Condiciones de carrera en tareas concurrentes (jobs de sincronización, actualizaciones masivas) que podrían sobrescribir cambios recientes si no se usan locks o transacciones adecuadas.
- Latencia de servicios externos (HeroUI CDN, generación de imágenes) que eleva el tiempo de respuesta y reduce la experiencia del usuario.
- Falta de observabilidad fina que dificulta detectar anomalías y reproducir bugs críticos en producción.
- Migración desde una base de datos en memoria hacia un motor persistente que puede provocar pérdida de datos si no se coordinan backups y scripts de migración.
- Pruebas unitarias sobre módulos críticos con mocks para servicios externos.
- Tests de integración end-to-end usando los contenedores Docker para validar flujos y expiraciones TTL.


## Camino a producción
1. Configurar pipelines CI/CD con las pruebas anteriores para backend y UI.
2. Instrumentar logs estructurados, métricas y alertas sobre TTL, errores y throughput.
3. Desplegar en un entorno de staging paritario usando `docker compose up --build` y ejecutar pruebas de carga básicas.

