import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import cookie from 'cookie'
import { prisma } from "../../../prisma";

// Logs a user in
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body
  if(!username || !password) return res.json({success:false, error: "Missing username/password"})
  try{
    let user = await prisma.user.findUnique({where: {username}});
    if(!user) return res.json({success: false, error: "User doesn't exist!"})
    let same = bcrypt.compareSync(password, user.password);
    if(!same) return res.json({success: false, error: "Invalid password!"})
    // Password is valid
    let token = jwt.sign({userId: user.userId},process.env.JWT_SECRET,{expiresIn: "5d"})
    res.setHeader("Set-Cookie",cookie.serialize("jwt",token,{
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: true,
      maxAge: 5 * 24 * 60 * 60
    }))
    res.json({success: true})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please try again"})
  }
}

export default handler;