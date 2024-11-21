import { useRef, useState, useEffect } from 'react'
import Sortable from 'sortablejs'
import axios from 'axios'

const OrderStatus = () => {
  const [statuses, setStatuses] = useState([])
  const [newStatusName, setNewStatusName] = useState('')
  const [editingStatus, setEditingStatus] = useState(null) // Track status being edited
  const [editedName, setEditedName] = useState('') // New name for the status
  const listRef = useRef(null)
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
          status_id: status.status_id || `temp-${index}`
        }))
        .sort((a, b) => a.status_index - b.status_index)

      setStatuses(sortedStatuses)
    } catch (error) {
      console.error('Error fetching order statuses:', error)
    }
  }
  // Fetch danh sách trạng thái từ server
  useEffect(() => {
    fetchStatuses()
  }, [])

  // Cập nhật trạng thái lên server
  const updateOrderStatuses = (updatedStatuses) => {
    const token = localStorage.getItem('token')

    if (!token) {
      console.error('No token found. Please log in.')
      return
    }

    axios
      .put(
        'http://localhost:9999/api/manager/order-status/update',
        updatedStatuses,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(() => {
        alert('Cập nhật trạng thái thành công!')
      })
      .catch((error) => {
        console.error('Error updating statuses:', error)
      })
  }
  const handleDragEnd = (event) => {
    const updatedStatuses = Array.from(statuses)

    const [removed] = updatedStatuses.splice(event.oldIndex, 1)
    updatedStatuses.splice(event.newIndex, 0, removed)

    updatedStatuses.forEach((status, index) => {
      status.status_index = index + 1
    })

    setStatuses(updatedStatuses)
    updateOrderStatuses(updatedStatuses)
  }

  // Xử lý kéo thả
  useEffect(() => {
    if (!listRef.current) return

    const sortable = Sortable.create(listRef.current, {
      animation: 150,
      onEnd: (event) => handleDragEnd(event)
    })

    return () => {
      sortable.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statuses])

  const handleAddStatus = async () => {
    if (!newStatusName.trim()) {
      alert('Vui lòng nhập tên trạng thái!')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Không tìm thấy token. Vui lòng đăng nhập lại!')
      return
    }

    try {
      const newStatus = {
        status_name: newStatusName,
        status_index: statuses.length + 1
      }

      await axios.post(
        'http://localhost:9999/api/manager/order-status/add',
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setNewStatusName('')
      fetchStatuses()
      alert('Thêm trạng thái thành công!')
    } catch (error) {
      console.error('Error adding status:', error)
    }
  }

  const handleEditStatus = () => {
    const updatedStatuses = statuses.map((status) =>
      status.status_id === editingStatus.status_id
        ? { ...status, status_name: editedName }
        : status
    )

    setStatuses(updatedStatuses)
    updateOrderStatuses(updatedStatuses)
    setEditingStatus(null)
    setEditedName('')
  }

  const handleDeleteStatus = async (id) => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Không tìm thấy token. Vui lòng đăng nhập lại!')
      return
    }

    try {
      // Gọi API xóa trạng thái
      await axios.delete(
        'http://localhost:9999/api/manager/order-status/delete',
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: { status_id: id } // Gửi dữ liệu status_id trong body
        }
      )

      // Cập nhật lại danh sách trạng thái sau khi xóa
      const updatedStatuses = statuses
        .filter((status) => status.status_id !== id)
        .map((status, index) => ({
          ...status,
          status_index: index + 1
        }))

      setStatuses(updatedStatuses)
      updateOrderStatuses(updatedStatuses)
      alert('Xóa trạng thái thành công!')
    } catch (error) {
      console.error('Error deleting status:', error)
      alert('Lỗi khi xóa trạng thái! Vui lòng thử lại.')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-700 text-center">
        Quản Lý Trạng Thái Đơn Hàng
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Nhập tên trạng thái mới..."
          value={newStatusName}
          onChange={(e) => setNewStatusName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2"
        />
        <button
          onClick={handleAddStatus}
          className="bg-primary hover:bg-hoverPrimary text-white px-4 py-2 rounded-lg w-full font-bold"
        >
          Thêm Trạng Thái
        </button>
      </div>

      {statuses.length > 0 ? (
        <div
          ref={listRef}
          className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 relative"
        >
          {statuses.map((status, index) => (
            <div key={status.status_id} className="w-full">
              <div className="flex justify-between items-center bg-gray-100 border border-black-300 rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-700">
                    {status.status_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Thứ tự: {status.status_index}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingStatus(status)
                      setEditedName(status.status_name)
                    }}
                    className="bg-primary hover:bg-hoverPrimary text-white px-3 py-1 rounded-lg"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteStatus(status.status_id)}
                    className="bg-primary hover:bg-hoverPrimary text-white px-3 py-1 rounded-lg"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              {/* Thêm mũi tên nếu không phải trạng thái cuối */}
              {index < statuses.length - 1 && (
                <div className="flex justify-center my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 10l8 8 8-8"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Đang tải...</p>
      )}

      {/* Modal for Editing */}
      {editingStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Chỉnh sửa trạng thái</h2>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingStatus(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleEditStatus}
                className="bg-primary hover:bg-hoverPrimary text-white px-4 py-2 rounded-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderStatus
