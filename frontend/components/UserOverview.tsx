import React from 'react';
import styles from '../styles/UserOverview.module.css';

interface UserStats {
  activeProjects: number;
  upcomingEvents: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'event' | 'project' | 'notification';
  message: string;
  timestamp: string;
}

interface UserOverviewProps {
  user: {
    name: string;
    role: string;
    organization: string;
  };
  stats: UserStats;
  recentActivity: RecentActivity[];
}

export default function UserOverview({ user, stats, recentActivity }: UserOverviewProps) {
  return (
    <section className={styles.userOverview}>
      <div className={styles.profileSection}>
        <div className={styles.avatar}>
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className={styles.userInfo}>
          <h2>{user.name}</h2>
          <p className={styles.role}>{user.role}</p>
          <p className={styles.organization}>{user.organization}</p>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{stats.activeProjects}</span>
          <span className={styles.statLabel}>Active Projects</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{stats.upcomingEvents}</span>
          <span className={styles.statLabel}>Upcoming Events</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{stats.completionRate}%</span>
          <span className={styles.statLabel}>Completion Rate</span>
        </div>
      </div>

      <div className={styles.activitySection}>
        <h3>Recent Activity</h3>
        <div className={styles.activityFeed}>
          {recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <span className={`${styles.activityIcon} ${styles[activity.type]}`}>
                {activity.type === 'event' && '📅'}
                {activity.type === 'project' && '📋'}
                {activity.type === 'notification' && '🔔'}
              </span>
              <div className={styles.activityContent}>
                <p>{activity.message}</p>
                <span className={styles.timestamp}>{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}