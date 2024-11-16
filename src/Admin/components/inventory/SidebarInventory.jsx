import { Link, useLocation } from 'react-router-dom/dist'
import { HiOutlineLogout } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_TOP_LINKS_INVENTORY
} from '../../../constants/MenuLink'
import { getUserProfileRequest } from '../../../redux/actions/actions'
const SidebarInventory = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  // const navigate = useNavigate();
  useEffect(() => {
    try {
      dispatch(getUserProfileRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch])
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div
      className="fixed bg-primary w-70 h-full p-8 flex flex-col text-white font-RobotoMedium"
      style={{ backgroundColor: 'rgb(199 199 199)' }}
    >
      <div className="flex items-center justify-center gap-3">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Flogo.png?alt=media&token=ff560732-bd5c-43d0-9271-7bcd3d9204ea"
          alt="logo"
          className="w-[125px]"
        />
        <div className="text-[16px]"></div>
      </div>
      <div className="flex-1 mt-6">
        {DASHBOARD_SIDEBAR_TOP_LINKS_INVENTORY.map((link) => (
          <Link key={link.key} to={link.path}>
            <div
              key={link.key}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:no-underline ${location.pathname === link.path ? '' : 'text-textNoneActive'}`}
              style={{
                color: '#000c',
                backgroundColor:
                  hoveredIndex === link.key || location.pathname === link.path
                    ? 'rgb(171, 171, 171)'
                    : 'transparent'
              }}
              onMouseEnter={() => setHoveredIndex(link.key)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div>{link.icon}</div>
              <div>{link.label}</div>
            </div>
          </Link>
        ))}
      </div>
      <hr className="opacity-40" />
      <div className="">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <Link key={link.key} to={link.path}>
            <div
              key={link.key}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:no-underline ${location.pathname === link.path ? '' : 'text-textNoneActive'}`}
              style={{
                color: '#000c',
                backgroundColor:
                  hoveredIndex === link.key || location.pathname === link.path
                    ? 'rgb(171, 171, 171)'
                    : 'transparent'
              }}
              onMouseEnter={() => setHoveredIndex(link.key)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div>{link.icon}</div>
              <div>{link.label}</div>
            </div>
          </Link>
        ))}
        <div
          className="flex items-center gap-3 p-3 cursor-pointer text-main"
          style={{ color: 'rgb(253 0 15)' }}
        >
          <HiOutlineLogout />
          <div onClick={handleLogout}>Logout</div>
        </div>
      </div>
    </div>
  )
}

export default SidebarInventory
