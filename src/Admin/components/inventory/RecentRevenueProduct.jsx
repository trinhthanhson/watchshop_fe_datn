import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllRevenueProductRequest } from '../../../redux/actions/statistic/action'

const RecentRevenueProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const quantity_report = useSelector(
    (state) => state.revenue_product.revenue_product
  )
  const [filter, setFilter] = useState('all') // Giá trị mặc định là 'week'
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
        <strong className="text-sub font-semibold">
          Thống doanh thu theo sản phẩm
        </strong>
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
              className="bg-primary "
              style={{
                backgroundColor: 'rgb(171, 171, 171)',
                color: 'rgba(0, 0, 0, 0.8)'
              }}
            >
              <td className="rounded-s-md">STT</td>
              <td>Hình ảnh</td>
              <td className="text-center align-middle">Tên sản phẩm</td>
              <td className="text-center align-middle">Doanh thu</td>
              {/* Hiển thị cột Period Value nếu có giá trị */}
              {currentProducts?.some((item) => item.period_value) && (
                <td className="text-center align-middle">Chu kỳ</td>
              )}
              {/* Hiển thị cột Date Range nếu có giá trị */}
              {currentProducts?.some((item) => item.date_range) && (
                <td className="text-center align-middle"> Khoảng thời gian</td>
              )}
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
                  <td className="text-center align-middle">{index + 1}</td>
                  <td className="text-center align-middle">
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
                    {item.total_sold.toLocaleString('en')} VND
                  </td>
                  {/* Hiển thị giá trị Period Value nếu có */}
                  {item.period_value && (
                    <td className="text-center align-middle">
                      {item.period_value}
                    </td>
                  )}
                  {/* Hiển thị giá trị Date Range nếu có */}
                  {item.date_range && (
                    <td className="text-center align-middle">
                      {item.date_range}
                    </td>
                  )}
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

export default RecentRevenueProduct
