import React, { useState } from 'react'
import { EventFormData } from '../EventWizard'
import styles from '../../styles/WizardStep.module.css'

interface ExerciseTypeScopeProps {
  data: EventFormData
  onNext: (data: Partial<EventFormData>) => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function ExerciseTypeScope({
  data,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: ExerciseTypeScopeProps) {
  const [formData, setFormData] = useState({
    operationType: data.operationType || [],
    primaryFocus: data.primaryFocus || '',
    secondaryObjectives: data.secondaryObjectives || [],
    complexityLevel: data.complexityLevel || 3,
  })

  // Update local form data when parent data changes (e.g., when navigating back)
  React.useEffect(() => {
    setFormData({
      operationType: data.operationType || [],
      primaryFocus: data.primaryFocus || '',
      secondaryObjectives: data.secondaryObjectives || [],
      complexityLevel: data.complexityLevel || 3,
    })
  }, [data])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const operationTypes = [
    { value: 'oco', label: 'OCO (Offensive Cyber Operations)', description: 'Simulate offensive capabilities and red team activities' },
    { value: 'dco', label: 'DCO (Defensive Cyber Operations)', description: 'Focus on defensive strategies and blue team response' },
    { value: 'both', label: 'Combined Operations', description: 'Integrated offensive and defensive operations' }
  ]

  const primaryFocusOptions = [
    'Network Defense',
    'Incident Response',
    'Threat Hunting',
    'Red Team Operations',
    'Digital Forensics',
    'Malware Analysis',
    'Vulnerability Assessment',
    'Social Engineering Defense',
    'Cloud Security',
    'Industrial Control Systems'
  ]

  const secondaryObjectiveOptions = [
    'Communication & Coordination',
    'Tool Proficiency',
    'Documentation & Reporting',
    'Leadership Development',
    'Cross-team Collaboration',
    'Stress Testing',
    'Process Improvement',
    'Threat Intelligence',
    'Risk Assessment',
    'Compliance Validation'
  ]

  const complexityLabels = {
    1: 'Basic - Simple scenarios, clear indicators',
    2: 'Elementary - Straightforward with some complexity',
    3: 'Intermediate - Moderate complexity, realistic scenarios',
    4: 'Advanced - Complex multi-stage operations',
    5: 'Expert - Highly sophisticated, nation-state level'
  }

  const handleCheckboxChange = (field: 'operationType' | 'secondaryObjectives', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]

      return { ...prev, [field]: newArray }
    })

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.operationType || formData.operationType.length === 0) {
      newErrors.operationType = 'At least one operation type is required'
    }

    if (!formData.primaryFocus) {
      newErrors.primaryFocus = 'Primary focus is required'
    }

    if (!formData.secondaryObjectives || formData.secondaryObjectives.length === 0) {
      newErrors.secondaryObjectives = 'At least one secondary objective is required'
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
        <h2>Step 3: Exercise Type & Scope</h2>
        <p>Define the operational focus and learning objectives for your exercise.</p>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Operation Type *
            <div className={styles.tooltip}>
              <span className={styles.tooltipIcon}>ℹ️</span>
              <div className={styles.tooltipText}>
                Choose the operational approach for your exercise
              </div>
            </div>
          </label>
          <div className={styles.checkboxGroup}>
            {operationTypes.map(option => (
              <label key={option.value} className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={formData.operationType.includes(option.value)}
                  onChange={() => handleCheckboxChange('operationType', option.value)}
                  className={styles.checkbox}
                />
                <div className={styles.checkboxContent}>
                  <div className={styles.checkboxLabel}>{option.label}</div>
                  <div className={styles.checkboxDescription}>{option.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.operationType && (
            <div className={styles.errorMessage}>{errors.operationType}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Primary Focus *</label>
          <select
            value={formData.primaryFocus}
            onChange={(e) => handleInputChange('primaryFocus', e.target.value)}
            className={`${styles.select} ${errors.primaryFocus ? styles.error : ''}`}
          >
            <option value="">Select primary focus...</option>
            {primaryFocusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.primaryFocus && (
            <div className={styles.errorMessage}>{errors.primaryFocus}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Secondary Objectives *
            <div className={styles.helpText}>Select additional learning goals (choose multiple)</div>
          </label>
          <div className={styles.checkboxGrid}>
            {secondaryObjectiveOptions.map(option => (
              <label key={option} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={formData.secondaryObjectives.includes(option)}
                  onChange={() => handleCheckboxChange('secondaryObjectives', option)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>{option}</span>
              </label>
            ))}
          </div>
          {errors.secondaryObjectives && (
            <div className={styles.errorMessage}>{errors.secondaryObjectives}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Complexity Level
            <div className={styles.helpText}>
              Current: {complexityLabels[formData.complexityLevel as keyof typeof complexityLabels]}
            </div>
          </label>
          <div className={styles.sliderContainer}>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.complexityLevel}
              onChange={(e) => handleInputChange('complexityLevel', parseInt(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>Basic</span>
              <span>Elementary</span>
              <span>Intermediate</span>
              <span>Advanced</span>
              <span>Expert</span>
            </div>
          </div>
        </div>

        <div className={styles.summaryBox}>
          <h4>Exercise Configuration</h4>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Operation Types:</span>
              <span className={styles.summaryValue}>
                {formData.operationType.map(type =>
                  operationTypes.find(opt => opt.value === type)?.label.split(' (')[0]
                ).join(', ') || 'None selected'}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Primary Focus:</span>
              <span className={styles.summaryValue}>{formData.primaryFocus || 'Not selected'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Secondary Objectives:</span>
              <span className={styles.summaryValue}>
                {formData.secondaryObjectives.length} selected
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Complexity:</span>
              <span className={styles.summaryValue}>
                Level {formData.complexityLevel}/5
              </span>
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
          Next: Infrastructure Requirements →
        </button>
      </div>
    </div>
  )
}