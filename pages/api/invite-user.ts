import { prisma } from "../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../controllers/sessions";

interface Body  {
  username: string;
  projectId: number;
}

// Invites a user to the given project
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, projectId }: Body = req.body
  if(!projectId || !username) return res.json({success: false, error: "Missing fields"})

  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})

  try{
    // Check that user is in project
    let isInProject = await prisma.projectUsers.findFirst({where: {AND: [
      {userId: user.userId},
      {projectId}
    ]}})
    if (!isInProject) return res.json({success: false, error: "You are not part of this project."})

    // Get the userid
    let invitedUser = await prisma.user.findUnique({where: {username}})
    if(!invitedUser) return res.json({success: false, error: "Username does not exist."})

    // Check that we aren't blocked
    let isBlocked = await prisma.invitationBlocklist.findFirst({where: {
      AND: [
        {userId: invitedUser.userId},
        {username: user.username}
      ]
    }})
    if(isBlocked) return res.json({success: false, error: "You cannot invite this user."})

    // Everything OK, Create invitation
    await prisma.invitation.create({data: {
      userId: invitedUser.userId,
      invitedById: user.userId,
      projectId
    }})
 
    res.json({success: true})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler