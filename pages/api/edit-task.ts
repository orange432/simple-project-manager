import { prisma } from "../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../controllers/sessions";

// Creates a task
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, status, projectId, assignedUsers, taskId } = req.body
  if(!title || !projectId || !assignedUsers || !taskId) return res.json({success: false, error: "Missing field."})

  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})

  try{
    // Check that user is in project
    let isInProject = await prisma.projectUsers.findFirst({where: {AND: [
      {userId: user.userId},
      {projectId}
    ]}})
    if (!isInProject) return res.json({success: false, error: "You are not part of this project."})

    // Update the task
    let task = await prisma.task.update({data: {
      title,
      status,
      projectId
    }, where: {taskId}})

    // Remove unassigned users
    await prisma.taskUsers.deleteMany({where: {taskId}})

    let warnings = [];
    // Add assigned users to task
    for(let i=0; i<assignedUsers.length; i++){
      // Check the user is in the project
      let userIsInProject = await prisma.projectUsers.findFirst({where: {
        AND: [
          {userId: assignedUsers[i]},
          {projectId}
        ]
      }})

      if (userIsInProject){
        // Add user to task assignees
        await prisma.taskUsers.create({data: {
          taskId: task.taskId,
          userId: assignedUsers[i]
        }})
      }else{
        warnings.push(`Userid: ${assignedUsers[i]} is not part of this project.`)
      }
    }
    res.json({success: true, warnings})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler