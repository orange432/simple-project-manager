import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav"
import Link from 'next/link';
import { format, formatDistance } from 'date-fns';

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState<number>()
  const [name, setName] = useState("")
  const [inviteCount, setInviteCount] = useState<number>()
  const [messageCount, setMessageCount] = useState(0)
  const [sortState, setSortState] = useState([0,0,0,0,0])

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

  const sortTable = (column: number) =>{
    switch(column){
      case 0:
        if(sortState[column]){
          // Swap state
          let flip = sortState
          flip[column] = 0
          setSortState(flip);
          let sorted = [...tasks]
          sorted.sort((a,b)=>{
            if(a.task.project.name < b.task.project.name) return -1
            if(a.task.project.name > b.task.project.name) return 1;
            return 0
          })
          setTasks(sorted);
        }else{
          let flip = sortState
          flip[column] = 1
          setSortState(flip);
          let sorted = [...tasks]
          sorted.sort((a,b)=>{
            if(a.task.project.name > b.task.project.name) return -1
            if(a.task.project.name < b.task.project.name) return 1;
            return 0
          })
          setTasks(sorted);
        }
        break;
      case 1:
        if(sortState[column]){
          // Swap state
          let flip = sortState
          flip[column] = 0
          setSortState(flip);
          let sorted = [...tasks]
          sorted.sort((a,b)=>{
            if(a.task.title < b.task.title) return -1
            if(a.task.title > b.task.title) return 1;
            return 0
          })
          setTasks(sorted);
        }else{
          let flip = sortState
          flip[column] = 1
          setSortState(flip);
          let sorted = [...tasks]
          sorted.sort((a,b)=>{
            if(a.task.title > b.task.title) return -1
            if(a.task.title < b.task.title) return 1;
            return 0
          })
          setTasks(sorted);
        }
        break;
      case 2:
        if(sortState[column]){
          // Swap state
          let flip = sortState
          flip[column] = 0
          setSortState(flip);
          let sorted = [...tasks]
          sorted.sort((a,b)=>{
            if(a.task.status < b.task.status) return -1
            if(a.task.status > b.task.status) return 1;
            return 0
          })
          setTasks(sorted);
        }else{
          let flip = sortState
          flip[column] = 1
          setSortState(flip);
          let sorted = [...tasks]
          sorted.sort((a,b)=>{
            if(a.task.status > b.task.status) return -1
            if(a.task.status < b.task.status) return 1;
            return 0
          })
          setTasks(sorted);
        }
        break
      case 4:
        if(sortState[column]){
          // Swap state
          let flip = sortState
          flip[column] = 0
          setSortState(flip);
          let sorted = [...tasks]
          sorted.sort((a,b)=>{
            if(a.task.createdAt < b.task.createdAt) return -1
            if(a.task.createdAt > b.task.createdAt) return 1;
            return 0
          })
          setTasks(sorted);
        }else{
          let flip = sortState
          flip[column] = 1
          setSortState(flip);
          let sorted = [...tasks]
          sorted.sort((a,b)=>{
            if(a.task.createdAt > b.task.createdAt) return -1
            if(a.task.createdAt < b.task.createdAt) return 1;
            return 0
          })
          setTasks(sorted);
        }
        break;
      case 3:
        break;
    }
  }

  if (loading) return <Loading/>
  return (
    <div>
      <Head>
        <title>Simple Project Manager</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.png" />
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
                <th style={{cursor: "pointer"}} onClick={()=>sortTable(0)}>Project</th>
                <th style={{cursor: "pointer"}} onClick={()=>sortTable(1)}>Task</th>
                <th style={{cursor: "pointer"}} onClick={()=>sortTable(2)}>Status</th>
                <th>Assigned Users</th>
                <th style={{cursor: "pointer"}} onClick={()=>sortTable(4)}>Created</th>
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
                  <td>{formatDistance(new Date(task.createdAt), new Date(), {addSuffix: true})} ({format(new Date(task.createdAt),"dd/MM/yyyy")})</td>
                </tr>
              ))}            
            </tbody>
          </table>
        </div>
      </main>

    </div>
  )
}
