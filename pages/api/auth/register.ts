import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../prisma'
import bcrypt from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {username, password, email, displayName} = req.body;
  if(!username || !password || !email || !displayName) return res.json({success: false,error: "Missing fields!"})
  if(username.length<4) return res.json({success: false, error: "Username must be at least 4 characters long"})
  // Check Email
  if(!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
    return res.json({success: false, error: "Invalid email!"})
  }
  try{
    let user = await prisma.user.findUnique({where: {username}})
    if(user) return res.json({success: false, error: "Username already in use!"})
    let emailCheck = await prisma.user.findUnique({where: {email}})
    if(emailCheck) return res.json({success: false, error: "Email already in use!"})
    let hashedPassword = bcrypt.hashSync(password,10);
    await prisma.user.create({data: {
      username,
      email,
      displayName,
      password: hashedPassword
    }})
    res.json({success: true})
  }catch(err){
    console.log(err);
    res.json({success: false, error: "Database error.  Please try again."})
  }
  

}

export default handler;