import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getOrderDetailRequest } from '../../../redux/actions/actions'
import axios from 'axios'
import { DASHBOARD_SIDEBAR_TOP_LINKS_SHIPPER } from '../../../constants/MenuLink'
import OrderTracker from '../../../components/Order/OrderTraker'

const OrderShipperDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const orderDetail = useSelector((state) => state.orderDetail.orderDetail)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [nextStatusName, setNextStatusName] = useState('')
  const [statusIndex, setStatusIndex] = useState(0)
  const [statuses, setStatuses] = useState([])

  useEffect(() => {
    try {
      dispatch(getOrderDetailRequest(id))
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, id])
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

  // Xử lý xác nhận đơn hàng
  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:9999/api/shipper/order/${id}/status`,
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

  const handleReceiveOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:9999/api/shipper/order/${id}/accept`,
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
  // Xử lý xác nhận đơn hàng
  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:9999/api/shipper/order/${id}/status`,
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

  return (
    <>
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
      <div className="ml-[18%]">
        <h1 className="uppercase text-center sm:text-left font-RobotoSemibold text-main text-3xl md:text-3xl xl:text-[3rem] mb-5 mt-0 sm:mt-5 md:leading-tight">
          <OrderTracker orderDetail={orderDetail} />
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
                  {orderDetail?.total_price.toLocaleString('en')} VNĐ
                </span>
              )}
            </p>

            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Thanh toán:
              </span>
              {orderDetail?.total_price && (
                <span className="text-primary font-RobotoSemibold">
                  {orderDetail.total_price.toLocaleString('en')} VNĐ
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      {orderDetail?.is_cancel && (
        <div className="flex justify-center items-center bg-gray-200 border border-gray-300 rounded-lg p-4 w-[80%] ml-[18%] mt-2">
          <h1 className="uppercase font-RobotoSemibold text-main text-3xl md:text-3xl xl:text-[3rem] text-center">
            Giao không thành công
          </h1>
        </div>
      )}

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
                    <p>{orderItem?.product_order.product_name}</p>
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
      <div className="ml-[80%]  gap-4">
        {orderDetail.staff_id !== null &&
          !orderDetail?.is_cancel &&
          statusIndex <=
            Math.max(...statuses.map((status) => status.status_index)) && (
            <button
              className=" mr-[10px] mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
              onClick={() => handleCancelOrder()}
            >
              <p>Giao không thành công</p>
            </button>
          )}
        {orderDetail.staff_id !== null &&
          !orderDetail?.is_cancel &&
          statusIndex <=
            Math.max(...statuses.map((status) => status.status_index)) && (
            <button
              className="mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
              onClick={() => handleConfirmOrder()}
            >
              {orderDetail && <p>{nextStatusName}</p>}
            </button>
          )}
        {orderDetail.staff_id === null && !orderDetail?.is_cancel && (
          <button
            className=" mr-[10px] mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
            onClick={() => handleReceiveOrder()}
          >
            <p>Nhận đơn</p>
          </button>
        )}
      </div>
    </>
  )
}

export default OrderShipperDetail
