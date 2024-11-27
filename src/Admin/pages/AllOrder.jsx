import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { getAllOrdersRequest } from '../../redux/actions/actions'
import { getOrderStatusText } from '../../constants/Status'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as XLSX from 'xlsx'
const AllOrder = () => {
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.orders.orders)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [status, setStatus] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [filteredOrders, setFilteredOrders] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    try {
      dispatch(getAllOrdersRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch])

  useEffect(() => {
    const filtered = orders?.data?.filter((order) => {
      const orderDate = new Date(order.created_at).getTime()
      const startDateTimestamp = startDate ? startDate.getTime() : null
      const endDateTimestamp = endDate ? endDate.getTime() : null

      if (startDateTimestamp && orderDate < startDateTimestamp) {
        return false
      }

      if (endDateTimestamp && orderDate > endDateTimestamp) {
        return false
      }

      if (status && order.status !== status) {
        return false
      }
      return true
    })
    setFilteredOrders(filtered || [])

    const total = filtered
      ? filtered.reduce((acc, order) => acc + order.total_price, 0)
      : 0
    setTotalPrice(total)
  }, [orders.data, startDate, endDate, status])

  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
    setStatus(null)
  }

  const exportPDF = () => {
    const doc = new jsPDF()

    const tableColumn = [
      'No', // STT (Số Thứ Tự)
      'Image', // Hình Ảnh
      'Product Name', // Tên Sản Phẩm
      'Address', // Địa Chỉ
      'Total Quantity', // Tổng Số Lượng
      'Payment', // Thanh Toán
      'Order Date', // Ngày Đặt
      'Status' // Trạng Thái
    ]
    const tableRows = []

    filteredOrders.forEach((order, index) => {
      const orderDetails = order.orderDetails
        .map((item) => item.product?.product_name)
        .join(', ')
      const orderData = [
        index + 1,
        '', // Không xử lý hình ảnh trong bảng PDF
        orderDetails,
        order.address,
        order.total_quantity,
        order.total_price.toLocaleString('en') + ' VNĐ',
        new Date(order.created_at).toLocaleDateString(),
        getOrderStatusText(order.status)
      ]
      tableRows.push(orderData)
    })

    // Sử dụng autoTable để tạo bảng
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0,
        fontStyle: 'bold'
      }
    })

    doc.text('Order List', 14, 15)
    doc.save('order-list.pdf')
  }
  const exportToExcel = () => {
    const exportData = filteredOrders.map((order, index) => {
      const orderDate = new Date(order.created_at).toLocaleDateString()
      return {
        STT: index + 1,
        'Sản Phẩm': order.orderDetails
          .map((item) => item.product_order && item.product_order.product_name)
          .join(', '),
        'Địa Chỉ': order.address,
        'Tổng Số Lượng': order.total_quantity,
        'Thanh Toán': order.total_price.toLocaleString('en'),
        'Ngày Đặt': orderDate,
        'Trạng Thái': getOrderStatusText(order.status)
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
    XLSX.writeFile(workbook, 'orders.xlsx')
  }

  return (
    <>
      <div className="ml-[18%] w-[80%] font-RobotoMedium">
        <div className="flex justify-between">
          <div className="p-2 flex items-center justify-center gap-2">
            <label>Ngày bắt đầu</label>
            <DatePicker
              className="text-center p-[3px] rounded-md border-primary border-[1px]"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>

          <div className="p-2 flex items-center justify-center gap-2">
            <label>Ngày kết thúc</label>
            <DatePicker
              className="text-center p-[3px] rounded-md border-primary border-[1px]"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>

          <div className="p-2 flex items-center justify-center gap-2">
            <label>Trạng thái</label>
            <select
              className="p-[3px] rounded-md border-primary border-[1px] text-center"
              value={status || ''}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="0">Chờ xác nhận</option>
              <option value="1">Đã xác nhận</option>
              <option value="2">Đang vận chuyển</option>
              <option value="3">Chờ thanh toán</option>
              <option value="4">Đã thanh toán</option>
              <option value="5">Đã giao</option>
              <option value="6">Đã huỷ</option>
            </select>
          </div>

          <div className="p-2">
            <button
              onClick={() => handleReset()}
              className="text-center text-[14px] bg-primary text-white rounded-md shadow-md uppercase px-5 py-[7px] font-RobotoMedium hover:bg-hoverPrimary transition duration-200 ease-in-out"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-[85%] ml-[13%] rounded-md shadow-md bg-white mt-5">
        <table className="w-full text-gray-700">
          <thead className="text-white font-RobotoSemibold text-[18px] ">
            <tr className="bg-primary">
              <td className="rounded-s-md">STT</td>
              <td>Hình Ảnh</td>
              <td>Tên Sản Phẩm</td>
              <td>Địa Chỉ</td>
              <td>Tổng Số Lượng</td>
              <td>Thanh Toán</td>
              <td>Ngày Đặt</td>
              <td className="rounded-e-md" style={{ paddingRight: '50px' }}>
                Trạng Thái
              </td>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={index}
                className="cursor-pointer"
                onClick={() => navigate(`/manager/order/${order.order_id}`)}
              >
                <td>{index + 1}</td>
                <td className="flex items-center">
                  {[
                    ...new Map(
                      order.orderDetails.map((item) => [
                        item.product_order?.image,
                        item
                      ])
                    ).values()
                  ]
                    .slice(0, 2) // Lấy tối đa 2 hình ảnh
                    .map((uniqueItem, index) => (
                      <img
                        key={index}
                        className="w-[50px] h-[50px] rounded-full object-cover shadow-md mr-2"
                        src={
                          uniqueItem.product_order?.image ||
                          '/default-image.jpg'
                        }
                        alt={
                          uniqueItem.product_order?.product_name ||
                          'No product name'
                        }
                        title={
                          uniqueItem.product_order?.product_name ||
                          'No product name'
                        } // Hiển thị tooltip khi hover
                      />
                    ))}
                  {order.orderDetails.length > 2 && (
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      +{order.orderDetails.length - 2} ...
                    </span>
                  )}
                </td>
                <td>
                  {order.orderDetails.map((item, index) => (
                    <div
                      key={index}
                      className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]"
                      title={item.product_order?.product_name} // Hiển thị toàn bộ tên khi hover
                    >
                      {item.product_order?.product_name}
                    </div>
                  ))}
                </td>
                <td>{order.address}</td>
                <td>{order.total_quantity}</td>
                <td>{order.total_price.toLocaleString('en')} VNĐ</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="text-center align-middle">
                  <span className="inline-block text-black px-2 py-1 border rounded-md text-sm bg-blue-">
                    {order?.order_status?.status_name || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-[80%] ml-[18%] mt-2">
        <div className="flex justify-between font-RobotoMedium">
          <div className="text-primary rounded-md p-2 ml-[40%]">
            Số đơn hàng: {filteredOrders ? filteredOrders.length : 0}
          </div>
          <div className="text-primary rounded-md p-2">
            Tổng: {totalPrice.toLocaleString('en')} VNĐ
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <button
          onClick={exportPDF}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-md hover:bg-hoverPrimary transition duration-300 ease-in-out"
        >
          Xuất PDF
        </button>
        <button
          onClick={exportToExcel}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-md hover:bg-hoverPrimary transition duration-300 ease-in-out"
        >
          Xuất EXCEL
        </button>
      </div>
    </>
  )
}

export default AllOrder
