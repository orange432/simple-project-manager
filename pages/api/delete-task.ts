import { prisma } from "../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../controllers/sessions";

// Deletes a task
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {  taskId } = req.body
  if(!taskId) return res.json({success: false, error: "Missing field."})

  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})

  try{
    let task = await prisma.task.findUnique({where: {taskId}})

    // Check that user the project owner
    let isProjectOwner = await prisma.project.findFirst({
      where: {
        AND: [
          {projectId: task.projectId},
          {ownerId: user.userId}
        ]
      }
    }) 

    if(!isProjectOwner) return res.json({success: false, error: "Only the project owner can delete tasks"})
    // Delete the task
    await prisma.task.delete({where: {taskId}})

    res.json({success: true})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler