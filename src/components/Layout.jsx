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
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Routers />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Responsive Navbar */}
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <Routers />
      </main>
      {/* Responsive Footer */}
      <Footer />
    </div>
  )
}

export default Layout
