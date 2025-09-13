import React, { useState } from 'react'
import { EventFormData } from '../EventWizard'
import styles from '../../styles/WizardStep.module.css'

interface ReviewCreateProps {
  data: EventFormData
  onNext: (data: Partial<EventFormData>) => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function ReviewCreate({
  data,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: ReviewCreateProps) {
  const [isCreating, setIsCreating] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateEstimatedCost = () => {
    let baseCost = 1000 // Base setup cost

    // Scale multiplier
    const scaleMultipliers = { small: 1, medium: 2.5, large: 5, enterprise: 10 }
    const scaleMultiplier = data.teamSize ? scaleMultipliers[data.teamSize] || 1 : 1

    // Complexity multiplier
    const complexityMultiplier = (data.complexityLevel || 3) * 0.5

    // Infrastructure multiplier
    const infraMultipliers = { simple: 1, complex: 2, custom: 3 }
    const infraMultiplier = data.networkTopology ? infraMultipliers[data.networkTopology as keyof typeof infraMultipliers] || 1 : 1

    // System count multiplier
    const systemMultiplier = (data.requiredSystems?.length || 0) * 0.2

    const totalCost = baseCost * scaleMultiplier * complexityMultiplier * infraMultiplier * (1 + systemMultiplier)
    return Math.round(totalCost)
  }

  const calculateTimeline = () => {
    const baseSetupDays = 7
    const complexityDays = (data.complexityLevel || 3) * 2
    const infraDays = data.networkTopology === 'custom' ? 5 : data.networkTopology === 'complex' ? 3 : 1
    const systemDays = Math.ceil((data.requiredSystems?.length || 0) / 3)

    return baseSetupDays + complexityDays + infraDays + systemDays
  }

  const handleCreate = async () => {
    setIsCreating(true)

    // Simulate API call delay
    setTimeout(() => {
      onNext({
        estimatedCost: calculateEstimatedCost(),
        estimatedSetupDays: calculateTimeline(),
        status: 'draft'
      })
    }, 2000)
  }

  const sections = [
    {
      title: 'Basic Information',
      data: [
        { label: 'Organization', value: data.owningOrganization },
        { label: 'Event Name', value: data.eventName },
        { label: 'Description', value: data.eventDescription },
        { label: 'Duration', value: data.trainingDuration === 'custom' ? `${data.customDuration} days` : data.trainingDuration },
        { label: 'Start Date', value: formatDate(data.startDate) },
        { label: 'End Date', value: formatDate(data.endDate) },
      ]
    },
    {
      title: 'Scale & Participants',
      data: [
        { label: 'Team Size', value: data.teamSize ? data.teamSize.charAt(0).toUpperCase() + data.teamSize.slice(1) : 'Not specified' },
        { label: 'Number of Teams', value: data.numberOfTeams || 'Not specified' },
        { label: 'Total Participants', value: data.totalParticipants || 'Not specified' },
        { label: 'Skill Level', value: data.participantSkillLevel ? data.participantSkillLevel.charAt(0).toUpperCase() + data.participantSkillLevel.slice(1) : 'Not specified' },
      ]
    },
    {
      title: 'Exercise Configuration',
      data: [
        { label: 'Operation Type', value: data.operationType?.join(', ') },
        { label: 'Primary Focus', value: data.primaryFocus },
        { label: 'Secondary Objectives', value: `${data.secondaryObjectives?.length} objectives selected` },
        { label: 'Complexity Level', value: `${data.complexityLevel}/5` },
      ]
    },
    {
      title: 'Infrastructure',
      data: [
        { label: 'Network Topology', value: data.networkTopology ? data.networkTopology.charAt(0).toUpperCase() + data.networkTopology.slice(1) : 'Not specified' },
        { label: 'Required Systems', value: `${data.requiredSystems?.length || 0} systems selected` },
        { label: 'Deployment Type', value: data.deploymentType ? data.deploymentType.charAt(0).toUpperCase() + data.deploymentType.slice(1) : 'Not specified' },
        { label: 'Special Requirements', value: data.specialRequirements || 'None specified' },
      ]
    },
    {
      title: 'Adversary Profile',
      data: [
        { label: 'APT Profile', value: data.aptProfile },
        { label: 'Attack Sophistication', value: `${data.attackSophistication}/5` },
        { label: 'Primary TTPs', value: `${data.primaryTTPs?.length} categories selected` },
        { label: 'Industry Focus', value: data.industryFocus },
      ]
    }
  ]

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Step 6: Review & Create</h2>
        <p>Review your exercise configuration and create the training event.</p>
      </div>

      <div className={styles.reviewContent}>
        <div className={styles.reviewSections}>
          {sections.map((section, index) => (
            <div key={index} className={styles.reviewSection}>
              <h3>{section.title}</h3>
              <div className={styles.reviewData}>
                {section.data.map((item, itemIndex) => (
                  <div key={itemIndex} className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>{item.label}:</span>
                    <span className={styles.reviewValue}>{item.value || 'Not specified'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.estimatesSection}>
          <h3>Resource Estimates</h3>
          <div className={styles.estimateGrid}>
            <div className={styles.estimateItem}>
              <div className={styles.estimateIcon}>💰</div>
              <div className={styles.estimateContent}>
                <div className={styles.estimateValue}>${calculateEstimatedCost().toLocaleString()}</div>
                <div className={styles.estimateLabel}>Estimated Cost</div>
              </div>
            </div>

            <div className={styles.estimateItem}>
              <div className={styles.estimateIcon}>📅</div>
              <div className={styles.estimateContent}>
                <div className={styles.estimateValue}>{calculateTimeline()} days</div>
                <div className={styles.estimateLabel}>Setup Timeline</div>
              </div>
            </div>

            <div className={styles.estimateItem}>
              <div className={styles.estimateIcon}>👥</div>
              <div className={styles.estimateContent}>
                <div className={styles.estimateValue}>{data.totalParticipants}</div>
                <div className={styles.estimateLabel}>Participants</div>
              </div>
            </div>

            <div className={styles.estimateItem}>
              <div className={styles.estimateIcon}>🎯</div>
              <div className={styles.estimateContent}>
                <div className={styles.estimateValue}>Level {data.complexityLevel}</div>
                <div className={styles.estimateLabel}>Complexity</div>
              </div>
            </div>
          </div>

          <div className={styles.timelinePreview}>
            <h4>Timeline Overview</h4>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>🚀</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>Exercise Creation</div>
                  <div className={styles.timelineDate}>Today</div>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>⚙️</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>Infrastructure Setup</div>
                  <div className={styles.timelineDate}>{calculateTimeline()} days</div>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>📅</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>Exercise Start</div>
                  <div className={styles.timelineDate}>{formatDate(data.startDate)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isCreating && (
          <div className={styles.creatingOverlay}>
            <div className={styles.creatingModal}>
              <div className={styles.spinner}></div>
              <h3>Creating Your Exercise</h3>
              <p>Setting up infrastructure and configuring scenarios...</p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.stepActions}>
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep || isCreating}
          className={`${styles.button} ${styles.secondary}`}
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isCreating}
          className={`${styles.button} ${styles.primary} ${styles.createButton}`}
        >
          {isCreating ? 'Creating Exercise...' : '🚀 Create Exercise'}
        </button>
      </div>
    </div>
  )
}