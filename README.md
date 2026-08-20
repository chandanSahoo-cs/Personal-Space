# Personal Space

A personal data storage and retrieval application built for my own use.

It allows me to save and retrieve files or other data from anywhere, using Google Drive as the storage layer and TOTP-based authentication for verification.

## Tech Stack

* Next.js
* TypeScript
* Prisma
* PostgreSQL
* Google Drive API
* TOTP
* Tailwind CSS

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/chandanSahoo-cs/Personal-Space.git
cd Personal-Space
npm install
```

### Google Drive Authentication

Run the following script to generate the token required for Google Drive access:

```bash
node src/app/scripts/get-token.js
```

### TOTP Authentication

Run the following script to generate the QR code used to set up TOTP authentication:

```bash
node src/app/scripts/generate-totp.js
```

Set up the required environment variables, then initialize the database:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Note

This project was built primarily for my personal use and is tailored to my own storage and data management workflow.
