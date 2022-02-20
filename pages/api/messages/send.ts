import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'

// Deletes a message
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, message} = req.body
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    // Check receiver is correct
    let user = await prisma.user.findUnique({
      where: {username}
    })
    if(!user) res.json({success: false, error: "User doesn't exist."})

    // Get sender details
    let ourUser = await prisma.user.findUnique({
      where: {userId: decoded.userId}
    })

    // Check we aren't blocked
    let blocked = await prisma.invitationBlocklist.findFirst({
      where: {
        AND: [
          {username: ourUser.username},
          {userId: user.userId}
        ]
      }
    })
    if(blocked) return res.json({success: false, error: "You are blocked by this user."})
    
    // Everything ok, delete message
    await prisma.message.create({
      data: {
        senderId: decoded.userId,
        receiverId: user.userId,
        content: message
      }
    })
    
    res.json({success: true})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler