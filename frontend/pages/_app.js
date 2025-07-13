import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext'
import Layout from '../components/Layout'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </Layout>
    </AuthProvider>
  )
}
