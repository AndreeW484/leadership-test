# Formulario de liderazgo

## Vista local y Netlify

Ejecuta `node preview.cjs` desde `app/` y abre `http://localhost:4173`. Para ver el diploma de muestra sin guardar respuestas: `http://localhost:4173/?demo=diploma`.

El frontend puede alojarse en Netlify. El archivo `netlify.toml` configura `dist/` como carpeta pública y `netlify/functions/` como funciones. La función `responses` transmite el envío a la dirección de Apps Script proporcionada por el organizador y solo confirma el éxito cuando Google devuelve el comprobante. Esto evita depender de permisos de acceso entre dominios del navegador. La función contiene una URL pública de despliegue, no credenciales. Si cambia, actualiza `APPS_SCRIPT_URL` en las variables de Netlify.

**Antes del primer envío desde Netlify o desde el servidor local**, reemplaza `Code.gs` en Apps Script por la versión actual (incluye `doPost`) y actualiza la implementación existente con una nueva versión. Conserva la URL `/exec`.

Para publicar en Netlify utiliza un repositorio con `app` como directorio base y su `netlify.toml`, o ejecuta Netlify CLI desde `app`. Arrastrar únicamente `dist/` no publica la función necesaria para guardar respuestas. Dirección pública: https://leadership-test-munig.netlify.app/.

Formulario adaptable a celulares: nombre y dependencia, 10 preguntas, validación obligatoria y guardado central en Google Sheets. No requiere administrar un servidor. Google Apps Script sirve la página y escribe en la hoja con permisos del organizador. Los participantes nunca reciben acceso de lectura a la hoja.

## Activar el guardado

1. Crea una hoja de Google Sheets. En **Extensiones → Apps Script**, abre el editor.
2. Copia `google-apps-script/Code.gs` en el archivo `Code.gs`.
3. Agrega un archivo de tipo HTML llamado **Index** y pega el contenido completo de `google-apps-script/Index.html`.
4. El código ya está configurado para la hoja indicada: `1ovVaWdxe8d6FB9LnrVajjbSXl3qX2xOf1ERP3QHa3MU`. Si deseas cambiarla, puedes definir `SPREADSHEET_ID` en **Configuración del proyecto → Propiedades del script**.
5. Configura la zona horaria del proyecto y de la hoja como Guatemala.
6. En **Implementar → Nueva implementación → Aplicación web**, selecciona **Ejecutar como: Yo** y acceso **Cualquier usuario**. Autoriza con la cuenta que tiene permiso de edición sobre la hoja. La disponibilidad de acceso público depende de las restricciones de tu organización.
7. Copia la dirección de la aplicación terminada en `/exec`. Configúrala como destino de la función de Netlify. Si alojas el frontend en Netlify, el QR debe abrir la URL pública de Netlify; si usas el frontend de Apps Script, puede abrir esta dirección /exec.
8. Haz un envío de prueba desde un celular y verifica la fila creada en la pestaña **Respuestas**. Si vuelves a editar el código, actualiza la implementación con una nueva versión.

El QR definitivo abre https://leadership-test-munig.netlify.app/. El afiche y el código se encuentran en `dist/assets/QR-liderazgo-afiche.png` y `dist/assets/QR-liderazgo.png`. No compartas la hoja con los participantes. Compartir la dirección del formulario permite enviar respuestas; el nombre ingresado no verifica la identidad del participante.

## Resultados y Excel

Cada envío guarda ID, fecha/hora, nombre, dependencia, P1–P10, puntaje total y nivel. Valores: Siempre = 5, Frecuente = 4, A veces = 3, Rara vez = 2, Nunca = 1. El orden de preguntas corresponde a `Questions.txt`.

## Insignia para compartir

El formulario usa azul intenso, verde lima y fondo claro, junto al logo municipal original. La insignia combina una base verde suave con lima y azul en textos y contornos. Cada nivel tiene una ilustración distinta; la descripción original se muestra en la aplicación. Muestras locales: `/?demo=diploma&score=18`, `/?demo=diploma&score=28`, `/?demo=diploma&score=37` y `/?demo=diploma&score=45`. Estas vistas no guardan datos. Los cambios visuales no requieren actualizar `Code.gs`; si usas el frontend servido por Google, reemplaza `Index.html`.

Después de confirmar el guardado, el servidor devuelve el resultado para generar una insignia cuadrada. La imagen incluye una ilustración ampliada, un sello municipal integrado, el nivel y el nombre completo. La descripción original de la rúbrica aparece encima de la insignia en la aplicación. El puntaje se muestra en la pantalla de resultado; dependencia, fecha y folio quedan en el registro. La clasificación usa la rúbrica que proporcionó el organizador en la fotografía:

| Puntaje | Nivel | Descripción |
| --- | --- | --- |
| 42–50 | Líder con propósito inspirador | Tu liderazgo está guiado por valores claros y un sentido profundo de contribución. |
| 33–41 | Líder con propósito en desarrollo | Tienes una buena base, pero puedes fortalecer tu coherencia y comunicación del propósito. |
| 24–32 | Líder funcional | Cumples tu rol, pero tu propósito no siempre está presente en tus decisiones. |
| 10–23 | Liderazgo sin propósito definido | Es momento de reflexionar sobre el sentido y la dirección de tu liderazgo. |

La insignia es una imagen ilustrativa de autoevaluación. El PNG de **2160 × 2160** se genera localmente en el navegador. Los dos botones con icono permiten descargarla y compartirla. **Compartir por WhatsApp** abre el menú nativo para seleccionar WhatsApp cuando el navegador permite compartir archivos. Si no lo permite, prepara la descarga y un enlace a WhatsApp para adjuntar la imagen manualmente. El enlace incluye únicamente un mensaje con nivel y puntaje. La pantalla se adapta al celular y ofrece controles táctiles de 56 × 56 píxeles.

Para revisar un diploma ficticio sin enviar respuestas abre `diploma-preview.html`. La muestra lleva una marca visible y no registra información. Para actualizar la app que estás copiando, reemplaza **ambos** archivos `Code.gs` e `Index.html` y publica una nueva versión. Las hojas de la primera versión conservan sus respuestas; se agregan las columnas finales al siguiente envío, sin recalcular filas antiguas.

Para descargar el consolidado: en Google Sheets, **Archivo → Descargar → Microsoft Excel (.xlsx)**.

La aplicación confirma el éxito únicamente después de que Google confirma la escritura. Los reintentos de un mismo envío no crean filas duplicadas. Recargar e iniciar otra evaluación crea un envío diferente. No se almacenan datos personales en el navegador.

## Vista previa

`dist/index.html` permite revisar el diseño y recorrer las preguntas en un navegador. Con el servidor local, las respuestas se envían a través de la función de conexión; abierto como archivo suelto permite recorrer el formulario pero no guardar. Las vistas de muestra de insignias no realizan envíos. La publicación de Google Apps Script y el envío real requieren acceso a la cuenta Google del organizador.

## Galería y QR

- `badges.html`: las cuatro insignias con datos ficticios de muestra.
- `qr.html`: afiche con el QR definitivo y descargas de PNG.
- `assets/QR-liderazgo-afiche.png`: afiche de 2160 × 2700.
- `assets/QR-liderazgo.png`: código de 1800 × 1800.

La ilustración de colaboradores de la bienvenida es original e inspirada en la referencia compartida por el organizador.
