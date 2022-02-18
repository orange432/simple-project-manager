import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {useEffect} from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MyApp({ Component, pageProps }) {
  useEffect(()=>{import("bootstrap/dist/js/bootstrap.bundle")})
  return (
    <>
      <ToastContainer/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
