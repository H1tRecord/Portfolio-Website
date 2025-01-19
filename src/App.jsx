import { useEffect } from 'react';
import NavBar from "./components/NavBar"
import Hero from "./components/Hero"
import About from "./components/About"
import Project from "./components/Project"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import ThemeSwitcher from "./components/ThemeSwitcher"

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.style.setProperty('scroll-padding-top', '80px');
  }, []);

  return (
    <>
      <NavBar />
      <Hero />
      <About />
      <Project />
      <Contact />
      <Footer />
      <ThemeSwitcher />
    </>
  )
}

export default App
