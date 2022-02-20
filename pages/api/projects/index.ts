import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'
import { PrismaClient } from "@prisma/client";

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
    let projects = await prisma.projectUsers.findMany({
      where: {userId: decoded.userId},
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
    
    // Get user details
    let user = await prisma.user.findUnique({
      where: {userId: decoded.userId},
      select: {
        username: true,
        displayName: true
      }
    })
    res.json({projects, success: true, inviteCount, messageCount, user})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler