import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'
import bcrypt from 'bcrypt'

// Changes a users password
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username } = req.body
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    // Check user isn't already blocked
    let alreadyBlocked = await prisma.invitationBlocklist.findFirst({
      where: {
        AND: [
          {userId: decoded.userId},
          {username}
        ]
      }
    })
    if(alreadyBlocked) return res.json({success: false, error: "User already blocked."})

    // Block user
    await prisma.invitationBlocklist.create({data: {
      userId: decoded.userId,
      username
    }})

    res.json({success: true})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler