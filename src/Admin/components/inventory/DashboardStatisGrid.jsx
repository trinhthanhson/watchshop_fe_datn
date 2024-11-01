import PropTypes from 'prop-types'
import {
  IoBagHandle,
  IoPersonCircleOutline,
  IoBagCheckOutline,
  IoCashOutline
} from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  getAllCustomersRequest,
  getAllOrdersRequest
} from '../../../redux/actions/actions'

const DashboardStatisGrid = () => {
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.orders.orders)
  const customers = useSelector((state) => state.customers.customers)
  const [doanhthu, setDoanhThu] = useState(null)

  useEffect(() => {
    try {
      dispatch(getAllOrdersRequest())
      dispatch(getAllCustomersRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch])
  useEffect(() => {
    const fetchTotalPrice = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'http://localhost:9999/api/staff/statistic/sales',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        // Assuming you want the total price from the first object in the data array
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setDoanhThu(response.data?.data[0].total_price)
        } else {
          console.error('Unexpected response format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching total price:', error)
      }
    }

    fetchTotalPrice()
  }, [])
  // Calculate the total price of all orders
  const totalPrice =
    orders?.data?.reduce((total, order) => {
      return total + order.total_price
    }, 0) || 0

  // Count the number of orders
  const orderCount = orders?.data?.length || 0

  // Count the number of customers
  const customerCount = customers?.data?.length || 0

  return (
    <div className="flex gap-4 w-full">
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-400">
          <IoBagHandle className="text-white text-2xl" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-400 font-medium">Tồn kho</span>
          <div className="flex items-center">
            <strong className="text-xl font-semibold text-sky-700">
              {totalPrice.toLocaleString('en')} VNĐ
            </strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-main">
          <IoCashOutline className="text-white text-2xl" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-400 font-medium">Doanh thu</span>
          <div className="flex items-center">
            <strong className="text-xl font-semibold text-red">
              {(doanhthu || 0).toLocaleString('en')} VNĐ
            </strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-400">
          <IoBagCheckOutline className="text-white text-2xl" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-400 font-medium">Xuất kho</span>
          <div className="flex items-center">
            <strong className="text-xl font-semibold text-orange-500">
              {orderCount}
            </strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green">
          <IoPersonCircleOutline className="text-white text-2xl" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-400 font-medium">
            Số nhà cung cấp
          </span>
          <div className="flex items-center">
            <strong className="text-xl font-semibold text-green">
              {customerCount}
            </strong>
          </div>
        </div>
      </BoxWrapper>
    </div>
  )
}

export default DashboardStatisGrid

function BoxWrapper({ children }) {
  return (
    <div className="bg-white rounded-md p-4 flex-1 border-gray-200 flex items-center">
      {children}
    </div>
  )
}

BoxWrapper.propTypes = {
  children: PropTypes.node.isRequired
}
