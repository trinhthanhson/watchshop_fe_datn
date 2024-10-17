import axios from 'axios'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'

const CartItem = ({ cart, onQuantityChange, onDeleteSuccess }) => {
  const { product, price } = cart
  const [quantity, setQuantity] = useState(cart.quantity)

  // Function to handle quantity change
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product?.quantity) {
      try {
        const apiUrl = 'http://localhost:9999/api/customer/cart/update/quantity'
        const requestBody = {
          product_id: product?.product_id,
          quantity: newQuantity
        }
        const token = localStorage.getItem('token')

        const response = await axios.put(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('Cart updated successfully:', response.data)
        setQuantity(newQuantity)
        onQuantityChange(product?.product_id, newQuantity)
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
        product_id: product?.product_id
      }
      const token = localStorage.getItem('token')

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Delete items successfully:', response.data)
      onDeleteSuccess()
    } catch (error) {
      console.error('Failed to delete cart items:', error)
    }
  }

  return (
    <div className="p-3 shadow-lg rounded-md border-neutral-200 border-2">
      <div className="flex items-center mt-2">
        <div className="w-[12rem] h-[12rem] ml-5">
          <img
            className="w-full h-full object-cover object-top"
            src={product?.image}
            alt={product?.product_name}
            loading="lazy"
          />
        </div>
        <div className="ml-8 space-y-1">
          <p className="font-bold text-lg">{product?.product_name}</p>
          <p className="opacity-80 mt-3 text-sm">
            Category: {product?.category?.category_name}
          </p>
          <p className="text-main font-semibold text-lg">
            {price.toLocaleString('en')} VNĐ
          </p>
        </div>
        <div className="lg:flex items-center lg:space-x-5 pt-2 ml-[30%]">
          {product?.quantity === 0 ? (
            <p className="text-red-500 font-semibold text-lg">Hết hàng</p>
          ) : (
            <div className="flex items-center justify-center mt-4 h-[42px] px-[10px] rounded-lg shadow-md">
              <IconButton
                onClick={() => handleQuantityChange(Math.max(quantity - 1, 1))}
                aria-label="remove"
              >
                <RemoveIcon />
              </IconButton>
              <input
                type={'text'}
                className="input-small w-10 mx-2 text-center"
                step={null}
                min={1}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => setQuantity(Number(e.target.value))}
                value={quantity}
                readOnly={true}
              />
              <IconButton
                onClick={() =>
                  handleQuantityChange(
                    Math.min(quantity + 1, product?.quantity)
                  )
                }
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
