import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { getTransactionDetailRequest } from '../../../redux/actions/actions'

const TransactionDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const transactionDetail = useSelector(
    (state) => state.transactionDetail?.transactionDetail
  )
  useEffect(() => {
    try {
      dispatch(getTransactionDetailRequest(id))
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, id])

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      axios
        .put(
          `http://localhost:9999/api/inventory/transaction/${id}/status`,
          { status: 'REJECT' },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          dispatch(getTransactionDetailRequest(id))
        })
    } catch (error) {
      console.error('Error change order status', error)
    }
  }

  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      axios
        .put(
          `http://localhost:9999/api/inventory/transaction/${id}/status`,
          { status: 'APPROVED' },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          dispatch(getTransactionDetailRequest(id))
        })
    } catch (error) {
      console.error('Error change order status', error)
    }
  }
  return (
    <>
      <div className="flex">
        <div className="flex flex-[0.6] gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-2">
          <div className="w-full ml-5">
            <h5 className="text-left text-lg font-RobotoSemibold text-primary py-3">
              Thông tin phiếu đề nghị nhập kho:
            </h5>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Người lập:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {transactionDetail?.staff_transaction?.first_name +
                  ' ' +
                  transactionDetail?.staff_transaction?.last_name}
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Nội dung nhập hàng:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {transactionDetail?.content}
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Lý do nhập hàng:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {transactionDetail?.note}
              </span>
            </p>
            {transactionDetail?.supplier_transaction?.supplier_name && (
              <p className="p-5">
                <span className="text-primary font-RobotoMedium mr-2">
                  Nhà cung cấp:
                </span>
                <span className="text-primary font-RobotoSemibold">
                  {transactionDetail?.supplier_transaction?.supplier_name}
                </span>
              </p>
            )}

            {transactionDetail?.supplier_transaction?.email && (
              <p className="p-5">
                <span className="text-primary font-RobotoMedium mr-2">
                  Email:
                </span>
                <span className="text-primary font-RobotoSemibold">
                  {transactionDetail?.supplier_transaction?.email}
                </span>
              </p>
            )}

            {transactionDetail?.supplier_transaction?.phone && (
              <p className="p-5">
                <span className="text-primary font-RobotoMedium mr-2">
                  Số điện thoại:
                </span>
                <span className="text-primary font-RobotoSemibold">
                  {transactionDetail?.supplier_transaction?.phone}
                </span>
              </p>
            )}

            {transactionDetail?.supplier_transaction?.address && (
              <p className="p-5">
                <span className="text-primary font-RobotoMedium mr-2">
                  Địa chỉ:
                </span>
                <span className="text-primary font-RobotoSemibold">
                  {transactionDetail?.supplier_transaction?.address}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex-[0.4] w-[80%] ml-[20px] mr-[30px] rounded-md shadow-md bg-white mt-2">
          <div className="ml-5">
            <h5 className="text-left text-lg font-RobotoSemibold text-primary py-3">
              Chi Tiết Hóa Đơn
            </h5>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Tổng số lượng yêu cầu:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {transactionDetail?.total_quantity}
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Tổng tiền:
              </span>
              {transactionDetail?.total_price && (
                <span className="text-primary font-RobotoSemibold">
                  {transactionDetail.total_price.toLocaleString('en')} VNĐ
                </span>
              )}
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Thanh toán:
              </span>
              {transactionDetail?.total_price && (
                <span className="text-primary font-RobotoSemibold">
                  {transactionDetail.total_price.toLocaleString('en')} VNĐ
                </span>
              )}
            </p>
          </div>
        </div>
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
            {transactionDetail?.transactionDetails?.map((orderItem, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="flex items-center">
                  <img
                    className="w-[60px] mt-[2px] rounded-full shadow-md mr-2"
                    src={orderItem?.product_transaction_detail?.image}
                    alt={orderItem?.product_transaction_detail?.product_name}
                  />
                </td>

                <td>
                  <p>{orderItem?.product_transaction_detail?.product_name}</p>
                </td>
                <td>{orderItem?.quantity}</td>
                <td>{orderItem?.price.toLocaleString('en')} VNĐ</td>
                <td>
                  {new Date(transactionDetail.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ml-[18%] w-[80%] flex justify-between">
        <div></div>
        <div className="flex gap-3">
          {transactionDetail?.status === 'WAITING' && (
            <button
              onClick={() => handleCancelOrder()}
              className="mt-5 bg-main text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverRed ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
            >
              Hủy
            </button>
          )}

          {transactionDetail?.status === 'WAITING' && (
            <button
              className="mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
              onClick={() => handleConfirmOrder()}
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default TransactionDetail
