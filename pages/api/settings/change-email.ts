import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'

// Updates a users email
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    // Update email
    await prisma.user.update({
      where: { userId: decoded.userId },
      data: { email }
    })
    res.json({success: true})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler