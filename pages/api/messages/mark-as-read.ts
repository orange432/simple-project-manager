import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'

// Sets a message to read status
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {messageId} = req.body
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    // Check user is correct
    let message = await prisma.message.findFirst({
      where: {
        AND: [
          {messageId},
          {receiverId: decoded.userId}
        ]
      }
    })
    if(!message) res.json({success: false, error: "Invalid message."})
    
    // Everything ok, update message
    await prisma.message.update({
      where: {messageId},
      data: {markAsRead: true}
    })
    
    res.json({success: true})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler