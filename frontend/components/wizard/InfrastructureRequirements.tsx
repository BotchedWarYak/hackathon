import React, { useState } from 'react'
import { EventFormData } from '../EventWizard'
import styles from '../../styles/WizardStep.module.css'

interface InfrastructureRequirementsProps {
  data: EventFormData
  onNext: (data: Partial<EventFormData>) => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function InfrastructureRequirements({
  data,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep
}: InfrastructureRequirementsProps) {
  const [formData, setFormData] = useState({
    networkTopology: data.networkTopology || '',
    requiredSystems: data.requiredSystems || [],
    specialRequirements: data.specialRequirements || '',
    deploymentType: data.deploymentType || '',
  })

  // Update local form data when parent data changes (e.g., when navigating back)
  React.useEffect(() => {
    setFormData({
      networkTopology: data.networkTopology || '',
      requiredSystems: data.requiredSystems || [],
      specialRequirements: data.specialRequirements || '',
      deploymentType: data.deploymentType || '',
    })
  }, [data])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const networkTopologyOptions = [
    { value: 'simple', label: 'Simple Network', description: 'Basic network with few segments' },
    { value: 'complex', label: 'Complex Enterprise', description: 'Multi-tier network with DMZ, internal segments' },
    { value: 'custom', label: 'Custom Topology', description: 'Specialized network configuration' }
  ]

  const systemOptions = [
    'Windows Domain Controller',
    'Linux Servers',
    'Web Applications',
    'Database Systems',
    'Email Server',
    'DNS Server',
    'Firewall/IDS/IPS',
    'SIEM Platform',
    'Endpoint Detection',
    'Network Monitoring',
    'Cloud Services',
    'Industrial Control Systems'
  ]

  const deploymentOptions = [
    { value: 'cloud', label: 'Cloud-based', description: 'AWS, Azure, or GCP deployment' },
    { value: 'onpremise', label: 'On-premise', description: 'Physical or local virtualized infrastructure' },
    { value: 'hybrid', label: 'Hybrid', description: 'Combination of cloud and on-premise' }
  ]

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => {
      const newSystems = prev.requiredSystems.includes(value)
        ? prev.requiredSystems.filter(item => item !== value)
        : [...prev.requiredSystems, value]
      return { ...prev, requiredSystems: newSystems }
    })

    if (errors.requiredSystems) {
      setErrors(prev => ({ ...prev, requiredSystems: '' }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.networkTopology) {
      newErrors.networkTopology = 'Network topology is required'
    }

    if (!formData.requiredSystems || formData.requiredSystems.length === 0) {
      newErrors.requiredSystems = 'At least one system type is required'
    }

    if (!formData.deploymentType) {
      newErrors.deploymentType = 'Deployment type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext({
        networkTopology: formData.networkTopology,
        requiredSystems: formData.requiredSystems,
        specialRequirements: formData.specialRequirements,
        deploymentType: formData.deploymentType as 'cloud' | 'onpremise' | 'hybrid'
      })
    }
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Step 4: Infrastructure Requirements</h2>
        <p>Define the technical infrastructure needed for your exercise.</p>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Network Topology *
            <div className={styles.tooltip}>
              <span className={styles.tooltipIcon}>ℹ️</span>
              <div className={styles.tooltipText}>
                Network complexity affects exercise realism and resource requirements
              </div>
            </div>
          </label>
          <div className={styles.radioGroup}>
            {networkTopologyOptions.map(option => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="networkTopology"
                  value={option.value}
                  checked={formData.networkTopology === option.value}
                  onChange={(e) => handleInputChange('networkTopology', e.target.value)}
                  className={styles.radio}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioLabel}>{option.label}</div>
                  <div className={styles.radioDescription}>{option.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.networkTopology && (
            <div className={styles.errorMessage}>{errors.networkTopology}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Required Systems *
            <div className={styles.helpText}>Select all systems needed for your exercise</div>
          </label>
          <div className={styles.checkboxGrid}>
            {systemOptions.map(option => (
              <label key={option} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={formData.requiredSystems.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>{option}</span>
              </label>
            ))}
          </div>
          {errors.requiredSystems && (
            <div className={styles.errorMessage}>{errors.requiredSystems}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Special Requirements</label>
          <textarea
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            placeholder="Describe any custom infrastructure needs, specific configurations, or special hardware requirements..."
            className={styles.textarea}
            rows={4}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Deployment Type *</label>
          <div className={styles.radioGroup}>
            {deploymentOptions.map(option => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name="deploymentType"
                  value={option.value}
                  checked={formData.deploymentType === option.value}
                  onChange={(e) => handleInputChange('deploymentType', e.target.value)}
                  className={styles.radio}
                />
                <div className={styles.radioContent}>
                  <div className={styles.radioLabel}>{option.label}</div>
                  <div className={styles.radioDescription}>{option.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.deploymentType && (
            <div className={styles.errorMessage}>{errors.deploymentType}</div>
          )}
        </div>

        <div className={styles.summaryBox}>
          <h4>Infrastructure Overview</h4>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Network:</span>
              <span className={styles.summaryValue}>
                {networkTopologyOptions.find(opt => opt.value === formData.networkTopology)?.label || 'Not selected'}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Systems:</span>
              <span className={styles.summaryValue}>{formData.requiredSystems.length} selected</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Deployment:</span>
              <span className={styles.summaryValue}>
                {deploymentOptions.find(opt => opt.value === formData.deploymentType)?.label || 'Not selected'}
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
          Next: Adversary Characteristics →
        </button>
      </div>
    </div>
  )
}