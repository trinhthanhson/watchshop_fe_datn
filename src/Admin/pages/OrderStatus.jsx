import { useRef, useState, useEffect } from 'react'
import Sortable from 'sortablejs'
import axios from 'axios'

const OrderStatus = () => {
  const [statuses, setStatuses] = useState([])
  const listRef = useRef(null)

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'http://localhost:9999/api/manager/order-status/all',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        const sortedStatuses = response.data.data
          .map((status, index) => ({
            ...status,
            status_id: status.status_id || `temp-${index}` // Đảm bảo ID không undefined
          }))
          .sort((a, b) => a.status_index - b.status_index)

        setStatuses(sortedStatuses)
      } catch (error) {
        console.error('Error fetching order statuses:', error)
      }
    }
    fetchStatuses()
  }, [])

  useEffect(() => {
    if (listRef.current) {
      Sortable.create(listRef.current, {
        animation: 150, // Hiệu ứng kéo thả
        onEnd: (event) => {
          const updatedStatuses = Array.from(statuses)
          const [removed] = updatedStatuses.splice(event.oldIndex, 1)
          updatedStatuses.splice(event.newIndex, 0, removed)

          updatedStatuses.forEach((status, index) => {
            status.status_index = index + 1
          })

          setStatuses(updatedStatuses)

          const token = localStorage.getItem('token')
          axios
            .post(
              'http://localhost:9999/api/manager/order-status/update-order',
              updatedStatuses,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            )
            .then(() => console.log('Status order updated successfully!'))
            .catch((error) =>
              console.error('Error updating status order:', error)
            )
        }
      })
    }
  }, [statuses])

  return (
    <div className="container mx-auto p-3 " style={{ marginLeft: '300px' }}>
      <h1 className="text-2xl font-bold mb-4">Order Status Management</h1>
      {statuses.length > 0 ? (
        <div ref={listRef} className="flex flex-col gap-4">
          {statuses.map((status) => (
            <div
              key={status.status_id.toString()}
              className="bg-blue-100 border border-blue-500 text-blue-700 rounded-lg px-4 py-2"
            >
              <p className="font-bold">{status.status_name}</p>
              <p className="text-sm text-gray-500">
                Thứ tự: {status.status_index}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  )
}

export default OrderStatus
