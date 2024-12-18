import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getOrderDetailRequest } from '../../redux/actions/actions'
import axios from 'axios'
import { getAllRequestExportRequest } from '../../redux/actions/inventory/manager/action'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const AdminOrderDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const orderDetail = useSelector((state) => state.orderDetail.orderDetail)
  const tranRequest = useSelector(
    (state) => state.request_export.request_export.data
  )
  const isOrderInRequest = tranRequest?.some(
    (request) => request?.order_id === orderDetail?.order_id
  )

  const [showModal, setShowModal] = useState(false) // State điều khiển modal

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
      dispatch(getAllRequestExportRequest())
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
        `http://localhost:9999/api/staff/order/${id}/order-shipper`,
        { is_delivery: true },
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

      await axios.post(
        `http://localhost:9999/api/staff/order/${id}/create/request`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      dispatch(getOrderDetailRequest(id)) // Gọi lại để lấy dữ liệu sau khi tạo phiếu
      dispatch(getAllRequestExportRequest())
    } catch (error) {
      console.error('Error changing order status', error)
    }
  }
  // Lấy tên trạng thái tiếp theo

  const invoiceRef = useRef() // Tạo tham chiếu tới hóa đơn

  // Hàm xuất PDF
  const generatePDF = () => {
    const input = invoiceRef.current
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save('hoa_don.pdf')
    })
  }

  return (
    <>
      <div className="flex justify-center items-center bg-gray-200 border border-gray-300 rounded-lg p-4 w-[80%] ml-[18%]">
        <h1 className="uppercase font-RobotoSemibold text-main text-3xl md:text-3xl xl:text-[3rem] text-center">
          {orderDetail?.is_delivery
            ? 'Đã chuyển giao hàng'
            : orderDetail?.order_status?.status_index > 1
              ? orderDetail?.order_status?.status_name
              : orderDetail?.is_cancel
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

        <div className="flex-[0.4] w-[80%] ml-[10px] mr-[30px] rounded-md shadow-md bg-white mt-2">
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

      <div className="flex justify-center items-center bg-gray-200 border border-gray-300 rounded-lg p-4 w-[80%] ml-[18%] mt-2">
        <h1 className="uppercase font-RobotoSemibold text-main text-3xl md:text-3xl xl:text-[3rem] text-center">
          {check === 'True' ? 'Kho đã xác nhận' : 'Kho chưa xác nhận'}
        </h1>
      </div>
      <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-2">
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
                  </td>
                  <td>{orderItem?.quantity}</td>
                  <td>{orderItem.price.toLocaleString('en')} VNĐ</td>
                  <td>
                    {new Date(orderDetail.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Nút hiển thị modal */}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md w-3/4">
            <h2 className="text-center text-2xl font-bold mb-4">
              HÓA ĐƠN BÁN HÀNG
            </h2>

            {/* Nội dung hóa đơn */}
            <div ref={invoiceRef} className="p-4 border rounded">
              <p>
                <strong>Họ và Tên:</strong> {orderDetail?.recipient_name}
              </p>
              <p>
                <strong>Địa Chỉ:</strong> {orderDetail?.address}
              </p>
              <p>
                <strong>Số Điện Thoại:</strong> {orderDetail?.recipient_phone}
              </p>

              <table className="table-auto w-full mt-4 border-collapse border">
                <thead>
                  <tr>
                    <th className="border">STT</th>
                    <th className="border">Tên sản phẩm</th>
                    <th className="border">Hình ảnh</th>
                    <th className="border">Số lượng</th>
                    <th className="border">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail?.orderDetails &&
                    orderDetail.orderDetails.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="border">{index + 1}</td>
                        <td className="border">
                          {item?.product_order?.product_name}
                        </td>
                        <td className="border">
                          <img
                            src={item?.product_order?.image}
                            alt={item?.product_order?.product_name}
                            className="w-[50px] mx-auto"
                          />
                        </td>
                        <td className="border">{item?.quantity}</td>
                        <td className="border">
                          {item.price.toLocaleString()} VNĐ
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Nút điều khiển */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={generatePDF}
                className="mt-5 ml-[65%] bg-main text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverRed ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
              >
                Xuất PDF
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="mt-5  bg-gray-600 text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverRed ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="ml-[18%] w-[80%] flex justify-between">
        <button
          onClick={() => setShowModal(true)}
          className="mt-5 ml-auto bg-main text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverRed ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
        >
          Tạo Hóa Đơn
        </button>

        <div className="flex gap-3">
          {!orderDetail?.is_cancel &&
            (check === 'False' || check === null) &&
            orderDetail?.order_status?.status_index === 1 && (
              <button
                onClick={() => handleCancelOrder()}
                className={`mt-5 bg-main text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverRed ease-out duration-300 transform transition-all ${
                  orderDetail?.is_cancel &&
                  (check === 'True' || check === null) &&
                  orderDetail?.order_status?.status_index !== 1
                    ? 'translate-x-20 opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}
              >
                Hủy Đơn Hàng
              </button>
            )}
          {!orderDetail?.is_cancel &&
            check === 'True' &&
            !orderDetail?.is_delivery && (
              <button
                onClick={() => handleConfirmOrder()}
                className={`mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform transition-all ${
                  orderDetail?.is_delivery
                    ? 'translate-x-20 opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}
              >
                Chuyển giao hàng
              </button>
            )}
          {!isOrderInRequest && (
            <button
              onClick={() => handleCreateExportInventory()}
              className={`mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform transition-all ${
                isOrderInRequest
                  ? 'translate-x-20 opacity-0'
                  : 'translate-x-0 opacity-100'
              }`}
            >
              Tạo phiếu đề nghị xuất kho
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminOrderDetail
