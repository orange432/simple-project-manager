import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = cookie.parse(req.headers.cookie || "").jwt
  try{
    jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  try{
    const { payload }: any = jwt.decode(token); 
    let projects = await prisma.projectUsers.findMany({
      where: {userId: payload.userId},
      include: {
        project: {
          select: {
            name: true,
            projectId: true
          }
        }
      }
    })
    res.json({projects, success: true})
  }catch(err){
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler