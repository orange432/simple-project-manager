import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav"
import Link from 'next/link';

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState<number>()
  const [name, setName] = useState("")
  const [inviteCount, setInviteCount] = useState<number>()
  const [messageCount, setMessageCount] = useState(0)

  useEffect(()=>{
    getTasks()
  },[])

  const getTasks = () => {
    setLoading(true)
    fetch("/api/tasks",{credentials: "include"})
    .then(r=>r.json())
    .then(data=>{
      if(data?.code == 1) return window.location.href = "/login"
      if(data.success){
        setProjects(data.projects)
        setTasks(data.tasks.tasks)
        setInviteCount(data.inviteCount)
        setMessageCount(data.messageCount)
        setUserId(data.userId)
      }else{
        toast.error(data.error);
      }
      setLoading(false)
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
          <Nav className="justify-content-center" variant="pills" defaultActiveKey="/tasks">
            <Nav.Item>
              <Nav.Link href="/projects">Projects</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/tasks">Tasks</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/invitations">Invitations{(inviteCount)?` (${inviteCount})`:''}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/messages">Messages{(messageCount)?` (${messageCount})`:''}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/settings">Settings</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav.Item>
          </Nav>
          <h1>Tasks</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Task</th>
                <th>Status</th>
                <th>Assigned Users</th>
              </tr>
            </thead>
            <tbody>
              {(tasks.length===0)?<tr><td colSpan={4}>No Tasks available.</td></tr>
              :tasks.map(({task})=>(
                <tr key={task.taskId}>
                  <td><Link href={`/projects/${task.project.projectId}`}><a>{task.project.name}</a></Link></td>
                  <td>{task.title}</td>
                  <td>{
                  (task.status==1)?
                  'Not Started'
                  :(task.status==2)?
                  'In Progress'
                  :(task.status==3)?
                  'Testing':
                  'Complete' 
                  }</td>
                  <td>{task.users.map(({user})=>(<span key={user.userId}>{user.displayName}  </span>))}</td>
                </tr>
              ))}            
            </tbody>
          </table>
        </div>
      </main>

    </div>
  )
}
