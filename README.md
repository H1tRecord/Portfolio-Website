# HitRecord's Portfolio Website

<div align="center">
  <img src="./public/preview.png" alt="Portfolio Preview" width="600px">
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://h1trecord.github.io/Portfolio-Website)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
</div>

## ✨ Features

- **Modern Design**
  - Glass-morphism UI elements with dynamic backdrop filters
  - Fully responsive layout for all devices
  - Animated wave dividers between sections
  - Clean typography using Poppins font
  - Dark theme with customizable color schemes

- **Interactive Elements**
  - Dynamic typing effect in hero section
  - Real-time clock display with PHT timezone
  - Smooth scroll animations and transitions
  - Interactive project cards with language statistics
  - Theme switcher with multiple color schemes

- **Components**
  - Hero section with social links
  - About section with skills and interests
  - Projects section with GitHub integration
  - Contact form with EmailJS integration
  - Footer with quick links
  - Navigation bar with mobile menu

- **Developer Note**
  - Way too many CSS lines that may or may not been cleaned
  - Will appreciate if someone would clean the CSS amalgamation I have created
  - Was dared to make something in plain CSS than use Tailwind and I am in too deep

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Custom CSS with CSS Variables
- **Icons:** Font Awesome 6
- **Email Service:** EmailJS
- **Analytics:** Google Analytics
- **Deployment:** GitHub Pages

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/H1tRecord/Portfolio-Website.git
   cd Portfolio-Website
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_GA_MEASUREMENT_ID=your_ga_id
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

## 📁 Project Structure

```
Portfolio-Website/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── NavBar.jsx
│   │   ├── Project.jsx
│   │   └── ThemeSwitcher.jsx
│   ├── styles/
│   │   ├── About.css
│   │   ├── Contact.css
│   │   ├── Footer.css
│   │   ├── Hero.css
│   │   ├── index.css
│   │   ├── NavBar.css
│   │   ├── Project.css
│   │   └── ThemeSwitcher.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Customization

1. **Theme Colors**: Modify color variables in `src/styles/index.css`
2. **Content**: Update component texts in respective JSX files
3. **Styling**: Each component has its own CSS file in `src/styles/`
4. **Portfolio Data**: Edit projects section in `src/components/Project.jsx`

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📫 Contact

- GitHub: [@H1tRecord](https://github.com/H1tRecord)
- Twitter: [@HitRedcord](https://twitter.com/HitRedcord)
- YouTube: [@hitrecordyt](https://www.youtube.com/@hitrecordyt)
- Support: [Ko-fi](https://ko-fi.com/hitrecord)