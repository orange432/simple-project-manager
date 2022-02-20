import { prisma } from "../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../controllers/sessions";

interface Body  {
  rename: string;
  projectId: number;
}

// Invites a user to the given project
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rename, projectId }: Body = req.body
  if(!projectId || !rename) return res.json({success: false, error: "Missing fields"})

  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})

  try{
    // Check that user is in project
    let project = await prisma.project.findUnique({
      where: {projectId}
    })
    if (project.ownerId !== user.userId) return res.json({success: false, error: "You must own the project to rename it!"})

    
    // Everything OK, rename project
    await prisma.project.update({
      where: { projectId },
      data: {
        name: rename
      }
    })
 
    res.json({success: true})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler