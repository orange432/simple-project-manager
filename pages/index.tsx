import Head from 'next/head'
import Image from 'next/image'
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

      <main>
        <div className="container">
          <h1>Simple Project Manager</h1>
          <Link href="/login"><a className="btn btn-primary">Login</a></Link>
          <Link href="/register"><a className="btn btn-primary">Register</a></Link>
        </div>
      </main>

    </div>
  )
}
