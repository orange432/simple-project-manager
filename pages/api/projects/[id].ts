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
  const { id } = req.query
  try{
    const { payload }: any = jwt.decode(token); 
    let link = await prisma.projectUsers.findFirst({
      where: {userId: payload.userId, projectId: +id}
    })
    if(!link) return res.json({success:false, error: "You are not part of this project."})
  }catch(err){
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
  try{
    let project = await prisma.project.findUnique({
      where: {projectId: +id},
      include: {
        tasks: {
          include: {
            comments: true
          }
        }
      }
    })
    res.json({success: true, project})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler