import axios from 'axios'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSelector, useDispatch } from 'react-redux'
import {
  getAllCartRequest,
  getAllCouponsRequest
} from '../../redux/actions/actions'

const CartItem = ({ cart, onQuantityChange, onDeleteSuccess }) => {
  const dispatch = useDispatch()
  const { product_cart } = cart
  const coupons = useSelector((state) => state.coupons.coupons.data)

  const cart_get = useSelector((state) => state.cart.cart.data)
  const [discountedPrice, setDiscountedPrice] = useState(null)
  // Function to handle quantity change
  const price = product_cart?.updatePrices[0]?.price_new
  useEffect(() => {
    dispatch(getAllCouponsRequest())
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(coupons) && coupons.length > 0) {
      const now = new Date()

      // Find valid coupon
      const validCoupon = coupons.find((coupon) => {
        const startDate = new Date(coupon.start_date)
        const endDate = new Date(coupon.end_date)
        return now >= startDate && now <= endDate
      })

      if (validCoupon && validCoupon.couponDetails.length > 0) {
        // Filter active coupon details for the current product
        const activeCouponDetails = validCoupon.couponDetails.filter(
          (detail) =>
            detail.status === 'ACTIVE' &&
            detail.product_id === product_cart?.product_id
        )

        if (activeCouponDetails.length > 0) {
          // Assuming each detail has a percentage discount
          const maxPercent = Math.max(
            ...activeCouponDetails.map(
              (detail) => parseFloat(detail.percent) || 0
            )
          )

          // Calculate discount amount and apply it
          const discountAmount = price * maxPercent
          const newPrice = price - discountAmount
          setDiscountedPrice(Math.ceil(newPrice).toLocaleString('en'))
        }
      }
    }
  }, [coupons, price, product_cart?.product_id])
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity <= product_cart?.quantity) {
      try {
        const apiUrl = 'http://localhost:9999/api/customer/cart/update/quantity'
        const requestBody = {
          product_id: product_cart?.product_id,
          quantity: newQuantity
        }
        const token = localStorage.getItem('token')

        await axios.put(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        onQuantityChange(product_cart?.product_id, newQuantity)
      } catch (error) {
        console.error('Failed to update cart quantity:', error)
      }
    }
  }
  // Function to handle item deletion
  const handleDelete = async () => {
    try {
      const apiUrl = 'http://localhost:9999/api/customer/cart/delete/item'
      const requestBody = {
        product_id: product_cart?.product_id
      }
      const token = localStorage.getItem('token')

      await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      onDeleteSuccess()
    } catch (error) {
      console.error('Failed to delete cart items:', error)
    }
  }
  useEffect(() => {
    dispatch(getAllCartRequest())
  }, [dispatch])

  return (
    <div className="p-3 shadow-lg rounded-md border-neutral-200 border-2">
      <div className="flex items-center mt-2">
        <div className="w-[12rem] h-[12rem] ml-5">
          <img
            className="w-full h-full object-cover object-top"
            src={product_cart?.image}
            alt={product_cart?.product_cart_name}
            loading="lazy"
          />
        </div>
        <div className="ml-8 space-y-1">
          <p className="font-bold text-lg">{product_cart?.product_name}</p>
          <p className="opacity-80 mt-3 text-sm">
            Category: {product_cart?.category_product?.category_name}
          </p>
          <p className="text-main font-semibold text-lg">
            {discountedPrice
              ? `${discountedPrice} VNĐ`
              : `${price.toLocaleString('en')} VNĐ`}
          </p>
          {discountedPrice && (
            <p className="text-sm text-red-500 line-through">
              {price.toLocaleString('en')} VNĐ
            </p>
          )}
        </div>
        <div className="lg:flex items-center lg:space-x-5 pt-2 ml-[30%]">
          {product_cart?.quantity === 0 ? (
            <p className="text-red-500 font-semibold text-lg">Hết hàng</p>
          ) : (
            <div className="flex items-center justify-center mt-4 h-[42px] px-[10px] rounded-lg shadow-md">
              <IconButton
                onClick={() => handleQuantityChange(-1)}
                aria-label="remove"
              >
                <RemoveIcon />
              </IconButton>
              <input
                type="text"
                className="input-small w-10 mx-2 text-center"
                step={null}
                min={1}
                inputMode="numeric"
                pattern="[0-9]*"
                value={
                  cart_get.find(
                    (item) => item.product_id === product_cart?.product_id
                  )?.quantity || 0
                }
                readOnly={true}
              />
              <IconButton
                onClick={() => handleQuantityChange(1)}
                aria-label="add"
              >
                <AddIcon />
              </IconButton>
            </div>
          )}
          <div className="flex text-sm lg:text-base mt-4 lg:mt-4">
            <IconButton onClick={handleDelete} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}

CartItem.propTypes = {
  cart: PropTypes.object.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired
}

export default CartItem
