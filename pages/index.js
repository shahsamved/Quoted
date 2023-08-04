import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/IndexPage.module.css';
import { useSpring, useSprings, animated, interpolate } from 'react-spring';

function Stack({ image, background }) {
  const [open, setOpen] = useState(false);
  const { f, r } = useSpring({ f: open ? 0 : 1, r: open ? -3 : 3 });
  const cards = useSprings(5, [0, 1, 2, 3, 4].map(i => ({ opacity: 0.2 + i / 5, z: open ? (i / 5) * 80 : 0 })));
  return (
    <div className={styles.stackContainer} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {cards.map(({ z, opacity }, index) => (
        <animated.div
          key={index} // Add the key prop to fix the warning
          style={{
            opacity,
            background,
            transform: interpolate(
              [z, f.interpolate([0, 0.2, 0.6, 1], [0, index, index, 0]), r],
              (z, f, r) => `translate3d(0,0,${z}px) rotateX(${f * r}deg)`
            )
          }}
        >
          {index === 4 && <animated.img style={{ transform: f.interpolate([0, 1], ['scale(0.7)', 'scale(1)']) }} src={image} />}
        </animated.div>
      ))}
    </div>
  );
}

const IndexPage = () => {
  return (
    <div className={styles.container2}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to Quoted!</h1>
      </header>
      <div className={styles.main}>
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/9qWx-1.png" background="#52649e" />
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/T0hA-3.png" background="#f7f295" />
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/QoXU-2.png" background="#ee7074" />
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/QoXU-2.png" background="#ee7074" />
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/9qWx-1.png" background="#52649e" />
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/T0hA-3.png" background="#f7f295" />
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/T0hA-3.png" background="#f7f295" />
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/QoXU-2.png" background="#ee7074" />
        <Stack image="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/9qWx-1.png" background="#52649e" />
      </div>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/login">
              <button className={styles.loginButton}>Login</button>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/register">
              <button className={styles.registerButton}>Register</button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default IndexPage;
