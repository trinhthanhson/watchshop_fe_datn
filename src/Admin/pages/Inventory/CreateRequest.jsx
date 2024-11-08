import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProductsRequest } from '../../../redux/actions/actions'

const CreateRequest = () => {
  const [items, setItems] = useState([
    {
      product_id: '',
      name: '',
      quantity: '',
      unitPrice: '',
      totalPrice: '',
      stock: 0
    }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentRowIndex, setCurrentRowIndex] = useState(null)

  const products = useSelector((state) => state.products.products.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllProductsRequest())
  }, [dispatch])

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: '',
        name: '',
        quantity: '',
        unitPrice: '',
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ items })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-6xl space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Phiếu Đề Nghị Nhập Kho
        </h2>

        <div>
          <label className="block text-gray-700">
            Kính gửi:{' '}
            <span className="text-gray-800 font-semibold">Phòng Kế Toán</span>
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">
            * Nội dung:
          </label>
          <input
            type="text"
            name="content"
            className="w-full p-2 border border-gray-300 rounded mt-1"
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
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">
            * Thuộc bộ phận:
          </label>
          <input
            type="text"
            name="department"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border p-2">STT</th>
                <th className="border p-2">Mã Sản Phẩm</th>
                <th className="border p-2">Tên Hàng Hóa</th>
                <th className="border p-2">Số Lượng Tồn</th>
                <th className="border p-2">Số Lượng Nhập</th>
                <th className="border p-2">Đơn Giá</th>
                <th className="border p-2">Thành Tiền</th>
                <th className="border p-2">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="product_id"
                      value={item.product_id}
                      onChange={(e) => handleSearchChange(e, index)}
                      className="w-full p-1 border border-gray-200 rounded"
                      required
                    />
                  </td>
                  <td className="border p-2 relative">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleSearchChange(e, index)}
                      className="w-full p-1 border border-gray-200 rounded"
                      required
                      disabled
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name="stock"
                      value={item.stock}
                      className="w-full p-1 border border-gray-200 rounded"
                      disabled
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-1 border border-gray-200 rounded"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="unitPrice"
                      value={item.unitPrice.toLocaleString('vi-VN')}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-1 border border-gray-200 rounded"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    {item.totalPrice.toLocaleString('vi-VN') || ''}
                  </td>
                  <td className="border p-2">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full py-1 px-2 text-black bg-white rounded hover:bg-gray-200 transition duration-200"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="border p-2 font-semibold text-right">
                  Tổng
                </td>
                <td className="border p-2">
                  {items
                    .reduce(
                      (acc, item) => acc + (parseFloat(item.totalPrice) || 0),
                      0
                    )
                    .toLocaleString('vi-VN')}
                </td>
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {searchQuery && searchResults.length > 0 && (
          <div className="absolute bg-white border border-gray-300 mt-2 w-full z-10 max-w-5xl">
            {searchResults.map((product, idx) => (
              <div
                key={idx}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => selectProduct(product, currentRowIndex)} // Sử dụng currentRowIndex ở đây
              >
                {product.product_id} - {product.product_name} (Tồn:{' '}
                {product.quantity})
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addItem}
          className="mt-4 w-full bg-white text-black py-2 rounded border border-gray hover:bg-gray-200 hover:text-black transition duration-200"
        >
          Thêm Hàng Hóa
        </button>

        <div>
          <label className="block text-gray-700">* Lý do nhập kho:</label>
          <input
            type="text"
            name="reason"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Gửi Phiếu Nhập Kho
        </button>
        
      </form>
    </div>
  )
}

export default CreateRequest
