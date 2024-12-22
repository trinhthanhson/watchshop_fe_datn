import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllRevenueProductRequest } from '../../../redux/actions/statistic/action'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const RecentRevenueProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const quantity_report = useSelector(
    (state) => state.revenue_product.revenue_product
  )
  const [filter, setFilter] = useState('all')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('table') // 'table' hoặc 'chart'
  const itemsPerPage = 10

  const handleReset = () => {
    setStartDate(null)
    setEndDate(null)
  }

  useEffect(() => {
    try {
      dispatch(
        getAllRevenueProductRequest({
          filter: filter,
          start: startDate,
          end: endDate
        })
      )
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, filter, startDate, endDate])

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

  const chartData = {
    labels: quantity_report?.data?.map((item) => item.product_id) || [],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: quantity_report?.data?.map((item) => item.total_sold) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div className="bg-white px-4 pt-3 pb-4 ">
      <div className="flex justify-between items-center">
        <strong className="text-sub font-semibold">
          Thống kê doanh thu theo sản phẩm
        </strong>
        <div>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 border ${viewMode === 'table' ? 'bg-gray-200' : ''} transition-transform rounded duration-200`}
          >
            Hiển thị bảng
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 border ${viewMode === 'chart' ? 'bg-gray-200' : ''} transition-transform rounded duration-200 ml-2`}
          >
            Hiển thị biểu đồ
          </button>
        </div>
      </div>

      <div className="mt-3">
        {/* Bộ lọc */}
        <div className="flex items-center gap-4 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Tất cả</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
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
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-300 transition-transform rounded duration-200 transform"
          >
            Reset
          </button>
        </div>

        {/* Hiển thị nội dung theo viewMode */}
        {viewMode === 'chart' ? (
          <div className="mb-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <>
            <table className="w-full text-gray-700">
              <thead className="text-white font-medium bg-primary">
                <tr>
                  <td>STT</td>
                  <td>Hình ảnh</td>
                  <td className="text-center align-middle">Tên sản phẩm</td>
                  <td className="text-center align-middle">Doanh thu</td>
                </tr>
              </thead>
              <tbody>
                {currentProducts &&
                  currentProducts.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        navigate(`/manager/product/${item.product_id}`)
                      }
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        <img
                          src={item.image || 'default-image-url'}
                          alt={item.product_name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="truncate">{item.product_name}</td>
                      <td className="text-center">
                        {item.total_sold.toLocaleString('en')} VND
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RecentRevenueProduct
