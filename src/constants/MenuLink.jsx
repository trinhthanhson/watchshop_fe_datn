import {
  HiOutlineViewGrid,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineUserGroup,
  HiOutlineServer,
  HiOutlineReceiptTax,
  HiOutlineCog,
  HiOutlineDocumentText,
  HiOutlineDocumentReport
} from 'react-icons/hi'
import { MdWatch } from 'react-icons/md'
import { GrTransaction } from 'react-icons/gr'
import { FaPeopleLine } from 'react-icons/fa6'
import { BiText } from 'react-icons/bi'
export const DASHBOARD_SIDEBAR_TOP_LINKS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/manager',
    icon: <HiOutlineViewGrid />
  },
  {
    key: 'products',
    label: 'Products',
    path: '/manager/products',
    icon: <HiOutlineCube />
  },
  {
    key: 'orders',
    label: 'Orders',
    path: '/manager/orders',
    icon: <HiOutlineShoppingCart />
  },
  {
    key: 'customers',
    label: 'Customers',
    path: '/manager/customers',
    icon: <HiOutlineUserGroup />
  },

  {
    key: 'category',
    label: 'Category',
    path: '/manager/category',
    icon: <HiOutlineServer />
  },
  {
    key: 'brand',
    label: 'Brand',
    path: '/manager/brand',
    icon: <HiOutlineServer />
  },
  {
    key: 'coupons',
    label: 'Coupons',
    path: '/manager/coupons',
    icon: <HiOutlineReceiptTax />
  }
]

export const DASHBOARD_SIDEBAR_TOP_LINKS_SHIPPER = [
  {
    key: 'orders',
    label: 'Orders',
    path: '/manager/shipper',
    icon: <HiOutlineShoppingCart />
  },
  {
    key: 'ordership',
    label: 'Order received ',
    path: '/manager/shipper/receive',
    icon: <HiOutlineShoppingCart />
  }
]
export const DASHBOARD_SIDEBAR_TOP_LINKS_INVENTORY = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/inventory',
    icon: <HiOutlineCube />
  },
  {
    key: 'products',
    label: 'Product',
    path: '/inventory/product',
    icon: <MdWatch />
  },
  {
    key: 'request',
    label: 'Transaction Request',
    path: '/inventory/request',
    icon: <GrTransaction />
  },
  {
    key: 'transaction',
    label: 'Transaction',
    path: '/inventory/transaction',
    icon: <GrTransaction />
  },
  {
    key: 'staff',
    label: 'Staff Inventory',
    path: '/inventory/staff ',
    icon: <FaPeopleLine />
  },
  {
    key: 'type',
    label: 'Type Transaction',
    path: '/inventory/type',
    icon: <BiText />
  },
  {
    key: 'brand',
    label: 'Brand',
    path: '/inventory/brand',
    icon: <HiOutlineServer />
  },
  {
    key: 'category',
    label: 'Category',
    path: '/inventory/category',
    icon: <HiOutlineServer />
  },
  {
    key: 'supplier',
    label: 'Supplier',
    path: '/inventory/supplier',
    icon: <HiOutlineServer />
  },
  {
    key: 'report',
    label: 'Report',
    icon: <HiOutlineDocumentText />,
    subLinks: [
      {
        key: 'report-import',
        label: 'Report Import',
        path: '/inventory/report/import',
        icon: <HiOutlineDocumentReport />
      },
      {
        key: 'report-export',
        label: 'Report Export',
        path: '/inventory/report/export',
        icon: <HiOutlineDocumentReport />
      },
      {
        key: 'report-all',
        label: 'Report All',
        path: '/inventory/report/all',
        icon: <HiOutlineDocumentReport />
      }
    ]
  }
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: 'settings',
    label: 'Settings',
    path: '/manager/settings',
    icon: <HiOutlineCog />
  }
  // {
  //   key: 'logout',
  //   label: 'Logout',
  //   path: '/admin/logout',
  //   icon: <HiOutlineLogin />
  // },
]
