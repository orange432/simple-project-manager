import { prisma } from "../../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import cookie from 'cookie'

// Loads project data from the project with the given id
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = cookie.parse(req.headers.cookie || "").jwt
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET) 
  }catch(err){
    return res.json({success: false, error: "Invalid Token, please log in", code: 1})
  }
  const { id } = req.query
  try{
    let link = await prisma.projectUsers.findFirst({
      where: {AND:[{userId: decoded.userId}, {projectId: +id}]}
    })
    if(!link) return res.json({success:false, error: "You are not part of this project."})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
  try{
    // Load project data
    let project = await prisma.project.findUnique({
      where: {projectId: +id},
      include: {
        tasks: {
          include: {
            comments: {
              include: {
                user: {
                  select: {
                    displayName: true,
                    username: true
                  }
                }
              }
            },
            users: {
              include: {
                user: {
                  select: {
                    userId: true,
                    displayName: true,
                    username: true
                  }
                }
              }
            }
          }
        },
        users: {
          include: {
            user: {
              select: {
                displayName: true,
                username: true,
                userId: true
              }
            }
          }
        }
      }
    })

    // Load user data
    let user = await prisma.user.findUnique({where: 
      {userId: decoded.userId},
      select: {
        userId: true,
        username: true,
        displayName: true
      }
    })
    res.json({success: true, project,user})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler