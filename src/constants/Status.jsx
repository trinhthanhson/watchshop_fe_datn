export function getOrderStatus(status) {
  switch (status) {
    case '0':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-white bg-primary">
          Chờ Xác Nhận
        </span>
      )
    case '1':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-sky-600 bg-sky-100">
          Đã Xác Nhận
        </span>
      )
    case '2':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-teal-600 bg-teal-100">
          Đang Vận Chuyển
        </span>
      )
    case '3':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-white bg-green">
          Chờ thanh toán
        </span>
      )
    case '4':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-white bg-green">
          Đã thanh toán
        </span>
      )
    case '5':
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-white bg-green">
          Đã giao
        </span>
      )
    default:
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
          Đã Hủy
        </span>
      )
  }
}

export function getStatus(status) {
  if (typeof status === 'string') {
    switch (status) {
      case 'INACTIVE':
        return (
          <span className="capitalize py-1 px-2 rounded-md text-xs text-white bg-main">
            {status.split('_').join(' ')}
          </span>
        )
      default:
        return (
          <span className="capitalize py-1 px-2 rounded-md text-xs text-white bg-green">
            {status.split('_').join(' ')}
          </span>
        )
    }
  } else {
    return null
  }
}

export function getStatusText(status) {
  if (typeof status === 'string') {
    switch (status) {
      case 'INACTIVE':
        return ''
      case 'ACTIVE':
        return 'ACTIVE'
      default:
        return status.split('_').join(' ').toLowerCase() // Đối với các trạng thái khác, chuyển đổi chữ hoa thành chữ thường và thay thế dấu gạch dưới
    }
  } else {
    return null
  }
}
export function getOrderStatusText(status) {
  switch (status) {
    case '0':
      return 'Chờ Xác Nhận'
    case '1':
      return 'Đã Xác Nhận'
    case '2':
      return 'Đang Vận Chuyển'
    case '3':
      return 'Chờ Thanh Toán'
    case '4':
      return 'Đã Thanh Toán'
    case '5':
      return 'Đã Giao'
    default:
      return 'Đã Hủy'
  }
}
