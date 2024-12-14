import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { getOrderStatusText } from '../../constants/Status'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as XLSX from 'xlsx'
import { getAllOrderStatusRequest } from '../../redux/actions/order-status/action'
import {
  getAllOrderPageRequest,
  searchOrderByDateAndStatusRequest,
  searchOrderByDateRequest,
  searchOrderByInfoRequest,
  searchOrderByStatusRequest
} from '../../redux/actions/order/action'
const AllOrder = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const orders = useSelector((state) => state?.order_page?.order_page)
  const dateFindOrder = useSelector((state) => state?.orderByDate?.orderByDate)
  const orderStatus = useSelector((state) => state?.order_status?.order_status)
  const orderInfo = useSelector((state) => state?.orderByInfo?.orderByInfo)
  const orderStatusDate = useSelector(
    (state) => state?.orderByDateStatus?.orderByDateStatus
  )

  const statusFindOrder = useSelector(
    (state) => state?.orderByStatus?.orderByStatus
  )

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedStatusId, setStatusId] = useState('')
  const [searchRecipientName, setRecipientName] = useState('')
  const [searchRecipientPhone, setRecipientPhone] = useState('')
  const [isFilter, setIsFilter] = useState(false)
  const [isSearchDate, setSearchDate] = useState(false)
  const [isSearchRecipientName, setIsSearchRecipientName] = useState(false)
  const [isSearchRecipientPhone, setIsSearchRecipientPhone] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10 // Số bản ghi mỗi trang

  const displayedOrder = (() => {
    if (
      startDate &&
      endDate &&
      isSearchRecipientName &&
      isSearchRecipientPhone
    ) {
      return orderInfo
    }
    if (
      isSearchDate &&
      isFilter &&
      startDate &&
      endDate &&
      selectedStatusId &&
      !isSearchRecipientName &&
      !isSearchRecipientPhone
    ) {
      // Khi tìm kiếm theo ngày và trạng thái

      return orderStatusDate
    }

    if (
      isSearchDate &&
      startDate &&
      endDate &&
      !isSearchRecipientName &&
      !isSearchRecipientPhone
    ) {
      return dateFindOrder
    }

    if (
      isFilter &&
      statusFindOrder &&
      !isSearchRecipientName &&
      !isSearchRecipientPhone
    ) {
      return statusFindOrder
    }

    // Mặc định hiển thị tất cả đơn hàng
    return orders
  })()

  // Tổng số trang
  const totalPages =
    isSearchDate && isFilter && orderStatusDate
      ? orderStatusDate?.totalPages || 1
      : isSearchDate
        ? dateFindOrder?.totalPages || 1
        : isFilter
          ? statusFindOrder?.totalPages || 1
          : orders?.totalPages || 1

  // Fetch dữ liệu khi có thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          isSearchRecipientName &&
          isSearchRecipientPhone &&
          startDate &&
          endDate
        ) {
          // Khi tìm kiếm theo name, phone, và ngày
          await dispatch(
            searchOrderByInfoRequest(
              formatDate(startDate),
              formatDate(endDate),
              selectedStatusId || '', // Nếu không chọn trạng thái, để chuỗi rỗng
              searchRecipientName,
              searchRecipientPhone,
              currentPage,
              recordsPerPage
            )
          )
        } else if (
          isSearchDate &&
          isFilter &&
          startDate &&
          endDate &&
          selectedStatusId
        ) {
          // Khi tìm kiếm theo date và trạng thái
          await dispatch(
            searchOrderByDateAndStatusRequest(
              formatDate(startDate),
              formatDate(endDate),
              selectedStatusId,
              currentPage,
              recordsPerPage
            )
          )
        } else if (isSearchDate && startDate && endDate) {
          // Khi tìm kiếm chỉ theo ngày
          await dispatch(
            searchOrderByDateRequest(
              formatDate(startDate),
              formatDate(endDate),
              currentPage,
              recordsPerPage
            )
          )
        } else if (isFilter && selectedStatusId) {
          // Khi tìm kiếm chỉ theo trạng thái
          await dispatch(
            searchOrderByStatusRequest(
              selectedStatusId,
              currentPage,
              recordsPerPage
            )
          )
        } else {
          // Mặc định hiển thị tất cả đơn hàng
          await dispatch(getAllOrderPageRequest(currentPage, recordsPerPage))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [
    dispatch,
    isFilter,
    isSearchDate,
    currentPage,
    recordsPerPage,
    selectedStatusId,
    startDate,
    endDate,
    isSearchRecipientName,
    isSearchRecipientPhone,
    searchRecipientName,
    searchRecipientPhone
  ])

  // Fetch danh sách trạng thái khi component render lần đầu
  useEffect(() => {
    dispatch(getAllOrderStatusRequest())
  }, [dispatch])
  // Xử lý thay đổi trạng thái
  const handleStatusChange = (e) => {
    const status_id = e.target.value
    if (status_id === '') {
      setStatusId('')
      setIsFilter(false)
      setCurrentPage(1)
      dispatch(getAllOrderPageRequest(1, recordsPerPage))
    } else {
      setStatusId(status_id) // Cập nhật trạng thái
      setIsFilter(true)
      setSearchDate(false) // Vô hiệu tìm kiếm theo ngày
      setCurrentPage(1) // Reset về trang đầu
      dispatch(searchOrderByStatusRequest(status_id, 1, recordsPerPage)) // Dispatch action
    }
  }
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  // Xử lý tìm kiếm theo ngày
  const handleSearch = () => {
    if (
      startDate &&
      endDate &&
      !isSearchRecipientName &&
      !isSearchRecipientPhone
    ) {
      const startDateString = formatDate(startDate) // yyyy-MM-dd
      const endDateString = formatDate(endDate) // yyyy-MM-dd

      if (
        selectedStatusId &&
        !isSearchRecipientName &&
        !isSearchRecipientPhone
      ) {
        dispatch(
          searchOrderByDateAndStatusRequest(
            startDateString,
            endDateString,
            selectedStatusId,
            1,
            recordsPerPage
          )
        )
        setSearchDate(true)
        setIsFilter(true)
      } else if (
        !selectedStatusId &&
        !isSearchRecipientName &&
        !isSearchRecipientPhone
      ) {
        dispatch(
          searchOrderByDateRequest(
            startDateString,
            endDateString,
            1,
            recordsPerPage
          )
        )
        setSearchDate(true)
        setIsFilter(false)
      }
      setCurrentPage(1) // Reset về trang đầu
    } else {
      alert('Vui lòng chọn ngày bắt đầu và ngày kết thúc')
    }
  }

  const handleSearchInfo = () => {
    if (startDate && endDate && searchRecipientName && searchRecipientPhone) {
      const startDateString = formatDate(startDate) // yyyy-MM-dd
      const endDateString = formatDate(endDate) // yyyy-MM-dd

      setIsSearchRecipientName(true)
      setIsSearchRecipientPhone(true)
      setSearchDate(false)
      setIsFilter(false)

      dispatch(
        searchOrderByInfoRequest(
          startDateString,
          endDateString,
          selectedStatusId || '', // Để trạng thái rỗng nếu không có
          searchRecipientName,
          searchRecipientPhone,
          1,
          recordsPerPage
        )
      )
      setCurrentPage(1) // Reset về trang đầu
    } else {
      alert('Vui lòng nhập đầy đủ thông tin tên và số điện thoại')
    }
  }

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page)
    if (
      isSearchDate &&
      isFilter &&
      !isSearchRecipientName &&
      !isSearchRecipientPhone
    ) {
      const startDateString = formatDate(startDate) // yyyy-MM-dd
      const endDateString = formatDate(endDate) // yyyy-MM-dd

      dispatch(
        searchOrderByDateAndStatusRequest(
          startDateString,
          endDateString,
          selectedStatusId,
          page,
          recordsPerPage
        )
      )
    } else if (isSearchDate) {
      const startDateString = formatDate(startDate) // yyyy-MM-dd
      const endDateString = formatDate(endDate) // yyyy-MM-dd

      dispatch(
        searchOrderByDateRequest(
          startDateString,
          endDateString,
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

  // Xử lý thay đổi trạng thái
  const handleSearchRecipientNameChange = (e) => {
    const recipient_name = e.target.value
    setRecipientName(recipient_name)
  }
  const handleSearchRecipientPhoneChange = (e) => {
    const recipient_phone = e.target.value
    setRecipientPhone(recipient_phone)
  }
  // Reset bộ lọc và tìm kiếm
  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
    setStatusId('')
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
      <div className="relative m-[auto] ml-[10%]">
        <div className="p-2 flex items-center gap-4 ml-[75px]">
          {/* Ô nhập tên người nhận */}
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-1">Tên người nhận</label>
            <input
              type="text"
              value={searchRecipientName}
              onChange={handleSearchRecipientNameChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:font-medium focus:outline-none focus:ring-1 focus:ring-primary w-full"
              placeholder="Nhập tên người nhận..."
            />
          </div>

          {/* Ô nhập số điện thoại */}
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-1">Số điện thoại</label>
            <input
              type="number"
              value={searchRecipientPhone}
              onChange={handleSearchRecipientPhoneChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:font-medium focus:outline-none focus:ring-1 focus:ring-primary w-full"
              placeholder="Nhập số điện thoại..."
            />
          </div>

          {/* Nút Tra đơn hàng */}
          <div className="self-end">
            <button
              className="text-center text-[15px] bg-primary text-white rounded-md shadow-md uppercase px-4 py-2 font-RobotoMedium
             hover:bg-hoverPrimary transition duration-200 ease-in-out"
              onClick={handleSearchInfo}
            >
              Tra đơn hàng
            </button>
          </div>
        </div>
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
          </div>

          <div className="p-2 flex items-center justify-center gap-2">
            Trạng thái
            <select
              className="p-[3px] rounded-md border-primary border-[1px] text-center text-[15px]"
              value={selectedStatusId}
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
          <div className="p-2 flex items-center justify-center gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
          <div className="p-2 flex items-center justify-center gap-2">
            <button
              onClick={() => handleReset()}
              className="text-center text-[15px]  bg-primary text-white rounded-md shadow-md uppercase px-1 py-[7px] font-RobotoMedium hover:bg-hoverPrimary transition duration-200 ease-in-out mr-5"
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
