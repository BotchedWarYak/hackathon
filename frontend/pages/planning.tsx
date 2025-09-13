import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import EventCard from '../components/EventCard'
import EventWizard from '../components/EventWizard'
import styles from '../styles/EventPlanning.module.css'

interface Event {
  id: string
  name: string
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  startDate: string
  endDate: string
  participantCount: number
  organizaiton: string
  description: string
  type: string
}

const sampleEvents: Event[] = [
  {
    id: '1',
    name: 'Advanced Threat Detection Exercise',
    status: 'scheduled',
    startDate: '2024-11-20',
    endDate: '2024-11-22',
    participantCount: 45,
    organizaiton: 'Cyber Defense Unit',
    description: 'Multi-day exercise focusing on advanced persistent threat detection and response',
    type: 'Red Team vs Blue Team'
  },
  {
    id: '2',
    name: 'Incident Response Training',
    status: 'active',
    startDate: '2024-11-15',
    endDate: '2024-11-15',
    participantCount: 12,
    organizaiton: 'SOC Team',
    description: 'Hands-on incident response simulation with real-world scenarios',
    type: 'Tabletop Exercise'
  },
  {
    id: '3',
    name: 'Network Defense Bootcamp',
    status: 'draft',
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    participantCount: 25,
    organizaiton: 'IT Security',
    description: 'Comprehensive network defense training covering monitoring, detection, and response',
    type: 'Training Exercise'
  },
  {
    id: '4',
    name: 'Social Engineering Assessment',
    status: 'completed',
    startDate: '2024-11-10',
    endDate: '2024-11-10',
    participantCount: 100,
    organizaiton: 'All Departments',
    description: 'Organization-wide phishing and social engineering awareness exercise',
    type: 'Red Team Exercise'
  }
]

export default function EventPlanning() {
  const [showWizard, setShowWizard] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredEvents = sampleEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEventCreated = (eventData: any) => {
    console.log('New event created:', eventData)
    setShowWizard(false)
  }

  if (showWizard) {
    return (
      <Layout>
        <EventWizard
          onComplete={handleEventCreated}
          onCancel={() => setShowWizard(false)}
        />
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Event Planning - Training Platform</title>
        <meta name="description" content="Create and manage cybersecurity training events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className={styles.eventPlanningPage}>
          <header className={styles.pageHeader}>
            <div className={styles.titleSection}>
              <h1>Event Planning</h1>
              <p>Create and manage cybersecurity training events</p>
            </div>
            <button
              className={styles.newEventButton}
              onClick={() => setShowWizard(true)}
            >
              ➕ New Event
            </button>
          </header>

          <div className={styles.filtersSection}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.statusFilter}>
              <label>Filter by status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Events</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className={styles.eventsGrid}>
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}

            {filteredEvents.length === 0 && (
              <div className={styles.noEvents}>
                <p>No events found matching your criteria.</p>
                <button
                  className={styles.createFirstEventButton}
                  onClick={() => setShowWizard(true)}
                >
                  Create your first event
                </button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}