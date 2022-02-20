import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'
import bcrypt from 'bcrypt'

// Changes a users password
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { currentPassword, newPassword } = req.body
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    // Check user details and password
    let user = await prisma.user.findUnique({where: {userId: decoded.userId}})
    if(!user) return res.json({success: false,  error: "Invalid Token, please log in"})
    if(!bcrypt.compareSync(currentPassword, user.password)){
      return res.json({success: false, error: "Wrong password, please try again."})
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await prisma.user.update({
      where: { userId: decoded.userId },
      data: {
        password: hashedPassword
      }
    })
    res.json({success: true})
  }catch(err){
    console.log(err);
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler