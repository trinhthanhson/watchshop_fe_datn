import { useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import Routers from '../routers/Routers.jsx'

const Layout = () => {
  const location = useLocation()

  const isAdminPage = location.pathname.startsWith('/manager')
  const isInventoryPage = location.pathname.startsWith('/inventory')

  const isLoginPage = location.pathname === '/login'
  const isSignupPage = location.pathname === '/signup'
  const isForgotPasswordPage = location.pathname === '/forgotPassword'
  const isIndexPage = location.pathname === '/'

  if (
    isIndexPage ||
    isLoginPage ||
    isSignupPage ||
    isForgotPasswordPage ||
    isAdminPage ||
    isInventoryPage
  ) {
    return (
      <div>
        <Routers />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div>
        <Routers />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
