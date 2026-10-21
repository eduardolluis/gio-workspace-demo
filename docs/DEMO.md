# Alcance de la demo

## Datos

Todos los nombres, teléfonos, correos y movimientos son ficticios. Los correos usan el dominio reservado example.invalid.

Los datos iniciales se crean para el día de uso. Los cambios se guardan en localStorage con una clave propia de esta demo. Al cambiar de día se renuevan los ejemplos; el botón «Reiniciar demo» permite hacerlo antes.

## Operaciones disponibles

- Consultar agenda, filtrar citas y abrir fichas.
- Crear una cita y guardar cambios locales de estado.
- Crear y consultar pacientes de ejemplo.
- Registrar ingresos y gastos de ejemplo.
- Recargar la página conservando los cambios del día.
- Reiniciar la demo.

La interfaz también muestra otros módulos del producto. La evaluación preparada se centra en Agenda, Pacientes y Finanzas. Las operaciones especializadas que necesitan el backend original pueden mostrar que no están incluidas en esta demo.

## Aislamiento

El cliente de Supabase de la copia compilada se sustituye por demo-adapter.js. El adaptador no llama a un backend. demo.html añade una política de contenido que restringe las conexiones a este mismo sitio.

El identificador de usuario de ejemplo no es una credencial válida. No se incluye ningún token de servicio, contraseña ni archivo .env.

## Procedencia

Interfaz obtenida de la versión pública de https://gio-workspace.vercel.app/.
Versión de producción consultada: commit e5e132b5135530c03703dc463856fa90bd57ed9d.
La G procede del archivo original /icons/gio-workspace.svg.

Las capturas y el video se grabaron en una copia aislada de esa interfaz. Los textos que indican «demo» y el adaptador local forman parte de esta entrega.
