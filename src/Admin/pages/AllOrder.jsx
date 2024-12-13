import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { getOrderStatusText } from '../../constants/Status'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as XLSX from 'xlsx'
import { HiOutlineSearch } from 'react-icons/hi'
import { getAllOrderStatusRequest } from '../../redux/actions/order-status/action'
import {
  getAllOrderPageRequest,
  searchOrderByDateRequest,
  searchOrderByStatusRequest
} from '../../redux/actions/order/action'
const AllOrder = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const orders = useSelector((state) => state?.order_page?.order_page)
  const dateFindOrder = useSelector((state) => state?.orderByDate?.orderByDate)
  const orderStatus = useSelector((state) => state?.order_status?.order_status)
  const statusFindOrder = useSelector(
    (state) => state?.orderByStatus?.orderByStatus
  )

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedStatusId, setStatusId] = useState(0)
  const [isFilter, setIsFilter] = useState(false)
  const [isSearchDate, setSearchDate] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10 // Số bản ghi mỗi trang

  // Xác định dữ liệu hiển thị
  const displayedOrder =
    isSearchDate && dateFindOrder
      ? dateFindOrder
      : isFilter && statusFindOrder
        ? statusFindOrder
        : orders

  // Tổng số trang
  const totalPages = isSearchDate
    ? dateFindOrder?.totalPages || 1
    : isFilter
      ? statusFindOrder?.totalPages || 1
      : orders?.totalPages || 1

  // Fetch dữ liệu khi có thay đổi
  useEffect(() => {
    try {
      if (isSearchDate) {
        dispatch(
          searchOrderByDateRequest(
            startDate?.toISOString().split('T')[0],
            endDate?.toISOString().split('T')[0],
            currentPage,
            recordsPerPage
          )
        )
      } else if (isFilter) {
        dispatch(
          searchOrderByStatusRequest(
            selectedStatusId,
            currentPage,
            recordsPerPage
          )
        )
      } else {
        dispatch(getAllOrderPageRequest(currentPage, recordsPerPage))
      }
      dispatch(getAllOrderStatusRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [
    dispatch,
    isFilter,
    isSearchDate,
    currentPage,
    recordsPerPage,
    selectedStatusId,
    startDate,
    endDate
  ])

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (e) => {
    const status_id = e.target.value
    setStatusId(status_id)
    setIsFilter(true)
    setSearchDate(false) // Vô hiệu tìm kiếm theo ngày
    setCurrentPage(1) // Reset về trang đầu
    dispatch(searchOrderByStatusRequest(status_id, 1, recordsPerPage))
  }

  // Xử lý tìm kiếm theo ngày
  const handleSearch = () => {
    if (startDate && endDate) {
      const startDateString = startDate.toLocaleDateString('en-CA') // yyyy-MM-dd
      const endDateString = endDate.toLocaleDateString('en-CA') // yyyy-MM-dd

      dispatch(
        searchOrderByDateRequest(
          startDateString,
          endDateString,
          currentPage,
          recordsPerPage
        )
      )
      setSearchDate(true)
    } else {
      alert('Vui lòng chọn ngày bắt đầu và ngày kết thúc')
    }
  }

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (isSearchDate) {
      dispatch(
        searchOrderByDateRequest(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
          page,
          recordsPerPage
        )
      )
    } else if (isFilter) {
      dispatch(
        searchOrderByStatusRequest(selectedStatusId, page, recordsPerPage)
      )
    } else {
      dispatch(getAllOrderPageRequest(page, recordsPerPage))
    }
  }

  // Reset bộ lọc ngày
  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
    setSearchDate(false)
    setIsFilter(false)
    setCurrentPage(1)
    dispatch(getAllOrderPageRequest(1, recordsPerPage))
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

    orders?.data.forEach((order, index) => {
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
    const exportData = orders.map((order, index) => {
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
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative m-[auto] ml-[40%]">
        <HiOutlineSearch
          fontSize={20}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-[500px] border border-gray-300 rounded-md px-4 py-2 pl-9 focus:font-medium focus:text-primary focus:outline-none focus:ring-1 focus:ring-primary transition duration-500 ease-in-out"
        />
      </div>
      <div className="ml-[15%] w-[90%] font-RobotoMedium">
        <div className="flex justify-between">
          <div className="p-2 flex items-center justify-center gap-2">
            <label>Ngày bắt đầu</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border rounded p-2"
            />
          </div>
          <div className="p-2 flex items-center justify-center gap-2">
            <label>Ngày kết thúc</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border rounded p-2"
            />
            <div className="p-2 flex items-center justify-center gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleSearch}
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          <div className="p-2 flex items-center justify-center gap-2">
            Trạng thái
            <select
              className="p-[3px] rounded-md border-primary border-[1px] text-center text-[13px]"
              value={status || ''}
              onChange={handleStatusChange}
            >
              {/* Tùy chọn mặc định */}
              <option value="">Tất cả</option>
              {/* Lấy danh sách từ orderStatus */}
              {orderStatus?.data?.map((statusItem) => (
                <option key={statusItem.status_id} value={statusItem.status_id}>
                  {statusItem.status_name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-2 mt-3">
            <button
              onClick={() => handleReset()}
              className="text-center text-[10px] bg-primary text-white rounded-md shadow-md uppercase px-1 py-[7px] font-RobotoMedium hover:bg-hoverPrimary transition duration-200 ease-in-out mr-5"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-[90%] ml-[15%] rounded-md shadow-md bg-white mt-2">
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
            {displayedOrder?.data?.map((order, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-gray-100 transition-colors "
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
                <td className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                  {order.address}
                </td>
                <td>{order.total_quantity}</td>
                <td>{order.total_price.toLocaleString('en')} VNĐ</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="text-center align-middle ">
                  <span className="inline-block text-black px-2 py-1 border rounded-md text-sm bg-blue-200">
                    {order?.order_status?.status_name || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Điều khiển phân trang */}
        <div className="flex justify-center items-center gap-4 mt-4 border p-4 rounded-md">
          <button
            className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
            disabled={currentPage === 1} // Disable khi đang ở trang đầu
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} // Chuyển về trang trước hoặc giữ nguyên nếu trang đầu
          >
            Previous
          </button>

          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
            disabled={currentPage === totalPages} // Disable khi đang ở trang cuối
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            } // Chuyển sang trang sau hoặc giữ nguyên nếu trang cuối
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <button
          onClick={exportPDF}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-md hover:bg-hoverPrimary transition duration-300 ease-in-out ml-[20%] hover:scale-110 "
        >
          Xuất PDF
        </button>
        <button
          onClick={exportToExcel}
          className="bg-primary text-white px-4 py-2 rounded-md shadow-md hover:bg-hoverPrimary transition duration-300 ease-in-out ml-1  hover:scale-110  "
        >
          Xuất EXCEL
        </button>
      </div>
    </div>
  )
}

export default AllOrder
