import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from './firebase.js';

const RegisterPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      console.log('User ID:', userCredential.user.uid); 

      // Store additional user data in Firestore
      await firestore.collection('users').doc(userCredential.user.uid).set({
        email: email,
        password: password,
      });

      console.log('User data stored in Firestore');
      // Redirect or perform additional actions upon successful registration
      router.push('/dashboard'); // Example: Redirect to dashboard page
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Register</h2>
      <form className="form" onSubmit={handleRegister}>
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
          Register
        </button>
      </form>
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

export default RegisterPage;
