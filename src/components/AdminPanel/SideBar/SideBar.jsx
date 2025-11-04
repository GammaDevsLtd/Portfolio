"use client";
import React from "react";
import styles from "./SideBar.module.css";
import {
  FiUsers,
  FiFolder,
  FiFileText,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

const SideBar = ({ activeSection, setActiveSection }) => {
  const router = useRouter();

  const menuItems = [
    { id: 1, name: "Teams", icon: <FiUsers />, key: "teams" },
    { id: 2, name: "Projects", icon: <FiFolder />, key: "projects" },
    { id: 3, name: "Forms", icon: <FiFileText />, key: "forms" },
    { id: 4, name: "Client Requests", icon: <FiMessageSquare />, key: "requests" },
  ];

  const handleMenuItemClick = (sectionKey) => {
    setActiveSection(sectionKey);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.refresh(); 
        router.push("/login");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div className={styles.sidebar}>
      {/* Logo/Brand Section */}
      <div className={styles.logoSection}>
        <h2 className={styles.logo}>Admin Panel</h2>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button
                onClick={() => handleMenuItemClick(item.key)}
                className={`${styles.menuButton} ${
                  activeSection === item.key ? styles.active : ""
                }`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.menuText}>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className={styles.logoutSection}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <span className={styles.icon}>
            <FiLogOut />
          </span>
          <span className={styles.menuText}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
