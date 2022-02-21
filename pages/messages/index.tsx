import Head from 'next/head'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Modal from 'react-bootstrap/Modal'
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from 'react-bootstrap/Button';
import Nav from "react-bootstrap/Nav"
import Link from 'next/link';
import { format } from 'date-fns';

export default function Home() {
  const [show, setShow] = useState(false);
  const [messageContent, setMessageContent] = useState("")
  const [username, setUsername] = useState("")

  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [receivedMessages, setReceivedMessages] = useState([])
  const [sentMessages, setSentMessages] = useState([])
  const [userId, setUserId] = useState<number>()
  const [inviteCount, setInviteCount] = useState<number>()

  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<any>()

  const [viewSent, setViewSent] = useState(false);

  useEffect(()=>{
    getMessages()
  },[])

  const getMessages = () => {
    setLoading(true)
    fetch("/api/messages",{credentials: "include"})
    .then(r=>r.json())
    .then(data=>{
      if(data?.code == 1) return window.location.href = "/login"
      if(data.success){
        setMessages(data.messages)
        setInviteCount(data.inviteCount)
        setUserId(data.userId)
        let received = data.messages.filter(message=>(message.receiverId===data.userId))
        setReceivedMessages(received)
        let sent = data.messages.filter(message=>(message.senderId===data.userId))
        setSentMessages(sent)
      }else{
        toast.error(data.error);
      }
      setLoading(false)
    })
  }

  const viewMessage = (messageId: number) => {
    let search = messages.find(message=>message.messageId===messageId)
    setCurrentMessage(search)
    setShowMessage(true)
  }

  const markAsRead = (messageId: number) => {
    setLoading(true)
    fetch("/api/messages/mark-as-read",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({messageId})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Message updated succesfully!")
        getMessages();
      }else{
        toast.error(data.error)
        setLoading(false);
      }
    })
  }
  
  const deleteMessage = (messageId: number) => {
    setLoading(true)
    fetch("/api/messages/delete",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({messageId})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Message deleted succesfully!")
        getMessages();
      }else{
        toast.error(data.error)
        setLoading(false);
      }
    })
  }

  const sendMessage = () => {
    if(!username || !messageContent) return toast.error("Please enter a username and message content.")
    setLoading(true)
    fetch("/api/messages/send",{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({message: messageContent, username})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.success){
        toast.success("Message sent succesfully!")
        setShow(false);
        getMessages();
      }else{
        toast.error(data.error)
        setLoading(false);
      }
    })
  }
  let content;
  if(viewSent){
    content = ((sentMessages.length===0)?
    <tr><td colSpan={4}>No Messages available.</td></tr>
    :sentMessages.map((message)=>(
      <tr key={message.messageId}>
        <td>{message.receiver.displayName} ({message.receiver.username})</td>
        <td>{(message.content.length>100)?`${message.content.substring(0,100)}...`:message.content}</td>
        <td>{format(new Date(message.sentAt),"dd/MM/yyyy")}</td>
        <td>{(message.markAsRead)?"Yes":"No"}</td>
        <td>
          <ButtonGroup>
            <Button variant="secondary" onClick={()=>viewMessage(message.messageId)}>View</Button>
          </ButtonGroup>
        </td>
      </tr>
    )))
  }else{
    content = (
      (receivedMessages.length===0)?<tr><td colSpan={4}>No Messages available.</td></tr>
      :receivedMessages.map((message)=>(
        <tr key={message.messageId}>
          <td>{message.sender.displayName} ({message.sender.username})</td>
          <td>{(message.content.length>100)?`${message.content.substring(0,100)}...`:message.content}</td>
          <td>{format(new Date(message.sentAt),"dd/MM/yyyy")}</td>
          <td>{(message.markAsRead)?"Yes":"No"}</td>
          <td>
            <ButtonGroup>
              <Button variant="secondary" onClick={()=>viewMessage(message.messageId)}>View</Button>
              <Button variant="secondary" onClick={()=>markAsRead(message.messageId)}>Mark as Read</Button>
              <Button variant="secondary" onClick={()=>deleteMessage(message.messageId)}>Delete</Button>
            </ButtonGroup>
          </td>
        </tr>
      )))
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
          <Nav className="justify-content-center" variant="pills" defaultActiveKey="/messages">
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
              <Nav.Link href="/messages">Messages</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/settings">Settings</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav.Item>
          </Nav>
          <h1>Messages</h1>
          <ButtonGroup>
            <Button variant="secondary" onClick={()=>setShow(true)}>Send Message</Button>
            <Button variant="secondary" onClick={()=>setViewSent(!viewSent)}>Toggle Sent/Received</Button>
          </ButtonGroup>
          <h2>{(viewSent)?"Sent Messages":"Received Messages"}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>{(viewSent)?"Receiver":"Sender"}</th>
                <th>Message Content</th>
                <th>Sent At</th>
                <th>Read?</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              {content}            
            </tbody>
          </table>
        </div>
      </main>
      <Modal show={show} onHide={()=>setShow(false)}>
            <Modal.Header>
              <Modal.Title>Send Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className="form-label">Username</label>
              <input className="form-control" type="text" onChange={e=>setUsername(e.target.value)}/>
              <label className="form-label">Message Content</label>
              <textarea className="form-control" onChange={e=>setMessageContent(e.target.value)}></textarea>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>setShow(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={sendMessage}>
                Send
              </Button>
            </Modal.Footer>
          </Modal>

          {/* View Message Modal */}
          <Modal show={showMessage} onHide={()=>setShowMessage(false)}>
            <Modal.Header>
              <Modal.Title>View Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Sender</h4>
              <p>{currentMessage?.sender?.displayName} ({currentMessage?.sender?.username})</p>
              <h4>Message</h4>
              <p>{currentMessage?.content}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>setShowMessage(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
    </div>
  )
}
