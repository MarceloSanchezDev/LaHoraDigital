# La Hora Hurlingham — web pública

Sitio de lectura con 959 publicaciones, 18 secciones y 944 imágenes recuperadas del medio. React y Vite; contenido estático JSON, sin PostgreSQL ni acceso a un administrador. Esta versión es una instantánea del archivo; las futuras ediciones del CMS requieren una nueva exportación/publicación.

## Desarrollo

Node.js 22.12 o posterior dentro de la rama 22.x.


Ejecutar `npm ci`, `npm run dev`. Para compilar: `npm run build`; para revisar la compilación: `npm run preview`.

## Vercel

Importar este repositorio, rama main, directorio raíz. vercel.json define Vite, npm ci, npm run build y dist. Las rutas de publicaciones y secciones admiten acceso directo.

Para clima y mapas, configurar OPENWEATHER_API_KEY en las variables de entorno de Vercel y volver a desplegar. La clave se utiliza solo en las funciones del servidor; nunca debe llevar prefijo VITE_. Sin clave, el sitio funciona y el widget informa que el clima no está disponible. Configurar SITE_URL con el origen definitivo para generar sitemap y metadatos Open Graph.

No se incluyen la app editorial, Supabase, Prisma, contraseñas, .env ni respaldos. La carpeta del administrador se conserva únicamente en el entorno local del proyecto de desarrollo.
