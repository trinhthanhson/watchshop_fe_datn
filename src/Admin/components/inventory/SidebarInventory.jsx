import { Link, useLocation } from 'react-router-dom'
import { HiOutlineLogout, HiOutlineUserGroup } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_TOP_LINKS_INVENTORY
} from '../../../constants/MenuLink'
import { getUserProfileRequest } from '../../../redux/actions/actions'

const SidebarInventory = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [expandedKey, setExpandedKey] = useState(null) // Để mở rộng menu con
  const user = useSelector((state) => state.user.user.data)

  const isDirector = user?.user?.role_user?.role_name === 'DIRECTOR'
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

  return (
    <div
      className="fixed bg-primary w-60 h-full p-8 flex flex-col text-white font-RobotoMedium overflow-y-auto"
      style={{
        backgroundColor: 'rgb(199, 199, 199)'
      }}
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
              onClick={() =>
                link.subLinks
                  ? setExpandedKey((prev) =>
                      prev === link.key ? null : link.key
                    )
                  : null
              }
            >
              <div>{link.icon}</div>
              <div className="h-full">{link.label}</div>
            </div>
            {/* Hiển thị menu con nếu có */}
            {link.subLinks && expandedKey === link.key && (
              <div className="ml-6">
                {link.subLinks.map((subLink) => (
                  <Link key={subLink.key} to={subLink.path}>
                    <div
                      className={`flex items-center gap-3 p-2 cursor-pointer hover:no-underline ${
                        location.pathname === subLink.path
                          ? 'text-black font-bold'
                          : 'text-textNoneActive'
                      }`}
                      style={{
                        color:
                          location.pathname === subLink.path ? '#000' : '#555',
                        backgroundColor:
                          location.pathname === subLink.path
                            ? 'rgb(220, 220, 220)'
                            : 'transparent',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          'rgb(230, 230, 230)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          location.pathname === subLink.path
                            ? 'rgb(220, 220, 220)'
                            : 'transparent')
                      }
                    >
                      <div>{subLink.icon}</div>
                      <div>{subLink.label}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Link>
        ))}
        {isDirector && (
          <>
            <Link key="staffs" to="/inventory/staff">
              <div
                className={`flex items-center gap-3 p-3 cursor-pointer hover:no-underline ${location.pathname === '/inventory/staff' ? '' : 'text-textNoneActive'}`}
                style={{
                  color: '#000c',
                  backgroundColor:
                    hoveredIndex === 'staff' ||
                    location.pathname === '/inventory/staff'
                      ? 'rgb(171, 171, 171)'
                      : 'transparent'
                }}
                onMouseEnter={() => setHoveredIndex('staff')}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div>
                  <HiOutlineUserGroup />
                </div>
                <div>Nhân viên</div>
              </div>
            </Link>
          </>
        )}
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
