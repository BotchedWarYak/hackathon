import React, { useState } from 'react';
import styles from '../styles/AppBar.module.css';

export default function AppBar() {
  const [activeSection, setActiveSection] = useState('home');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'planning', label: 'Event Planning', href: '/planning' },
    { id: 'infrastructure', label: 'Infrastructure', href: '/infrastructure' },
    { id: 'opfor', label: 'OpFor Operations', href: '/opfor' },
  ];

  return (
    <header className={styles.appBar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1>Training Platform</h1>
        </div>

        <nav className={styles.navigation}>
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={(e) => {
                if (item.href.startsWith('/')) {
                  // For internal links, use client-side routing simulation
                  e.preventDefault();
                  setActiveSection(item.id);
                  window.history.pushState({}, '', item.href);
                  window.location.href = item.href;
                } else {
                  e.preventDefault();
                  setActiveSection(item.id);
                }
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.userSection}>
          <button className={styles.notificationButton}>
            🔔
            <span className={styles.notificationBadge}>3</span>
          </button>

          <div className={styles.userMenu}>
            <button
              className={styles.userButton}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className={styles.userAvatar}>JD</div>
              <span>John Doe</span>
              <span className={styles.chevron}>▼</span>
            </button>

            {showUserMenu && (
              <div className={styles.userDropdown}>
                <a href="/profile" className={styles.dropdownItem}>Profile</a>
                <a href="/settings" className={styles.dropdownItem}>Settings</a>
                <a href="/help" className={styles.dropdownItem}>Help</a>
                <hr className={styles.dropdownDivider} />
                <a href="/logout" className={styles.dropdownItem}>Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}