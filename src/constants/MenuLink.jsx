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
    label: 'Sản phẩm',
    path: '/manager/products',
    icon: <HiOutlineCube />
  },
  {
    key: 'orders',
    label: 'Đơn hàng',
    path: '/manager/orders',
    icon: <HiOutlineShoppingCart />
  },
  {
    key: 'customers',
    label: 'Khách hàng',
    path: '/manager/customers',
    icon: <HiOutlineUserGroup />
  },

  {
    key: 'category',
    label: 'Loại sản phẩm',
    path: '/manager/category',
    icon: <HiOutlineServer />
  },
  {
    key: 'brand',
    label: 'Hãng sản phẩm',
    path: '/manager/brand',
    icon: <HiOutlineServer />
  },
  {
    key: 'coupons',
    label: 'Giảm giá',
    path: '/manager/coupons',
    icon: <HiOutlineReceiptTax />
  }
]

export const DASHBOARD_SIDEBAR_TOP_LINKS_SHIPPER = [
  {
    key: 'orders',
    label: 'Đơn hàng',
    path: '/manager/shipper',
    icon: <HiOutlineShoppingCart />
  },
  {
    key: 'ordership',
    label: 'Đơn hàng đã nhận',
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
    label: 'Sản phẩm',
    path: '/inventory/product',
    icon: <MdWatch />
  },
  {
    key: 'request',
    label: 'Phiếu đề nghị',
    icon: <GrTransaction />,
    subLinks: [
      {
        key: 'request-import',
        label: 'Đề nghị nhập',
        path: '/inventory/request/import',
        icon: <GrTransaction />
      },
      {
        key: 'request-export',
        label: 'Đề nghị xuất',
        path: '/inventory/request/export',
        icon: <GrTransaction />
      }
    ]
  },
  {
    key: 'transaction',
    label: 'Giao dịch',
    icon: <GrTransaction />,
    subLinks: [
      {
        key: 'transaction-import',
        label: 'Phiếu nhập',
        path: '/inventory/transaction/import',
        icon: <GrTransaction />
      },
      {
        key: 'transaction-export',
        label: 'Phiếu xuất',
        path: '/inventory/transaction/export',
        icon: <GrTransaction />
      }
    ]
  },
  {
    key: 'staff',
    label: 'Nhân viên kho',
    path: '/inventory/staff ',
    icon: <FaPeopleLine />
  },
  {
    key: 'type',
    label: 'Loại phiếu',
    path: '/inventory/type',
    icon: <BiText />
  },
  {
    key: 'brand',
    label: 'Hãng sản phẩm',
    path: '/inventory/brand',
    icon: <HiOutlineServer />
  },
  {
    key: 'category',
    label: 'Loại sản phẩm',
    path: '/inventory/category',
    icon: <HiOutlineServer />
  },
  {
    key: 'supplier',
    label: 'Nhà cung cấp',
    path: '/inventory/supplier',
    icon: <HiOutlineServer />
  },
  {
    key: 'report',
    label: 'Báo cáo',
    icon: <HiOutlineDocumentText />,
    subLinks: [
      {
        key: 'report-import',
        label: 'Báo cáo nhập',
        path: '/inventory/report/import',
        icon: <HiOutlineDocumentReport />
      },
      {
        key: 'report-export',
        label: 'Báo cáo xuất',
        path: '/inventory/report/export',
        icon: <HiOutlineDocumentReport />
      },
      {
        key: 'report-all',
        label: 'Báo cáo tổng',
        path: '/inventory/report/all',
        icon: <HiOutlineDocumentReport />
      }
    ]
  }
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: 'settings',
    label: 'Cài đặt',
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
