import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createTransactionRequest,
  getAllProductsRequest,
  getAllRequestRequest,
  getUserProfileRequest
} from '../../../redux/actions/actions'
import { useNavigate } from 'react-router-dom'

const CreateRequest = () => {
  const [items, setItems] = useState([
    {
      product_id: '',
      name: '',
      quantity: '',
      unitPrice: '',
      totalPrice: '',
      note: '',
      stock: 0
    }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentRowIndex, setCurrentRowIndex] = useState(null)
  const [content, setContent] = useState('')
  const [selectedRequest, setSelectedRequest] = useState('') // Trạng thái cho phiếu đề nghị được chọn
  const navigate = useNavigate()

  const products = useSelector((state) => state.products?.products?.data)
  const user = useSelector((state) => state.user?.user?.data)
  const request = useSelector((state) => state.request?.request?.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllProductsRequest())
    dispatch(getAllRequestRequest()) // Lấy danh sách các phiếu đề nghị
    dispatch(getUserProfileRequest())
  }, [dispatch])

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: '',
        name: '',
        quantity: '',
        unitPrice: '',
        content: '',
        note: ' ',
        totalPrice: '',
        stock: 0
      }
    ])
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleChange = (e, index) => {
    const { name, value } = e.target
    const newItems = [...items]

    // Nếu trường đang thay đổi là unitPrice, loại bỏ các ký tự không phải số và định dạng lại
    if (name === 'unitPrice') {
      let formattedValue = value.replace(/[^\d]/g, '') // Loại bỏ ký tự không phải là số
      if (formattedValue === '') formattedValue = '0' // Đảm bảo không để trống

      newItems[index].unitPrice = parseInt(formattedValue, 10)
    } else {
      newItems[index][name] = value
    }

    // Chuyển đổi quantity và unitPrice sang dạng số để tính toán
    const quantity = parseFloat(newItems[index].quantity) || 0
    const unitPrice = parseFloat(newItems[index].unitPrice) || 0

    // Tính toán totalPrice khi quantity hoặc unitPrice thay đổi
    newItems[index].totalPrice = quantity * unitPrice

    setItems(newItems)
  }

  const handleSearchChange = (e, index) => {
    const { value } = e.target
    setSearchQuery(value)
    setCurrentRowIndex(index) // Lưu index của hàng hiện tại

    const filteredProducts = products.filter(
      (product) =>
        (product.product_name.toLowerCase().includes(value.toLowerCase()) ||
          product.product_id.includes(value)) &&
        !items.some((item) => item.product_id === product.product_id)
    )

    setSearchResults(filteredProducts)
    handleChange(e, index)
  }
  const selectProduct = (product, index) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      product_id: product.product_id,
      name: product.product_name,
      stock: product.quantity
    }
    setItems(newItems)
    setSearchQuery('')
    setSearchResults([])
  }
  const handleRequestChange = (e) => {
    const selectedRequestId = e.target.value
    setSelectedRequest(selectedRequestId)

    // Tìm phiếu đề nghị đã chọn
    const requestData = request?.find(
      (req) => req.request_id === parseInt(selectedRequestId, 10)
    )

    if (requestData) {
      // Chuyển đổi requestDetails thành dữ liệu hiển thị trong bảng
      const updatedItems = requestData.requestDetails.map((detail) => ({
        product_id: detail.product_id,
        name: detail.product_name,
        quantity: detail.quantity,
        unitPrice: detail.unit_price,
        totalPrice: detail.total_price,
        note: detail.note || ''
      }))
      setItems(updatedItems)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const totalQuantity = items.reduce(
      (acc, item) => acc + (parseInt(item.quantity) || 0),
      0
    )
    const totalPrice = items.reduce(
      (acc, item) => acc + (parseInt(item.totalPrice) || 0),
      0
    )

    const payload = {
      content,
      total_quantity: totalQuantity,
      total_price: totalPrice,
      type_name: 'IMPORT',
      products: items.map((item) => ({
        productId: item.product_id,
        quantity: parseInt(item.quantity),
        unitPrice: parseInt(item.unitPrice),
        note: item.note
      }))
    }
    dispatch(createTransactionRequest(payload, navigate))
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl"
        style={{ marginLeft: '230px' }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Phiếu Đề Nghị Nhập Kho
        </h2>

        <div className="flex gap-6">
          {/* Cột trái */}
          <div className="w-1/2 space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold">
                Kính gửi:
              </label>
              <input
                type="text"
                name="content"
                className="w-full p-3 border border-gray-300 rounded mt-2"
                value={'Phòng kế toán'}
                disabled
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">
                * Nhân viên:
              </label>
              <input
                type="text"
                name="employee"
                value={user?.first_name + ' ' + user?.last_name}
                className="w-full p-3 border border-gray-300 rounded mt-2"
                required
                disabled
              />
            </div>
          </div>
          {/* Cột phải */}
          <div className="w-1/2 space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold">
                * Thuộc bộ phận:
              </label>
              <input
                type="text"
                name="department"
                value="Kho"
                className="w-full p-3 border border-gray-300 rounded mt-2"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">
                * Nội dung:
              </label>
              <input
                type="text"
                name="content"
                className="w-full p-3 border border-gray-300 rounded mt-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Combobox chọn phiếu đề nghị */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold">
            Chọn Phiếu Đề Nghị:
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded mt-2"
            value={selectedRequest}
            onChange={handleRequestChange}
            required
          >
            <option value="">-- Chọn phiếu đề nghị --</option>
            {request?.map((req) => (
              <option key={req?.request_id} value={req?.request_id}>
                {req.content}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border p-2">STT</th>
                <th className="border p-2">Mã Sản Phẩm</th>
                <th className="border p-2">Tên Hàng Hóa</th>
                <th className="border p-2">Số Lượng</th>
                <th className="border p-2">Đơn Giá</th>
                <th className="border p-2">Thành Tiền</th>
                <th className="border p-2">Ghi Chú</th>
                <th className="border p-2">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={item.product_id}
                      readOnly
                      className="w-full p-2"
                    />
                  </td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-2"
                      min="1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name="unitPrice"
                      value={item.unitPrice}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-2"
                      min="1"
                    />
                  </td>
                  <td className="border p-2">{item.totalPrice}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="note"
                      value={item.note}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-2"
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Tạo Phiếu Nhập Kho
        </button>
      </div>
    </div>
  )
}

export default CreateRequest
