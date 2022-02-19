import React from 'react'
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"

interface Props {
  variant: string;
  openComments(): void;
  openEditor(): void;
  task: {
    taskId: number,
    users: any,
    title: string
  }
  userId: number
}

const Task: React.FC<Props> = (props) => {
  return (
    <Card
      bg={props.variant}
      key={props.task.taskId}
      text={(props.variant==="light")?"dark":"white"}
    >
      <Card.Header>Task - <ButtonGroup>
        <Button variant="secondary" onClick={props.openComments}>Comments</Button>
        <Button variant="secondary" onClick={props.openEditor}>Edit</Button>
        </ButtonGroup></Card.Header>
      <Card.Body>
        <h3 className="text-center">{props.task.title}</h3>
        {(props.task.users.find(({user})=>user.userId===props.userId))?
          <p className="text-center">You are assigned to this task</p>:
          <></>
        }
      </Card.Body>
    </Card>
  )
}

export default Task