import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Header from '../../components/Header'
import { DASHBOARD_SIDEBAR_TOP_LINKS_SHIPPER } from '../../../constants/MenuLink'
import { getAllOrderShipperAcceptRequest } from '../../../redux/actions/shipper/action'

const OrderReceiveShipper = () => {
  const dispatch = useDispatch()
  const orders = useSelector(
    (state) => state.orderShipperAccept?.orderShipperAccept
  )
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10 // Số bản ghi mỗi trang
  const totalPages = orders?.totalPages || 1 // Lấy totalPages từ API
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getAllOrderShipperAcceptRequest(currentPage, recordsPerPage))
  }, [dispatch, currentPage, recordsPerPage])
  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
    setStatus('')
  }
  const [hoveredIndex, setHoveredIndex] = useState(null)
  return (
    <>
      <Header />
      <div
        className="fixed bg-primary w-60 h-full p-3 flex flex-col text-white font-RobotoMedium"
        style={{ backgroundColor: 'rgb(199 199 199)' }}
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
          {DASHBOARD_SIDEBAR_TOP_LINKS_SHIPPER.map((link) => (
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
        </div>
      </div>
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
      <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-5">
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
            {orders?.data?.map((order, index) => (
              <tr
                key={index}
                className="cursor-pointer"
                onClick={() => navigate(`/manager/shipper/${order.order_id}`)}
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
                <td className="text-center align-middle ">
                  <span className="inline-block text-black px-2 py-1 border rounded-md text-sm bg-blue-200">
                    {order?.order_status?.status_name || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-4 mt-4 border p-4 rounded-md ml-[200px]">
        <button
          className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
          disabled={currentPage === 1} // Disable khi đang ở trang đầu
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} // Tránh trang âm
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
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          } // Tránh vượt quá totalPages
        >
          Next
        </button>
      </div>
      {/* <div className="w-[80%] ml-[18%] mt-2">
        <div className="flex justify-between font-RobotoMedium">
          <div className="text-primary rounded-md p-2">
            Số đơn hàng: {filteredOrders ? filteredOrders.length : 0}
          </div>
          <div className="text-primary rounded-md p-2">
            Tổng: {totalPrice.toLocaleString('en')} VNĐ
          </div>
        </div>
      </div> */}
    </>
  )
}

export default OrderReceiveShipper
