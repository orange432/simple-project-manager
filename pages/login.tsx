import Head from 'next/head'
import {useState, FormEvent} from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [username,setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    fetch("/api/auth/login",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        window.location.href = "/projects"
      }else{
        toast.error(data.error)
        setLoading(false)
      }
    })
    .catch(err=>toast.error(err))

  }

  if(loading) return <Loading/>
  return (
    <div>
      <Head>
        <title>Simple Project Manager</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <div className="container">
          <h1>Simple Project Manager</h1>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label className="form-label">Username</label>
            <input type="text" className="form-control" onChange={e=>setUsername(e.target.value)}/>
            <label className="form-label">Password</label>
            <input type="password" className="form-control" onChange={e=>setPassword(e.target.value)}/>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          <Link href="/"><a>Back</a></Link>
        </div>
      </main>

    </div>
  )
}
