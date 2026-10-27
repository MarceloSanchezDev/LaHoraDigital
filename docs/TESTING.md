# Pruebas de La Hora Hurlingham

## Proyecto completo de desarrollo

- `npm run test:unit`: pruebas Node y componentes React con Vitest/Testing Library.
- `npm run test:unit:diario`, `npm run test:unit:api`, `npm run test:unit:editorial`: ejecutar por proyecto.
- `npm run test:e2e`: los tres proyectos de Playwright en Chromium.
- `npm run test:e2e:diario`, `npm run test:e2e:api`, `npm run test:e2e:editorial`: ejecutar un solo proyecto.
- `npm run test:all`: unitarias y E2E.

Instalar con `npm ci` y `npx playwright install chromium`. Los E2E completos requieren PostgreSQL local: `npm run db:start` en el proyecto original, o E2E_DATABASE_URL apuntando a una base local lahora_test/lahora_development. El runner solo lee DATABASE_URL del .env local; no carga sus claves de producción en Vite. Todas las URLs de navegador/API son locales, se bloquean las llamadas de navegador a hosts externos y se crea un esquema e2e_ aleatorio que se elimina al terminar. No utilizar URLs de Supabase/Vercel: el runner las rechaza. Puertos reservados: 18730–18733. No se reutilizan servidores ya abiertos.

## Cobertura

Diario: portada, navegación, cuerpo e imagen, búsqueda de texto completo con acentos, filtros, estado vacío, error/reintento y 404 de borradores/archivados. Unitarias para tarjetas, imágenes rotas, consulta de catálogos y utilidades de lectura.

API: contrato de salida sin campos internos, CORS, métodos de solo lectura, aislamiento de gestión, CSRF, permisos OWNER/EDITOR, conflictos de versión, publicación/archivado y adjunto >4,5 MB con comparación SHA256 de descarga.

Panel: login incorrecto, cookie HttpOnly/SameSite, cierre de sesión, creación/edición de borradores, envío a revisión del EDITOR, publicación del OWNER, adjuntos e invalidación de visibilidad tras archivar. Componentes: límite de archivo, error de subida, subida directa sin filtrar CSRF/sesión al Storage y quitar una imagen sin borrar el objeto.

## Límites explícitos

El E2E completo usa PostgreSQL y las rutas reales de API/panel, pero sustituye Supabase Auth por identidades OWNER/EDITOR de prueba y Storage por un directorio temporal. Las políticas RLS y el OAuth real de Supabase no se ejecutan en esta base local; deben comprobarse en un entorno remoto aislado cuando se cambian. Redis está deshabilitado para que CI no requiera secretos ni toque la instancia de producción. Las comprobaciones reales de Redis se mantienen en tools/check-public-cache.mjs usando un namespace temporal y se ejecutan por separado con credenciales del entorno de pruebas. La subida grande de este E2E verifica bytes/permisos/streaming local, no el límite de la plataforma Vercel ni el salto a Supabase Storage; esa prueba remota se verificó manualmente y debe repetirse al cambiar de plataforma.

Los informes HTML, capturas y trazas de fallos quedan en .runtime/playwright-report y .runtime/test-results, fuera de Git. El workflow de GitHub los conserva 7 días sin descargar variables ni credenciales de producción.

## Repositorios desplegables

El repositorio privado la-hora-editorial contiene la suite completa y CI descarga el frontend público para probar los tres servicios juntos. Localmente instalar dependencias en la raíz, editorial, public-api y .runtime/public-site (un checkout del repo público). Puede usarse E2E_PUBLIC_ROOT con otra ruta al código del frontend. Ejecutar npm run test:all desde la raíz del repositorio privado.

El repositorio público LaHoraDigital ejecuta sus unitarias y E2E de interfaz contra un servidor local que representa el contrato público (tools/testing/public-fixture-server.mjs). No contiene backend privado ni necesita secretos/PostgreSQL. La prueba de integración completa con persistencia está en el repositorio privado y el proyecto original.

Las suites se ejecutan en pull requests y al hacer push a main. El workflow no despliega ni modifica Supabase/Vercel.
