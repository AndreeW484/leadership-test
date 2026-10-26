# Leadership Test

Mobile-friendly leadership self-assessment with Google Sheets integration, personalized achievement badges, and WhatsApp sharing. Built for the Municipality of Guatemala.

## Features

- Ten required questions using a five-point frequency scale.
- Participant name and department collected before the evaluation.
- Centralized response storage in Google Sheets through Google Apps Script.
- Four leadership levels based on the supplied scoring rubric.
- Personalized 2160 × 2160 PNG badges with a different illustration for each level.
- Image download and native sharing, with a WhatsApp fallback.
- Responsive interface with locally embedded fonts and illustrations.

## Run locally

Requires Node.js 22 or later. No dependency installation is needed.

```sh
cd app
node preview.cjs
```

Open http://localhost:4173. To view a sample badge without submitting a response, open http://localhost:4173/?demo=diploma&score=45. Other sample scores: `18`, `28`, and `37`.

## Deploy to Netlify

Connect this GitHub repository to Netlify and use:

| Setting | Value |
| --- | --- |
| Base directory | `app` |
| Build command | Leave empty |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |

The configuration is provided in `app/netlify.toml`. Deploy the complete project, including the Netlify function. Uploading only `dist` does not deploy the response-saving function.

The function uses the configured Apps Script deployment. Set the optional Netlify environment variable `APPS_SCRIPT_URL` to override that URL.

## Google Sheets setup

Copy `app/google-apps-script/Code.gs` into the Apps Script project connected to your response sheet. Set the script property `SPREADSHEET_ID` if using a different sheet. Deploy the script as a web app that executes as the sheet owner, with access suitable for your participants, then set its `/exec` URL in Netlify.

When updating an existing deployment, select a new version while keeping its deployment URL. The `doPost` function is required for the Netlify frontend. `Index.html` is only needed if hosting the frontend directly in Apps Script.

After deployment, submit a test response and verify it in the **Respuestas** sheet before distributing the form. Use the public Netlify URL as the QR destination. Export the consolidated results from Google Sheets as Microsoft Excel when needed.

## Validation

```sh
cd app
node check.cjs
```

Checks JavaScript syntax, all possible total scores, agreement between frontend and server classification, and synchronization of the two HTML versions. Additional browser checks and icon-export utilities are included for local development.

## Project structure

```text
app/
  dist/                 Frontend and visual assets
  google-apps-script/   Google Sheets backend and optional Google-hosted frontend
  netlify/functions/    Submission proxy
  netlify.toml          Hosting configuration
  preview.cjs           Local preview server
```

See [the Spanish setup guide](app/README.md) for the full rubric and workflow. Visual asset sources and font licensing are documented in [SOURCES.md](app/dist/assets/SOURCES.md).
