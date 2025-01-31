import { useEffect, useState } from 'react'
import OrderItem from '../../components/Order/OrderItem'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getAllOrderStatusCustomerRequest } from '../../redux/actions/order-status/action'
import {
  getAllOrderCustomerPageRequest,
  getAllOrderStatusCustomerPageRequest,
  seacrchOrderCustomerByDatePageRequest
} from '../../redux/actions/customer/action'

const OrdersHistory = () => {
  const dispatch = useDispatch()
  const customerOrders = useSelector(
    (state) => state?.orderCustomerPage?.orderCustomerPage
  )
  const orderStatusCustomer = useSelector(
    (state) => state?.orderStatusCustomer?.orderStatusCustomer
  )

  const orderStatusCustomerPage = useSelector(
    (state) => state?.orderStatusCustomerPage?.orderStatusCustomerPage
  )

  const searchOrderCustomerPage = useSelector(
    (state) => state?.searchOrderByDate?.searchOrderByDate
  )
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [filter, setFilter] = useState(false)
  const [selectedStatusId, setStatusId] = useState(0)
  const [sortOrder, setSortOrder] = useState('asc') // Trạng thái bộ lọc
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10 // Số bản ghi mỗi trang
  const totalPages = customerOrders?.totalPages || 1 // Tổng số trang từ API

  const displayedOrder = (() => {
    if (selectedStatusId == 0 && !filter) {
      return customerOrders
    } else if (selectedStatusId != 0 && !filter) {
      return orderStatusCustomerPage
    } else if (filter) {
      return searchOrderCustomerPage
    }
  })()

  useEffect(() => {
    dispatch(getAllOrderStatusCustomerRequest())
    try {
      if (selectedStatusId == 0 && !filter) {
        dispatch(
          getAllOrderCustomerPageRequest(
            currentPage,
            recordsPerPage,
            'created_at',
            sortOrder
          )
        )
      } else if (selectedStatusId == -1) {
        dispatch(
          getAllOrderStatusCustomerPageRequest(
            { status_id: selectedStatusId, is_cancel: true },
            currentPage,
            recordsPerPage,
            'created_at',
            sortOrder
          )
        )
      } else {
        dispatch(
          getAllOrderStatusCustomerPageRequest(
            { status_id: selectedStatusId, is_cancel: false },
            currentPage,
            recordsPerPage,
            'created_at',
            sortOrder
          )
        )
      }
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, currentPage, sortOrder, selectedStatusId])
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
    setFilter(false)
    setStatusId(0)
    setSortOrder('asc')
  }
  const handleSearch = () => {
    dispatch(
      seacrchOrderCustomerByDatePageRequest(
        formatDate(startDate),
        formatDate(endDate),
        currentPage,
        recordsPerPage,
        'created_at',
        sortOrder
      )
    )

    setFilter(true)
  }

  const handleStatusChange = (e) => {
    const status_id = e.target.value

    setStatusId(status_id)
  }
  return (
    <>
      <section className="relative flex flex-col-reverse md:flex-row items-center bg-[url('https://www.highlandscoffee.com.vn/vnt_upload/cake/SPECIALTYCOFFEE/Untitled-1-01.png')]">
        <div className="relative md:w-full pt-[80px]">
          <div className="py-[40px] px-7 lg:px-14 md:py-14 w-full">
            <h1 className="uppercase text-center sm:text-left font-RobotoSemibold text-main text-3xl md:text-3xl xl:text-[3rem] mb-5 mt-0 sm:mt-5 md:leading-tight">
              Lịch Sử Đơn Hàng
            </h1>
          </div>
        </div>
      </section>

      <section className="mt-[80px] mb-[20px] md:mt-[100px] md:mb-[100px] px-4">
        <div className="flex py-5 flex-col sm:flex-row justify-start sm:justify-between items-center lg:w-10/12 mx-auto">
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
          <button
            className="text-[14px] bg-primary text-white rounded-md shadow-md uppercase px-5 py-[5px] font-RobotoMedium hover:bg-hoverPrimary transition duration-200 ease-in-out"
            onClick={() => handleSearch()}
          >
            Tìm kiếm
          </button>

          <div className="p-2 flex items-center justify-center gap-2">
            Trạng thái
            <select
              className="p-[3px] rounded-md border-primary border-[1px] text-center text-[15px]"
              value={selectedStatusId}
              onChange={handleStatusChange}
            >
              {/* Tùy chọn mặc định */}
              <option value={0}>Tất cả</option>
              {/* Lấy danh sách từ orderStatus */}
              {orderStatusCustomer?.data?.map((statusItem) => (
                <option key={statusItem.status_id} value={statusItem.status_id}>
                  {statusItem.status_name}
                </option>
              ))}
              <option value={-1}>Đã huỷ</option>
            </select>
          </div>
          <div className="flex justify-end p-4">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
          <div className="p-2">
            <button
              onClick={() => handleReset()}
              className="text-[14px] bg-primary text-white rounded-md shadow-md uppercase px-5 py-[7px] font-RobotoMedium hover:bg-hoverPrimary transition duration-200 ease-in-out"
            >
              Reset filter
            </button>
          </div>
        </div>

        <div className="w-full lg:px-32 relative my-10">
          <div className="space-y-3">
            {displayedOrder?.data?.length > 0 ? (
              displayedOrder?.data?.map((order, index) => (
                <OrderItem key={index} order={order} />
              ))
            ) : (
              <p
                style={{
                  color: 'red',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: '50px'
                }}
              >
                KHÔNG CÓ ĐƠN HÀNG NÀO
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-4 border p-4 rounded-md ml-[200px]">
          <button
            className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
        <div className="ml-[8%] flex py-3 justify-between font-RobotoMedium lg:w-10/12">
          <div className="text-primary rounded-md p-2">
            Số đơn hàng: {customerOrders.data ? customerOrders?.data.length : 0}
          </div>
          <div className="text-primary rounded-md p-2">
            Tổng: {customerOrders.toLocaleString('en')} VNĐ
          </div>
        </div>
      </section>
    </>
  )
}

export default OrdersHistory
