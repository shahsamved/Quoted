import { auth } from '../components/firebase.js';
import { useState } from 'react';
import { useRouter } from 'next/router';


const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in user with Firebase Authentication
      await auth.signInWithEmailAndPassword(email, password);

      // Redirect or perform additional actions upon successful login
      router.push('/dashboard'); // Example: Redirect to dashboard page
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = () => {
    // Redirect to the "Forgot Password" page
    router.push('/forgotPassword');
  };

  return (
    <div className="container">
      <h2 className="title">Login</h2>
      <form className="form" onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input"
        />
        <button type="submit" className="button">
          Login
        </button>
      </form>
      <div className="forgot-password">
        <p>Forgot your password?</p>
        <button onClick={handleForgotPassword} className="link-button">
          Reset Password
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
        }

        .input {
          margin-bottom: 10px;
          padding: 10px;
          font-size: 16px;
        }

        .button {
          padding: 10px;
          background-color: #0070f3;
          color: #fff;
          font-size: 16px;
          border: none;
          cursor: pointer;
        }

        .forgot-password {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }

        .link-button {
          margin-left: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #0070f3;
          font-weight: bold;
          text-decoration: underline;
        }

        .error {
          color: red;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
