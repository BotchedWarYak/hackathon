import React, { useState } from 'react'
import { EventFormData } from '../EventWizard'
import styles from '../../styles/WizardStep.module.css'

interface ScaleParticipantsProps {
  data: EventFormData
  onNext: (data: Partial<EventFormData>) => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function ScaleParticipants({
  data,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: ScaleParticipantsProps) {
  const [formData, setFormData] = useState({
    teamSize: data.teamSize || '',
    numberOfTeams: data.numberOfTeams || 1,
    totalParticipants: data.totalParticipants || 0,
    participantSkillLevel: data.participantSkillLevel || '',
  })

  // Update local form data when parent data changes (e.g., when navigating back)
  React.useEffect(() => {
    setFormData({
      teamSize: data.teamSize || '',
      numberOfTeams: data.numberOfTeams || 1,
      totalParticipants: data.totalParticipants || 0,
      participantSkillLevel: data.participantSkillLevel || '',
    })
  }, [data])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const teamSizeOptions = [
    {
      value: 'small',
      label: 'Small (5-15 participants)',
      description: 'Ideal for focused, hands-on training with close mentorship',
      suggestedTeams: { min: 1, max: 3 }
    },
    {
      value: 'medium',
      label: 'Medium (16-50 participants)',
      description: 'Balanced approach allowing for diverse team dynamics',
      suggestedTeams: { min: 2, max: 5 }
    },
    {
      value: 'large',
      label: 'Large (51-100 participants)',
      description: 'Complex scenarios with multiple concurrent operations',
      suggestedTeams: { min: 4, max: 10 }
    },
    {
      value: 'enterprise',
      label: 'Enterprise (100+ participants)',
      description: 'Organization-wide exercises with comprehensive coverage',
      suggestedTeams: { min: 8, max: 20 }
    }
  ]

  const skillLevelOptions = [
    {
      value: 'beginner',
      label: 'Beginner',
      description: 'New to cybersecurity, needs foundational training'
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      description: 'Some experience, can handle moderate complexity'
    },
    {
      value: 'advanced',
      label: 'Advanced',
      description: 'Experienced professionals, ready for complex scenarios'
    },
    {
      value: 'mixed',
      label: 'Mixed Skill Levels',
      description: 'Participants with varying experience levels'
    }
  ]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const calculateParticipants = React.useCallback(() => {
    const selectedSize = teamSizeOptions.find(opt => opt.value === formData.teamSize)
    if (!selectedSize || !formData.numberOfTeams) return

    let avgTeamSize = 0
    switch (formData.teamSize) {
      case 'small': avgTeamSize = 10; break
      case 'medium': avgTeamSize = 33; break
      case 'large': avgTeamSize = 75; break
      case 'enterprise': avgTeamSize = 150; break
    }

    const calculated = Math.round((avgTeamSize / selectedSize.suggestedTeams.max) * formData.numberOfTeams)
    setFormData(prev => ({ ...prev, totalParticipants: calculated }))
  }, [formData.teamSize, formData.numberOfTeams])

  React.useEffect(() => {
    calculateParticipants()
  }, [calculateParticipants])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.teamSize) {
      newErrors.teamSize = 'Team size is required'
    }

    if (!formData.numberOfTeams || formData.numberOfTeams < 1) {
      newErrors.numberOfTeams = 'Number of teams must be at least 1'
    } else {
      const selectedSize = teamSizeOptions.find(opt => opt.value === formData.teamSize)
      if (selectedSize) {
        if (formData.numberOfTeams < selectedSize.suggestedTeams.min) {
          newErrors.numberOfTeams = `For ${selectedSize.label.toLowerCase()}, we recommend at least ${selectedSize.suggestedTeams.min} teams`
        } else if (formData.numberOfTeams > selectedSize.suggestedTeams.max) {
          newErrors.numberOfTeams = `For ${selectedSize.label.toLowerCase()}, we recommend no more than ${selectedSize.suggestedTeams.max} teams`
        }
      }
    }

    if (!formData.totalParticipants || formData.totalParticipants < 1) {
      newErrors.totalParticipants = 'Total participants must be at least 1'
    }

    if (!formData.participantSkillLevel) {
      newErrors.participantSkillLevel = 'Participant skill level is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext({
        teamSize: formData.teamSize as 'small' | 'medium' | 'large' | 'enterprise',
        numberOfTeams: formData.numberOfTeams,
        totalParticipants: formData.totalParticipants,
        participantSkillLevel: formData.participantSkillLevel as 'beginner' | 'intermediate' | 'advanced' | 'mixed'
      })
    }
  }

  const selectedTeamSize = teamSizeOptions.find(opt => opt.value === formData.teamSize)

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Step 2: Scale & Participants</h2>
        <p>Define the size and composition of your training event.</p>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Team Size *
            <div className={styles.tooltip}>
              <span className={styles.tooltipIcon}>ℹ️</span>
              <div className={styles.tooltipText}>
                Team size affects exercise complexity, resource requirements, and facilitation needs
              </div>
            </div>
          </label>
          <div className={styles.radioGroup}>
            {teamSizeOptions.map(option => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="teamSize"
                  value={option.value}
                  checked={formData.teamSize === option.value}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  className={styles.radio}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioLabel}>{option.label}</div>
                  <div className={styles.radioDescription}>{option.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.teamSize && (
            <div className={styles.errorMessage}>{errors.teamSize}</div>
          )}
        </div>

        {formData.teamSize && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Number of Teams *
                {selectedTeamSize && (
                  <div className={styles.suggestion}>
                    Suggested: {selectedTeamSize.suggestedTeams.min}-{selectedTeamSize.suggestedTeams.max} teams
                  </div>
                )}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.numberOfTeams}
                onChange={(e) => handleInputChange('numberOfTeams', parseInt(e.target.value) || 1)}
                className={`${styles.input} ${errors.numberOfTeams ? styles.error : ''}`}
              />
              {errors.numberOfTeams && (
                <div className={styles.errorMessage}>{errors.numberOfTeams}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Total Participants *
                <div className={styles.helpText}>Auto-calculated, but you can adjust</div>
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalParticipants}
                onChange={(e) => handleInputChange('totalParticipants', parseInt(e.target.value) || 0)}
                className={`${styles.input} ${errors.totalParticipants ? styles.error : ''}`}
              />
              {errors.totalParticipants && (
                <div className={styles.errorMessage}>{errors.totalParticipants}</div>
              )}
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Participant Skill Level *
            <div className={styles.tooltip}>
              <span className={styles.tooltipIcon}>ℹ️</span>
              <div className={styles.tooltipText}>
                This determines exercise complexity and the type of scenarios presented
              </div>
            </div>
          </label>
          <div className={styles.radioGroup}>
            {skillLevelOptions.map(option => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="participantSkillLevel"
                  value={option.value}
                  checked={formData.participantSkillLevel === option.value}
                  onChange={(e) => handleInputChange('participantSkillLevel', e.target.value)}
                  className={styles.radio}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioLabel}>{option.label}</div>
                  <div className={styles.radioDescription}>{option.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.participantSkillLevel && (
            <div className={styles.errorMessage}>{errors.participantSkillLevel}</div>
          )}
        </div>

        {formData.teamSize && formData.participantSkillLevel && (
          <div className={styles.summaryBox}>
            <h4>Exercise Summary</h4>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Scale:</span>
                <span className={styles.summaryValue}>
                  {teamSizeOptions.find(opt => opt.value === formData.teamSize)?.label}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Teams:</span>
                <span className={styles.summaryValue}>{formData.numberOfTeams}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Participants:</span>
                <span className={styles.summaryValue}>{formData.totalParticipants}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Skill Level:</span>
                <span className={styles.summaryValue}>
                  {skillLevelOptions.find(opt => opt.value === formData.participantSkillLevel)?.label}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.stepActions}>
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`${styles.button} ${styles.secondary}`}
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          className={`${styles.button} ${styles.primary}`}
        >
          Next: Exercise Type & Scope →
        </button>
      </div>
    </div>
  )
}