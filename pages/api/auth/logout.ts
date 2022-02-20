import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie'

// Logs a user in
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Set-Cookie",cookie.serialize("jwt","",{
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: true,
    maxAge: 0
  }))
  res.json({success: true})
}

export default handler;