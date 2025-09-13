import React from 'react';
import DashboardCard from './DashboardCard';
import styles from '../styles/DashboardGrid.module.css';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
  participants: number;
}

interface Event {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'scheduled';
  performance: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'pending';
}

interface DashboardGridProps {
  projects: Project[];
  recentEvents: Event[];
  teamMembers: TeamMember[];
  resourceStatus: {
    infrastructure: 'healthy' | 'warning' | 'error';
    budget: number;
    budgetLimit: number;
    systemHealth: number;
  };
}

export default function DashboardGrid({ projects, recentEvents, teamMembers, resourceStatus }: DashboardGridProps) {
  return (
    <div className={styles.dashboardGrid}>
      <DashboardCard title="Active Projects" className={styles.projectsCard}>
        <div className={styles.projectsList}>
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className={styles.projectItem}>
              <div className={styles.projectHeader}>
                <span className={styles.projectName}>{project.name}</span>
                <span className={`${styles.status} ${styles[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <div className={styles.projectProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className={styles.progressText}>{project.progress}%</span>
              </div>
              <div className={styles.projectMeta}>
                {project.participants} participants
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Quick Actions" className={styles.actionsCard}>
        <div className={styles.actionButtons}>
          <button className={`${styles.actionButton} ${styles.primary}`}>
            ➕ New Event
          </button>
          <button className={styles.actionButton}>
            📋 Clone Previous
          </button>
          <button className={styles.actionButton}>
            📄 Import Template
          </button>
        </div>
      </DashboardCard>

      <DashboardCard title="Recent Events" className={styles.eventsCard}>
        <div className={styles.eventsList}>
          {recentEvents.slice(0, 4).map((event) => (
            <div key={event.id} className={styles.eventItem}>
              <div className={styles.eventHeader}>
                <span className={styles.eventName}>{event.name}</span>
                <span className={styles.eventDate}>{event.date}</span>
              </div>
              <div className={styles.eventMeta}>
                <span className={`${styles.eventStatus} ${styles[event.status]}`}>
                  {event.status}
                </span>
                {event.status === 'completed' && (
                  <span className={styles.performance}>
                    Performance: {event.performance}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Team & Participants" className={styles.teamCard}>
        <div className={styles.teamList}>
          {teamMembers.slice(0, 5).map((member) => (
            <div key={member.id} className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={styles.memberInfo}>
                <span className={styles.memberName}>{member.name}</span>
                <span className={styles.memberRole}>{member.role}</span>
              </div>
              <span className={`${styles.memberStatus} ${styles[member.status]}`}>
                {member.status === 'active' ? '✅' : '⏳'}
              </span>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Resource Status" className={styles.resourceCard}>
        <div className={styles.resourceMetrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Infrastructure</span>
            <span className={`${styles.metricValue} ${styles[resourceStatus.infrastructure]}`}>
              {resourceStatus.infrastructure === 'healthy' && '✅ Healthy'}
              {resourceStatus.infrastructure === 'warning' && '⚠️ Warning'}
              {resourceStatus.infrastructure === 'error' && '❌ Error'}
            </span>
          </div>

          <div className={styles.metric}>
            <span className={styles.metricLabel}>Budget Usage</span>
            <div className={styles.budgetBar}>
              <div
                className={styles.budgetFill}
                style={{ width: `${(resourceStatus.budget / resourceStatus.budgetLimit) * 100}%` }}
              />
            </div>
            <span className={styles.budgetText}>
              ${resourceStatus.budget.toLocaleString()} / ${resourceStatus.budgetLimit.toLocaleString()}
            </span>
          </div>

          <div className={styles.metric}>
            <span className={styles.metricLabel}>System Health</span>
            <span className={styles.metricValue}>
              {resourceStatus.systemHealth}%
            </span>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}