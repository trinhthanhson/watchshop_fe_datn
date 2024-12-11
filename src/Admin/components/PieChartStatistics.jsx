import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  Sector
} from 'recharts'

const COLORS = [
  '#880e0e',
  '#3a241b',
  '#fb923c',
  '#006400',
  '#38bdf8',
  '#396264'
]

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
    percent
  } = props

  // Tính toán vị trí thông tin nằm dưới chân nửa dưới của hình tròn
  const x = cx
  const y = cy + outerRadius + 20 // Đưa thông tin xuống dưới nửa dưới của vòng tròn

  return (
    <g>
      {/* Vẽ phần lồi */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} // Tăng kích thước lồi
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* Hiển thị thông tin sản phẩm bên dưới */}
      <text x={x} y={y} textAnchor="middle" fill={fill} fontSize={14}>
        {payload.product_name}
      </text>
      <text
        x={x}
        y={y + 20} // Khoảng cách thêm để tách thông tin
        textAnchor="middle"
        fill="#333"
        fontSize={12}
      >
        {`Số lượng: ${value}`}
      </text>
      <text
        x={x}
        y={y + 40} // Khoảng cách thêm để tách thông tin
        textAnchor="middle"
        fill="#999"
        fontSize={12}
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const PieChartStatistics = () => {
  const [mostSoldProducts, setMostSoldProducts] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    async function fetchMostSoldProducts() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'http://localhost:9999/api/statistic/product/top',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setMostSoldProducts(response.data.data)
      } catch (error) {
        console.error('Error fetching most sold products:', error)
      }
    }

    fetchMostSoldProducts()
  }, [])

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index) // Cập nhật trạng thái phần được hover
  }

  const handleMouseLeave = () => {
    setActiveIndex(null) // Xóa trạng thái khi rời chuột
  }

  return (
    <div className="bg-white p-4 rounded-md border border-gray-200 flex flex-col ">
      <strong className="text-sub font-semibold">Sản phẩm phổ biến</strong>
      <div className="w-full mt-3 flex-1 text-xs">
        {mostSoldProducts && mostSoldProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={600}>
            <PieChart>
              <Pie
                data={mostSoldProducts}
                cx="35%" // Đặt trung tâm của biểu đồ
                cy="40%" // Đặt trung tâm của biểu đồ
                labelLine={false}
                outerRadius={200}
                activeIndex={activeIndex}
                activeShape={renderActiveShape} // Sử dụng hình dạng lồi tùy chỉnh
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                dataKey="total_quantity"
                label={({ percent }) => {
                  return `${(percent * 100).toFixed(2)}%` // Hiển thị phần trăm trên miếng hình tròn
                }}
              >
                {mostSoldProducts.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.product_id}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
              />
              <Legend
                layout="vertical"
                verticalAlign="bottom"
                align="left"
                payload={mostSoldProducts.map((entry, index) => ({
                  value: entry.product_name,
                  type: 'circle',
                  color: COLORS[index % COLORS.length]
                }))}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}

export default PieChartStatistics
