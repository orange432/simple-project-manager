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
import Task from '../../components/Task'
import { Table } from 'react-bootstrap'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<any>({})
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState<number>()
  const [displayName, setDisplayName] = useState("")
  const [myUsername, setMyUsername] = useState("")

  const [currentTaskId, setCurrentTaskId] = useState<number>();
  
  const [editor, setEditor] = useState(false)
  const [editorTitle, setEditorTitle] = useState("")
  const [editorStatus, setEditorStatus] = useState(1)
  const [editorAssigned, setEditorAssigned] = useState([])
  
  const [show,setShow] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskStatus, setTaskStatus] = useState(1)
  const [taskAssigned, setTaskAssigned] = useState([])

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [variant, setVariant] = useState("light");
  const [commentTask, setCommentTask] = useState<any>({})

  const [notStarted, setNotStarted] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [testing, setTesting] = useState([])
  const [complete, setComplete] = useState([])

  const [showAddUser, setShowAddUser] = useState(false)
  const [username, setUsername] = useState("")

  const [showRename, setShowRename] = useState(false)
  const [rename, setRename] = useState("")

  const [tableView, setTableView] = useState(false)
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
        setTasks(data.project.tasks)
        setNotStarted(data.project.tasks.filter((task)=>(task.status===1)))
        setInProgress(data.project.tasks.filter((task)=>(task.status===2)))
        setTesting(data.project.tasks.filter((task)=>(task.status===3)
        ))
        setComplete(data.project.tasks.filter((task)=>task.status===4))
        setUserId(data.user.userId)
        setMyUsername(data.user.username)
        setDisplayName(data.user.displayName)
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

  const handleEditorAssign = (event: ChangeEvent<HTMLInputElement>) => {
    let assigned = editorAssigned.filter((item=>item!==+event.currentTarget.value))

    if(event.currentTarget.checked){
      assigned.push(+event.currentTarget.value)
    }
    setEditorAssigned(assigned);
  }

  const editTask = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const { id } = router.query
    const taskId = currentTaskId

    fetch("/api/edit-task",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        taskId,
        projectId: +id,
        title: editorTitle,
        status: editorStatus,
        assignedUsers: editorAssigned
      })
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Task updated successfully!")
        loadProject();
        setEditor(false);
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
  }

  const openEditor = (taskId: number) => {;
    setCurrentTaskId(taskId);
    const selectedTask = project.tasks.find(task=>task.taskId===taskId)
    setEditorTitle(selectedTask.title)
    setEditorStatus(selectedTask.status)
    setEditorAssigned(selectedTask.users.map(({user})=>(user.userId)))
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
    if(typeof(selectedTask)!=='undefined'){
      setCommentTask(selectedTask);
      setComments(selectedTask.comments);
    }
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

  const addUser = () => {
    const { id } = router.query
    setLoading(true);
    fetch("/api/invite-user",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({projectId: +id,username})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("User successfully invited!")
      }else{
        toast.error(data.error)
      }
      setLoading(false)
    })
  }
  
  const renameProject = () => {
    const { id } = router.query
    setLoading(true);
    fetch("/api/rename-project",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({projectId: +id,rename})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Project renamed!")
        setShowRename(false)
      }else{
        toast.error(data.error)
      }
      setLoading(false)
    })
  }

  useEffect(()=>{
    if(router.isReady){
      loadProject()
    }
  },[router.isReady])

  let content;
  if(tableView){
    content = (
      <Table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Assigned?</th>
            <th>Comment(s)</th>
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task)=>(
            <tr key={task.taskId}>
              <td>{task.title}</td>
              <td>
                {(task.status===1)?
                'Not Started'
                :(task.status===2)?
                'In Progress'
                :(task.status===3)?
                'Testing':'Complete'  
              }
              </td>
              <td>{(task.users.find(({user})=>user.userId===userId))?"Yes":"No"}</td>
              <td>{task.comments.length}</td>
              <td>
                <ButtonGroup>
                  <Button onClick={()=>openComments(task.taskId)} variant="primary">View Comments</Button>
                  <Button onClick={()=>openEditor(task.taskId)} variant="primary">Edit</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }else{
    content = (<div className="row">
    <div className="col-md-3">
      <h2 className="text-center">Not Started</h2>
      {(notStarted.length===0)?<p className="text-center">No tasks in this category</p>:
      notStarted.map((task)=>(
        <Task
          variant="light"
          key={task.taskId}
          task={task}
          openComments={()=>openComments(task.taskId)}
          openEditor={()=>openEditor(task.taskId)}
          userId={userId}
        />
      ))}
    </div>
    <div className="col-md-3">
      <h2 className="text-center">In Progress</h2>
      {(inProgress.length===0)?<p className="text-center">No tasks in this category.</p>:
      inProgress.map((task)=>(
        <Task
          variant="info"
          key={task.taskId}
          task={task}
          openComments={()=>openComments(task.taskId)}
          openEditor={()=>openEditor(task.taskId)}
          userId={userId}
        />
      ))}
    </div>
    <div className="col-md-3">
      <h2 className="text-center">Testing</h2>
      {(testing.length===0)?<p className="text-center">No tasks in this category.</p>:
      testing.map(task=>(
        <Task
          variant="warning"
          key={task.taskId}
          task={task}
          openComments={()=>openComments(task.taskId)}
          openEditor={()=>openEditor(task.taskId)}
          userId={userId}
        />
      ))}
    </div>
    <div className="col-md-3">
      <h2 className="text-center">Complete</h2>
      {(complete.length===0)?<p className="text-center">No tasks in this category.</p>:
      complete.map(task=>(
        <Task
          variant="success"
          key={task.taskId}
          task={task}
          openComments={()=>openComments(task.taskId)}
          openEditor={()=>openEditor(task.taskId)}
          userId={userId}
        />
      ))}
    </div>
  </div>)
  }

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
          <div className="text-center">
            <ButtonGroup>
              <Button onClick={()=>setShow(true)}  variant="secondary">New Task</Button>
              <Button onClick={()=>setTableView(!tableView)} variant="secondary">{(tableView)?'Switch to Board':'Switch to Table'}</Button>
              <Button onClick={()=>setShowAddUser(true)} variant="secondary">Invite User</Button>
              {(userId===project.ownerId)?
              <Button onClick={()=>setShowRename(true)} variant="secondary">Rename Project</Button>:
              <></>
              }
              <Button onClick={()=>loadProject()} variant="secondary">Refresh</Button>
              <Link href="/projects"><a className="btn btn-secondary">Back to Project List</a></Link>
            </ButtonGroup>
          </div>
          {content}
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
            <Modal.Body>
              <form onSubmit={editTask}>
                <label className="form-label">Task Title</label>
                <input required className="form-control" type="text" onChange={e=>setEditorTitle(e.target.value)} value={editorTitle}/>
                <h4>Status</h4>
                <Form.Check
                 required
                 type="radio" 
                 label="Not Started"
                 value={1}
                 name="edstatus"
                 onChange={e=>setEditorStatus(+e.target.value)}
                 checked={editorStatus===1}
                />
                <Form.Check
                  required
                 type="radio" 
                 label="In Progress"
                 value={2}
                 name="edstatus"
                 onChange={e=>setEditorStatus(+e.target.value)}
                 checked={editorStatus===2}
                />
                <Form.Check
                  required
                 type="radio" 
                 label="Testing"
                 value={3}
                 name="edstatus"
                 onChange={e=>setEditorStatus(+e.target.value)}
                 checked={editorStatus===3}
                />
                <Form.Check
                  required
                 type="radio" 
                 label="Complete"
                 value={4}
                 name="edstatus"
                 onChange={e=>setEditorStatus(+e.target.value)}
                 checked={editorStatus===4}
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
                    onChange={handleEditorAssign}
                    checked={(editorAssigned.find(u=>u===user.userId))?true:false}
                  />
                ))}
              </form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={()=>setEditor(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={editTask}>
              Update Task
            </Button>
          </Modal.Footer>
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

          {/* Add User Modal */}
          <Modal show={showAddUser} onHide={()=>setShowAddUser(false)}>
            <Modal.Header>
              <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className="form-label">Username</label>
              <input className="form-control" type="text" onChange={e=>setUsername(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>setShowAddUser(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={addUser}>
                Add User
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Rename Project Modal */}
          <Modal show={showRename} onHide={()=>setShowRename(false)}>
            <Modal.Header>
              <Modal.Title>Rename Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className="form-label">New Project Name</label>
              <input className="form-control" type="text" onChange={e=>setRename(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>setShowRename(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={renameProject}>
                Rename Project
              </Button>
            </Modal.Footer>
          </Modal>
    </div>
  )
}
