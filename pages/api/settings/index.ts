import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'

// Loads a list of settings and user data
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    // Get user data
    let user = await prisma.user.findUnique({
      where: {userId: decoded.userId},
      select: {
        displayName: true,
        username: true,
        email: true
      }
    })
    // Load blocklist
    let blocklist = await prisma.invitationBlocklist.findMany({
      where: {userId: decoded.userId}
    })
    res.json({success: true, user, blocklist})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler