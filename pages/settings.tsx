import Head from 'next/head'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav"
import Link from 'next/link';
import { Table } from 'react-bootstrap';

type User = {
  userId: number,
  displayName: string,
  username: string
}

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [blockList, setBlocklist] = useState([]);
  const [blockedUser, setBlockedUser] = useState("")
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

  // blocks the specified user from inviting
  const blockUser = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    fetch("/api/settings/block-user",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: blockedUser})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("User successfully blocked!")
        getSettings();
      }else{
        toast.error(data.error)
        setLoading(false)
      }
    })
  }

  const unBlockUser = (username: string) => {
    setLoading(true)
    fetch("/api/settings/unblock-user",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("User successfully unblocked!")
        getSettings();
      }else{
        toast.error(data.error)
        setLoading(false)
      }
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
        <Nav variant="pills" defaultActiveKey="/settings">
            <Nav.Item>
              <Nav.Link href="/projects">Projects</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/tasks">Tasks</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/invitations">Invitations</Nav.Link>
            </Nav.Item>
            
            <Nav.Item>
                <Nav.Link href="/settings">Settings</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/logout">Logout</Nav.Link>
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
          <Form.Group className="mb-3">
            <Form.Label>New Display Name</Form.Label>
            <Form.Control type="text" required onChange={e=>setDisplayName(e.target.value)}/>
          </Form.Group>
          <Button type="submit" variant="primary">Update Display Name</Button>
        </Form>
        <h3>Blocked Users</h3>
        <p>Users blocked from inviting you</p>
        <Form onSubmit={blockUser}>
        <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" required onChange={e=>setBlockedUser(e.target.value)}/>
          </Form.Group>
          <Button type="submit" variant="primary">Block User</Button>
        </Form>
        <Table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
          {(blockList.length===0)?
            <tr><td colSpan={2}>No blocked users.</td></tr>
            :
            blockList.map((block)=>(
              <tr key={block.username}>
                <td>{block.username}</td>
                <td><Button type="button" variant="secondary" onClick={()=>unBlockUser(block.username)}>Unblock</Button></td>
              </tr>
            ))
          }
          </tbody>
        </Table>

        </div>
      </main>
    </div>
  )
}
