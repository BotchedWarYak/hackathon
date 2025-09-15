import React from 'react'
import styles from '../../styles/Infrastructure.module.css'

interface InfrastructureHeaderProps {
  event: {
    id: string
    name: string
    status: 'not_started' | 'in_progress' | 'ready' | 'deployed'
    totalVMs: number
    networkSegments: number
    estimatedResources: {
      cpu: number
      memory: number
      storage: number
      cost: number
    }
  }
  onStatusChange: (status: 'not_started' | 'in_progress' | 'ready' | 'deployed') => void
}

export default function InfrastructureHeader({ event, onStatusChange }: InfrastructureHeaderProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started': return '⏳'
      case 'in_progress': return '🔄'
      case 'ready': return '✅'
      case 'deployed': return '🚀'
      default: return '❓'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return styles.statusNotStarted
      case 'in_progress': return styles.statusInProgress
      case 'ready': return styles.statusReady
      case 'deployed': return styles.statusDeployed
      default: return styles.statusNotStarted
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_started': return 'Not Started'
      case 'in_progress': return 'In Progress'
      case 'ready': return 'Ready'
      case 'deployed': return 'Deployed'
      default: return 'Unknown'
    }
  }

  return (
    <div className={styles.infrastructureHeader}>
      <div className={styles.eventInfo}>
        <h1>{event.name}</h1>
        <div className={styles.eventMeta}>
          <span className={styles.eventId}>Event ID: {event.id}</span>
          <div className={`${styles.statusBadge} ${getStatusColor(event.status)}`}>
            {getStatusIcon(event.status)} {getStatusLabel(event.status)}
          </div>
        </div>
      </div>

      <div className={styles.quickStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🖥️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{event.totalVMs}</div>
            <div className={styles.statLabel}>Virtual Machines</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🌐</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{event.networkSegments}</div>
            <div className={styles.statLabel}>Network Segments</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💻</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{event.estimatedResources.cpu}</div>
            <div className={styles.statLabel}>CPU Cores</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🧠</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{event.estimatedResources.memory}GB</div>
            <div className={styles.statLabel}>Memory</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>${event.estimatedResources.cost}</div>
            <div className={styles.statLabel}>Estimated Cost</div>
          </div>
        </div>
      </div>

      <div className={styles.headerActions}>
        <button className={styles.actionButton}>
          📊 View Metrics
        </button>
        <button className={styles.actionButton}>
          📁 Export Config
        </button>
        <button
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={() => {
            if (event.status === 'ready') {
              onStatusChange('deployed')
            } else if (event.status === 'in_progress') {
              onStatusChange('ready')
            }
          }}
        >
          {event.status === 'ready' ? '🚀 Deploy' : event.status === 'in_progress' ? '✅ Mark Ready' : '▶️ Start Build'}
        </button>
      </div>
    </div>
  )
}