import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  getAllRequestRequest,
  getOrderDetailRequest
} from '../../redux/actions/actions'
import axios from 'axios'

const AdminOrderDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const orderDetail = useSelector((state) => state.orderDetail.orderDetail)
  const tranRequest = useSelector((state) => state.request.request.data)
  const isOrderInRequest = tranRequest?.some(
    (request) => request?.order_id === orderDetail?.order_id
  )
  const [nextStatusName, setNextStatusName] = useState('')
  const [statusIndex, setStatusIndex] = useState(0)
  const [statuses, setStatuses] = useState([])

  const [check, setCheck] = useState(null)

  const checkTransactionStatus = async (orderId) => {
    try {
      const token = localStorage.getItem('token') // Lấy token từ localStorage
      const response = await axios.get(
        `http://localhost:9999/api/staff/order/check`,
        {
          params: { orderId }, // Truyền tham số orderId
          headers: {
            Authorization: `Bearer ${token}` // Thêm header Authorization
          }
        }
      )

      setCheck(response?.data?.message)
    } catch (error) {
      console.error('Error checking transaction status:', error)
      throw error
    }
  }
  // Lấy chi tiết đơn hàng
  useEffect(() => {
    try {
      dispatch(getOrderDetailRequest(id))
      dispatch(getAllRequestRequest())
      checkTransactionStatus(id) // Gọi hàm kiểm tra trạng thái giao dịch
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, id])

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:9999/api/staff/order/${id}/status`,
        { is_cancel: true },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      dispatch(getOrderDetailRequest(id))
    } catch (error) {
      console.error('Error changing order status', error)
    }
  }

  // Xử lý xác nhận đơn hàng
  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:9999/api/staff/order/${id}/status`,
        { status_index: statusIndex, is_cancel: false },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      dispatch(getOrderDetailRequest(id))
    } catch (error) {
      console.error('Error changing order status', error)
    }
  }
  const handleCreateExportInventory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token is missing or invalid')
        return
      }

      const response = await axios.post(
        `http://localhost:9999/api/staff/order/${id}/create/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      dispatch(getOrderDetailRequest(id)) // Gọi lại để lấy dữ liệu sau khi tạo phiếu
      dispatch(getAllRequestRequest())
    } catch (error) {
      console.error('Error changing order status', error)
    }
  }
  console.log('dd', check)
  // Lấy tên trạng thái tiếp theo
  useEffect(() => {
    const fetchNextStatusName = async () => {
      if (!orderDetail || !orderDetail.order_status) {
        setNextStatusName('Không có trạng thái hiện tại')
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'http://localhost:9999/api/manager/order-status/all',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        const statusesData = response?.data?.data || []
        setStatuses(statusesData)

        const currentStatusIndex = orderDetail.order_status.status_index
        setStatusIndex(currentStatusIndex + 1)

        const nextStatus = statusesData.find(
          (status) => status.status_index === currentStatusIndex + 1
        )

        setNextStatusName(
          nextStatus ? nextStatus.status_name : 'Không có trạng thái tiếp theo'
        )
      } catch (error) {
        setNextStatusName('Không thể lấy trạng thái tiếp theo')
      }
    }

    fetchNextStatusName()
  }, [orderDetail])

  return (
    <>
      <div className="flex justify-center items-center bg-gray-200 border border-gray-300 rounded-lg p-4">
        <h1 className="uppercase font-RobotoSemibold text-main text-3xl md:text-3xl xl:text-[3rem] text-center">
          {orderDetail?.is_cancel
            ? 'Đã huỷ'
            : orderDetail?.order_status?.status_name}
        </h1>
      </div>

      <div className="flex">
        <div className="flex flex-[0.6] gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-2">
          <div className="w-full ml-5">
            <h5 className="text-left text-lg font-RobotoSemibold text-primary py-3">
              Thông Tin Nhận Hàng
            </h5>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Họ Và Tên:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {orderDetail?.recipient_name}
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Địa Chỉ Nhận Hàng:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {orderDetail?.address}
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Số Điện Thoại:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {orderDetail?.recipient_phone}
              </span>
            </p>
          </div>
        </div>

        <div className="flex-[0.4] w-[80%] ml-[20px] mr-[30px] rounded-md shadow-md bg-white mt-2">
          <div className="ml-5">
            <h5 className="text-left text-lg font-RobotoSemibold text-primary py-3">
              Chi Tiết Hóa Đơn
            </h5>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Tổng số lượng:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {orderDetail?.total_quantity}
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Tổng tiền:
              </span>
              {orderDetail?.total_price && (
                <span className="text-primary font-RobotoSemibold">
                  {orderDetail.total_price.toLocaleString('en')} VNĐ
                </span>
              )}
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Phí vận chuyển:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {(20000).toLocaleString('en')} VNĐ
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Thanh toán:
              </span>
              {orderDetail?.total_price && (
                <span className="text-primary font-RobotoSemibold">
                  {(orderDetail.total_price + 20000).toLocaleString('en')} VNĐ
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center bg-gray-200 border border-gray-300 rounded-lg p-4">
        <h1 className="uppercase font-RobotoSemibold text-main text-3xl md:text-3xl xl:text-[3rem] text-center">
          {check === 'True' ? 'Kho đã xác nhận' : 'Kho chưa xác nhận'}
        </h1>
      </div>
      <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-5">
        <table className="w-full text-gray-700">
          <thead className="text-white font-RobotoSemibold text-[18px] ">
            <tr className="bg-primary">
              <td className="rounded-s-md">STT</td>
              <td>Hình Ảnh</td>
              <td>Sản Phẩm</td>
              <td>Số Lượng</td>
              <td>Đơn Giá</td>
              <td className="rounded-e-md">Ngày Đặt</td>
            </tr>
          </thead>
          <tbody>
            {orderDetail?.orderDetails &&
              orderDetail.orderDetails.map((orderItem, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="flex items-center">
                    <img
                      className="w-[60px] mt-[2px] rounded-full shadow-md mr-2"
                      src={orderItem?.product_order.image}
                      alt={orderItem?.product_order.product_name}
                    />
                  </td>

                  <td>
                    <p>{orderItem?.product_order?.product_name}</p>
                    <span className="text-[12px]">
                      {
                        orderItem?.product_order?.category_product
                          ?.category_name
                      }
                    </span>
                  </td>
                  <td>{orderItem?.quantity}</td>
                  <td>
                    {orderItem.product_order.updatePrices[0].price_new.toLocaleString(
                      'en'
                    )}{' '}
                    VNĐ
                  </td>
                  <td>
                    {new Date(orderDetail.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="ml-[18%] w-[80%] flex justify-between">
        <div></div>
        <div className="flex gap-3">
          {!orderDetail?.is_cancel &&
            (check === 'False' || check === null) &&
            orderDetail?.order_status?.status_index === 1 && (
              <button
                onClick={() => handleCancelOrder()}
                className="mt-5 bg-main text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverRed ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
              >
                Hủy Đơn Hàng
              </button>
            )}

          {!orderDetail?.is_cancel &&
            check === 'True' &&
            statusIndex <=
              Math.max(...statuses.map((status) => status.status_index)) && (
              <button
                className="mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
                onClick={() => handleConfirmOrder()}
              >
                {orderDetail && <p>{nextStatusName}</p>}
              </button>
            )}
          {!isOrderInRequest && (
            <button
              className="mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
              onClick={() => handleCreateExportInventory()}
            >
              Tạo phiếu xuất kho
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminOrderDetail
