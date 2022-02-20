import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav"
import Link from 'next/link';

import {format, formatDistance} from "date-fns"

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState<number>()
  const [name, setName] = useState("")
  const [inviteCount, setInviteCount] = useState<number>()

  useEffect(()=>{
    getProjects()
  },[])

  const getProjects = () => {
    setLoading(true)
    fetch("/api/projects",{credentials: "include"})
    .then(r=>r.json())
    .then(data=>{
      if(data?.code == 1) return window.location.href = "/login"
      if(data.success){
        setProjects(data.projects)
        setInviteCount(data.inviteCount)
        setUserId(data.userId)
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
    .catch(err=>toast.error(err))
  }

  const createProject = () => {
    if(!name) return toast.error("Please enter a valid name.")
    setLoading(true)
    fetch("/api/create-project",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Project successfully created!")
        getProjects()
        setShow(false)
      }else{
        toast.error(data.error);
      }
      setLoading(false);
    })
  }

  if (loading) return <Loading/>
  return (
    <div>
      <Head>
        <title>Simple Project Manager</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <Nav variant="pills" className="justify-content-center" defaultActiveKey="/projects">
            <Nav.Item>
              <Nav.Link href="/projects">Projects</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/invitations">Invitations{(inviteCount)?` (${inviteCount})`:''}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/tasks">Tasks</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/settings">Settings</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav.Item>
          </Nav>
          <h1>Projects</h1>
          <Button type="button" variant="primary" onClick={()=>setShow(true)}>Create Project</Button>
          <table className="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>User(s)</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {(projects.length===0)?<tr><td colSpan={4}>No projects available.</td></tr>
              :projects.map(({project})=>(
                <tr key={project.projectId}>
                  <td>{project.projectId}</td>
                  <td><Link href={`/projects/${project.projectId}`}><a>{project.name}</a></Link></td>
                  <td>{project?.users.map(({user})=>(<><span style={{textDecoration: "underline"}} key={user.userId}>{user.displayName}</span>&nbsp;</>))}</td>
                  <td>{formatDistance(new Date(project.createdAt), new Date(), {addSuffix: true})} ({format(new Date(project.createdAt),"dd/MM/yyyy")})</td>
                </tr>
              ))}            
            </tbody>
          </table>
          <Modal show={show} onHide={()=>setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className="form-label">Name</label>
              <input className="form-control" type="text" onChange={e=>setName(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShow(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={createProject}>
              Create Project
            </Button>
          </Modal.Footer>
          </Modal>
        </div>
      </main>

    </div>
  )
}
