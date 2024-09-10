import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = window.pageYOffset;

  const handleScroll = () => {
    const currentScrollY = window.pageYOffset;

    if (currentScrollY > lastScrollY) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }

    lastScrollY = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer className={`${styles.footer} ${isVisible ? styles.visible : styles.hidden}`}>
      <p><b>Patas Unidas</b> &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
