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

const ColumnChartStatistics = () => {
  const [data, setData] = useState([])
  const [selectedYear, setSelectedYear] = useState(2024)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [viewMode, setViewMode] = useState('chart') // 'chart' or 'table'

  // Fetch yearly data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:9999/api/staff/inventory/statistic/year?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const result = await response.json()
      if (response.ok) {
        const fullYearData = Array.from({ length: 12 }, (_, index) => {
          const monthData = result.data.find((item) => item.moth === index + 1)
          return {
            moth: index + 1,
            total_price: monthData ? monthData.total_price : 0
          }
        })
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
    try {
      const token = localStorage.getItem('token')
      const url = `http://localhost:9999/api/staff/inventory/statistic/date?start=${startDate}&end=${endDate}`
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const result = await response.json()

      if (response.ok) {
        // Aggregate daily data
        const dailyData = result.data.reduce((acc, item) => {
          const date = new Date(item.date_pay).toISOString().split('T')[0]
          if (!acc[date]) {
            acc[date] = {
              date,
              total_price: 0
            }
          }
          acc[date].total_price += item.total_sold
          return acc
        }, {})

        // Convert to array
        const formattedData = Object.values(dailyData)

        setData(formattedData)
      } else {
        console.error('Failed to fetch data:', result.message)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
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
          : getMonthName(item.moth),
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
    <div className="h-[24rem] bg-white p-4 rounded-md border border-gray-200 flex flex-col flex-1">
      <strong className="text-sub font-semibold">Thống kê doanh thu</strong>
      <div className="flex justify-end items-start mt-3">
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
      <div className="w-full mt-3 flex-1 text-xs">
        {viewMode === 'chart' ? (
          <ResponsiveContainer width="100%" height="60%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={startDate && endDate ? 'date' : 'moth'}
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
                      <tr key={item.date || item.moth}>
                        <td className="border border-gray-300 p-2 text-center">
                          {item.date
                            ? new Date(item.date).toLocaleDateString('vi-VN')
                            : getMonthName(item.moth)}
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
