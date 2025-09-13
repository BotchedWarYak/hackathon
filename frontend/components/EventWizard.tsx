import React, { useState } from 'react'
import BasicInformation from './wizard/BasicInformation'
import ScaleParticipants from './wizard/ScaleParticipants'
import ExerciseTypeScope from './wizard/ExerciseTypeScope'
import InfrastructureRequirements from './wizard/InfrastructureRequirements'
import AdversaryCharacteristics from './wizard/AdversaryCharacteristics'
import ReviewCreate from './wizard/ReviewCreate'
import styles from '../styles/EventWizard.module.css'

export interface EventFormData {
  // Step 1: Basic Information
  owningOrganization?: string
  eventName?: string
  eventDescription?: string
  trainingDuration?: string
  customDuration?: number
  startDate?: string
  endDate?: string

  // Step 2: Scale & Participants
  teamSize?: 'small' | 'medium' | 'large' | 'enterprise'
  numberOfTeams?: number
  totalParticipants?: number
  participantSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'mixed'

  // Step 3: Exercise Type & Scope
  operationType?: string[]
  primaryFocus?: string
  secondaryObjectives?: string[]
  complexityLevel?: number

  // Step 4: Infrastructure Requirements
  networkTopology?: string
  requiredSystems?: string[]
  specialRequirements?: string
  deploymentType?: 'cloud' | 'onpremise' | 'hybrid'

  // Step 5: Adversary Characteristics
  aptProfile?: string
  attackSophistication?: number
  primaryTTPs?: string[]
  industryFocus?: string

  // Additional metadata
  createdAt?: string
  createdBy?: string
  estimatedCost?: number
  estimatedSetupDays?: number
  status?: string
}

interface EventWizardProps {
  onComplete: (data: EventFormData) => void
  onCancel: () => void
}

const steps = [
  { id: 1, title: 'Basic Information', component: BasicInformation },
  { id: 2, title: 'Scale & Participants', component: ScaleParticipants },
  { id: 3, title: 'Exercise Type & Scope', component: ExerciseTypeScope },
  { id: 4, title: 'Infrastructure Requirements', component: InfrastructureRequirements },
  { id: 5, title: 'Adversary Characteristics', component: AdversaryCharacteristics },
  { id: 6, title: 'Review & Create', component: ReviewCreate },
]

export default function EventWizard({ onComplete, onCancel }: EventWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<EventFormData>({})
  const [isDraft, setIsDraft] = useState(false)

  const handleStepComplete = (stepData: Partial<EventFormData>) => {
    const updatedData = { ...formData, ...stepData }
    console.log('Step completed:', currentStep, 'Data:', stepData, 'Updated:', updatedData)
    setFormData(updatedData)

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step completed
      onComplete({
        ...updatedData,
        createdAt: new Date().toISOString(),
        createdBy: 'John Doe' // This would come from auth context
      })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    const draftData = {
      ...formData,
      createdAt: new Date().toISOString(),
      createdBy: 'John Doe',
      status: 'draft'
    }
    setIsDraft(true)
    console.log('Saving draft:', draftData)
    // Here you would typically save to backend
    alert('Draft saved successfully!')
  }

  const handleCancel = () => {
    if (Object.keys(formData).length > 0) {
      const confirmCancel = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel? Your progress will be lost.'
      )
      if (confirmCancel) {
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  const currentStepData = steps.find(step => step.id === currentStep)
  const CurrentStepComponent = currentStepData?.component

  const progressPercentage = (currentStep / steps.length) * 100

  return (
    <div className={styles.wizard}>
      <div className={styles.wizardHeader}>
        <h1>Create New Training Event</h1>
        <button className={styles.cancelButton} onClick={handleCancel}>
          ✕ Cancel
        </button>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className={styles.stepBreadcrumbs}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.breadcrumb} ${
                step.id === currentStep ? styles.active : ''
              } ${step.id < currentStep ? styles.completed : ''}`}
            >
              <div className={styles.breadcrumbNumber}>
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <span className={styles.breadcrumbTitle}>{step.title}</span>
              {index < steps.length - 1 && <div className={styles.breadcrumbArrow}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className={styles.stepContent}>
        {CurrentStepComponent && (
          <CurrentStepComponent
            data={formData}
            onNext={handleStepComplete}
            onPrevious={handlePrevious}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
          />
        )}
      </div>

      {/* Save Draft Button */}
      <div className={styles.draftSection}>
        <button
          className={styles.saveDraftButton}
          onClick={handleSaveDraft}
          disabled={isDraft}
        >
          💾 {isDraft ? 'Draft Saved' : 'Save Draft'}
        </button>
      </div>
    </div>
  )
}