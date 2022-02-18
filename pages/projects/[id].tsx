import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'
import Modal from "react-bootstrap/Modal"
import Button from 'react-bootstrap/Button'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any>({})
  const [show,setShow] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")

  const loadProject = () => {
    setLoading(true);
    const { id } = router.query;
    fetch(`/api/projects/${id}`,{
      credentials: "include"
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        setProject(data.project)
      }else{
        if(data?.code===1) return window.location.href="/login"
        toast.error(data.error)
      }
      setLoading(false)
    })
  }

  useEffect(()=>{
    loadProject()
  })

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
          <h1>{project.name}</h1>
        </div>
      </main>
      <Modal show={show} onHide={()=>setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className="form-label">Task Title</label>
              <input className="form-control" type="text" onChange={e=>setTaskTitle(e.target.value)}/>
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
