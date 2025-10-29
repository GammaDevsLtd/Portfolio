"use client";
import React from "react";
import { useState, useEffect } from "react";
import styles from "./Team.module.css";
import { IoExitOutline } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

const Teams = [
  {
    name: "George-Pepple Treasure",
    image: "/about.jpg", // Placeholder image path
    role: "Co-Founder & Full-Stack Developer",
    desc: "A passionate developer with a knack for creating seamless user experiences and robust, scalable backend solutions.",
    link: "#", 
  },
  {
    name: "Adekunle Adebayo",
    image: "/Hero.jpg",
    role: "Lead UI/UX Designer",
    desc: "Specializes in crafting intuitive and visually stunning interfaces that solve complex user problems and elevate brands.",
    link: "#",
  },
  {
    name: "Chiamaka Okoro",
    image: "/about.jpg",
    role: "Backend Engineer",
    desc: "The architect of our server-side logic, ensuring our applications are secure, performant, and built to last.",
    link: "#",
  },
  {
    name: "Emeka Nwosu",
    image: "/Hero.jpg",
    role: "Frontend Developer",
    desc: "Brings designs to life with clean, efficient code and a keen eye for creating responsive, interactive user experiences.",
    link: "#",
  },
  {
    name: "Fatima Bello",
    image: "/about.jpg",
    role: "Project Manager",
    desc: "The organizational powerhouse who ensures projects are delivered on time, on budget, and to the highest standard.",
    link: "#",
  },
];

export const Team = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % Teams.length);
    }, 3000);

    return () => clearInterval(sliderInterval);
  }, [Teams.length]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meet The Team</h1>
        <span className={styles.subtitle}>
          Together we work to give you the best through GammaDevs
        </span>
      </div>
      <div className={styles.sliderContainer}>
        {Teams.map((team, i) => (
          <div
            key={team.name}
            className={`${index === i ? styles.body : styles.inactive}`}
          >
            <div className={styles.pic}>
              <div className={styles.gradientWrapper}>
                <div className={styles.imgcontainer}>
                  <Image
                    src={team.image}
                    className={styles.img}
                    alt={team.name}
                    fill
                  />
                </div>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.content}>
                <div className={styles.role}>
                  <h2 className={styles.name}>{team.name}</h2>
                  <span className={styles.position}>{team.role}</span>
                </div>
                <span className={styles.desc}>{team.desc}</span>
                <div className={styles.socials}>
                  <span className={styles.profile}>
                    View My Portfolio and Projects <IoExitOutline />
                  </span>
                  <div className={styles.social}>
                    <div className={styles.icon}>
                      <FaXTwitter />
                    </div>
                    <div className={styles.icon}>
                      <FaLinkedin />
                    </div>
                    <div className={styles.icon}>
                      <FaGithub />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.buttons}>
          {Teams.slice(0, 5).map((team, i) => (
            <button
              key={team.name}
              className={
                index === i ? styles.sliderImg : styles.sliderImginactive
              }
              onClick={()=>setIndex(i)}
            >
              <Image
                src={team.image}
                className={styles.img}
                alt={team.name}
                fill
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
