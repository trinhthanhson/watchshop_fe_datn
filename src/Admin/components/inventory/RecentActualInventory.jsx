import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllQuantityProductRequest } from '../../../redux/actions/statistic/action'

const RecentActualInventory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const quantity_report = useSelector(
    (state) => state.quantity_report.quantity_report
  )
  const [filter, setFilter] = useState('week') // Giá trị mặc định là 'week'
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(1) // Trang hiện tại
  const itemsPerPage = 10 // Số sản phẩm mỗi trang
  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
  }
  // Fetch dữ liệu khi filter hoặc ngày thay đổi
  useEffect(() => {
    try {
      dispatch(
        getAllQuantityProductRequest({
          filter: filter,
          start: startDate,
          end: endDate
        })
      )
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, filter, startDate, endDate])

  // Tính toán sản phẩm cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = quantity_report?.data?.slice(startIndex, endIndex)

  const totalPages = Math.ceil(
    (quantity_report?.data?.length || 0) / itemsPerPage
  )

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }
  return (
    <div className="bg-white px-4 pt-3 pb-4 ">
      <div className="flex justify-between">
        <strong className="text-sub font-semibold">Thống kê tồn kho</strong>
      </div>
      <div className="mt-3">
        {/* Bộ lọc */}
        <div className="flex items-center gap-4 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
            <option value="">Tất cả</option>
          </select>
          <div className="flex items-center gap-2">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-200 flex-1 hover:bg-gray-300 transition-transform rounded duration-200 transform "
            >
              Reset
            </button>
          </div>
        </div>

        {/* Bảng thống kê */}
        <table className="w-full text-gray-700">
          <thead className="text-white font-medium bg-primary">
            <tr
              className="bg-primary"
              style={{
                backgroundColor: 'rgb(171, 171, 171)',
                color: 'rgba(0, 0, 0, 0.8)'
              }}
            >
              <td className="rounded-s-md">STT</td>
              <td>Hình ảnh</td>
              <td>Tên sản phẩm</td>
              <td>Số lượng tồn kho</td>
              <td>Tổng nhập</td>
              <td>Tổng xuất</td>
              <td className="rounded-e-md">Tồn kho hiện tại</td>
            </tr>
          </thead>
          <tbody>
            {currentProducts &&
              currentProducts.map((item, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() =>
                    navigate(`/manager/product/${item.product_id}`)
                  }
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      className="w-10 h-10 rounded-full"
                      src={item.image || 'default-image-url'}
                      alt={item.product_name}
                    />
                  </td>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.total_import}</td>
                  <td>{item.total_export}</td>
                  <td>{item.current_stock}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Điều khiển phân trang */}
        <div className="flex justify-center mt-4 space-x-2 mb-2">
          {/* Nút Previous */}
          <button
            className="p-2 border rounded-md hover:bg-gray-300 transition-transform duration-200 transform cursor-pointer"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* Hiển thị số trang */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                className={`p-2 border rounded-md transition-transform duration-200 transform cursor-pointer ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-300'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}

          {/* Nút Next */}
          <button
            className="p-2 border rounded-md hover:bg-gray-300 transition-transform duration-200 transform cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecentActualInventory
