import Head from 'next/head'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav"
import Link from 'next/link';

type User = {
  userId: number,
  displayName: string,
  username: string
}

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [blockList, setBlocklist] = useState([]);
  const [user, setUser] = useState<User>()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const [displayName, setDisplayName] = useState("")

  useEffect(()=>{
    getSettings()
  },[])

  const getSettings = () => {
    setLoading(true)
    fetch("/api/settings",{credentials: "include"})
    .then(r=>r.json())
    .then(data=>{
      if(data?.code == 1) return window.location.href = "/login"
      if(data.success){
        setBlocklist(data.blocklist)
        setUser(data.user)
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
  }

  // changePassword changes the users current password
  const changePassword = (event: FormEvent) => {
    event.preventDefault()
    if(newPassword!==confirmNewPassword) return toast.error("Passwords do not match!")
    setLoading(true);
    fetch("/api/settings/change-password",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({newPassword, currentPassword})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Password updated!")
      }else{
        toast.error(data.error)
      }
      setLoading(false)
    })
  }

  const changeDisplayName = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true)
    fetch("/api/settings/change-display-name",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({displayName})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Password updated!")
      }else{
        toast.error(data.error)
      }
      setLoading(false)
    })
  }


  if (loading) return <Loading/>;
  
  return (
    <div>
      <Head>
        <title>Simple Project Manager</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <Nav>
            <Nav.Item>
              <Link href="/projects">
                <Nav.Link>Projects</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/invitations">
                <Nav.Link>Invitations</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/settings">
                <Nav.Link active>Settings</Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>
          <h1>Settings</h1>
        

        <Form onSubmit={changePassword}>
          <h4>Change Password</h4>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" required onChange={e=>setCurrentPassword(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" required onChange={e=>setNewPassword(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" required onChange={e=>setConfirmNewPassword(e.target.value)}/>
          </Form.Group>
          <Button type="submit" variant="primary">Change Password</Button>
        </Form>

        <Form onSubmit={changeDisplayName}>
          <h4>Change Display Name</h4>
          <Form.Group>
            <Form.Label>New Display Name</Form.Label>
            <Form.Control type="text" required onChange={e=>setDisplayName(e.target.value)}/>
          </Form.Group>
          <Button type="submit" variant="primary">Update Display Name</Button>
        </Form>
        </div>
      </main>
    </div>
  )
}
