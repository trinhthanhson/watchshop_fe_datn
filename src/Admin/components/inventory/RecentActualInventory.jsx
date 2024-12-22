import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { getAllQuantityProductRequest } from '../../../redux/actions/statistic/action'

const RecentActualInventory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const quantity_report = useSelector(
    (state) => state.quantity_report.quantity_report
  )
  const [filter, setFilter] = useState('all')
  const [start, setStartDate] = useState(null)
  const [end, setEndDate] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [showChart, setShowChart] = useState(false) // State để chuyển đổi giữa bảng và biểu đồ
  const recordsPerPage = 10
  const totalPages = quantity_report?.totalPages || 1

  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
  }

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
  }, [dispatch, filter, start, end, currentPage, sortOrder])

  return (
    <div className="bg-white px-4 pt-3 pb-4">
      <div className="flex justify-between">
        <strong className="text-sub font-semibold">Thống kê tồn kho</strong>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowChart((prev) => !prev)} // Toggle giữa biểu đồ và bảng
        >
          {showChart ? 'Hiển thị bảng' : 'Hiển thị biểu đồ'}
        </button>
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
              className="px-4 py-2 border border-gray-200 flex-1 hover:bg-gray-300 transition-transform rounded duration-200 transform"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Nội dung chính: biểu đồ hoặc bảng */}
        {showChart ? (
          <div className="w-full h-80 mb-4">
            <ResponsiveContainer>
              <BarChart data={quantity_report?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="info"
                  label={{
                    value: 'Product ID',
                    position: 'insideBottom',
                    offset: -5
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name, props) => {
                    const productName = props.payload?.product_name || 'Unknown'
                    return [`${value}`, `(${productName})`] // Hiển thị giá trị và product_name trong tooltip
                  }}
                />
                <Legend />
                <Bar
                  dataKey="quantity"
                  fill="#8884d8"
                  name="Số lượng tồn kho"
                />
                <Bar dataKey="total_import" fill="#82ca9d" name="Tổng nhập" />
                <Bar dataKey="total_export" fill="#ffc658" name="Tổng xuất" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
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
                <td className="text-center align-middle">Khoảng thời gian</td>
              </tr>
            </thead>
            <tbody>
              {quantity_report?.data &&
                quantity_report?.data?.map((item, index) => (
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
                    <td className="cursor-pointer truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                      {item.product_name}
                    </td>
                    <td className="text-center align-middle">
                      {item.quantity}
                    </td>
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
        )}

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
