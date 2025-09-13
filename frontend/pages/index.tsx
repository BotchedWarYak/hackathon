import Head from 'next/head'
import Layout from '../components/Layout'
import UserOverview from '../components/UserOverview'
import DashboardGrid from '../components/DashboardGrid'

// Sample data
const sampleUser = {
  name: 'John Doe',
  role: 'Training Coordinator',
  organization: 'Cyber Defense Unit'
}

const sampleStats = {
  activeProjects: 3,
  upcomingEvents: 5,
  completionRate: 87
}

const sampleActivity = [
  {
    id: '1',
    type: 'event' as const,
    message: 'Red Team Exercise completed successfully',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'project' as const,
    message: 'Network Security Training updated',
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    type: 'notification' as const,
    message: 'New team member invitation sent',
    timestamp: '1 day ago'
  },
  {
    id: '4',
    type: 'event' as const,
    message: 'Infrastructure deployment completed',
    timestamp: '2 days ago'
  }
]

const sampleProjects = [
  {
    id: '1',
    name: 'Advanced Threat Detection',
    status: 'active' as const,
    progress: 73,
    participants: 12
  },
  {
    id: '2',
    name: 'Incident Response Training',
    status: 'active' as const,
    progress: 45,
    participants: 8
  },
  {
    id: '3',
    name: 'Network Security Assessment',
    status: 'pending' as const,
    progress: 0,
    participants: 15
  }
]

const sampleEvents = [
  {
    id: '1',
    name: 'Red Team vs Blue Team Exercise',
    date: 'Nov 15, 2024',
    status: 'completed' as const,
    performance: 92
  },
  {
    id: '2',
    name: 'Phishing Simulation',
    date: 'Nov 12, 2024',
    status: 'completed' as const,
    performance: 78
  },
  {
    id: '3',
    name: 'Infrastructure Penetration Test',
    date: 'Nov 20, 2024',
    status: 'scheduled' as const,
    performance: 0
  },
  {
    id: '4',
    name: 'Social Engineering Assessment',
    date: 'Nov 25, 2024',
    status: 'scheduled' as const,
    performance: 0
  }
]

const sampleTeamMembers = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Security Analyst',
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    role: 'Penetration Tester',
    status: 'active' as const
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'Incident Response Lead',
    status: 'active' as const
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Network Administrator',
    status: 'pending' as const
  },
  {
    id: '5',
    name: 'Lisa Johnson',
    role: 'Security Trainer',
    status: 'active' as const
  }
]

const sampleResourceStatus = {
  infrastructure: 'healthy' as const,
  budget: 45000,
  budgetLimit: 100000,
  systemHealth: 94
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Training Platform Dashboard</title>
        <meta name="description" content="Cybersecurity Training Management Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <UserOverview
          user={sampleUser}
          stats={sampleStats}
          recentActivity={sampleActivity}
        />
        <DashboardGrid
          projects={sampleProjects}
          recentEvents={sampleEvents}
          teamMembers={sampleTeamMembers}
          resourceStatus={sampleResourceStatus}
        />
      </Layout>
    </>
  )
}