import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'
import bcrypt from 'bcrypt'

// Changes a users password
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { displayName } = req.body
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    // Update displlay name
    await prisma.user.update({
      where: { userId: decoded.userId },
      data: { displayName }
    })
    res.json({success: true})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler