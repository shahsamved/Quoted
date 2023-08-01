import React from 'react';
import Link from 'next/link';

const IndexPage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default IndexPage;
