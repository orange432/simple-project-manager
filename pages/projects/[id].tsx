import Head from 'next/head'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'
import Modal from "react-bootstrap/Modal"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any>({})
  const [show,setShow] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskStatus, setTaskStatus] = useState(1)

  // createTask creates a task
  const createTask = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const { id } = router.query;

    fetch("/api/create-task",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectId: id,
        title: taskTitle,
        status: taskStatus
      })
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Task created successfully!")
        loadProject();
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
  }

  // loadProject loads the current project
  const loadProject = () => {
    setLoading(true);
    const { id } = router.query;
    fetch(`/api/projects/${id}`,{
      credentials: "include"
    })
    .then(r=>r.json())
    .then(data=>{
      console.log(data);
      if(data.success){
        setProject(data.project)
      }else{
        if(data?.code===1) return window.location.href="/login"
        toast.error(data.error)
      }
      setLoading(false)
    })
  }

  const handleAssign = (event: ChangeEvent) => {

  }

  useEffect(()=>{
    if(router.isReady){
      loadProject()
    }
  },[router.isReady])

  if(loading) return <Loading/>
  return (
    <div>
      <Head>
        <title>Simple Project Manager</title>
        <meta name="description" content="A simple project management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <h1 className="text-center">{project.name}</h1>
          <Button onClick={()=>setShow(true)} variant="secondary">New Task</Button>
          <div className="row">
            <div className="col-md-3">
              <h2 className="text-center">Not Started</h2>
            </div>
            <div className="col-md-3">
              <h2 className="text-center">In Progress</h2>
            </div>
            <div className="col-md-3">
              <h2 className="text-center">Testing</h2>
            </div>
            <div className="col-md-3">
              <h2 className="text-center">Complete</h2>
            </div>
          </div>
        </div>
      </main>
      <Modal show={show} onHide={()=>setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={createTask}>
                <label className="form-label">Task Title</label>
                <input className="form-control" type="text" onChange={e=>setTaskTitle(e.target.value)}/>
                <h4>Status</h4>
                <Form.Check
                 checked
                 type="radio" 
                 label="Not Started"
                 value={1}
                 name="status"
                 onChange={e=>setTaskStatus(+e.target.value)}
                />
                <Form.Check
                 type="radio" 
                 label="In Progress"
                 value={2}
                 name="status"
                 onChange={e=>setTaskStatus(+e.target.value)}
                />
                <Form.Check
                 type="radio" 
                 label="Testing"
                 value={3}
                 name="status"
                 onChange={e=>setTaskStatus(+e.target.value)}
                />
                <Form.Check
                 type="radio" 
                 label="Complete"
                 value={4}
                 name="status"
                 onChange={e=>setTaskStatus(+e.target.value)}
                />
                <h4>Assign Users</h4>
                {project.users.map(({user})=>(
                  <Form.Check
                    key={user.userId}
                    type="checkbox"
                    label={`${user.displayName} (${user.username})`}
                    value={user.userId}
                    name="assigned"
                    onChange={handleAssign}
                  />
                ))}
              </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShow(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={createTask}>
              Create Task
            </Button>
          </Modal.Footer>
          </Modal>
    </div>
  )
}
