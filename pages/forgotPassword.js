import { auth } from './firebase.js';
import { useState } from 'react';

import { useRouter } from 'next/router';

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await auth.sendPasswordResetEmail(email);
      setEmailSent(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Forgot Password</h2>
      {emailSent ? (
        <>
          <p>
            Password reset email sent. Please check your inbox to reset your password.
          </p>
          <button onClick={() => router.push('/login')} className="button">
            Go back to Login Page
          </button>
        </>
      ) : (
        <form className="form" onSubmit={handleForgotPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
          />
          <button type="submit" className="button">
            Reset Password
          </button>
        </form>
      )}
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

        .error {
          color: red;
          margin-top: 10px;
        }

        .message {
          color: green;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
