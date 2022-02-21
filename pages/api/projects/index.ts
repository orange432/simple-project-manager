import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../../controllers/sessions";

// Loads a list of projects
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})
  try{
    let projects = await prisma.projectUsers.findMany({
      where: {userId: user.userId},
      include: {
        project: {
          include: {
            users: {
              include: {
                user: {select: {displayName: true}}
              }
            }
          }
        }
      }
    })

    // Get invite count
    let inviteCount = await prisma.invitation.count({
      where: {userId: user.userId}
    })

    let messageCount = await prisma.message.count({
      where: {
        AND: [
          {receiverId: user.userId},
          {markAsRead: false}
        ]
      }
    })
    
    res.json({projects, success: true, inviteCount, messageCount, user})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler