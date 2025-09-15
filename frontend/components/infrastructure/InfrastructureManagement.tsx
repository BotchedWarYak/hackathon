import React, { useState } from 'react'
import styles from '../../styles/Infrastructure.module.css'

interface InfrastructureManagementProps {
  event: {
    id: string
    name: string
    status: string
    totalVMs: number
    networkSegments: number
    estimatedResources: {
      cpu: number
      memory: number
      storage: number
      cost: number
    }
  }
  nodes: any[]
  onEventUpdate: (event: any) => void
}

interface DeploymentProgress {
  stage: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress: number
  estimatedTime: string
  message: string
}

interface ResourceQuota {
  type: 'cpu' | 'memory' | 'storage' | 'cost'
  used: number
  limit: number
  unit: string
}

export default function InfrastructureManagement({
  event,
  nodes,
  onEventUpdate
}: InfrastructureManagementProps) {
  const [activeSection, setActiveSection] = useState<'deployment' | 'resources' | 'monitoring'>('deployment')
  const [deploymentProgress] = useState<DeploymentProgress[]>([
    {
      stage: 'Network Configuration',
      status: 'completed',
      progress: 100,
      estimatedTime: '0 min',
      message: 'Network zones and routing configured'
    },
    {
      stage: 'Virtual Machine Provisioning',
      status: 'in_progress',
      progress: 75,
      estimatedTime: '5 min',
      message: 'Creating 8 of 12 virtual machines...'
    },
    {
      stage: 'Software Installation',
      status: 'pending',
      progress: 0,
      estimatedTime: '15 min',
      message: 'Waiting for VMs to complete provisioning'
    },
    {
      stage: 'Security Configuration',
      status: 'pending',
      progress: 0,
      estimatedTime: '10 min',
      message: 'Pending software installation completion'
    },
    {
      stage: 'Final Validation',
      status: 'pending',
      progress: 0,
      estimatedTime: '3 min',
      message: 'Pending previous stages completion'
    }
  ])

  const [resourceQuotas] = useState<ResourceQuota[]>([
    { type: 'cpu', used: 48, limit: 100, unit: 'cores' },
    { type: 'memory', used: 192, limit: 512, unit: 'GB' },
    { type: 'storage', used: 2400, limit: 5000, unit: 'GB' },
    { type: 'cost', used: 1250, limit: 5000, unit: 'USD' }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'in_progress': return '🔄'
      case 'completed': return '✅'
      case 'failed': return '❌'
      default: return '❓'
    }
  }

  const getQuotaColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) return styles.quotaDanger
    if (percentage >= 75) return styles.quotaWarning
    return styles.quotaHealthy
  }

  const renderDeploymentStatus = () => (
    <div className={styles.deploymentStatus}>
      <div className={styles.deploymentHeader}>
        <h4>Deployment Progress</h4>
        <div className={styles.deploymentActions}>
          <button className={styles.actionButton}>⏸️ Pause</button>
          <button className={styles.actionButton}>🔄 Retry Failed</button>
          <button className={`${styles.actionButton} ${styles.primary}`}>
            🚀 Deploy All
          </button>
        </div>
      </div>

      <div className={styles.progressList}>
        {deploymentProgress.map((stage, index) => (
          <div key={index} className={styles.progressItem}>
            <div className={styles.progressIcon}>
              {getStatusIcon(stage.status)}
            </div>
            <div className={styles.progressContent}>
              <div className={styles.progressTitle}>{stage.stage}</div>
              <div className={styles.progressMessage}>{stage.message}</div>
              {stage.status === 'in_progress' && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>
              )}
            </div>
            <div className={styles.progressTime}>
              {stage.status === 'in_progress' ? `~${stage.estimatedTime}` : ''}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.deploymentSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Machines:</span>
          <span className={styles.summaryValue}>{event.totalVMs}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Completed:</span>
          <span className={styles.summaryValue}>
            {nodes.filter(n => n.status === 'ready').length}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>In Progress:</span>
          <span className={styles.summaryValue}>
            {nodes.filter(n => n.status === 'building').length}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Failed:</span>
          <span className={styles.summaryValue}>
            {nodes.filter(n => n.status === 'failed').length}
          </span>
        </div>
      </div>
    </div>
  )

  const renderResourceManagement = () => (
    <div className={styles.resourceManagement}>
      <div className={styles.resourceHeader}>
        <h4>Resource Usage</h4>
        <button className={styles.refreshButton}>🔄 Refresh</button>
      </div>

      <div className={styles.quotasList}>
        {resourceQuotas.map((quota, index) => (
          <div key={index} className={styles.quotaItem}>
            <div className={styles.quotaHeader}>
              <div className={styles.quotaTitle}>
                {quota.type.charAt(0).toUpperCase() + quota.type.slice(1)}
              </div>
              <div className={styles.quotaUsage}>
                {quota.used} / {quota.limit} {quota.unit}
              </div>
            </div>
            <div className={styles.quotaBar}>
              <div
                className={`${styles.quotaFill} ${getQuotaColor(quota.used, quota.limit)}`}
                style={{ width: `${(quota.used / quota.limit) * 100}%` }}
              />
            </div>
            <div className={styles.quotaPercentage}>
              {Math.round((quota.used / quota.limit) * 100)}% used
            </div>
          </div>
        ))}
      </div>

      <div className={styles.costBreakdown}>
        <h5>Cost Breakdown</h5>
        <div className={styles.costItems}>
          <div className={styles.costItem}>
            <span>Compute (CPU/Memory)</span>
            <span>$850/month</span>
          </div>
          <div className={styles.costItem}>
            <span>Storage</span>
            <span>$200/month</span>
          </div>
          <div className={styles.costItem}>
            <span>Network</span>
            <span>$100/month</span>
          </div>
          <div className={styles.costItem}>
            <span>Licensing</span>
            <span>$300/month</span>
          </div>
          <div className={`${styles.costItem} ${styles.total}`}>
            <span><strong>Total Monthly</strong></span>
            <span><strong>$1,450</strong></span>
          </div>
        </div>
      </div>

      <div className={styles.resourceActions}>
        <button className={styles.resourceButton}>📈 Scale Up</button>
        <button className={styles.resourceButton}>📉 Scale Down</button>
        <button className={styles.resourceButton}>💾 Create Snapshot</button>
        <button className={styles.resourceButton}>🔄 Auto-Scale</button>
      </div>
    </div>
  )

  const renderMonitoring = () => (
    <div className={styles.monitoring}>
      <div className={styles.monitoringHeader}>
        <h4>Infrastructure Monitoring</h4>
        <div className={styles.monitoringControls}>
          <select className={styles.timeRange}>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button className={styles.refreshButton}>🔄 Refresh</button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>System Health</span>
            <span className={styles.metricValue}>94%</span>
          </div>
          <div className={styles.metricChart}>
            <div className={styles.chartPlaceholder}>📈 Health trend chart</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>CPU Usage</span>
            <span className={styles.metricValue}>45%</span>
          </div>
          <div className={styles.metricChart}>
            <div className={styles.chartPlaceholder}>📊 CPU usage chart</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Memory Usage</span>
            <span className={styles.metricValue}>67%</span>
          </div>
          <div className={styles.metricChart}>
            <div className={styles.chartPlaceholder}>📉 Memory usage chart</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Network Traffic</span>
            <span className={styles.metricValue}>2.4GB</span>
          </div>
          <div className={styles.metricChart}>
            <div className={styles.chartPlaceholder}>📡 Network traffic chart</div>
          </div>
        </div>
      </div>

      <div className={styles.alertsList}>
        <h5>Recent Alerts</h5>
        <div className={styles.alerts}>
          <div className={styles.alert}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertContent}>
              <div className={styles.alertTitle}>High CPU usage on WebServer01</div>
              <div className={styles.alertTime}>5 minutes ago</div>
            </div>
            <button className={styles.alertAction}>View</button>
          </div>
          <div className={styles.alert}>
            <span className={styles.alertIcon}>🔴</span>
            <div className={styles.alertContent}>
              <div className={styles.alertTitle}>DC02 is unreachable</div>
              <div className={styles.alertTime}>15 minutes ago</div>
            </div>
            <button className={styles.alertAction}>Investigate</button>
          </div>
          <div className={styles.alert}>
            <span className={styles.alertIcon}>💚</span>
            <div className={styles.alertContent}>
              <div className={styles.alertTitle}>All systems backup completed</div>
              <div className={styles.alertTime}>1 hour ago</div>
            </div>
            <button className={styles.alertAction}>Details</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.infrastructureManagement}>
      <div className={styles.managementTabs}>
        <button
          className={`${styles.managementTab} ${activeSection === 'deployment' ? styles.active : ''}`}
          onClick={() => setActiveSection('deployment')}
        >
          🚀 Deployment
        </button>
        <button
          className={`${styles.managementTab} ${activeSection === 'resources' ? styles.active : ''}`}
          onClick={() => setActiveSection('resources')}
        >
          📊 Resources
        </button>
        <button
          className={`${styles.managementTab} ${activeSection === 'monitoring' ? styles.active : ''}`}
          onClick={() => setActiveSection('monitoring')}
        >
          👁️ Monitoring
        </button>
      </div>

      <div className={styles.managementContent}>
        {activeSection === 'deployment' && renderDeploymentStatus()}
        {activeSection === 'resources' && renderResourceManagement()}
        {activeSection === 'monitoring' && renderMonitoring()}
      </div>
    </div>
  )
}