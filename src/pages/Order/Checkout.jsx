import { useCallback, useEffect, useState } from 'react'
import OrderTracker from '../../components/Order/OrderTraker'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CartItem from '../../components/Cart/CartItem'
import {
  getAllCartRequest,
  getUserProfileRequest
} from '../../redux/actions/actions'
import { toast } from 'react-toastify'

const Checkout = () => {
  const activeStep = -1
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cart = useSelector((state) => state.cart.cart)
  // const user = useSelector((state) => state.user.user.data)
  const [address, setAddress] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: ''
  })
  useEffect(() => {
    dispatch(getUserProfileRequest())
  }, [dispatch])

  const getAllCart = useCallback(() => {
    dispatch(getAllCartRequest())
  }, [dispatch])

  useEffect(() => {
    getAllCart()
  }, [getAllCart])

  // const handleOrderButtonClick = () => {
  //   dispatch(addOrderRequest())
  // }

  const token = localStorage.getItem('token')
  // Calculate total price
  // const totalPrice = quantity * product.updatePrices[0].price_new

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleAddressSave = () => {
    let hasError = false
    const newErrors = {
      recipientName: '',
      recipientPhone: '',
      shippingAddress: ''
    }

    if (!recipientName) {
      newErrors.recipientName = 'Recipient name is required.'
      hasError = true
    }

    if (!shippingAddress) {
      newErrors.shippingAddress = 'Shipping address is required.'
      hasError = true
    }

    if (!recipientPhone) {
      newErrors.recipientPhone = 'Recipient phone is required.'
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }
    // Clear errors and set address
    setErrors({
      recipientName: '',
      recipientPhone: '',
      shippingAddress: ''
    })
    setAddress(`${recipientName}, ${recipientPhone}, ${shippingAddress}`)
    setError(null)

    handleCloseModal()
  }

  const handleOrder = async () => {
    const cleanCart = cart?.data?.map((item) => {
      return Object.entries(item).reduce((acc, [key, value]) => {
        if (value !== null) {
          acc[key] = value // Chỉ thêm các trường khác null
        }
        return acc
      }, {})
    })
    if (!address) {
      setError('Please enter a shipping address.')
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(null)
    const body = JSON.stringify({
      cart: cleanCart,
      total_price,
      address,
      recipient_name: recipientName,
      note,
      recipient_phone: recipientPhone
    })
    console.log(body)
    try {
      const response = await fetch(
        'http://localhost:9999/api/customer/order/buy-cart',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            cart: cart?.data,
            total_price,
            address,
            recipient_name: recipientName,
            note,
            recipient_phone: recipientPhone
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const data = await response.json()
      toast.success('Đặt hàng thành công')

      if (data.code === 201) {
        setSuccess('Order placed successfully!')
        navigate('/orders-history')
        console.log(success)
      } else {
        setSuccess('Order placed fail!')
        console.log(success)
      }
    } catch (error) {
      setError(error.message)
      console.log(success)
    } finally {
      setLoading(false)
    }
  }
  const handlePayNow = async () => {
    // Xử lý cart và loại bỏ các giá trị null
    const cleanCart = cart?.data?.map((item) => {
      return Object.entries(item).reduce((acc, [key, value]) => {
        if (value !== null) {
          acc[key] = value // Chỉ thêm các trường khác null
        }
        return acc
      }, {})
    })

    // Kiểm tra địa chỉ nhận hàng
    if (!address) {
      setError('Please enter a shipping address.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    // Chuẩn bị dữ liệu body cho yêu cầu POST
    const body = {
      cart: cleanCart,
      total_price,
      address,
      recipient_name: recipientName,
      note,
      recipient_phone: recipientPhone
    }

    try {
      // Gửi yêu cầu POST đến backend để tạo thanh toán
      const response = await fetch(
        'http://localhost:9999/api/customer/payment/paypal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        }
      )

      // Kiểm tra phản hồi
      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      // Lấy dữ liệu phản hồi từ backend
      const data = await response.json()
      toast.success('Đặt hàng thành công')
      // Kiểm tra và điều hướng người dùng đến trang thanh toán của PayPal
      if (data.code === 200) {
        const paymentUrl = data.message // URL chuyển hướng đến PayPal
        window.location.href = paymentUrl // Chuyển hướng đến PayPal
      } else {
        setSuccess('Order placed fail!')
      }
    } catch (error) {
      // Xử lý lỗi
      setError(error.message)
      console.log('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const total_price = cart?.data?.reduce((total, item) => {
    // Lấy giá trị discounted_price và quantity từ mỗi item
    const discountedPrice = item.discounted_price || 0 // Đảm bảo giá trị không null/undefined
    const quantity = item.quantity || 0 // Đảm bảo giá trị không null/undefined

    // Cộng dồn vào tổng
    return total + discountedPrice * quantity
  }, 0)

  return (
    <>
      <section className="relative flex flex-col-reverse md:flex-row items-center bg-[url('https://www.highlandscoffee.com.vn/vnt_upload/cake/SPECIALTYCOFFEE/Untitled-1-01.png')]">
        <div className="relative md:w-full pt-[80px]">
          <div className="py-[40px] px-7 lg:px-14 md:py-14 w-full">
            <h1 className="uppercase text-center sm:text-left font-RobotoSemibold text-main text-3xl md:text-3xl xl:text-[3rem] mb-5 mt-0 sm:mt-5 md:leading-tight">
              <OrderTracker activeStep={activeStep} />
            </h1>
          </div>
        </div>
      </section>
      <section className="p-6">
        <div className="p-10 flex">
          <div className="flex items-center mt-5">
            <input
              type="text"
              value={address || error}
              readOnly
              placeholder="Nhập thông tin giao hàng"
              className="border border-gray-300 p-2 rounded mr-2 w-[1000px]"
            />
            <button
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleOpenModal}
            >
              Nhập thông tin giao hàng
            </button>
          </div>
          {success && <p className="text-green mt-4">{success}</p>}
          {isModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
              <div
                className="bg-white border border-gray-200 p-5 rounded-lg shadow-lg w-80"
                style={{ width: 600 }}
              >
                <h2 className="text-xl font-bold mb-4">
                  Nhập thông tin giao hàng
                </h2>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Tên người nhận
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 mt-1">{errors.recipientName}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Địa chỉ nhận hàng
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-500 mt-1">
                      {errors.shippingAddress}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Số điện thoại người nhận
                  </label>
                  <input
                    type="number"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                  {errors.recipientPhone && (
                    <p className="text-red-500 mt-1">{errors.recipientPhone}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Note</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    style={{ marginTop: 10 }}
                    onClick={handleAddressSave}
                  >
                    Save
                  </button>
                  <button
                    className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    style={{ marginTop: 10 }}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="border p-5 bg-white shadow-lg rounded-md ml-[5%]">
            <p className="font-bold  pb-4 uppercase">Chi Tiết Hóa Đơn</p>
            <hr />

            <div className="space-y-3 font-semibold">
              <div className="flex justify-between pt-3 text-black ">
                <span>Tổng</span>
                <span style={{ justifyContent: 'flex-end' }}>
                  {total_price.toLocaleString('en')} VNĐ
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Thanh Toán</span>
                <span className="text-green-700">
                  {total_price.toLocaleString('en')} VNĐ
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-5">
              <button
                onClick={handleOrder}
                className="w-[50%] bg-green-500 bg-primary text-white p-2 rounded-md mt-5 shadow-md hover:bg-main transition duration-300 ease-in-out"
              >
                {loading ? 'Placing order...' : 'Đặt hàng'}
              </button>
              <button
                className="w-[50%] bg-green-500 bg-primary text-white p-2 rounded-md mt-5 shadow-md hover:bg-main transition duration-300 ease-in-out"
                onClick={handlePayNow}
              >
                {loading ? 'Placing order...' : 'Thanh toán'}
              </button>
            </div>
          </div>
        </div>
        <div className="lg:grid grid-cols-3 lg:px-16">
          <div className="lg:col-span-2 lg:px-5 ">
            <div className="space-y-3">
              {cart.data &&
                cart?.data?.length > 0 &&
                cart?.data?.map((item, index) => (
                  <CartItem key={index} cart={item} isCheckout={true} />
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Checkout
