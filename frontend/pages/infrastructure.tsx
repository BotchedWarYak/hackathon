import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import InfrastructureHeader from '../components/infrastructure/InfrastructureHeader'
import EventContextBridge from '../components/infrastructure/EventContextBridge'
import NetworkTopologyViewer from '../components/infrastructure/NetworkTopologyViewer'
import MachineConfiguration from '../components/infrastructure/MachineConfiguration'
import InfrastructureManagement from '../components/infrastructure/InfrastructureManagement'
import styles from '../styles/Infrastructure.module.css'

// Placeholder interfaces for infrastructure data
interface InfrastructureEvent {
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
  // Event planning context
  eventData?: {
    teamSize: 'small' | 'medium' | 'large' | 'enterprise'
    numberOfTeams: number
    operationType: string[]
    aptProfile: string
    participantSkillLevel: string
    industryFocus: string
    complexityLevel: number
    networkTopology: string
    requiredSystems: string[]
    deploymentType: 'cloud' | 'onpremise' | 'hybrid'
  }
}

interface NetworkNode {
  id: string
  name: string
  type: 'zone' | 'machine' | 'network'
  zone: string
  x: number
  y: number
  status: 'planned' | 'building' | 'ready' | 'failed'
  connections: string[]
  config?: {
    os: string
    role: string
    cpu: number
    memory: number
    storage: number
    tools: string[]
  }
}

interface InfrastructureTemplate {
  id: string
  name: string
  description: string
  type: 'corporate' | 'small_business' | 'government' | 'custom'
  networkZones: string[]
  defaultMachines: NetworkNode[]
  estimatedCost: number
}

export default function Infrastructure() {
  // Sample current event data (would come from backend/context)
  const [currentEvent, setCurrentEvent] = useState<InfrastructureEvent>({
    id: '1',
    name: 'Advanced Threat Detection Exercise',
    status: 'in_progress',
    totalVMs: 12,
    networkSegments: 4,
    estimatedResources: {
      cpu: 48,
      memory: 192,
      storage: 2400,
      cost: 1250
    },
    eventData: {
      teamSize: 'medium',
      numberOfTeams: 3,
      operationType: ['dco', 'both'],
      aptProfile: 'APT28 (Fancy Bear)',
      participantSkillLevel: 'intermediate',
      industryFocus: 'Financial Services',
      complexityLevel: 3,
      networkTopology: 'complex',
      requiredSystems: ['Windows Domain Controller', 'Linux Servers', 'Web Applications', 'SIEM Platform'],
      deploymentType: 'cloud'
    }
  })

  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([
    {
      id: 'dmz',
      name: 'DMZ Zone',
      type: 'zone',
      zone: 'dmz',
      x: 100,
      y: 100,
      status: 'ready',
      connections: ['internal', 'management']
    },
    {
      id: 'internal',
      name: 'Internal Network',
      type: 'zone',
      zone: 'internal',
      x: 300,
      y: 100,
      status: 'ready',
      connections: ['dmz', 'isolated']
    },
    {
      id: 'management',
      name: 'Management',
      type: 'zone',
      zone: 'management',
      x: 200,
      y: 250,
      status: 'ready',
      connections: ['dmz']
    },
    {
      id: 'isolated',
      name: 'Red Team Zone',
      type: 'zone',
      zone: 'isolated',
      x: 500,
      y: 100,
      status: 'planned',
      connections: ['internal']
    }
  ])

  const [availableTemplates] = useState<InfrastructureTemplate[]>([
    {
      id: 'corporate',
      name: 'Corporate Network',
      description: 'Enterprise environment with DMZ, internal network, and management zones',
      type: 'corporate',
      networkZones: ['DMZ', 'Internal', 'Management', 'Guest'],
      defaultMachines: [],
      estimatedCost: 2500
    },
    {
      id: 'small_business',
      name: 'Small Business',
      description: 'Simple network topology for small organization scenarios',
      type: 'small_business',
      networkZones: ['Public', 'Internal'],
      defaultMachines: [],
      estimatedCost: 800
    },
    {
      id: 'government',
      name: 'Government Agency',
      description: 'High-security environment with compliance requirements',
      type: 'government',
      networkZones: ['Public DMZ', 'Classified', 'Unclassified', 'Management'],
      defaultMachines: [],
      estimatedCost: 4200
    }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [activePanel, setActivePanel] = useState<'topology' | 'machines' | 'management'>('topology')

  // Generate smart suggestions based on event planning data
  const generateSmartSuggestions = () => {
    if (!currentEvent.eventData) return []

    const suggestions = []
    const { teamSize, operationType, aptProfile, participantSkillLevel, requiredSystems } = currentEvent.eventData

    // Team size suggestions
    if (teamSize === 'small') {
      suggestions.push({
        type: 'network',
        title: 'Small Team Configuration',
        description: 'Simple network with 2 zones recommended for team size',
        action: 'Apply Configuration'
      })
    } else if (teamSize === 'large' || teamSize === 'enterprise') {
      suggestions.push({
        type: 'network',
        title: 'Enterprise Segmentation',
        description: 'Multiple isolated networks recommended for large teams',
        action: 'Apply Configuration'
      })
    }

    // Operation type suggestions
    if (operationType.includes('dco')) {
      suggestions.push({
        type: 'tools',
        title: 'Defensive Tools Suite',
        description: 'SIEM, EDR, and monitoring tools for DCO focus',
        action: 'Add Tools'
      })
    }

    if (operationType.includes('oco')) {
      suggestions.push({
        type: 'tools',
        title: 'Red Team Infrastructure',
        description: 'C2 servers and attack simulation tools',
        action: 'Add Tools'
      })
    }

    return suggestions
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    // In real app, this would load template configuration
    console.log('Template selected:', templateId)
  }

  const handleNodeUpdate = (nodeId: string, updates: Partial<NetworkNode>) => {
    setNetworkNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    )
  }

  const handleAddMachine = (config: any) => {
    const newNode: NetworkNode = {
      id: `machine_${Date.now()}`,
      name: config.name || 'New Machine',
      type: 'machine',
      zone: config.zone || 'internal',
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 150,
      status: 'planned',
      connections: [],
      config: config
    }
    setNetworkNodes(prev => [...prev, newNode])
  }

  return (
    <>
      <Head>
        <title>Infrastructure - Training Platform</title>
        <meta name="description" content="Design and deploy training infrastructure" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className={styles.infrastructurePage}>
          <InfrastructureHeader
            event={currentEvent}
            onStatusChange={(status) => setCurrentEvent(prev => ({ ...prev, status }))}
          />

          <EventContextBridge
            eventData={currentEvent.eventData}
            suggestions={generateSmartSuggestions()}
          />

          <div className={styles.mainInterface}>
            <div className={styles.panelTabs}>
              <button
                className={`${styles.panelTab} ${activePanel === 'topology' ? styles.active : ''}`}
                onClick={() => setActivePanel('topology')}
              >
                🌐 Network Topology
              </button>
              <button
                className={`${styles.panelTab} ${activePanel === 'machines' ? styles.active : ''}`}
                onClick={() => setActivePanel('machines')}
              >
                🖥️ Machine Config
              </button>
              <button
                className={`${styles.panelTab} ${activePanel === 'management' ? styles.active : ''}`}
                onClick={() => setActivePanel('management')}
              >
                ⚙️ Management
              </button>
            </div>

            <div className={styles.interfacePanels}>
              {activePanel === 'topology' && (
                <NetworkTopologyViewer
                  nodes={networkNodes}
                  onNodeUpdate={handleNodeUpdate}
                  templates={availableTemplates}
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                />
              )}

              {activePanel === 'machines' && (
                <MachineConfiguration
                  eventData={currentEvent.eventData}
                  nodes={networkNodes}
                  onAddMachine={handleAddMachine}
                  onNodeUpdate={handleNodeUpdate}
                />
              )}

              {activePanel === 'management' && (
                <InfrastructureManagement
                  event={currentEvent}
                  nodes={networkNodes}
                  onEventUpdate={setCurrentEvent}
                />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}