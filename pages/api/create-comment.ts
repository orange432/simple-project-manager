import { prisma } from "../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../controllers/sessions";

type Body = {
  taskId: number;
  projectId: number;
  comment: string;
  variant: string
}

// Creates a task
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { taskId, projectId, comment, variant }: Body = req.body
  if(!taskId || !projectId || !comment) return res.json({success: false, error: "Missing fields"})

  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})

  try{
    // Check that user is in project
    let isInProject = await prisma.projectUsers.findFirst({where: {AND: [
      {userId: user.userId},
      {projectId}
    ]}})
    if (!isInProject) return res.json({success: false, error: "You are not part of this project."})

    // Create the comment
    await prisma.taskComments.create({data: {
      content: comment,
      taskId,
      userId: user.userId,
      variant
    }})

    res.json({success: true})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler