"use client";
import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaBars, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";

const MobileNavbar = ({ activeSection, links, isMenuOpen, setIsMenuOpen }) => {
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className={styles.mobileMenuOverlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.mobileLogo}>
            <Link href="/" className={styles.logocontainer} onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/logo.jpeg"
                alt="GammaDevs Logo"
                className={styles.img}
                fill
              />
            </Link>
          </div>
          <button 
            className={styles.mobileMenuClose}
            onClick={() => setIsMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.mobileLinks}>
          {links.map((link) => (
            <Link
              className={`${styles.mobileLink} ${
                activeSection === link.path ? styles.mobileActive : ""
              }`}
              key={link.title}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className={styles.mobileSocialsSection}>
          <Link href="/#contact" className={styles.mobileBook}>Book Us</Link>
          <div className={styles.mobileSocials}>
             <Link href="https://www.instagram.com/gammadevs?igsh=ZGE4MWxpaXcxcGQ0" onClick={() => setIsMenuOpen(false)} target="_blank" className={styles.sociallinks}>
              <FaInstagram />
            </Link>
            <Link href="Check out GammaDevs (@GammaDevs): https://x.com/GammaDevs?t=bBCm9bKIiwQVHzaQO6Frmg&s=08" target="_blank" className={styles.sociallinks} onClick={() => setIsMenuOpen(false)}>
              <FaXTwitter />
            </Link>
            <Link href="https://www.linkedin.com/company/gammadevs/" onClick={() => setIsMenuOpen(false)} target="_blank" className={styles.sociallinks}>
              <IoLogoLinkedin />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("/#home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { title: "Home", path: "/#home" },
    { title: "About", path: "/#about" },
    { title: "Team", path: "/#team" },
    { title: "Projects", path: "/#projects" },
  ];

  // Close mobile menu when clicking on links
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Effect to set up the Intersection Observer.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`/#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    links.forEach((link) => {
      const selector = link.path.substring(link.path.indexOf("#"));
      const section = document.querySelector(selector);
      
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [links]);

  return (
    <div className={styles.container}>
      {/* Desktop Navbar */}
      <div className={styles.navbar}>
        <div className={styles.links}>
          {links.map((link) => (
            <Link
              className={`${styles.link} ${
                activeSection === link.path ? styles.active : ""
              }`}
              key={link.title}
              href={link.path}
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className={styles.logo}>
          <Link href="/" className={styles.logocontainer}>
            <Image
              src="/logo.jpeg"
              alt="GammaDevs Logo"
              className={styles.img}
              fill
            />
          </Link>
        </div>
        
        <div className={styles.socials}>
          <Link href="/#contact" className={styles.book}>Book Us</Link>
          <div className={styles.social}>
            <Link href="https://www.instagram.com/gammadevs?igsh=ZGE4MWxpaXcxcGQ0" target="_blank" className={styles.sociallinks}>
              <FaInstagram />
            </Link>
            <Link href="Check out GammaDevs (@GammaDevs): https://x.com/GammaDevs?t=bBCm9bKIiwQVHzaQO6Frmg&s=08" target="_blank" className={styles.sociallinks}>
              <FaXTwitter />
            </Link>
            <Link href="https://www.linkedin.com/company/gammadevs/" target="_blank" className={styles.sociallinks}>
              <IoLogoLinkedin />
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Navbar Component */}
      <MobileNavbar 
        activeSection={activeSection}
        links={links}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </div>
  );
};

export default Navbar;