import React from 'react';
import styles from '../styles/Login.module.css';

const LoginPage = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <div className={styles.container}>
      <h1>Login Page</h1>
      <form className={styles.form} onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
