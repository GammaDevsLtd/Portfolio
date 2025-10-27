"use client";
import React from 'react';
import styles from "./Serve.module.css";
import TiltCard from './TiltCard'; 
import { FaUserCog, FaLaptopCode, FaPalette } from "react-icons/fa";
import { IoApps } from "react-icons/io5";
import { FaScrewdriverWrench } from "react-icons/fa6";

const servicesData = [
  {
    icon: <FaUserCog size={40} color="#083365" />,
    title: "Tech Consultation",
    description: "Expert advice to help you choose the right technologies and align IT strategies with your business goals."
  },
  {
    icon: <FaLaptopCode size={40} color="#083365" />,
    title: "Website Development",
    description: "Custom websites and web applications tailored to your specific needs and business objectives."
  },
  {
    icon: <IoApps size={40} color="#083365" />,
    title: "App Development",
    description: "Cross-platform mobile applications with intuitive UI and powerful functionality."
  },
  {
    icon: <FaPalette size={40} color="#083365" />,
    title: "UI/UX Design & Prototyping",
    description: "User-centered designs that enhance experience and drive engagement."
  },
  {
    icon: <FaScrewdriverWrench size={40} color="#083365" />,
    title: "Tech Maintenance",
    description: "Ongoing support, updates, and troubleshooting to ensure your products run smoothly and securely."
  }
];

export default function Serve() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Our Services</h1>
      <div className={styles.cardGrid}>
      {servicesData.map((service, index) => (
        <TiltCard
          key={index} // React needs a unique key for list items
          icon={service.icon}
          title={service.title}
          description={service.description}
        />
      ))}
      </div>
    </div>
  );
}