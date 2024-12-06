import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllProductsRequest,
  getAllSupplierRequest,
  getUserProfileRequest
} from '../../../redux/actions/actions'
import { useNavigate } from 'react-router-dom'
import {
  createTransactionRequest,
  getAllRequestNotFullRequest,
  getDataNotFullRequest
} from '../../../redux/actions/inventory/manager/action'

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
  const [supplierId, setSupplierId] = useState('') // Trạng thái cho phiếu đề nghị được chọn
  const [billId, setBillId] = useState('') // Trạng thái cho phiếu đề nghị được chọn
  const navigate = useNavigate()

  const products = useSelector((state) => state.products?.products?.data)
  const user = useSelector((state) => state.user?.user?.data)
  const request = useSelector((state) => state.request_all?.request_all?.data)
  const supplier = useSelector((state) => state.suppliers?.suppliers?.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllProductsRequest())
    dispatch(getAllRequestNotFullRequest()) // Lấy danh sách các phiếu đề nghị
    dispatch(getUserProfileRequest())
    dispatch(getAllSupplierRequest())
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

  const resetTable = () => {
    setItems([])
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
  // const handleRequestChange = (e) => {
  //   const selectedRequestId = e.target.value
  //   setSelectedRequest(selectedRequestId)
  //   dispatch(getDataNotFullRequest(selectedRequestId))

  //   // Tìm phiếu đề nghị đã chọn
  //   const requestData = request?.find(
  //     (req) => req.request_id === parseInt(selectedRequestId, 10)
  //   )
  //   console.log(requestData)
  //   if (requestData) {
  //     // Chuyển đổi requestDetails thành dữ liệu hiển thị trong bảng
  //     const updatedItems = requestData.requestDetails.map((detail) => ({
  //       product_id: detail.product_id,
  //       name: detail?.product_request?.product_name || '',
  //       quantity: detail.quantity || 0,
  //       quantity_request: detail.quantity_request,
  //       unitPrice: detail.price || 0,
  //       totalPrice: detail.quantity * detail.price || 0,
  //       note: detail.note || '',
  //       stock: detail?.product_request?.quantity
  //     }))
  //     setItems(updatedItems)
  //   }
  // }
  const dataNotFull = useSelector((state) => state?.notfull?.data?.data)
  const handleRequestChange = (e) => {
    const selectedRequestId = e.target.value
    setSelectedRequest(selectedRequestId)
    // Gửi request ID để lấy dữ liệu từ API
    dispatch(getDataNotFullRequest(selectedRequestId))
  }

  useEffect(() => {
    if (dataNotFull) {
      // Chuyển đổi dữ liệu từ API thành bảng
      const updatedItems = dataNotFull?.product_request?.map((detail) => ({
        product_id: detail?.productId,
        name: detail?.productName || '',
        quantity: detail?.remainingQuantity || 0,
        quantity_request: detail?.quantityRequest,
        unitPrice: detail?.price || 0,
        totalPrice: detail.quantityRequest * detail?.price || 0,
        note: detail?.note || '',
        stock: detail?.productQuantity
      }))
      setItems(updatedItems)
    } else {
      console.warn('dataNotFull is not an array:', dataNotFull)
    }
  }, [dataNotFull])

  const handleSupplierChange = (e) => {
    const selectedSupplierId = e.target.value // Lấy giá trị được chọn
    setSupplierId(selectedSupplierId) // Cập nhật trạng thái
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
      request_id: selectedRequest,
      type_name: 'IMPORT',
      bill_code: billId,
      supplier_id: supplierId,
      products: items.map((item) => ({
        productId: item.product_id,
        quantity: parseInt(item.quantity),
        quantity_request: parseInt(item.quantity_request) || 0,
        unitPrice: parseInt(item.unitPrice),
        note: item.note,
        stock: item.stock
      }))
    }
    dispatch(createTransactionRequest(payload, navigate))
    setItems([])
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl"
        style={{ marginLeft: '230px' }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Phiếu Nhập Kho
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
            <div>
              <label className="block text-gray-700 font-semibold">
                Mã hoá đơn nhập hàng:
              </label>
              <input
                type="text"
                name="bill_id"
                className="w-full p-3 border border-gray-300 rounded mt-2"
                value={billId}
                onChange={(e) => setBillId(e.target.value)}
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
                {req.transaction_code + ' - ' + req.content}
              </option>
            ))}
          </select>
        </div>
        {/* Combobox chọn phiếu đề nghị */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold">
            Chọn Nhà Cung Cấp:
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded mt-2"
            value={supplierId}
            onChange={handleSupplierChange}
            required
          >
            <option value="">-- Chọn nhà cung cấp --</option>
            {supplier?.map((req) => (
              <option key={req?.supplier_id} value={req?.supplier_id}>
                {req?.supplier_name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <button
            type="button"
            onClick={resetTable}
            className="py-2 px-4 mb-4 text-white bg-primary rounded hover:bg-red-600 transition duration-200 ml-[92%] mt-[20px]"
          >
            Reset
          </button>
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
                <th className="border p-2">Ghi Chú</th>
                <th className="border p-2">Hành Động</th>
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
                      required
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
                    <input
                      type="text"
                      name="note"
                      value={item.note}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-1 border border-gray-200 rounded"
                      required
                    />
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
                  Tổng Số Lượng Nhập
                </td>
                <td className="border p-2 font-semibold text-center">
                  {items.reduce(
                    (acc, item) => acc + (parseFloat(item.quantity) || 0),
                    0
                  )}
                </td>
                <td className="border p-2 font-semibold text-right">
                  Tổng Tiền
                </td>
                <td className="border p-2 font-semibold">
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
        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Tạo Phiếu Nhập Kho
        </button>
      </div>
    </div>
  )
}

export default CreateRequest
