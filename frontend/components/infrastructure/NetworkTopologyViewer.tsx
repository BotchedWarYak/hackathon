import React, { useState } from 'react'
import styles from '../../styles/Infrastructure.module.css'

interface NetworkNode {
  id: string
  name: string
  type: 'zone' | 'machine' | 'network'
  zone: string
  x: number
  y: number
  status: 'planned' | 'building' | 'ready' | 'failed'
  connections: string[]
  config?: any
}

interface InfrastructureTemplate {
  id: string
  name: string
  description: string
  type: string
  networkZones: string[]
  defaultMachines: NetworkNode[]
  estimatedCost: number
}

interface NetworkTopologyViewerProps {
  nodes: NetworkNode[]
  onNodeUpdate: (nodeId: string, updates: Partial<NetworkNode>) => void
  templates: InfrastructureTemplate[]
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
}

export default function NetworkTopologyViewer({
  nodes,
  onNodeUpdate,
  templates,
  selectedTemplate,
  onTemplateSelect
}: NetworkTopologyViewerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual')

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return '#ffd700'
      case 'building': return '#ff8c00'
      case 'ready': return '#32cd32'
      case 'failed': return '#ff4757'
      default: return '#cccccc'
    }
  }

  const getZoneColor = (zone: string) => {
    const zoneColors: Record<string, string> = {
      dmz: '#ff6b6b',
      internal: '#4ecdc4',
      management: '#45b7d1',
      isolated: '#f9ca24',
      external: '#6c5ce7'
    }
    return zoneColors[zone] || '#95a5a6'
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
  }

  const handleNodeDrag = (nodeId: string, x: number, y: number) => {
    onNodeUpdate(nodeId, { x, y })
  }

  const renderVisualTopology = () => (
    <div className={styles.topologyCanvas}>
      <svg
        width="100%"
        height="400"
        viewBox="0 0 600 400"
        className={styles.topologySvg}
      >
        {/* Render connections */}
        {nodes.map(node =>
          node.connections.map(connectionId => {
            const targetNode = nodes.find(n => n.id === connectionId)
            if (!targetNode) return null

            return (
              <line
                key={`${node.id}-${connectionId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="#cbd5e0"
                strokeWidth="2"
                strokeDasharray={node.type === 'zone' ? '5,5' : 'none'}
              />
            )
          })
        )}

        {/* Render nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.type === 'zone' ? 40 : 25}
              fill={node.type === 'zone' ? getZoneColor(node.zone) : getNodeStatusColor(node.status)}
              stroke={selectedNode === node.id ? '#667eea' : '#ffffff'}
              strokeWidth={selectedNode === node.id ? 3 : 2}
              className={styles.topologyNode}
              onClick={() => handleNodeClick(node.id)}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              pointerEvents="none"
            >
              {node.name.split(' ')[0]}
            </text>
            {node.type === 'machine' && (
              <text
                x={node.x}
                y={node.y + 60}
                textAnchor="middle"
                fill="#4a5568"
                fontSize="10"
                pointerEvents="none"
              >
                {node.config?.os || 'Unknown OS'}
              </text>
            )}
          </g>
        ))}
      </svg>

      {selectedNode && (
        <div className={styles.nodeDetails}>
          {(() => {
            const node = nodes.find(n => n.id === selectedNode)
            if (!node) return null

            return (
              <div className={styles.nodeDetailsCard}>
                <h4>{node.name}</h4>
                <div className={styles.nodeInfo}>
                  <div><strong>Type:</strong> {node.type}</div>
                  <div><strong>Zone:</strong> {node.zone}</div>
                  <div><strong>Status:</strong> {node.status}</div>
                  {node.config && (
                    <>
                      <div><strong>OS:</strong> {node.config.os}</div>
                      <div><strong>Role:</strong> {node.config.role}</div>
                    </>
                  )}
                </div>
                <div className={styles.nodeActions}>
                  <button
                    className={styles.nodeActionButton}
                    onClick={() => onNodeUpdate(node.id, { status: 'building' })}
                  >
                    🔄 Build
                  </button>
                  <button className={styles.nodeActionButton}>
                    ⚙️ Configure
                  </button>
                  <button className={styles.nodeActionButton}>
                    🗑️ Remove
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )

  const renderListView = () => (
    <div className={styles.nodesList}>
      {nodes.map(node => (
        <div
          key={node.id}
          className={`${styles.nodeListItem} ${selectedNode === node.id ? styles.selected : ''}`}
          onClick={() => handleNodeClick(node.id)}
        >
          <div className={styles.nodeListIcon}>
            {node.type === 'zone' ? '🌐' : '🖥️'}
          </div>
          <div className={styles.nodeListContent}>
            <div className={styles.nodeListName}>{node.name}</div>
            <div className={styles.nodeListMeta}>
              {node.type} • {node.zone} • {node.status}
            </div>
          </div>
          <div className={`${styles.nodeListStatus} ${styles[node.status]}`}>
            {node.status === 'planned' && '⏳'}
            {node.status === 'building' && '🔄'}
            {node.status === 'ready' && '✅'}
            {node.status === 'failed' && '❌'}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className={styles.networkTopologyViewer}>
      <div className={styles.topologyHeader}>
        <div className={styles.topologyTitle}>
          <h3>Network Topology</h3>
          <p>Design your training network infrastructure</p>
        </div>

        <div className={styles.topologyControls}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'visual' ? styles.active : ''}`}
              onClick={() => setViewMode('visual')}
            >
              🗺️ Visual
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
          </div>

          <button
            className={styles.templatesButton}
            onClick={() => setShowTemplates(true)}
          >
            📄 Templates
          </button>

          <button className={styles.addZoneButton}>
            ➕ Add Zone
          </button>
        </div>
      </div>

      <div className={styles.topologyContent}>
        {viewMode === 'visual' ? renderVisualTopology() : renderListView()}
      </div>

      {showTemplates && (
        <div className={styles.templatesModal}>
          <div className={styles.templatesOverlay} onClick={() => setShowTemplates(false)} />
          <div className={styles.templatesContent}>
            <div className={styles.templatesHeader}>
              <h3>Infrastructure Templates</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowTemplates(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.templatesList}>
              {templates.map(template => (
                <div
                  key={template.id}
                  className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.selected : ''}`}
                  onClick={() => onTemplateSelect(template.id)}
                >
                  <div className={styles.templateHeader}>
                    <h4>{template.name}</h4>
                    <span className={styles.templateCost}>${template.estimatedCost}</span>
                  </div>
                  <p className={styles.templateDescription}>{template.description}</p>
                  <div className={styles.templateZones}>
                    <strong>Zones:</strong> {template.networkZones.join(', ')}
                  </div>
                  <button
                    className={styles.templateApplyButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTemplateSelect(template.id)
                      setShowTemplates(false)
                    }}
                  >
                    Apply Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.topologyLegend}>
        <h4>Legend</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.zoneColor}`} />
            <span>Network Zones</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.machineColor}`} />
            <span>Virtual Machines</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.plannedColor}`} />
            <span>Planned</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.readyColor}`} />
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}