import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About/About'
import Origin from '../pages/About/Origin'
import Services from '../pages/About/Services'
import Jobs from '../pages/About/Jobs'
import News from '../pages/News/News'
import Menu from '../pages/Menu/Menu'
import Products from '../pages/Menu/Products'
import Page404 from '../pages/Page404'
import Contact from '../pages/Contact'
import ProductDetail from '../pages/Menu/ProductDetail'
import NewDetail from '../pages/News/NewDetail'
import Discover from '../pages/Discover'
import Cart from '../pages/Cart'
import Layout from '../Admin/components/Layout'
import Dashboard from '../Admin/pages/Dashboard'
import AllProducts from '../Admin/pages/AllProducts'
import AllOrder from '../Admin/pages/AllOrder'
import AllCustomers from '../Admin/pages/AllCustomer'
import AllCategory from '../Admin/pages/AllCategory'
import AdminOrderDetail from '../Admin/pages/AdminOrderDetail'
import AdminProductDetail from '../Admin/pages/AdminProductDetail'
import CreateProduct from '../Admin/pages/CreateProduct'
import UpdateProduct from '../Admin/pages/UpdateProduct'
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import CustomerProfile from '../pages/Auth/CustomerProfile'
import StaffProfile from '../Admin/pages/StaffProfile'
import OrdersHistory from '../pages/Order/OrdersHistory'
import OrderDetail from '../pages/Order/OrderDetail'
import AllCoupons from '../Admin/pages/AllCoupons'
import CreateCoupon from '../Admin/pages/CreateCoupon'
import Checkout from '../pages/Order/Checkout'
import ProductDetailByCategory from '../pages/Menu/ProductByCategory'
import OrderBuyNow from '../pages/Order/OrderBuyNow'
import AdminUserCustomerDetail from '../Admin/pages/AdminUserCustomerDetail'
import AllBrand from '../Admin/pages/AllBrand'
import AllStaff from '../Admin/pages/AllStaff'
import AdminUserStaffDetail from '../Admin/pages/AdminUserStaffDetail'
import AllCouponDetail from '../Admin/pages/AllCouponDetail'
import { decryptData } from '../cryptoUtils/cryptoUtils'
import ProductByBrand from '../pages/Menu/ProductByBrand'
import OrderAcceptShipper from '../Admin/pages/OrderAcceptShipper'
import OrderShipperDetail from '../Admin/pages/OrderShipperDetail'
import OrderReceiveShipper from '../Admin/pages/OrderReceiveShipper'
import DashboardInevntory from '../Admin/pages/Inventory/DashboardInevntory'
import LayoutInventory from '../Admin/components/inventory/LayoutInventory'
import ProductInventory from '../Admin/pages/Inventory/ProductInventory'
import InventoryProductDetail from '../Admin/pages/Inventory/InventoryProductDetail'
import InventoryUpdateProduct from '../Admin/pages/Inventory/InventoryUpdateProduct'
import TransactionRequest from '../Admin/pages/Inventory/TransactionRequest'
import CreateProductInventory from '../Admin/pages/Inventory/CreateProductInventory'
import AllCategoryInventory from '../Admin/pages/Inventory/AllCategoryInventory'
import AllBrandInventory from '../Admin/pages/Inventory/AllBrandInventory'
import AllSupplierInventory from '../Admin/pages/Inventory/AllSupplierInventory'
import CreateRequest from '../Admin/pages/Inventory/CreateRequest'
import TransactionRequestDetail from '../Admin/pages/Inventory/TransactionRequestDetail'
import Transaction from '../Admin/pages/Inventory/Transaction'
import TransactionDetail from '../Admin/pages/Inventory/TransactionDetail'
import { NavigationPaths } from './navigationPaths'
import { UserRole } from '../enum/UserRole'
import AllTypeInventory from '../Admin/pages/Inventory/AllTypeInventory'
import OrderStatus from '../Admin/pages/OrderStatus'

const Routers = () => {
  const navigate = useNavigate()
  const currentPath = window.location.pathname
  const [role, setRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    // Lấy role từ localStorage và giải mã
    const roleName = localStorage.getItem('role_name')
    if (roleName) {
      try {
        const decryptedRole = decryptData(roleName)
        setRole(decryptedRole)
        if (
          decryptedRole === 'MANAGER' ||
          decryptedRole === 'STAFF' ||
          decryptedRole === 'SHIPPER' ||
          decryptedRole === 'WAREHOUSE_STAFF' ||
          decryptedRole === 'WAREHOUSE_MANAGER'
        ) {
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error('Error decrypting role:', error)
      }
    }
  }, [])
  useEffect(() => {
    if (isLoggedIn) {
      // Kiểm tra nếu là STAFF, không cho vào trang kho (bắt đầu với /inventory)
      if (
        role === UserRole.STAFF &&
        (currentPath.startsWith(NavigationPaths.WAREHOUSE_STAFF) ||
          currentPath.startsWith(NavigationPaths.WAREHOUSE_MANAGER))
      ) {
        // Điều hướng đến trang NOTFOUND nếu không hợp lệ
        navigate(NavigationPaths.NOTFOUND)
        return // Dừng lại, không điều hướng thêm
      }

      // Kiểm tra nếu là WAREHOUSE_STAFF hoặc WAREHOUSE_MANAGER, không cho vào trang STAFF (bắt đầu với /manager)
      if (
        (role === UserRole.WAREHOUSE_STAFF ||
          role === UserRole.WAREHOUSE_MANAGER) &&
        currentPath.startsWith(NavigationPaths.STAFF)
      ) {
        // Điều hướng đến trang NOTFOUND nếu không hợp lệ
        navigate(NavigationPaths.NOTFOUND)
        return // Dừng lại, không điều hướng thêm
      }
    }
  }, [isLoggedIn, role, currentPath, navigate])
  // Your component code here

  return (
    <Routes>
      <Route path="*" element={<Page404 />} />
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/origin" element={<Origin />} />
      <Route path="/services" element={<Services />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewDetail />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/buynow" element={<OrderBuyNow />} />
      <Route
        path="/products/:category_id/category"
        element={<ProductDetailByCategory />}
      />
      <Route path="/products/:brand_id/brand" element={<ProductByBrand />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders-history" element={<OrdersHistory />} />
      <Route path="/order/:id" element={<OrderDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/manager/shipper" element={<OrderAcceptShipper />} />
      <Route path="/manager/shipper/:id" element={<OrderShipperDetail />} />

      <Route
        path="/manager/shipper/receive"
        element={<OrderReceiveShipper />}
      />

      <Route path="/manager" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/manager/products" element={<AllProducts />} />
        <Route path="/manager/create-product" element={<CreateProduct />} />
        <Route path="/manager/update-product/:id" element={<UpdateProduct />} />
        <Route
          path="/manager/user-customer/:id"
          element={<AdminUserCustomerDetail />}
        />
        <Route
          path="/manager/user-staff/:id"
          element={<AdminUserStaffDetail />}
        />
        <Route path="/manager/order-status" element={<OrderStatus />} />
        <Route path="/manager/product/:id" element={<AdminProductDetail />} />
        <Route
          path="/manager/coupon-detail/:id"
          element={<AllCouponDetail />}
        />
        <Route path="/manager/orders" element={<AllOrder />} />
        <Route path="/manager/order/:id" element={<AdminOrderDetail />} />
        <Route path="/manager/customers" element={<AllCustomers />} />
        <Route path="/manager/staffs" element={<AllStaff />} />
        <Route path="/manager/category" element={<AllCategory />} />
        <Route path="/manager/brand" element={<AllBrand />} />
        <Route path="/manager/profile" element={<StaffProfile />} />
        <Route path="/manager/coupons" element={<AllCoupons />} />
        <Route path="/manager/create-coupon" element={<CreateCoupon />} />
      </Route>

      <Route path="/inventory" element={<LayoutInventory />}>
        <Route index element={<DashboardInevntory />} />
        <Route path="/inventory/product" element={<ProductInventory />} />
        <Route
          path="/inventory/product/:id"
          element={<InventoryProductDetail />}
        />
        <Route
          path="/inventory/update-product/:id"
          element={<InventoryUpdateProduct />}
        />
        <Route path="/inventory/request" element={<TransactionRequest />} />
        <Route
          path="/inventory/create-product"
          element={<CreateProductInventory />}
        />
        <Route path="/inventory/category" element={<AllCategoryInventory />} />
        <Route path="/inventory/brand" element={<AllBrandInventory />} />
        <Route path="/inventory/supplier" element={<AllSupplierInventory />} />
        <Route path="/inventory/create-request" element={<CreateRequest />} />
        <Route
          path="/inventory/request/:id"
          element={<TransactionRequestDetail />}
        />
        <Route path="/inventory/transaction" element={<Transaction />} />
        <Route path="/inventory/type" element={<AllTypeInventory />} />
        <Route
          path="/inventory/transaction/:id"
          element={<TransactionDetail />}
        />
      </Route>
    </Routes>
  )
}

export default Routers
