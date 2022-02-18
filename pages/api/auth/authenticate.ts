import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../../controllers/sessions";

// Logs a user in
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let [user,error] = await authorize(req,res);
  if(error) return res.json({success: false, error, code: 1})
  res.json({success: true, user})
}

export default handler;