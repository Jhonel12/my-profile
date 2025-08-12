# Jhonel G. Mira - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. Features a clean design, smooth animations, and dark mode support.

## 🚀 Features

- **Modern Design**: Clean and professional portfolio layout
- **Responsive**: Fully responsive design that works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: Powered by Framer Motion for engaging interactions
- **TypeScript**: Full TypeScript support for better development experience
- **Fast Performance**: Built with Vite for lightning-fast development and builds
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Linting**: ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation component
│   └── Footer.tsx      # Footer component
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── About.tsx       # About page
│   ├── Projects.tsx    # Projects showcase
│   └── Contact.tsx     # Contact form
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jhonel-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Personal Information

Update the following files with your personal information:

- `src/pages/Home.tsx` - Hero section and skills
- `src/pages/About.tsx` - Personal info, experience, and education
- `src/pages/Projects.tsx` - Project showcase
- `src/pages/Contact.tsx` - Contact information
- `src/components/Footer.tsx` - Social links and contact details

### Profile Image

1. **Add your profile image:**
   - Place your profile photo as `profile-image.jpg` in the `public/` directory
   - Recommended size: 512x512 pixels (square aspect ratio)
   - Supported formats: JPG, PNG, WebP
   - The image will appear in:
     - Home page hero section (large circular image)
     - About page (medium circular image)
     - Navigation bar (small circular image)

2. **Image optimization tips:**
   - Use a professional headshot with good lighting
   - Keep file size under 500KB for fast loading
   - Square aspect ratio works best
   - Clear background recommended

### Styling

The project uses Tailwind CSS for styling. You can customize:

- Colors in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles in individual component files

### Theme

The website supports both light and dark modes. The theme toggle is available in the navigation bar and persists across sessions.

## 📱 Pages

### Home
- Hero section with introduction
- Skills overview
- Call-to-action section

### About
- Personal information
- Technical skills with progress bars
- Work experience timeline
- Education details

### Projects
- Project showcase with cards
- Technology tags
- Live demo and source code links
- Project categories

### Contact
- Contact form with validation
- Contact information
- Availability status

## 🔧 Configuration

### Vite Configuration
The build tool is configured in `vite.config.ts` with:
- React plugin
- Development server on port 3000
- Auto-open browser

### TypeScript Configuration
TypeScript is configured in `tsconfig.json` with:
- Strict mode enabled
- React JSX support
- Modern ES2020 target

### Tailwind Configuration
Tailwind CSS is configured in `tailwind.config.js` with:
- Custom color palette
- Custom fonts (Inter, JetBrains Mono)
- Custom animations
- Responsive breakpoints

## 📦 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Name**: Jhonel G. Mira
- **Email**: jhonel.mira@example.com
- **Location**: Manila, Philippines

---

Built with ❤️ using React, TypeScript, and Vite
