import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table"
import Nav from "react-bootstrap/Nav"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [invitations, setInvitations] = useState([]);
  const [userId, setUserId] = useState<number>()

  useEffect(()=>{
    getInvitations()
  },[])

  const getInvitations = () => {
    setLoading(true)
    fetch("/api/invitations",{credentials: "include"})
    .then(r=>r.json())
    .then(data=>{
      if(data?.code == 1) return window.location.href = "/login"
      if(data.success){
        setInvitations(data.invitations)
        setUserId(data.userId)
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
  }

  // acceptInvite accepts an invitation
  const acceptInvite = (inviteId: number) => {
    setLoading(true)
    fetch("/api/accept-invite",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({inviteId})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Invite Accepted.")
        getInvitations()
      }else{
        toast.error(data.error)
        setLoading(false)
      }
    })
  }

  // declineInvite declines an invitation
  const declineInvite = (inviteId: number) => {
    setLoading(true)
    fetch("/api/decline-invite",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({inviteId})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Invite declined.")
        getInvitations()
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
        <Nav variant="pills" defaultActiveKey="/invitations">
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
          <h1>Invitations</h1>
          <Table>
            <thead>
              <tr>
              <th>Project Name</th>
              <th>Invited By</th>
              <th>Sent At</th>
              <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              {(invitations.length===0)?
                <tr><td colSpan={3}>No invitations.</td></tr>
                :
                invitations.map((invite)=>(
                  <tr key={invite.inviteId}>
                    <td>{invite.project.name}</td>
                    <td>{invite.invitedBy.displayName}</td>
                    <td>{invite.createdAt}</td>
                    <td>
                      <Button className="mr-3" variant="secondary" onClick={()=>acceptInvite(invite.inviteId)}>Accept</Button>
                      <Button className="mr-3" variant="secondary" onClick={()=>declineInvite(invite.inviteId)}>Decline</Button>
                    </td>
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
