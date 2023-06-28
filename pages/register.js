import React from 'react';
import styles from '../styles/Register.module.css';

const RegisterPage = () => {
  const handleRegister = (e) => {
    e.preventDefault();
    // Handle registration logic
  };

  return (
    <div className={styles.container}>
      <h1>Register Page</h1>
      <form className={styles.form} onSubmit={handleRegister}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
