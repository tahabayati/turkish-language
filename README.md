# Turkish Vocabulary Logger

A small hobby project I made while learning Turkish. I was already using Google Sheets to add vocabulary, so I decided to build a simple tool with the free tools available to me. There are probably much more polished projects for this, but I wanted to share mine too. I hope it helps, and good luck with your own language-learning journey!

A small, self-hosted vocabulary logger built for learning Turkish. Look up a word, refine its meaning and notes, and save it to a Google Sheet you control.

It is not a shared service: every installation uses its own Google Sheet and Apps Script webhook. Nothing from your sheet is stored in this repository.

## What it does

- Translates Turkish words to English.
- Suggests reference images from Wikimedia Commons.
- Creates, edits, lists, and deletes vocabulary entries in Google Sheets.

## Set up your own copy

### 1. Create a Google Sheet and Apps Script webhook

1. Create a blank Google Sheet.
2. In the sheet, open **Extensions → Apps Script**.
3. Replace the starter code with the contents of [`google-apps-script.js`](./google-apps-script.js), then save.
4. Choose **Deploy → New deployment**, select **Web app**, and set access so your deployed Next.js app can call it. Copy the deployment URL.

The script creates the header row on its first use. Keep the spreadsheet and deployment URL private.

### 2. Run locally

To use the project as-is, clone it:

```bash
git clone https://github.com/tahabayati/turkish-language.git
cd turkish-language
npm install
cp .env.example .env.local
```

To keep your own GitHub version or make changes, fork the repository first, then clone your fork instead. Your fork can use its own Google Sheet and Vercel project.

Set your Apps Script URL in `.env.local`:

```dotenv
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Then start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

Import your fork or repository into Vercel, then add `GOOGLE_SHEET_WEBHOOK_URL` under the project's environment variables. Redeploy after saving it.

This does not change your current deployment: it already uses the same variable. Do not make a sheet-backed deployment publicly writable. The app's API routes have no user authentication, so enable Vercel deployment protection or use another access-control layer before sharing the URL.

## Use it for another language

The Google Sheet storage works for any vocabulary pair. To change the translation pair, edit `sl=tr` (source language) and `tl=en` (target language) in [`app/api/translate/route.ts`](./app/api/translate/route.ts), then update the labels in [`app/page.tsx`](./app/page.tsx) and the header names in [`google-apps-script.js`](./google-apps-script.js). Language codes follow the Google Translate convention, for example `de` for German, `es` for Spanish, and `ja` for Japanese.

## Development

```bash
npm run typecheck
npm run build
```

`private: true` in `package.json` only prevents accidental publishing to npm; it does not prevent making this GitHub repository public.

## Contributing

Small, focused pull requests are welcome. Please keep the app self-hosted and avoid committing `.env.local`, webhook URLs, or spreadsheet data.

## License

[MIT](./LICENSE)
