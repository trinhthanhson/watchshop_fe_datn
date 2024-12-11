import { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Stepper, Step, StepLabel } from '@mui/material'

const OrderTracker = ({ orderDetail }) => {
  const [steps, setSteps] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchStatuses = async () => {
      if (!orderDetail || !orderDetail.order_status) {
        setSteps(['Không có trạng thái hiện tại'])
        setActiveStep(0)
        setLoading(false)
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
        setSteps(statusesData.map((status) => status.status_name))
        const currentStatusIndex = orderDetail.order_status.status_index || 0
        setActiveStep(currentStatusIndex)
      } catch (error) {
        setSteps(['Không thể lấy danh sách trạng thái'])
        setActiveStep(0)
      } finally {
        setLoading(false)
      }
    }

    fetchStatuses()
  }, [orderDetail])

  if (loading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel className="" sx={{ color: '#b22830', fontSize: '44px' }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}

OrderTracker.propTypes = {
  orderDetail: PropTypes.shape({
    order_status: PropTypes.shape({
      status_index: PropTypes.number
    })
  }).isRequired
}

export default OrderTracker
