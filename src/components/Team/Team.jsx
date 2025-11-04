"use client";
import React from "react";
import { useState, useEffect } from "react";
import styles from "./Team.module.css";
import { IoExitOutline } from "react-icons/io5";
import {
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiInstagram,
  FiFacebook,
  FiDribbble,
  FiGlobe,
  FiMail,
} from "react-icons/fi";
import { FaBehance } from "react-icons/fa";
import Image from "next/image";

export const Team = () => {
  const [teams, setTeams] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to render icon based on string value
  const renderIcon = (iconName) => {
    const icons = {
      FiLinkedin: <FiLinkedin />,
      FiTwitter: <FiTwitter />,
      FiGithub: <FiGithub />,
      FiInstagram: <FiInstagram />,
      FiFacebook: <FiFacebook />,
      FiDribbble: <FiDribbble />,
      FaBehance: <FaBehance />,
      FiGlobe: <FiGlobe />,
      FiMail: <FiMail />,
    };
    return icons[iconName] || <FiGlobe />; // Default to globe if icon not found
  };

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/teams');
        
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        
        const data = await response.json();
        setTeams(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Auto-slide only when we have teams and no errors
  useEffect(() => {
    if (teams.length === 0) return;

    const sliderInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % teams.length);
    }, 3000);

    return () => clearInterval(sliderInterval);
  }, [teams.length]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meet The Team</h1>
          <span className={styles.subtitle}>
            Together we work to give you the best through GammaDevs
          </span>
        </div>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meet The Team</h1>
          <span className={styles.subtitle}>
            Together we work to give you the best through GammaDevs
          </span>
        </div>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meet The Team</h1>
          <span className={styles.subtitle}>
            Together we work to give you the best through GammaDevs
          </span>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h3>No Team Members Yet</h3>
          <p>We're assembling our amazing team. Check back soon to meet the people behind GammaDevs!</p>
          <div className={styles.emptyActions}>
            <button 
              onClick={() => window.location.reload()} 
              className={styles.refreshLink}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meet The Team</h1>
        <span className={styles.subtitle}>
          Together we work to give you the best through GammaDevs
        </span>
      </div>
      <div className={styles.sliderContainer}>
        {teams.map((team, i) => (
          <div
            key={team.id || team.name}
            className={`${index === i ? styles.body : styles.inactive}`}
          >
            <div className={styles.pic}>
              <div className={styles.gradientWrapper}>
                <div className={styles.imgcontainer}>
                  <Image
                    src={team.image || "/default-avatar.jpg"}
                    className={styles.img}
                    alt={team.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  {team.link && (
                    <a href={team.link} className={styles.profile} target="_blank" rel="noopener noreferrer">
                      View My Portfolio and Projects <IoExitOutline />
                    </a>
                  )}
                  <div className={styles.social}>
                    {team.socials?.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        className={styles.icon}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.platform}
                      >
                        {renderIcon(social.icon)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.buttons}>
          {teams.slice(0, 5).map((team, i) => (
            <button
              key={team.id || team.name}
              className={
                index === i ? styles.sliderImg : styles.sliderImginactive
              }
              onClick={() => setIndex(i)}
            >
              <Image
                src={team.image || "/default-avatar.jpg"}
                className={styles.img}
                alt={team.name}
                fill
                sizes="48px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};