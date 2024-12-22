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
  const [filter, setFilter] = useState('all') // Giá trị mặc định là 'week'
  const [start, setStartDate] = useState(null)
  const [end, setEndDate] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc') // Trạng thái bộ lọc
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10 // Số bản ghi mỗi trang
  const totalPages = quantity_report?.totalPages || 1 // Tổng số trang từ API
  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
  }
  // Fetch dữ liệu khi filter hoặc ngày thay đổi
  useEffect(() => {
    try {
      dispatch(
        getAllQuantityProductRequest(
          filter,
          start,
          end,
          currentPage,
          recordsPerPage,
          'created_at',
          sortOrder
        )
      )
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, filter])

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
            <option value="all">Tất cả</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
          <div className="flex items-center gap-2">
            <label>Từ ngày:</label>
            <input
              type="date"
              value={start || ''}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label>Đến ngày:</label>
            <input
              type="date"
              value={end || ''}
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
              <td className="text-center align-middle">Số lượng tồn kho</td>
              <td className="text-center align-middle">Tổng nhập</td>
              <td className="text-center align-middle">Tổng xuất</td>
              <td className="text-center align-middle"> Khoảng thời gian</td>
            </tr>
          </thead>
          <tbody>
            {quantity_report?.data &&
              quantity_report?.data?.map((item, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 transition-colors "
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
                  <td className="cursor-pointer truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {item.product_name}
                  </td>
                  <td className="text-center align-middle">{item.quantity}</td>
                  <td className="text-center align-middle">
                    {item.total_import}
                  </td>
                  <td className="text-center align-middle">
                    {item.total_export}
                  </td>
                  <td className="text-center align-middle">{item.info}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-4 mt-4 border p-4 rounded-md ml-[200px]">
          <button
            className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecentActualInventory
