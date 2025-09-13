import React, { useState } from 'react'
import { EventFormData } from '../EventWizard'
import styles from '../../styles/WizardStep.module.css'

interface BasicInformationProps {
  data: EventFormData
  onNext: (data: Partial<EventFormData>) => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function BasicInformation({
  data,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: BasicInformationProps) {
  const [formData, setFormData] = useState({
    owningOrganization: data.owningOrganization || '',
    eventName: data.eventName || '',
    eventDescription: data.eventDescription || '',
    trainingDuration: data.trainingDuration || '',
    customDuration: data.customDuration || 1,
    startDate: data.startDate || '',
    endDate: data.endDate || '',
  })

  // Update local form data when parent data changes (e.g., when navigating back)
  React.useEffect(() => {
    setFormData({
      owningOrganization: data.owningOrganization || '',
      eventName: data.eventName || '',
      eventDescription: data.eventDescription || '',
      trainingDuration: data.trainingDuration || '',
      customDuration: data.customDuration || 1,
      startDate: data.startDate || '',
      endDate: data.endDate || '',
    })
  }, [data])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const organizations = [
    'Cyber Defense Unit',
    'SOC Team',
    'IT Security',
    'Network Operations',
    'Incident Response',
    'Red Team',
    'All Departments'
  ]

  const durationOptions = [
    { value: '1day', label: '1 Day' },
    { value: '3days', label: '3 Days' },
    { value: '1week', label: '1 Week' },
    { value: '2weeks', label: '2 Weeks' },
    { value: 'custom', label: 'Custom Duration' },
  ]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const calculateEndDate = React.useCallback(() => {
    if (!formData.startDate || !formData.trainingDuration) return

    const startDate = new Date(formData.startDate)
    let daysToAdd = 0

    switch (formData.trainingDuration) {
      case '1day': daysToAdd = 0; break
      case '3days': daysToAdd = 2; break
      case '1week': daysToAdd = 6; break
      case '2weeks': daysToAdd = 13; break
      case 'custom': daysToAdd = formData.customDuration - 1; break
    }

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + daysToAdd)

    setFormData(prev => ({
      ...prev,
      endDate: endDate.toISOString().split('T')[0]
    }))
  }, [formData.startDate, formData.trainingDuration, formData.customDuration])

  React.useEffect(() => {
    calculateEndDate()
  }, [calculateEndDate])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.owningOrganization.trim()) {
      newErrors.owningOrganization = 'Organization is required'
    }

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required'
    } else if (formData.eventName.length < 3) {
      newErrors.eventName = 'Event name must be at least 3 characters'
    }

    if (!formData.eventDescription.trim()) {
      newErrors.eventDescription = 'Description is required'
    } else if (formData.eventDescription.length < 10) {
      newErrors.eventDescription = 'Description must be at least 10 characters'
    }

    if (!formData.trainingDuration) {
      newErrors.trainingDuration = 'Training duration is required'
    }

    if (formData.trainingDuration === 'custom' && formData.customDuration < 1) {
      newErrors.customDuration = 'Custom duration must be at least 1 day'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    } else {
      const selectedDate = new Date(formData.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.startDate = 'Start date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData)
    }
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Step 1: Basic Event Information</h2>
        <p>Let&apos;s start with the fundamental details of your training event.</p>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Owning Organization *
              <div className={styles.tooltip}>
                <span className={styles.tooltipIcon}>ℹ️</span>
                <div className={styles.tooltipText}>
                  The organization responsible for conducting this training event
                </div>
              </div>
            </label>
            <select
              value={formData.owningOrganization}
              onChange={(e) => handleInputChange('owningOrganization', e.target.value)}
              className={`${styles.select} ${errors.owningOrganization ? styles.error : ''}`}
            >
              <option value="">Select organization...</option>
              {organizations.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
            {errors.owningOrganization && (
              <div className={styles.errorMessage}>{errors.owningOrganization}</div>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Event Name *</label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              placeholder="e.g., Advanced Threat Detection Exercise"
              className={`${styles.input} ${errors.eventName ? styles.error : ''}`}
            />
            {errors.eventName && (
              <div className={styles.errorMessage}>{errors.eventName}</div>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Event Description *</label>
            <textarea
              value={formData.eventDescription}
              onChange={(e) => handleInputChange('eventDescription', e.target.value)}
              placeholder="Describe the goals, scope, and expected outcomes of this training event..."
              className={`${styles.textarea} ${errors.eventDescription ? styles.error : ''}`}
              rows={4}
            />
            {errors.eventDescription && (
              <div className={styles.errorMessage}>{errors.eventDescription}</div>
            )}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Training Duration *</label>
            <select
              value={formData.trainingDuration}
              onChange={(e) => handleInputChange('trainingDuration', e.target.value)}
              className={`${styles.select} ${errors.trainingDuration ? styles.error : ''}`}
            >
              <option value="">Select duration...</option>
              {durationOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.trainingDuration && (
              <div className={styles.errorMessage}>{errors.trainingDuration}</div>
            )}
          </div>

          {formData.trainingDuration === 'custom' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Custom Duration (days) *</label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.customDuration}
                onChange={(e) => handleInputChange('customDuration', parseInt(e.target.value) || 1)}
                className={`${styles.input} ${errors.customDuration ? styles.error : ''}`}
              />
              {errors.customDuration && (
                <div className={styles.errorMessage}>{errors.customDuration}</div>
              )}
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Start Date *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`${styles.input} ${errors.startDate ? styles.error : ''}`}
            />
            {errors.startDate && (
              <div className={styles.errorMessage}>{errors.startDate}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>End Date</label>
            <input
              type="date"
              value={formData.endDate}
              readOnly
              className={`${styles.input} ${styles.readonly}`}
            />
            <div className={styles.helpText}>
              End date is automatically calculated based on duration
            </div>
          </div>
        </div>
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
          Next: Scale & Participants →
        </button>
      </div>
    </div>
  )
}