import { prisma } from "../prisma"
import cookie from "cookie"
import jwt from "jsonwebtoken"
import { NextApiRequest, NextApiResponse } from "next"

// authorize checks if a user is logged in and is valid
export const authorize = async (req: NextApiRequest,res) => {
  const token = cookie.parse(req.headers.cookie || "").jwt;
  if(!token) return [null, "No token, please log in."]
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET)
  }catch(err){
    return [null, "Invalid token, please log in."]
  }

  let userId = decoded.userId;
  // Create the token
  try{
    jwt.sign({userId},process.env.JWT_SECRET,{
      expiresIn: "5d"
    })
  }catch(err){
    return [null, "Error while generating new token"]
  }
  // Set the cookie
  res.setHeader("Set-Cookie",cookie.serialize("jwt",token,{
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: true,
    maxAge: 5 * 24 * 60 * 60
  }))

  // Get user info
  try{
    let user = await prisma.user.findUnique({
      where: {userId},
      select: {
        userId: true,
        username: true,
        email: true,
        displayName: true
      }
    })
    return [user, null]
  }catch(err){
    console.log(err)
    return [null, "Database error, please try again."]
  }
}