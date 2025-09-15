import React from 'react'
import styles from '../../styles/Infrastructure.module.css'

interface EventContextBridgeProps {
  eventData?: {
    teamSize: string
    numberOfTeams: number
    operationType: string[]
    aptProfile: string
    participantSkillLevel: string
    industryFocus: string
    complexityLevel: number
    networkTopology: string
    requiredSystems: string[]
    deploymentType: string
  }
  suggestions: Array<{
    type: string
    title: string
    description: string
    action: string
  }>
}

export default function EventContextBridge({ eventData, suggestions }: EventContextBridgeProps) {
  if (!eventData) {
    return (
      <div className={styles.contextBridge}>
        <div className={styles.noEventData}>
          <h3>No Event Planning Context</h3>
          <p>Create an event in Event Planning to get smart infrastructure suggestions.</p>
          <button className={styles.linkButton}>
            ➕ Create New Event
          </button>
        </div>
      </div>
    )
  }

  const getTeamSizeLabel = (size: string) => {
    const labels: Record<string, string> = {
      small: 'Small (5-15)',
      medium: 'Medium (16-50)',
      large: 'Large (51-100)',
      enterprise: 'Enterprise (100+)'
    }
    return labels[size] || size
  }

  const getComplexityLabel = (level: number) => {
    const labels: Record<number, string> = {
      1: 'Basic',
      2: 'Elementary',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    }
    return labels[level] || 'Unknown'
  }

  return (
    <div className={styles.contextBridge}>
      <div className={styles.bridgeHeader}>
        <h3>Event Planning Context</h3>
        <p>Infrastructure suggestions based on your event configuration</p>
      </div>

      <div className={styles.contextSummary}>
        <div className={styles.contextGrid}>
          <div className={styles.contextItem}>
            <span className={styles.contextIcon}>👥</span>
            <div className={styles.contextContent}>
              <div className={styles.contextLabel}>Team Configuration</div>
              <div className={styles.contextValue}>
                {getTeamSizeLabel(eventData.teamSize)} • {eventData.numberOfTeams} teams
              </div>
            </div>
          </div>

          <div className={styles.contextItem}>
            <span className={styles.contextIcon}>🎯</span>
            <div className={styles.contextContent}>
              <div className={styles.contextLabel}>Operation Focus</div>
              <div className={styles.contextValue}>
                {eventData.operationType.join(', ').toUpperCase()}
              </div>
            </div>
          </div>

          <div className={styles.contextItem}>
            <span className={styles.contextIcon}>🕵️</span>
            <div className={styles.contextContent}>
              <div className={styles.contextLabel}>Threat Actor</div>
              <div className={styles.contextValue}>{eventData.aptProfile}</div>
            </div>
          </div>

          <div className={styles.contextItem}>
            <span className={styles.contextIcon}>🏢</span>
            <div className={styles.contextContent}>
              <div className={styles.contextLabel}>Industry Target</div>
              <div className={styles.contextValue}>{eventData.industryFocus}</div>
            </div>
          </div>

          <div className={styles.contextItem}>
            <span className={styles.contextIcon}>📊</span>
            <div className={styles.contextContent}>
              <div className={styles.contextLabel}>Complexity</div>
              <div className={styles.contextValue}>
                {getComplexityLabel(eventData.complexityLevel)} (Level {eventData.complexityLevel})
              </div>
            </div>
          </div>

          <div className={styles.contextItem}>
            <span className={styles.contextIcon}>☁️</span>
            <div className={styles.contextContent}>
              <div className={styles.contextLabel}>Deployment</div>
              <div className={styles.contextValue}>
                {eventData.deploymentType.charAt(0).toUpperCase() + eventData.deploymentType.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className={styles.smartSuggestions}>
          <h4>Smart Suggestions</h4>
          <div className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <div key={index} className={styles.suggestionCard}>
                <div className={styles.suggestionIcon}>
                  {suggestion.type === 'network' && '🌐'}
                  {suggestion.type === 'tools' && '🛠️'}
                  {suggestion.type === 'security' && '🔒'}
                  {suggestion.type === 'monitoring' && '👁️'}
                </div>
                <div className={styles.suggestionContent}>
                  <div className={styles.suggestionTitle}>{suggestion.title}</div>
                  <div className={styles.suggestionDescription}>{suggestion.description}</div>
                </div>
                <button className={styles.suggestionAction}>
                  {suggestion.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.infrastructureMapping}>
        <h4>Infrastructure Impact</h4>
        <div className={styles.mappingGrid}>
          <div className={styles.mappingItem}>
            <div className={styles.mappingSource}>
              {eventData.numberOfTeams} Teams →
            </div>
            <div className={styles.mappingTarget}>
              {eventData.numberOfTeams} Network Segments
            </div>
          </div>

          <div className={styles.mappingItem}>
            <div className={styles.mappingSource}>
              {eventData.requiredSystems.length} System Types →
            </div>
            <div className={styles.mappingTarget}>
              ~{eventData.requiredSystems.length * 2} Virtual Machines
            </div>
          </div>

          <div className={styles.mappingItem}>
            <div className={styles.mappingSource}>
              {eventData.aptProfile} →
            </div>
            <div className={styles.mappingTarget}>
              Vulnerable Services & Monitoring
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}