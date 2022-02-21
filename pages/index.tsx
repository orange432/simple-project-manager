import Head from 'next/head'
import Link from 'next/link'
import { useEffect,useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    setLoading(true)
    fetch("/api/auth/authenticate",{credentials: "include"})
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        window.location.href = "/projects"
      }else{
        setLoading(false)
      }
    })
    .catch(err=>toast.error(err))
  },[])
  if(loading) return <Loading/>
  return (
    <div>
      <Head>
        <title>Simple Project Manager</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>
        <div className="container text-center">
          <img src="/images/checklist.png" alt="" style={{maxHeight: 300}}/>
          <h1 className="mt-2">Simple Project Manager</h1>
          <p>A simple, easy to use project management system.</p>
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
