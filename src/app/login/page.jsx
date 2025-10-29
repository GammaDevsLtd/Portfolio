"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      if(!formData.email || !formData.password){
        setError("All fields are required");
        return
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      }

      if (res.ok) {
        setSuccess(data.message || "Registration Successful");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>What do you wish to do today?</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Enter Your Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            id="email"
            onChange={handleChange}
            value={formData.email}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Enter Your Password:</label>
          <div className={styles.passwordWrapper}>
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              id="password"
              onChange={handleChange}
              value={formData.password}
              className={styles.password}
            />

            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className={styles.show}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {loading ? (
          <button type="button" disabled className={styles.disabledButton}>
            Logging in ... <div className={styles.spinner}></div>
          </button>
        ) : (
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        )}
      <span>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </span>
      </form>
    </div>
  );
};

export default LoginPage;
