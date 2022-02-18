import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'
import Modal from "react-bootstrap/Modal"
import Button from 'react-bootstrap/Button'
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Alert from "react-bootstrap/Alert"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any>({})
  
  const [editor, setEditor] = useState(false)
  const [editorTitle, setEditorTitle] = useState("")
  const [editorStatus, setEditorStatus] = useState(1)
  const [editorAssigned, setEditorAssigned] = useState([])
  
  const [show,setShow] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskStatus, setTaskStatus] = useState(1)
  const [taskAssigned, setTaskAssigned] = useState([])

  const [showComments, setShowComments] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number>();
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [variant, setVariant] = useState("light");
  const [commentTask, setCommentTask] = useState<any>({})

  const [notStarted, setNotStarted] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [testing, setTesting] = useState([])
  const [complete, setComplete] = useState([])

  useEffect(()=>{
    refreshComments(currentTaskId)
  },[project.tasks])

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
        projectId: +id,
        title: taskTitle,
        status: taskStatus,
        assignedUsers: taskAssigned
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
      if(data.success){
        setProject(data.project)
        setNotStarted(data.project.tasks.filter((task)=>(task.status===1)))
        setInProgress(data.project.tasks.filter((task)=>(task.status===2)))
        setTesting(data.project.tasks.filter((task)=>(task.status===3)
        ))
        setComplete(data.project.tasks.filter((task)=>task.status===4))
        console.log(testing)
      }else{
        if(data?.code===1) return window.location.href="/login"
        toast.error(data.error)
      }
      setLoading(false)
    })
  }

  const handleAssign = (event: ChangeEvent<HTMLInputElement>) => {
    let cleaned = taskAssigned.filter((item)=>item!== +event.currentTarget.value)
    if(event.currentTarget.checked){
      cleaned.push(+event.currentTarget.value)
    }
    setTaskAssigned(cleaned)
  }

  const editTask = (taskId: number) => {
    setLoading(true)
    const { id } = router.query;

    fetch("/api/edit-task",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        taskId,
        projectId: +id,
        title: taskTitle,
        status: taskStatus,
        assignedUsers: taskAssigned
      })
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Task updated successfully!")
        loadProject();
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
  }

  const openEditor = (taskId: number) => {
    setEditor(true);
  }

  const openComments = (taskId: number) => {
    setCurrentTaskId(taskId)
    refreshComments(taskId);
    setShowComments(true);
  }

  const refreshComments = (taskId: number) => {
    if(typeof(project.tasks) === 'undefined'){
      return;
    }
    const selectedTask = project.tasks.find(task=>task.taskId===taskId)
    console.log(selectedTask)
    setCommentTask(selectedTask);
    setComments(selectedTask.comments);
  }

  const createComment = (event: FormEvent) => {
    event.preventDefault()
    const taskId = commentTask.taskId
    const { id } = router.query;
    fetch("/api/create-comment",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        taskId,
        projectId: +id,
        comment,
        variant
      })
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Comment added successfully!")
        setComment("");
        loadProject();
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
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
          <Button className="mr-4" onClick={()=>setShow(true)} variant="secondary">New Task</Button>
          <Link href="/projects"><a className="btn btn-primary">Back to Project List</a></Link>
          <div className="row">
            <div className="col-md-3">
              <h2 className="text-center">Not Started</h2>
              {(notStarted.length===0)?<p className="text-center">No tasks in this category</p>:
              notStarted.map((task)=>(
                <Card
                  bg="light"
                  key={task.taskId}
                  text="dark"
                >
                  <Card.Header>Task - <ButtonGroup>
                    <Button variant="secondary" onClick={()=>openComments(task.taskId)}>View</Button>
                    <Button variant="secondary" onClick={()=>openEditor(task.taskId)}>Edit</Button>
                    </ButtonGroup></Card.Header>
                  <Card.Body>
                    <h3 className="text-center">{task.title}</h3>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className="col-md-3">
              <h2 className="text-center">In Progress</h2>
              {(inProgress.length===0)?<p className="text-center">No tasks in this category.</p>:
              inProgress.map((task)=>(
                <Card
                  bg="info"
                  key={task.taskId}
                  text="white"
                >
                  <Card.Header>Task - <ButtonGroup>
                    <Button variant="secondary" onClick={()=>openComments(task.taskId)}>View</Button>
                    <Button variant="secondary" onClick={()=>openEditor(task.taskId)}>Edit</Button>
                    </ButtonGroup></Card.Header>
                  <Card.Body>
                    <h3 className="text-center">{task.title}</h3>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className="col-md-3">
              <h2 className="text-center">Testing</h2>
              {(testing.length===0)?<p className="text-center">No tasks in this category.</p>:
              testing.map(task=>(
                <Card
                  bg="warning"
                  key={task.taskId}
                  text="white"
                >
                  <Card.Header>Task - <ButtonGroup>
                    <Button variant="secondary" onClick={()=>openComments(task.taskId)}>View</Button>
                    <Button variant="secondary" onClick={()=>openEditor(task.taskId)}>Edit</Button>
                    </ButtonGroup></Card.Header>
                  <Card.Body>
                    <h3 className="text-center">{task.title}</h3>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className="col-md-3">
              <h2 className="text-center">Complete</h2>
              {(complete.length===0)?<p className="text-center">No tasks in this category.</p>:
              complete.map(task=>(
                <Card
                  bg="success"
                  key={task.taskId}
                  text="white"
                >
                  <Card.Header>Task - <ButtonGroup>
                    <Button variant="secondary" onClick={()=>openComments(task.taskId)}>View</Button>
                    <Button variant="secondary" onClick={()=>openEditor(task.taskId)}>Edit</Button>
                    </ButtonGroup></Card.Header>
                  <Card.Body>
                    <h3 className="text-center">{task.title}</h3>
                  </Card.Body>
                </Card>
              ))}
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
                <input required className="form-control" type="text" onChange={e=>setTaskTitle(e.target.value)}/>
                <h4>Status</h4>
                <Form.Check
                 required
                 type="radio" 
                 label="Not Started"
                 value={1}
                 name="status"
                 onChange={e=>setTaskStatus(+e.target.value)}
                />
                <Form.Check
                  required
                 type="radio" 
                 label="In Progress"
                 value={2}
                 name="status"
                 onChange={e=>setTaskStatus(+e.target.value)}
                />
                <Form.Check
                  required
                 type="radio" 
                 label="Testing"
                 value={3}
                 name="status"
                 onChange={e=>setTaskStatus(+e.target.value)}
                />
                <Form.Check
                  required
                 type="radio" 
                 label="Complete"
                 value={4}
                 name="status"
                 onChange={e=>setTaskStatus(+e.target.value)}
                />
                <h4>Assign Users</h4>
                {(project.users.length===0)?<p>No available users</p>:
                project.users.map(({user})=>(
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

          {/* Editor Modal */}
          <Modal show={editor} onHide={()=>setEditor(false)}>
            <Modal.Header>
              <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
          </Modal>

          {/* Comments Modal */}
          <Modal show={showComments} onHide={()=>setShowComments(false)}>
            <Modal.Header>
              <Modal.Title>{commentTask.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h2>Comments</h2>
              <div>
                <form onSubmit={createComment}>
                <label className="form-label">Your Comment</label>
                <textarea className="form-control mb-4" onChange={e=>setComment(e.target.value)} value={comment}></textarea>
                <Form.Select className="mb-4" onChange={e=>setVariant(e.target.value)} aria-label="Message Variant">
                  <option value="light">Plain</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="danger">Danger</option>
                  <option value="success">Success</option>
                </Form.Select>
                <Button className="mb-4" type="submit" variant="primary">Add Comment</Button>
                </form>
              </div>
              {(comments.length===0)?<p>No comments.</p>:
              comments.map((comment)=>(
                <Alert key={comment.commentId} variant={`${(comment.variant)?comment.variant:'light'}`}>
                  <Alert.Heading>{comment.user.displayName}</Alert.Heading>
                  <p>{comment.content}</p>
                </Alert>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>setShowComments(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
    </div>
  )
}
