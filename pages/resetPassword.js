import { auth } from './firebase.js';
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { oobCode } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      // If the oobCode is not available, it means the page is accessed directly without the reset link.
      // You can redirect the user to another page or show an error message.
      router.push('/login'); // Redirect to login page if the oobCode is missing
    }
  }, [oobCode]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await auth.confirmPasswordReset(oobCode, newPassword); // Set the new password
      setResetSuccess(true);
    } catch (error) {
      setError('Error resetting password');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Reset Password</h2>
      {resetSuccess ? (
        <>
          <p>Password changed. You can now sign in with your new password.</p>
          <button onClick={() => router.push('/login')} className="button">
            Back to Login
          </button>
        </>
      ) : (
        <form className="form" onSubmit={handleResetPassword}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
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
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
