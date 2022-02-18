import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthWrapper } from '../context/Auth'

function MyApp({ Component, pageProps }) {
  return (
    <>
    <AuthWrapper>
      <ToastContainer/>
      <Component {...pageProps} />
    </AuthWrapper>  
    </>
  )
}

export default MyApp
