# Publicar la landing y demo

## Vercel

1. Importa el repositorio `eduardolluis/gio-workspace-demo`.
2. Selecciona **Other** como framework.
3. Usa la raíz del repositorio como Root Directory.
4. Deja vacíos los comandos de instalación y compilación.
5. Usa `public` como Output Directory.

`vercel.json` define estas opciones y las reescrituras de las rutas de la demo. No hacen falta variables de entorno, Supabase ni claves de API.

La URL de demostración existente es https://gio-landing-demo.vercel.app. Crear o subir este repositorio no lo conecta automáticamente con ese proyecto de Vercel. Si se conecta después, se deben sustituir las opciones de compilación del despliegue anterior por las de este repositorio.

## Servidor local

```bash
npm run dev
```

El servidor publica únicamente `public/`. El código de herramientas, la documentación y los metadatos de Git quedan fuera de la raíz servida. Se puede cambiar el puerto con `PORT` y la raíz con `GIO_ROOT`.

## Rutas y otros proveedores

La landing vive en `/`. Rutas como `/inicio`, `/agenda`, `/pacientes` y `/finanzas` deben devolver `demo.html`, conservando la URL en el navegador. Los archivos estáticos conservan sus rutas absolutas.

Para otro proveedor de hosting, configura las reescrituras equivalentes a las de `vercel.json`. GitHub aloja aquí el código y la documentación; GitHub Pages no está configurado para las rutas de esta aplicación.

## Comprobación después de publicar

- Abrir la portada en móvil y escritorio.
- Entrar a la demo desde el botón de la portada.
- Abrir directamente `/agenda` y recargar la página.
- Reproducir el video.
- Comprobar el enlace de contacto y, si se usa, el aviso de venta.
