import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table"
import Nav from "react-bootstrap/Nav"
import Link from 'next/link';

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [invitations, setInvitations] = useState([]);
  const [userId, setUserId] = useState<number>()
  const [name, setName] = useState("")

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

  const acceptInvite = (inviteId: number) => {
    setLoading(true)
  }

  const declineInvite = (inviteId: number) => {
    setLoading(true)
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
                <Nav.Link active>Invitations</Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/settings">
                <Nav.Link>Settings</Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>
          <h1>Invitations</h1>
          <Table>
            <thead>
              <th>Project Name</th>
              <th>Invited By</th>
              <th>Sent At</th>
              <th>Controls</th>
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
