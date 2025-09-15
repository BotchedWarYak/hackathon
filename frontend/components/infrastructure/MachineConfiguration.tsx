import React, { useState } from 'react'
import styles from '../../styles/Infrastructure.module.css'

interface MachineConfigurationProps {
  eventData?: {
    teamSize: string
    operationType: string[]
    requiredSystems: string[]
    deploymentType: string
    industryFocus: string
    participantSkillLevel: string
  }
  nodes: any[]
  onAddMachine: (config: any) => void
  onNodeUpdate: (nodeId: string, updates: any) => void
}

interface MachineTemplate {
  id: string
  name: string
  description: string
  os: string
  role: string
  category: 'server' | 'workstation' | 'security' | 'database'
  defaultSpecs: {
    cpu: number
    memory: number
    storage: number
  }
  preInstalledTools: string[]
  vulnerabilities: string[]
}

export default function MachineConfiguration({
  eventData,
  nodes,
  onAddMachine,
  onNodeUpdate
}: MachineConfigurationProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'custom' | 'existing'>('suggestions')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [customConfig, setCustomConfig] = useState({
    name: '',
    os: 'Windows Server 2022',
    role: 'Domain Controller',
    zone: 'internal',
    cpu: 4,
    memory: 8,
    storage: 100,
    tools: [] as string[]
  })

  // Machine templates based on common scenarios
  const machineTemplates: MachineTemplate[] = [
    {
      id: 'win_dc',
      name: 'Windows Domain Controller',
      description: 'Active Directory server for enterprise scenarios',
      os: 'Windows Server 2022',
      role: 'Domain Controller',
      category: 'server',
      defaultSpecs: { cpu: 4, memory: 8, storage: 120 },
      preInstalledTools: ['Active Directory', 'DNS', 'DHCP'],
      vulnerabilities: ['MS17-010', 'Kerberoast']
    },
    {
      id: 'linux_web',
      name: 'Linux Web Server',
      description: 'Apache/Nginx web server with common vulnerabilities',
      os: 'Ubuntu 22.04',
      role: 'Web Server',
      category: 'server',
      defaultSpecs: { cpu: 2, memory: 4, storage: 60 },
      preInstalledTools: ['Apache', 'MySQL', 'PHP'],
      vulnerabilities: ['SQL Injection', 'XSS', 'CSRF']
    },
    {
      id: 'siem_server',
      name: 'SIEM Platform',
      description: 'Security monitoring and analysis platform',
      os: 'CentOS 8',
      role: 'SIEM Server',
      category: 'security',
      defaultSpecs: { cpu: 8, memory: 16, storage: 500 },
      preInstalledTools: ['Splunk', 'ELK Stack', 'Suricata'],
      vulnerabilities: []
    },
    {
      id: 'win_workstation',
      name: 'Windows Workstation',
      description: 'Standard corporate workstation environment',
      os: 'Windows 11',
      role: 'Workstation',
      category: 'workstation',
      defaultSpecs: { cpu: 2, memory: 8, storage: 80 },
      preInstalledTools: ['Office Suite', 'Antivirus', 'VPN Client'],
      vulnerabilities: ['Phishing vectors', 'Local privilege escalation']
    }
  ]

  // Generate smart suggestions based on event data
  const getSmartSuggestions = () => {
    if (!eventData) return []

    const suggestions = []
    const { requiredSystems, operationType, industryFocus, participantSkillLevel } = eventData

    requiredSystems.forEach(system => {
      const template = machineTemplates.find(t => t.name.toLowerCase().includes(system.toLowerCase()))
      if (template) {
        suggestions.push({
          ...template,
          reason: `Required for your ${system} component`,
          priority: 'high'
        })
      }
    })

    // Add defensive tools for DCO operations
    if (operationType.includes('dco')) {
      const siemTemplate = machineTemplates.find(t => t.id === 'siem_server')
      if (siemTemplate) {
        suggestions.push({
          ...siemTemplate,
          reason: 'Essential for DCO monitoring and detection',
          priority: 'high'
        })
      }
    }

    // Add industry-specific systems
    if (industryFocus === 'Financial Services') {
      suggestions.push({
        id: 'financial_app',
        name: 'Financial Application Server',
        description: 'Banking application with PCI compliance requirements',
        os: 'Windows Server 2022',
        role: 'Application Server',
        category: 'server',
        defaultSpecs: { cpu: 4, memory: 16, storage: 200 },
        preInstalledTools: ['IIS', 'SQL Server', 'TLS Certificate'],
        vulnerabilities: ['Weak encryption', 'Authentication bypass'],
        reason: 'Industry-specific target for financial services scenarios',
        priority: 'medium'
      })
    }

    return suggestions.slice(0, 6) // Limit to 6 suggestions
  }

  const handleTemplateSelect = (template: MachineTemplate) => {
    setSelectedTemplate(template.id)
    setCustomConfig({
      name: template.name,
      os: template.os,
      role: template.role,
      zone: 'internal',
      cpu: template.defaultSpecs.cpu,
      memory: template.defaultSpecs.memory,
      storage: template.defaultSpecs.storage,
      tools: template.preInstalledTools
    })
  }

  const handleAddMachine = () => {
    onAddMachine({
      ...customConfig,
      template: selectedTemplate
    })
    // Reset form
    setCustomConfig({
      name: '',
      os: 'Windows Server 2022',
      role: 'Domain Controller',
      zone: 'internal',
      cpu: 4,
      memory: 8,
      storage: 100,
      tools: []
    })
    setSelectedTemplate('')
  }

  const renderSuggestions = () => {
    const suggestions = getSmartSuggestions()

    return (
      <div className={styles.suggestionsPanel}>
        <div className={styles.suggestionsHeader}>
          <h4>Smart Suggestions</h4>
          <p>Based on your event planning configuration</p>
        </div>

        <div className={styles.suggestionsList}>
          {suggestions.map((suggestion: any) => (
            <div key={suggestion.id} className={styles.suggestionCard}>
              <div className={styles.suggestionHeader}>
                <div className={styles.suggestionTitle}>
                  <span className={styles.suggestionIcon}>
                    {suggestion.category === 'server' && '🖥️'}
                    {suggestion.category === 'workstation' && '💻'}
                    {suggestion.category === 'security' && '🔒'}
                    {suggestion.category === 'database' && '🗄️'}
                  </span>
                  {suggestion.name}
                </div>
                <span className={`${styles.priorityBadge} ${styles[suggestion.priority]}`}>
                  {suggestion.priority}
                </span>
              </div>

              <p className={styles.suggestionDescription}>{suggestion.description}</p>

              <div className={styles.suggestionSpecs}>
                <span>{suggestion.defaultSpecs.cpu} CPU</span>
                <span>{suggestion.defaultSpecs.memory}GB RAM</span>
                <span>{suggestion.defaultSpecs.storage}GB Storage</span>
              </div>

              <div className={styles.suggestionReason}>
                <strong>Why:</strong> {suggestion.reason}
              </div>

              <div className={styles.suggestionTools}>
                <strong>Pre-installed:</strong> {suggestion.preInstalledTools.join(', ')}
              </div>

              <button
                className={styles.addMachineButton}
                onClick={() => {
                  handleTemplateSelect(suggestion)
                  handleAddMachine()
                }}
              >
                ➕ Add to Infrastructure
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCustomBuilder = () => (
    <div className={styles.customBuilder}>
      <div className={styles.builderHeader}>
        <h4>Custom Machine Builder</h4>
        <p>Create a custom virtual machine configuration</p>
      </div>

      <div className={styles.builderForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Machine Name</label>
            <input
              type="text"
              value={customConfig.name}
              onChange={(e) => setCustomConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., DC01, WebServer01"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Zone</label>
            <select
              value={customConfig.zone}
              onChange={(e) => setCustomConfig(prev => ({ ...prev, zone: e.target.value }))}
              className={styles.formSelect}
            >
              <option value="dmz">DMZ</option>
              <option value="internal">Internal</option>
              <option value="management">Management</option>
              <option value="isolated">Isolated</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Operating System</label>
            <select
              value={customConfig.os}
              onChange={(e) => setCustomConfig(prev => ({ ...prev, os: e.target.value }))}
              className={styles.formSelect}
            >
              <option value="Windows Server 2022">Windows Server 2022</option>
              <option value="Windows Server 2019">Windows Server 2019</option>
              <option value="Ubuntu 22.04">Ubuntu 22.04</option>
              <option value="CentOS 8">CentOS 8</option>
              <option value="Windows 11">Windows 11</option>
              <option value="Kali Linux">Kali Linux</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Role</label>
            <select
              value={customConfig.role}
              onChange={(e) => setCustomConfig(prev => ({ ...prev, role: e.target.value }))}
              className={styles.formSelect}
            >
              <option value="Domain Controller">Domain Controller</option>
              <option value="Web Server">Web Server</option>
              <option value="Database Server">Database Server</option>
              <option value="Application Server">Application Server</option>
              <option value="Workstation">Workstation</option>
              <option value="SIEM Server">SIEM Server</option>
              <option value="Jump Box">Jump Box</option>
            </select>
          </div>
        </div>

        <div className={styles.resourceSliders}>
          <div className={styles.sliderGroup}>
            <label>CPU Cores: {customConfig.cpu}</label>
            <input
              type="range"
              min="1"
              max="16"
              value={customConfig.cpu}
              onChange={(e) => setCustomConfig(prev => ({ ...prev, cpu: parseInt(e.target.value) }))}
              className={styles.slider}
            />
          </div>

          <div className={styles.sliderGroup}>
            <label>Memory: {customConfig.memory}GB</label>
            <input
              type="range"
              min="2"
              max="64"
              step="2"
              value={customConfig.memory}
              onChange={(e) => setCustomConfig(prev => ({ ...prev, memory: parseInt(e.target.value) }))}
              className={styles.slider}
            />
          </div>

          <div className={styles.sliderGroup}>
            <label>Storage: {customConfig.storage}GB</label>
            <input
              type="range"
              min="40"
              max="1000"
              step="20"
              value={customConfig.storage}
              onChange={(e) => setCustomConfig(prev => ({ ...prev, storage: parseInt(e.target.value) }))}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.builderActions}>
          <button
            className={styles.previewButton}
            disabled={!customConfig.name}
          >
            👁️ Preview
          </button>
          <button
            className={styles.createButton}
            onClick={handleAddMachine}
            disabled={!customConfig.name}
          >
            ➕ Create Machine
          </button>
        </div>
      </div>
    </div>
  )

  const renderExistingMachines = () => {
    const machines = nodes.filter(node => node.type === 'machine')

    return (
      <div className={styles.existingMachines}>
        <div className={styles.existingHeader}>
          <h4>Existing Machines ({machines.length})</h4>
          <p>Manage your current virtual machine configuration</p>
        </div>

        <div className={styles.machinesList}>
          {machines.map((machine: any) => (
            <div key={machine.id} className={styles.machineCard}>
              <div className={styles.machineHeader}>
                <div className={styles.machineTitle}>
                  <span className={styles.machineIcon}>🖥️</span>
                  {machine.name}
                </div>
                <div className={`${styles.machineStatus} ${styles[machine.status]}`}>
                  {machine.status}
                </div>
              </div>

              <div className={styles.machineDetails}>
                <div><strong>OS:</strong> {machine.config?.os || 'Unknown'}</div>
                <div><strong>Role:</strong> {machine.config?.role || 'Unknown'}</div>
                <div><strong>Zone:</strong> {machine.zone}</div>
                <div><strong>Resources:</strong> {machine.config?.cpu || 0}C/{machine.config?.memory || 0}GB/{machine.config?.storage || 0}GB</div>
              </div>

              <div className={styles.machineActions}>
                <button className={styles.machineActionButton}>⚙️ Configure</button>
                <button className={styles.machineActionButton}>📊 Monitor</button>
                <button className={styles.machineActionButton}>🔄 Restart</button>
                <button className={styles.machineActionButton}>🗑️ Delete</button>
              </div>
            </div>
          ))}

          {machines.length === 0 && (
            <div className={styles.emptyState}>
              <p>No machines configured yet</p>
              <p>Use suggestions or custom builder to add machines</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.machineConfiguration}>
      <div className={styles.configTabs}>
        <button
          className={`${styles.configTab} ${activeTab === 'suggestions' ? styles.active : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          💡 Smart Suggestions
        </button>
        <button
          className={`${styles.configTab} ${activeTab === 'custom' ? styles.active : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          🔧 Custom Builder
        </button>
        <button
          className={`${styles.configTab} ${activeTab === 'existing' ? styles.active : ''}`}
          onClick={() => setActiveTab('existing')}
        >
          📋 Existing ({nodes.filter(n => n.type === 'machine').length})
        </button>
      </div>

      <div className={styles.configContent}>
        {activeTab === 'suggestions' && renderSuggestions()}
        {activeTab === 'custom' && renderCustomBuilder()}
        {activeTab === 'existing' && renderExistingMachines()}
      </div>
    </div>
  )
}