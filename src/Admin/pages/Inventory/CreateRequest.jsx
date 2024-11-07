import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProductsRequest } from '../../../redux/actions/actions'

const CreateRequest = () => {
  const [items, setItems] = useState([
    { name: '', quantity: '', unitPrice: '', totalPrice: '' }
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const products = useSelector((state) => state.products.products.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllProductsRequest())
  }, [dispatch])

  const addItem = () => {
    setItems([
      ...items,
      { name: '', quantity: '', unitPrice: '', totalPrice: '' }
    ])
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleChange = (e, index) => {
    const { name, value } = e.target
    const newItems = [...items]
    newItems[index][name] = value

    if (name === 'quantity' || name === 'unitPrice') {
      newItems[index].totalPrice =
        newItems[index].quantity && newItems[index].unitPrice
          ? newItems[index].quantity * newItems[index].unitPrice
          : ''
    }

    setItems(newItems)
  }
  const handlePriceChange = (e, index) => {
    // Loại bỏ các ký tự không phải là số và dấu chấm
    let value = e.target.value.replace(/[^\d]/g, '')

    // Đảm bảo giá trị không bị rỗng
    if (value === '') {
      value = '0'
    }

    // Chuyển giá trị thành số
    const newItems = [...items]
    newItems[index].unitPrice = parseInt(value, 10)

    // Cập nhật lại danh sách items
    setItems(newItems)
  }

  const handleSearchChange = (e, index) => {
    const { value } = e.target
    setSearchQuery(value)

    // Lọc các sản phẩm có tên chứa từ khóa và chưa có trong bảng
    const filteredProducts = products.filter(
      (product) =>
        product.product_name.toLowerCase().includes(value.toLowerCase()) &&
        !items.some((item) => item.name === product.product_name) // Kiểm tra sản phẩm đã có trong bảng chưa
    )

    setSearchResults(filteredProducts)

    // Gọi lại hàm xử lý thay đổi cho các trường khác
    handleChange(e, index)
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

        {/* Thông tin chung */}
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

        {/* Bảng hàng hóa */}
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-semibold"></span>
            <span className="text-gray-700 font-semibold italic">
              Đơn vị tính: VND
            </span>
          </div>
          <table className="min-w-full border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border p-2">STT</th>
                <th className="border p-2">Tên Hàng Hóa</th>
                <th className="border p-2">Số Lượng</th>
                <th className="border p-2">Đơn Giá</th>
                <th className="border p-2">Thành Tiền</th>
                <th className="border p-2">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2 relative">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleSearchChange(e, index)} // Sử dụng hàm tìm kiếm
                      className="w-full p-1 border border-gray-200 rounded"
                      required
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
                      type="text" // Thay đổi thành 'text' để xử lý dấu phân cách
                      name="unitPrice"
                      value={item.unitPrice.toLocaleString('vi-VN')} // Định dạng số với dấu chấm
                      onChange={(e) => handlePriceChange(e, index)} // Gọi hàm xử lý nhập liệu
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
                <td colSpan="4" className="border p-2 font-semibold text-right">
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

        {/* Gợi ý tên hàng hóa nằm bên ngoài bảng */}
        {searchQuery && searchResults.length > 0 && (
          <div className="absolute bg-white border border-gray-300 mt-2 w-full z-10 max-w-5xl">
            {searchResults.map((product, idx) => (
              <div
                key={idx}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  // Chọn sản phẩm và điền vào ô nhập liệu
                  const newItems = [...items]
                  newItems[0].name = product.product_name // Dùng item đầu tiên ở đây
                  setItems(newItems)
                  setSearchQuery('') // Xóa từ khóa tìm kiếm sau khi chọn
                  setSearchResults([]) // Xóa gợi ý
                }}
              >
                {product.product_name}
              </div>
            ))}
          </div>
        )}

        {/* Nút thêm hàng hóa */}
        <button
          type="button"
          onClick={addItem}
          className="mt-4 w-full bg-white text-black py-2 rounded border border-gray hover:bg-gray-200 hover:text-black transition duration-200"
        >
          Thêm Hàng Hóa
        </button>

        {/* Ghi chú */}
        <div>
          <label className="block text-gray-700 font-semibold">
            * Diễn giải:
          </label>
          <textarea
            name="notes"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            rows="3"
          ></textarea>
        </div>

        {/* Nút tạo phiếu */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Tạo Phiếu
        </button>
      </form>
    </div>
  )
}

export default CreateRequest
