import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'

// Loads a list of messages
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    let messages = await prisma.message.findMany({where:{
      OR: [
        {senderId: decoded.userId},
        {receiverId: decoded.userId}
      ]
    },
    include: {
      sender: {
        select: {
          userId: true,
          username: true,
          displayName: true
        }
      },
      receiver: {
        select: {
          userId: true,
          username: true,
          displayName: true
        }
      }
    }
    })

    // Get invite count
    let inviteCount = await prisma.invitation.count({
      where: {userId: decoded.userId}
    })
    res.json({messages, success: true, inviteCount, userId: decoded.userId})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler