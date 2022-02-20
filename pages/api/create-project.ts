import { prisma } from "../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../controllers/sessions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.body
  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})

  try{
    let project = await prisma.project.create({data: {
      name,
      ownerId: user.userId
    }})
    await prisma.projectUsers.create({data: {
      userId: user.userId,
      projectId: project.projectId
    }})
    res.json({success: true})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler