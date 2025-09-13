import { useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const [message, setMessage] = useState('')

  return (
    <>
      <Head>
        <title>Hackathon App</title>
        <meta name="description" content="Full-stack app with Next.js, FastAPI, and SpacetimeDB" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Hackathon App
        </h1>

        <div className={styles.description}>
          <p>Full-stack application with Next.js, FastAPI, and SpacetimeDB</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Chat &rarr;</h2>
            <p>Start chatting with the Gemini AI</p>
          </div>

          <div className={styles.card}>
            <h2>Users &rarr;</h2>
            <p>Manage users and permissions</p>
          </div>

          <div className={styles.card}>
            <h2>Database &rarr;</h2>
            <p>Real-time data with SpacetimeDB</p>
          </div>

          <div className={styles.card}>
            <h2>API &rarr;</h2>
            <p>FastAPI backend integration</p>
          </div>
        </div>
      </main>
    </>
  )
}