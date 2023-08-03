import { auth, firestore, FieldValue } from './firebase.js';
import { useState, useEffect } from 'react';

import { FaHeart, FaRegHeart } from 'react-icons/fa';

const LikeButton = ({ quoteId, liked }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(0);

  const handleLikeClick = async () => {
    try {
      const userId = auth.currentUser.uid;
      const likeRef = firestore.collection('likes').doc(`${userId}_${quoteId}`);
      const likeSnapshot = await likeRef.get();
      const quoteRef = firestore.collection('quotes').doc(quoteId);

      if (likeSnapshot.exists) {
        // If already liked, remove the like
        await likeRef.delete();
        await quoteRef.update({
          likes: FieldValue.increment(-1),
        });
      } else {
        // If not liked, add a new like
        await likeRef.set({
          userId: userId,
          quoteId: quoteId,
          timestamp: new Date(),
        });
        await quoteRef.update({
          likes: FieldValue.increment(1),
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const likeRef = firestore.collection('likes').doc(`${userId}_${quoteId}`);
        const likeSnapshot = await likeRef.get();
        setIsLiked(likeSnapshot.exists);
      } catch (error) {
        console.error('Error fetching like data:', error);
      }
    };

    const fetchLikeCount = async () => {
      try {
        const quoteRef = firestore.collection('quotes').doc(quoteId);
        const quoteSnapshot = await quoteRef.get();
        if (quoteSnapshot.exists) {
          const data = quoteSnapshot.data();
          setLikeCount(data.likes || 0);
        }
      } catch (error) {
        console.error('Error fetching like count:', error);
      }
    };

    fetchLikeData();
    fetchLikeCount();
  }, [quoteId]);

  const toggleLike = () => {
    handleLikeClick();
    setIsLiked((prevLiked) => !prevLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  return (
    <div className="like-button">
      <button onClick={toggleLike} className="heart-button">
        {isLiked ? (
          <FaHeart className="like-icon filled" style={{ fill: 'red' }} />
        ) : (
          <FaRegHeart className="like-icon" />
        )}
      </button>
      <span className="like-count">{likeCount}</span>
      <style jsx>{`
        .like-button {
          display: flex;
          align-items: center;
        }

        .heart-button {
          background-color: transparent;
          border: none;
          cursor: pointer;
        }

        .like-icon {
          margin-right: 5px;
        }

        .filled {
          fill: red;
        }
      `}</style>
    </div>
  );
};

export default LikeButton;
