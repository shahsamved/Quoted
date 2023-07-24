import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from './firebase.js';
import { FaEdit, FaTrash } from 'react-icons/fa';

const dashboard = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid); // Fetch user data from Firestore
      } else {
        router.push('/login'); // Redirect to login page if the user is not logged in
      }
    });

    return () => unsubscribe(); // Unsubscribe from the auth state listener on component unmount
  }, []);

  useEffect(() => {
    // Fetch quotes from Firestore
    const fetchQuotes = async () => {
        try {
          const quotesSnapshot = await firestore.collection('quotes').orderBy('timestamp', 'desc').get();
  
          if (quotesSnapshot.empty) {
            // Handle the case where the "quotes" collection is empty
            setLoading(false);
            return;
          }
  
          const quotesData = quotesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setQuotes(quotesData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quotes:', error);
          setLoading(false); // Ensure that loading state is set to false in case of an error
        }
      };
  
      fetchQuotes();
    }, []);
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login'); // Redirect to the login page after successful logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const userSnapshot = await firestore.collection('users').doc(userId).get();
      if (userSnapshot.exists) {
        setUser({ ...user, name: userSnapshot.data().name });
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile'); // Redirect to the profile page
  };

  const handleUploadClick = () => {
    router.push('/uploadQuote'); // Redirect to the upload quotes page
  };

  const handleEditClick = (quoteId) => {
    // Redirect to the quote edit page with the quote ID as a query parameter
    router.push(`/editQuote?id=${quoteId}`);
  };

  const handleDeleteClick = async (quoteId) => {
    // Show a confirmation pop-up before deleting the quote
    const isConfirmed = window.confirm('Are you sure you want to delete this quote?');

    if (isConfirmed) {
      try {
        // Delete the quote document from Firestore
        await firestore.collection('quotes').doc(quoteId).delete();
        // Update the local quotes state by removing the deleted quote
        setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== quoteId));
      } catch (error) {
        console.error('Error deleting quote:', error);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    } else {
      return '';
    }
  };

  return (
    <div className="container">
      <h2 className="title">Dashboard</h2>
      <div className="user-info">
  {user && user.authorProfilePic && (
    <img
      src={user.authorProfilePic}
      alt={user.name}
      className="author-profile-pic"
    />
  )}
  <p>Welcome, {user && user.name}</p>
  <button onClick={handleLogout}>Logout</button>
</div>

      <div className="actions">
        <button onClick={handleProfileClick}>Update/View Profile</button>
        <button onClick={handleUploadClick}>Upload Quotes</button>
      </div>
      <h3 className="section-title">Recent Quotes</h3>
      {loading ? (
        <p>Loading quotes...</p>
      ) : (
        <ul className="quote-list">
          {quotes.map((quote) => (
  <li key={quote.id} className="quote-item">
    <div className="quote-header">
      {quote.profilePic ? (
        <img
          src={quote.profilePic}
          alt={quote.author}
          className="author-profile-pic"
        />
      ) : (
        <img
          src="/placeholder.png" // Replace with a placeholder image path
          alt={quote.author}
          className="author-profile-pic"
        />
      )}
      <div className="quote-details">
        <p className="quote">{quote.quote}</p>
        <p className="author">- {quote.author}</p>
      </div>
    </div>
    <p className="timestamp">{formatTimestamp(quote.timestamp)}</p>
    <div className="quote-actions">
                <button onClick={() => handleEditClick(quote.id)}>
                  <FaEdit className="edit-icon" />
                </button>
                <button onClick={() => handleDeleteClick(quote.id)}>
                  <FaTrash className="delete-icon" />
                </button>
              </div>
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

        .actions {
          margin-bottom: 20px;
        }

        .actions button {
          margin-right: 10px;
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
        .quote-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 5px;
          }
  
          .edit-icon-container {
            margin-right: 5px;
          }
  
          .delete-icon-container {
            color: red;
          }
  
          .quote-actions button {
            background: none;
            border: none;
            cursor: pointer;
          }
      `}</style>
    </div>
  );
};

export default dashboard;
