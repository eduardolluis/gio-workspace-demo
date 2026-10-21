# Comprobaciones realizadas

Fecha: 20 de octubre de 2026.

- Landing revisada en un navegador Chromium a 1440 × 1000 y 390 × 844.
- Sin desplazamiento horizontal en esas dos medidas.
- Imágenes de la landing cargadas correctamente.
- Galería: cambio entre capturas verificado.
- Botón principal: abre la demo en /inicio.
- Agenda, Pacientes y Finanzas: páginas cargadas sin errores JavaScript.
- Creación de una cita ficticia: guardada en el navegador.
- Creación de un paciente ficticio: guardada en el navegador.
- Reproducción del MP4 desde la landing: verificada.
- Registro de un ingreso ficticio: guardado y conservado después de recargar.
- Reinicio de la demo: restaura el estado inicial.
- Navegación y creación de cita: sin peticiones al dominio de Supabase.
- Video: MP4 de 35,16 segundos, con textos en pantalla y sin pista de audio.
- Fotograma del recorrido de pacientes revisado visualmente.
- Enlace actual al portafolio del desarrollador comprobado.

No se ha probado una instalación de producción ni la configuración del backend original. Esta revisión corresponde a la landing y la demo local de este paquete.

## Preparación del repositorio público — 21 de octubre de 2026

- Archivos del sitio separados en `public/`; herramientas y documentación fuera de la raíz servida.
- Sintaxis de adaptador, galería, servidor y scripts de medios comprobada con `npm run check`.
- Rutas locales `/`, `/agenda`, `/pacientes` y `/finanzas`: HTTP 200.
- Referencias estáticas de ambas entradas HTML: accesibles desde la nueva raíz.
- Video MP4: lectura parcial HTTP 206 verificada.
- Enlaces relativos del README y documentación: archivos existentes.
- Solicitudes de metadatos privados y rutas inexistentes: HTTP 404; URL malformada: HTTP 400.
- Retiradas las referencias residuales a la configuración de Supabase de producción y al correo del cliente original en los módulos compilados de soporte y usuarios.
- La revisión visual anterior de la demo se mantiene documentada arriba; en esta reorganización se comprobaron rutas y recursos, sin repetir la revisión visual en navegador.
