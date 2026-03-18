# Jhonel G. Mira Portfolio

A personal portfolio website built with React, TypeScript, Vite, Tailwind CSS, and Firebase.

This project includes:

- Public portfolio pages for Home, About, Projects, and Contact
- Dark mode support
- Smooth UI animations with Framer Motion
- Firebase-powered contact form submissions
- Admin login and protected inbox for viewing contact messages and feedback

## Live Project

Add your deployed URL here when ready.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Firebase
- ESLint

## Project Structure

```text
src/
  components/
    Footer.tsx
    Navbar.tsx
    ProtectedRoute.tsx
  config/
    admin.ts
  hooks/
    useTheme.ts
  pages/
    About.tsx
    AdminContacts.tsx
    Contact.tsx
    Home.tsx
    Login.tsx
    Projects.tsx
  services/
    firebase.ts
  App.tsx
  index.css
  main.tsx
  vite-env.d.ts
public/
  avatar-placeholder.svg
  login.jpg
```

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm

### Installation

1. Clone the repository.

```bash
git clone https://github.com/Jhonel12/my-profile.git
cd my-profile
```

2. Install dependencies.

```bash
npm install
```

3. Create your local environment file.

Windows:

```bash
copy .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

4. Open `.env` and add your own Firebase configuration values.

Important:
- Do not commit your real `.env` file
- Do not put real API keys in the README
- Keep only `.env.example` in the public repository

5. Start the development server.

```bash
npm run dev
```

6. Open `http://localhost:3000`

## Environment Variables

This project uses Firebase config through Vite environment variables.

Use [`.env.example`](/e:/laragon/www/my-profile/.env.example) as the template:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

These values are used by [firebase.ts](/e:/laragon/www/my-profile/src/services/firebase.ts).

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the app for production into `dist/`.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint.

## Main Pages

- `/` - Home page
- `/about` - About page
- `/projects` - Projects page
- `/contact` - Contact form page
- `/login` - Admin login
- `/admin/contacts` - Protected admin inbox

## Customization

Update these files to personalize the portfolio:

- [Home.tsx](/e:/laragon/www/my-profile/src/pages/Home.tsx)
- [About.tsx](/e:/laragon/www/my-profile/src/pages/About.tsx)
- [Projects.tsx](/e:/laragon/www/my-profile/src/pages/Projects.tsx)
- [Contact.tsx](/e:/laragon/www/my-profile/src/pages/Contact.tsx)
- [Footer.tsx](/e:/laragon/www/my-profile/src/components/Footer.tsx)
- [admin.ts](/e:/laragon/www/my-profile/src/config/admin.ts)

Profile images are stored in `public/`.

## Deployment

Build the project first:

```bash
npm run build
```

Then deploy the generated `dist/` folder to services like Vercel or Netlify.

## Notes For Public Repos

- Firebase config should stay in local `.env` files, not inside source code
- Review your Firebase Authentication settings and Firestore security rules before publishing
- If any Firebase values were previously committed, rotate them in Firebase Console

## Contact

- Name: Jhonel G. Mira
- Email: `jhonelmira@gmail.com`
- Location: Cagayan de Oro, Philippines
