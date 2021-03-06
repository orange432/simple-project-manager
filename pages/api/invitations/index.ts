import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'

// Loads a list of projects
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    let invitations = await prisma.invitation.findMany({
      where: { userId: decoded.userId },
      include: {
        invitedBy: {
          select: {
            username: true,
            displayName: true
          }
        },
        project: {
          select: {
            name: true
          }
        }
      }
    })
    let messageCount = await prisma.message.count({
      where: {
        AND: [
          {receiverId: decoded.userId},
          {markAsRead: false}
        ]
      }
    })
    res.json({invitations,userId: decoded.userId, success: true, messageCount})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler