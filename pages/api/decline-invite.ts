import { prisma } from "../../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { authorize } from "../../controllers/sessions";

interface Body  {
  inviteId: number
}

// User accepts the invite
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { inviteId }: Body = req.body
  if(inviteId==null) return res.json({success: false, error: "Missing fields"})

  const [user, error]:any = await authorize(req,res)
  if(error) return res.json({success: false, error, code: 1})

  try{
    // Decline invite
    await prisma.invitation.delete({
      where: { inviteId }
    })
    
    res.json({success: true})
  }catch(err){
    console.log(err)
    res.json({success:false, error: "Database error.  Please refresh the page."})
  }
}

export default handler