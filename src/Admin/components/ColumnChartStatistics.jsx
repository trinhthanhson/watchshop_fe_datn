import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from 'recharts'
import * as XLSX from 'xlsx'
import { MdFileDownload } from 'react-icons/md'
import { useSelector, useDispatch } from 'react-redux'
import { getDataAIByQuantityLimitRequest } from '../../redux/actions/ai/action'
import axios from 'axios'

const ColumnChartStatistics = () => {
  const [data, setData] = useState([])
  const [selectedYear, setSelectedYear] = useState(2024)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [viewMode, setViewMode] = useState('chart')
  const dataAI = useSelector((state) => state?.dataAIByQuantity?.dataAI)
  const dispatch = useDispatch()

  const [showModal, setShowModal] = useState(false)
  const [inputPrediction, setInputPrediction] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(dataAI?.data?.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = (dataAI?.data || []).slice(
    startIndex,
    startIndex + itemsPerPage
  )
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handlePredictionSubmit = () => {
    dispatch(getDataAIByQuantityLimitRequest(inputPrediction))
    setInputPrediction('')
  }
  const handleGetPrediction = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Token không tồn tại! Vui lòng đăng nhập lại.')
        return
      }

      const inputPrediction = 30 // Thay đổi theo input người dùng nếu cần

      const response = await axios.get(
        'http://127.0.0.1:5000/predict', // Gọi đúng endpoint `/predict`
        {
          params: { quantity: inputPrediction },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        const results = response.data.results
        console.log(results)

        // Xuất file Excel
        const worksheet = XLSX.utils.json_to_sheet(results)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Predictions')

        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        })
        const blob = new Blob([excelBuffer], {
          type: 'application/octet-stream'
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'predictions.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert('Failed to fetch predictions.')
      }
    } catch (error) {
      console.error('Error fetching predictions:', error)
      alert('Có lỗi xảy ra trong quá trình xử lý.')
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedYear, startDate, endDate])

  const handlePredictionClick = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setInputPrediction('') // Reset input khi đóng modal
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:9999/api/statistic/year?year=${selectedYear}`, // Truyền year và typeName vào URL
        {
          method: 'GET', // Đảm bảo phương thức GET
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const result = await response.json()
      if (response.ok) {
        // Log toàn bộ dữ liệu để kiểm tra

        const fullYearData = Array.from({ length: 12 }, (_, index) => {
          // Log từng item trong data để kiểm tra
          const monthData = result?.data.find(
            (item) => item?.month === index + 1
          )
          console.log('Month data:', monthData) // Xem monthData có dữ liệu không
          return {
            month: index + 1,
            total_price: monthData ? monthData.total_price : 0
          }
        })

        console.log('Full year data:', fullYearData)
        setData(fullYearData)
      } else {
        console.error('Failed to fetch data:', result.message)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Fetch data based on date range
  const fetchDateRangeData = async () => {
    // try {
    //   const token = localStorage.getItem('token')
    //   const url = `http://localhost:9999/api/statistic/date?start=${startDate}&end=${endDate}`
    //   const response = await fetch(url, {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   })
    //   const result = await response.json()
    //   if (response.ok) {
    //     // Aggregate daily data
    //     const dailyData = result.data.reduce((acc, item) => {
    //       const date = new Date(item.date_pay).toISOString().split('T')[0]
    //       if (!acc[date]) {
    //         acc[date] = {
    //           date,
    //           total_price: 0
    //         }
    //       }
    //       acc[date].total_price += item.total_sold
    //       return acc
    //     }, {})
    //     // Convert to array
    //     const formattedData = Object.values(dailyData)
    //     setData(formattedData)
    //   } else {
    //     console.error('Failed to fetch data:', result.message)
    //   }
    // } catch (error) {
    //   console.error('Error fetching data:', error)
    // }
  }

  // Use effect to fetch data based on inputs
  useEffect(() => {
    if (startDate && endDate) {
      fetchDateRangeData()
    } else {
      fetchData()
    }
  }, [selectedYear, startDate, endDate])

  // Handle year change
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value))
    setStartDate('')
    setEndDate('')
  }

  // Handle date range submission
  const handleDateRangeSubmit = () => {
    if (startDate && endDate) {
      fetchDateRangeData()
    } else {
      alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.')
    }
  }

  // Check if there is any revenue data
  const hasRevenue =
    data.length > 0 && data.some((item) => item.total_price > 0)
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Date: item.date
          ? new Date(item.date).toLocaleDateString('vi-VN')
          : getMonthName(item.month),
        Revenue: item.total_price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND'
        })
      }))
    )

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Statistics')

    // Save to file
    XLSX.writeFile(wb, 'Statistics.xlsx')
  }
  const handleExportToExcel = () => {
    // Chuẩn bị dữ liệu cho Excel
    const formattedData = dataAI?.data.map((item, index) => ({
      STT: index + 1,
      'Mã Sản Phẩm': item.productId,
      Tuần: item.week,
      'Giá Nhập': item.importPrice,
      'Số lượng nhập': item.importQuantity,
      'Số Lượng xuất': item.exportQuantity,
      'Giá xuất': item.exportPrice,
      'Biến động giá': item.priceVolatility,
      'Chênh lệch SL': item.quantityDifference || 0,
      'Tồn kho cuối': item.endQuantity
    }))

    // Tạo workbook và worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

    // Xuất file
    XLSX.writeFile(workbook, 'data.xlsx')
  }
  // Helper function to get month names
  const getMonthName = (monthNumber) => {
    const months = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ]
    return months[monthNumber - 1]
  }

  return (
    <div className="h-[30rem] bg-white p-4 rounded-md border border-gray-200 flex flex-col flex-1 ">
      <strong className="text-sub font-semibold">Thống kê doanh thu</strong>
      <div className="flex justify-end items-start mt-3">
        <button
          onClick={handlePredictionClick} // Nút Dự Đoán
          className="px-4 py-2 rounded-md ml-2 bg-blue-500 text-white"
        >
          Dự Đoán
        </button>
        <div className="flex gap-4 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button
            onClick={handleDateRangeSubmit}
            className="px-4 py-2 rounded-md bg-primary text-white"
          >
            Lọc theo ngày
          </button>
        </div>
        <div className="ml-4">
          <label htmlFor="yearSelect" className="mr-2 font-RobotoMedium">
            Chọn năm:
          </label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={handleYearChange}
            className="rounded-md font-RobotoMedium focus:border-none"
          >
            <option value={2020}>2020</option>
            <option value={2021}>2021</option>
            <option value={2022}>2022</option>
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
          </select>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white rounded-md p-4 w-2/3 shadow-lg z-50">
            <h2 className="text-lg font-bold mb-4">Nhập thông tin dự đoán</h2>
            <input
              type="text"
              value={inputPrediction}
              onChange={(e) => setInputPrediction(e.target.value)}
              placeholder="Nhập dự đoán doanh thu"
              className="w-full border p-2 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2 mb-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md bg-gray-300 text-black"
              >
                Đóng
              </button>
              <button
                onClick={handlePredictionSubmit}
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
              >
                Xác Nhận
              </button>
              <button
                onClick={handleGetPrediction}
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
              >
                Lấy kết quả
              </button>
            </div>

            {/* Hiển thị bảng dữ liệu nếu có */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <MdFileDownload
                  className="cursor-pointer text-primary"
                  fontSize={25}
                  onClick={handleExportToExcel}
                />
              </div>
              {currentData && currentData.length > 0 && (
                <div
                  className="w-full overflow-x-auto"
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                  <table className="w-full border-collapse border text-lg">
                    <thead>
                      <tr>
                        <th className="border p-4">STT</th>
                        <th className="border p-4">Mã Sản Phẩm</th>
                        <th className="border p-4">Tuần</th>
                        <th className="border p-4">Giá Nhập</th>
                        <th className="border p-4">Số Lượng Nhập</th>
                        <th className="border p-4">Số Lượng Xuất</th>
                        <th className="border p-4">Giá Xuất</th>
                        <th className="border p-4">Biến Động Giá</th>
                        <th className="border p-4">Chênh Lệch SL</th>
                        <th className="border p-4">Tồn Kho Cuối</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="border p-4 text-center">
                            {startIndex + index + 1}
                          </td>
                          <td className="border p-4">{item.productId}</td>
                          <td className="border p-4">{item.week}</td>
                          <td className="border p-4">{item.importPrice}</td>
                          <td className="border p-4">{item.importQuantity}</td>
                          <td className="border p-4">{item.exportQuantity}</td>
                          <td className="border p-4">{item.exportPrice}</td>
                          <td className="border p-4">{item.priceVolatility}</td>
                          <td className="border p-4">
                            {item.quantityDifference}
                          </td>
                          <td className="border p-4">{item.endQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`text-lg px-6 py-3 bg-gray-300 rounded-md ${
                    currentPage === 1 && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <span className="text-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`text-lg px-6 py-3 bg-blue-500 text-white rounded-md ${
                    currentPage === totalPages &&
                    'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle between chart and table view */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setViewMode('chart')}
          className={`px-4 py-2 rounded-md ${viewMode === 'chart' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Biểu đồ
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 rounded-md ml-2 ${viewMode === 'table' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Bảng
        </button>
        <MdFileDownload
          className="cursor-pointer text-primary"
          fontSize={25}
          onClick={exportToExcel}
        />
      </div>

      {/* Display chart or table */}
      <div className="w-full mt-3 flex-1 text-xs ml-5">
        {viewMode === 'chart' ? (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{ top: 20, right: 10, left: 1, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={startDate && endDate ? 'date' : 'month'}
                tickFormatter={(tick) =>
                  startDate && endDate
                    ? new Date(tick).toLocaleDateString('vi-VN')
                    : getMonthName(tick)
                }
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_price" fill="#880E0E" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          hasRevenue && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">
                      {startDate && endDate ? 'Ngày' : 'Tháng'}
                    </th>
                    <th className="border border-gray-300 p-2">Doanh Thu</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) =>
                    item.total_price > 0 ? (
                      <tr key={item.date || item.month}>
                        <td className="border border-gray-300 p-2 text-center">
                          {item.date
                            ? new Date(item.date).toLocaleDateString('vi-VN')
                            : getMonthName(item.month)}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {item.total_price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          })}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ColumnChartStatistics
