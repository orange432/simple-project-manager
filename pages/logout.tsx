import { useEffect } from 'react'
import Loading from '../components/Loading'
import { toast } from 'react-toastify'

export default function Home() {
  useEffect(()=>{
    fetch("/api/auth/logout",{
      credentials: "include"
    })
    .then(r=>r.json())
    .then(()=>{
      window.location.href = "/"
    })
    .catch(err=>toast.error(err))
    
  })
  return <Loading/>
}
