import Head from 'next/head'
import {useState, FormEvent} from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function Register() {
  const [username,setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (password !== confirmPassword) return toast.error("Passwords do not match!")
    fetch("/api/auth/register",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        displayName,
        email
      })
    })
  }
  return (
    <div>
      <Head>
        <title>Simple Project Manager</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <h1>Simple Project Manager =-</h1>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <label className="form-label">Username</label>
            <input type="text" className="form-control" onChange={e=>setUsername(e.target.value)}/>
            <label className="form-label">Email</label>
            <input type="email" className="form-control" onChange={e=>setEmail(e.target.value)}/>
            <label className="form-label">Display Name</label>
            <input type="text" className="form-control" onChange={e=>setDisplayName(e.target.value)}/>
            <label className="form-label">Password</label>
            <input type="password" className="form-control" onChange={e=>setPassword(e.target.value)}/>
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" onChange={e=>setConfirmPassword(e.target.value)}/>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          <Link href="/"><a>Back</a></Link>
        </div>
      </main>

    </div>
  )
}
