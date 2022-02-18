import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Simple Project Manager</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="container text-center">
          <h1>Simple Project Manager</h1>
          <div className="text-center mb-3">
            <Link href="/login"><a className="btn btn-primary">Login</a></Link>
          </div>
          <div className="text-center">
            <Link href="/register"><a className="btn btn-secondary">Register</a></Link>
          </div>
        </div>
      </main>

    </div>
  )
}
