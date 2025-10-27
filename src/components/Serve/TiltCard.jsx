"use client";
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from "./Serve.module.css"; 

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltCard({ icon, title, description }) {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  function handleMouse(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotationX = (offsetY / (rect.height / 2)) * -12; // rotateAmplitude
    const rotationY = (offsetX / (rect.width / 2)) * 12;  // rotateAmplitude
    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }
  
  function handleMouseEnter() {
    scale.set(1.05); // scaleOnHover
  }

  return (
    <figure
      ref={ref}
      className={styles.cardFigure} 
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={styles.cardInner}
        style={{
          width: '100%',
          height: '100%',
          rotateX,
          rotateY,
          scale
        }}
      >
        <div className={styles.cardContent}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
        </div>
      </motion.div>
    </figure>
  );
}
