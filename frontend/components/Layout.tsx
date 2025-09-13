import React, { ReactNode } from 'react';
import AppBar from './AppBar';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <AppBar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}