import React, { useState } from 'react'
import { EventFormData } from '../EventWizard'
import styles from '../../styles/WizardStep.module.css'

interface AdversaryCharacteristicsProps {
  data: EventFormData
  onNext: (data: Partial<EventFormData>) => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function AdversaryCharacteristics({
  data,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: AdversaryCharacteristicsProps) {
  const [formData, setFormData] = useState({
    aptProfile: data.aptProfile || '',
    attackSophistication: data.attackSophistication || 3,
    primaryTTPs: data.primaryTTPs || [],
    industryFocus: data.industryFocus || '',
  })

  // Update local form data when parent data changes (e.g., when navigating back)
  React.useEffect(() => {
    setFormData({
      aptProfile: data.aptProfile || '',
      attackSophistication: data.attackSophistication || 3,
      primaryTTPs: data.primaryTTPs || [],
      industryFocus: data.industryFocus || '',
    })
  }, [data])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const aptProfiles = [
    'APT1 (Comment Crew)',
    'APT28 (Fancy Bear)',
    'APT29 (Cozy Bear)',
    'Lazarus Group',
    'Carbanak',
    'FIN7',
    'Equation Group',
    'Generic Cybercriminal',
    'Hacktivist Group',
    'Custom Profile'
  ]

  const sophisticationLevels = {
    1: 'Script Kiddie - Basic tools, limited skills',
    2: 'Organized Crime - Moderate capabilities, profit-driven',
    3: 'Advanced Persistent - Skilled, persistent, resource-backed',
    4: 'Nation-State Affiliated - Highly skilled, well-resourced',
    5: 'Nation-State Level - Elite capabilities, unlimited resources'
  }

  const ttpCategories = [
    'Initial Access',
    'Execution',
    'Persistence',
    'Privilege Escalation',
    'Defense Evasion',
    'Credential Access',
    'Discovery',
    'Lateral Movement',
    'Collection',
    'Command and Control',
    'Exfiltration',
    'Impact'
  ]

  const industryOptions = [
    'Financial Services',
    'Healthcare',
    'Government/Military',
    'Critical Infrastructure',
    'Technology/Software',
    'Manufacturing',
    'Retail/E-commerce',
    'Education',
    'Energy/Utilities',
    'Transportation',
    'Generic/Multi-sector'
  ]

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => {
      const newTTPs = prev.primaryTTPs.includes(value)
        ? prev.primaryTTPs.filter(item => item !== value)
        : [...prev.primaryTTPs, value]
      return { ...prev, primaryTTPs: newTTPs }
    })

    if (errors.primaryTTPs) {
      setErrors(prev => ({ ...prev, primaryTTPs: '' }))
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

    if (!formData.aptProfile) {
      newErrors.aptProfile = 'APT profile is required'
    }

    if (!formData.primaryTTPs || formData.primaryTTPs.length === 0) {
      newErrors.primaryTTPs = 'At least one TTP category is required'
    }

    if (!formData.industryFocus) {
      newErrors.industryFocus = 'Industry focus is required'
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
        <h2>Step 5: Adversary Characteristics</h2>
        <p>Define the threat actor profile and attack patterns for your exercise.</p>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            APT Profile *
            <div className={styles.tooltip}>
              <span className={styles.tooltipIcon}>ℹ️</span>
              <div className={styles.tooltipText}>
                Choose a threat actor profile to base your exercise scenarios on
              </div>
            </div>
          </label>
          <select
            value={formData.aptProfile}
            onChange={(e) => handleInputChange('aptProfile', e.target.value)}
            className={`${styles.select} ${errors.aptProfile ? styles.error : ''}`}
          >
            <option value="">Select APT profile...</option>
            {aptProfiles.map(profile => (
              <option key={profile} value={profile}>{profile}</option>
            ))}
          </select>
          {errors.aptProfile && (
            <div className={styles.errorMessage}>{errors.aptProfile}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Attack Sophistication
            <div className={styles.helpText}>
              Current: {sophisticationLevels[formData.attackSophistication as keyof typeof sophisticationLevels]}
            </div>
          </label>
          <div className={styles.sliderContainer}>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.attackSophistication}
              onChange={(e) => handleInputChange('attackSophistication', parseInt(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>Script Kiddie</span>
              <span>Organized</span>
              <span>Advanced</span>
              <span>Nation-State</span>
              <span>Elite</span>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Primary TTPs (MITRE ATT&CK) *
            <div className={styles.helpText}>Select the main attack techniques to simulate</div>
          </label>
          <div className={styles.checkboxGrid}>
            {ttpCategories.map(category => (
              <label key={category} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={formData.primaryTTPs.includes(category)}
                  onChange={() => handleCheckboxChange(category)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>{category}</span>
              </label>
            ))}
          </div>
          {errors.primaryTTPs && (
            <div className={styles.errorMessage}>{errors.primaryTTPs}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Industry Focus *</label>
          <select
            value={formData.industryFocus}
            onChange={(e) => handleInputChange('industryFocus', e.target.value)}
            className={`${styles.select} ${errors.industryFocus ? styles.error : ''}`}
          >
            <option value="">Select industry focus...</option>
            {industryOptions.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors.industryFocus && (
            <div className={styles.errorMessage}>{errors.industryFocus}</div>
          )}
        </div>

        <div className={styles.summaryBox}>
          <h4>Adversary Profile</h4>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Threat Actor:</span>
              <span className={styles.summaryValue}>{formData.aptProfile || 'Not selected'}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Sophistication:</span>
              <span className={styles.summaryValue}>Level {formData.attackSophistication}/5</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>TTPs:</span>
              <span className={styles.summaryValue}>{formData.primaryTTPs.length} categories</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Target Industry:</span>
              <span className={styles.summaryValue}>{formData.industryFocus || 'Not selected'}</span>
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
          Next: Review & Create →
        </button>
      </div>
    </div>
  )
}