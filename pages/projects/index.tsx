import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("")

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
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
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
          <h1>Projects</h1>
          <button type="button" className="btn btn-primary" onClick={()=>setShow(true)}>Create Project</button>
          <table className="table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Users</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {(projects.length===0)?<tr><td colSpan={4}>No projects available.</td></tr>
              :projects.map(({project})=>(
                <tr key={project.projectId}>
                  <td>{project.projectId}</td>
                  <td><Link href={`/projects/${project.projectId}`}><a>{project.name}</a></Link></td>
                  <td>{project?.users.map(({user})=>(<span>{user.displayName}  </span>))}</td>
                  <td>{project.createdAt.toString()}</td>
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
