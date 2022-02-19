import { prisma } from "../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../controllers/sessions";

interface Body  {
  inviteId: number
}

// User accepts the invite
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { inviteId }: Body = req.body
  if(inviteId==null) return res.json({success: false, error: "Missing fields"})

  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})

  try{
    // Get invite
    let invitation = await prisma.invitation.findUnique({where: 
      {inviteId}
    })
    if(!invitation) return res.json({success:false, error: "Invitation doesn't exist or already accepted."})

    // Check invitation details
    if(invitation.userId !== user.userId) return res.json({sucess: false, error: "Not your invitation to accept."})

    // Check that user isn't already in project
    let isInProject = await prisma.projectUsers.findFirst({where: {AND: [
      {userId: user.userId},
      {projectId: invitation.projectId}
    ]}})
    if (isInProject) {
      await prisma.invitation.delete({where: {inviteId}})
      return res.json({success: false, error: "You are already part of this project."})
    }
    
    // Everything OK, add user to project
    await prisma.projectUsers.create({data: {
      userId: invitation.userId,
      projectId: invitation.projectId
    }})
 
    res.json({success: true})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler