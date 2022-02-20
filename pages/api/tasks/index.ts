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
    let tasks = await prisma.user.findUnique({
      where: {userId: decoded.userId},
      include: {
        tasks: {
          include: {
            task: {
              include: {
                users: {
                  include: {user: {
                    select: {
                      userId: true,
                      username: true,
                      displayName: true
                    }
                  }}
                },
                project:{
                  select: {
                    name: true,
                    projectId: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Get invite count
    let inviteCount = await prisma.invitation.count({
      where: {userId: decoded.userId}
    })
    let messageCount = await prisma.message.count({
      where: {
        AND: [
          {receiverId: decoded.userId},
          {markAsRead: false}
        ]
      }
    })
    res.json({tasks, success: true, inviteCount, messageCount})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler