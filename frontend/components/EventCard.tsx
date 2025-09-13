import React from 'react'
import styles from '../styles/EventCard.module.css'

interface Event {
  id: string
  name: string
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  startDate: string
  endDate: string
  participantCount: number
  organizaiton: string
  description: string
  type: string
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateRange = () => {
    if (event.startDate === event.endDate) {
      return formatDate(event.startDate)
    }
    return `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
  }

  const getStatusIcon = () => {
    switch (event.status) {
      case 'draft': return '📝'
      case 'scheduled': return '📅'
      case 'active': return '🔴'
      case 'completed': return '✅'
      default: return '📋'
    }
  }

  return (
    <div className={styles.eventCard}>
      <div className={styles.cardHeader}>
        <div className={styles.eventTitle}>
          <h3>{event.name}</h3>
          <span className={`${styles.status} ${styles[event.status]}`}>
            {getStatusIcon()} {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        <div className={styles.eventType}>
          {event.type}
        </div>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.description}>{event.description}</p>

        <div className={styles.eventMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>📅 Dates:</span>
            <span className={styles.metaValue}>{formatDateRange()}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>👥 Participants:</span>
            <span className={styles.metaValue}>{event.participantCount}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>🏢 Organization:</span>
            <span className={styles.metaValue}>{event.organizaiton}</span>
          </div>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.actionButton}>
          👁️ View Details
        </button>
        <button className={styles.actionButton}>
          ✏️ Edit
        </button>
        <button className={styles.actionButton}>
          📋 Clone
        </button>
        {event.status === 'draft' && (
          <button className={`${styles.actionButton} ${styles.primary}`}>
            🚀 Launch
          </button>
        )}
        {event.status === 'scheduled' && (
          <button className={`${styles.actionButton} ${styles.warning}`}>
            ⏸️ Postpone
          </button>
        )}
      </div>
    </div>
  )
}