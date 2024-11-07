import { useState } from 'react'

const CreateRequest = () => {
  const [items, setItems] = useState([
    { name: '', quantity: '', unitPrice: '', totalPrice: '' }
  ])

  // Hàm thêm hàng hóa mới vào bảng
  const addItem = () => {
    setItems([
      ...items,
      { name: '', quantity: '', unitPrice: '', totalPrice: '' }
    ])
  }

  // Hàm xử lý xóa hàng hóa
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  // Hàm xử lý thay đổi khi người dùng nhập vào ô
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
                  <td className="border p-2">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleChange(e, index)}
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
                      type="number"
                      name="unitPrice"
                      value={item.unitPrice}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-1 border border-gray-200 rounded"
                      required
                    />
                  </td>
                  <td className="border p-2">{item.totalPrice || ''}</td>
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
                  {items.reduce(
                    (acc, item) => acc + (parseFloat(item.totalPrice) || 0),
                    0
                  )}
                </td>
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

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
