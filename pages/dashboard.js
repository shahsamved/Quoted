import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from './firebase.js';

const DashboardPage = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login'); // Redirect to login page if user is not logged in
      }
    });

    return () => unsubscribe(); // Unsubscribe from the auth state listener on component unmount
  }, []);

  useEffect(() => {
    // Fetch quotes from Firestore
    const fetchQuotes = async () => {
      try {
        const quotesSnapshot = await firestore.collection('quotes').orderBy('timestamp', 'desc').get();
        const quotesData = quotesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuotes(quotesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login'); // Redirect to login page after successful logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Dashboard</h2>
      <div className="user-info">
        <p>Welcome, {user && user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h3 className="section-title">Recent Quotes</h3>
      {loading ? (
        <p>Loading quotes...</p>
      ) : (
        <ul className="quote-list">
          {quotes.map((quote) => (
            <li key={quote.id} className="quote-item">
              <div className="quote-header">
                <img
                  src={quote.authorProfilePic || '/placeholder.png'}
                  alt={quote.author}
                  className="author-profile-pic"
                />
                <div className="quote-details">
                  <p className="quote">{quote.quote}</p>
                  <p className="author">- {quote.author}</p>
                </div>
              </div>
              <p className="timestamp">{quote.timestamp.toDate().toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .user-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .quote-list {
          list-style: none;
          padding: 0;
        }

        .quote-item {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 10px;
        }

        .quote-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .author-profile-pic {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .quote-details {
          flex: 1;
        }

        .quote {
          margin: 0;
        }

        .author {
          margin: 0;
          font-style: italic;
        }

        .timestamp {
          margin: 0;
          font-size: 12px;
          color: #777;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
