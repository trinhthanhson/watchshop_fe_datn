import { Outlet } from 'react-router-dom/dist'
import SidebarInventory from './SidebarInventory'
import Header from '../Header'

const LayoutInventory = () => {
  return (
    <div className="flex flex-row h-screen w-screen bg-bgPrimary">
      <SidebarInventory />
      <div className="flex-1 w-[80%] overflow-x-hidden">
        <Header />

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LayoutInventory
