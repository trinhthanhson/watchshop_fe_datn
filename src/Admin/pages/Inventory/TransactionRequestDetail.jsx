import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  getAllProductsRequest,
  getRequestDetailRequest
} from '../../../redux/actions/actions'

const TransactionRequestDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const requestDetail = useSelector(
    (state) => state.requestDetail?.requestDetail
  )
  const products = useSelector((state) => state.products?.products?.data)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentRowIndex, setCurrentRowIndex] = useState(null)
  useEffect(() => {
    try {
      dispatch(getAllProductsRequest())
      dispatch(getRequestDetailRequest(id))
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, id])

  const selectProduct = (product, index) => {
    const updatedData = [...editingData]
    updatedData[index] = {
      ...updatedData[index],
      product_request: {
        product_name: product.product_name,
        product_id: product.product_id,
        image: product.image
      },
      stock: product.quantity // Thêm số lượng hiện có nếu cần
    }
    setEditingData(updatedData)
    setSearchQuery('') // Xóa nội dung tìm kiếm
    setSearchResults([]) // Ẩn danh sách gợi ý
  }
  const handleSearchChange = (e, index) => {
    const { value } = e.target
    setSearchQuery(value)
    setCurrentRowIndex(index) // Lưu index của hàng hiện tại
    handleInputChange(index, 'product_request.product_name', value)
    const filteredProducts = products.filter(
      (product) =>
        (product.product_name.toLowerCase().includes(value.toLowerCase()) ||
          product.product_id.includes(value)) &&
        !editingData.some(
          (item) => item.product_request?.product_id === product.product_id
        )
    )

    setSearchResults(filteredProducts)
  }
  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      axios
        .put(
          `http://localhost:9999/api/inventory/request/${id}/status`,
          { status: 'REJECT' },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          dispatch(getRequestDetailRequest(id))
        })
    } catch (error) {
      console.error('Error change order status', error)
    }
  }

  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      axios
        .put(
          `http://localhost:9999/api/inventory/request/${id}/status`,
          { status: 'APPROVED' },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          dispatch(getRequestDetailRequest(id))
        })
    } catch (error) {
      console.error('Error change order status', error)
    }
  }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingData, setEditingData] = useState([])

  useEffect(() => {
    // Đồng bộ editingData với requestDetail
    if (requestDetail?.requestDetails) {
      setEditingData(requestDetail?.requestDetails)
    }
  }, [requestDetail])
  // Mở modal chỉnh sửa
  const openEditModal = () => {
    setIsEditModalOpen(true)
  }

  // Đóng modal chỉnh sửa
  const closeEditModal = () => {
    setIsEditModalOpen(false)
  }

  // Cập nhật giá trị trong form
  const handleInputChange = (index, field, value) => {
    const updatedData = [...editingData]

    // Kiểm tra nếu field có dấu `.` (đường dẫn lồng nhau)
    const fields = field.split('.')
    if (fields.length > 1) {
      const [parentField, childField] = fields
      if (!updatedData[index][parentField]) {
        updatedData[index][parentField] = {} // Tạo object nếu chưa tồn tại
      }
      updatedData[index][parentField][childField] = value // Cập nhật giá trị
    } else {
      updatedData[index][field] = value // Cập nhật thông thường
    }

    setEditingData(updatedData)
  }

  // Thêm dòng mới
  const handleAddRow = () => {
    const newRow = {
      product_request: { product_name: '', image: '' },
      quantity: 0,
      price: 0,
      note: ''
    }
    setEditingData([...editingData, newRow])
  }

  // Xóa dòng
  const handleDeleteRow = (index) => {
    const updatedData = editingData.filter((_, i) => i !== index)
    setEditingData(updatedData)
  }

  // Lưu thay đổi
  const handleSave = async () => {
    const mappedData = editingData.map((item) => ({
      ...item,
      quantity: item.quantity // Gán giá trị quantity_request vào quantity
    }))

    try {
      const token = localStorage.getItem('token')
      axios
        .post(
          `http://localhost:9999/api/inventory/request/${id}/update`,
          mappedData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          dispatch(getRequestDetailRequest(id))
        })
    } catch (error) {
      console.error('Error change order status', error)
    }
    closeEditModal()
  }

  return (
    <>
      <div className="flex">
        <div className="flex flex-[0.6] gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-2">
          <div className="w-full ml-5">
            <h5 className="text-left text-lg font-RobotoSemibold text-primary py-3">
              Thông tin phiếu đề nghị :
            </h5>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Người lập:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {requestDetail?.staff_created_request?.first_name +
                  ' ' +
                  requestDetail?.staff_created_request?.last_name}
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Nội dung:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {requestDetail?.content}
              </span>
            </p>
          </div>
        </div>

        <div className="flex-[0.4] w-[80%] ml-[20px] mr-[30px] rounded-md shadow-md bg-white mt-2">
          <div className="ml-5">
            <h5 className="text-left text-lg font-RobotoSemibold text-primary py-3">
              Chi Tiết Hóa Đơn
            </h5>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Tổng số lượng yêu cầu:
              </span>
              <span className="text-primary font-RobotoSemibold">
                {requestDetail?.total_quantity}
              </span>
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Tổng tiền:
              </span>
              {requestDetail?.total_price && (
                <span className="text-primary font-RobotoSemibold">
                  {requestDetail.total_price.toLocaleString('en')} VNĐ
                </span>
              )}
            </p>
            <p className="p-5">
              <span className="text-primary font-RobotoMedium mr-2">
                Thanh toán:
              </span>
              {requestDetail?.total_price && (
                <span className="text-primary font-RobotoSemibold">
                  {requestDetail.total_price.toLocaleString('en')} VNĐ
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-5">
        <table className="w-full text-gray-700">
          <thead className="text-white font-RobotoSemibold text-[18px]">
            <tr className="bg-primary">
              <td className="rounded-s-md">STT</td>
              <td>Hình Ảnh</td>
              <td>Sản Phẩm</td>
              <td>Số lượng đề nghị</td>
              <td>Số lượng duyệt</td>
              <td>Đơn Giá</td>
              <td>Lý do</td>
              <td>Ngày Đặt</td>
            </tr>
          </thead>
          <tbody>
            {requestDetail?.requestDetails?.map((orderItem, index) => (
              <tr key={index}>
                <td className="w-[60px] justify-center items-center flex pt-8">
                  {index + 1}
                </td>
                <td className="items-center">
                  <img
                    className="w-[60px] mt-[2px] rounded-full shadow-md mr-2"
                    src={orderItem?.product_request?.image}
                    alt={orderItem?.product_request?.product_name}
                  />
                </td>
                <td>
                  <p>{orderItem?.product_request?.product_name}</p>
                </td>
                <td>{orderItem?.quantity_request}</td>
                <td>{orderItem?.quantity}</td>
                <td>{orderItem?.price.toLocaleString('en')} VNĐ</td>
                <td>{orderItem.note}</td>
                <td>
                  {new Date(requestDetail.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-primary px-4 py-2 rounded-md text-whith w-[7%] ml-[92%] mb-[20px]"
          onClick={openEditModal}
        >
          Sửa
        </button>
        {/* Modal chỉnh sửa */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[80%] max-h-[90%] overflow-y-auto p-8">
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa chi tiết</h2>
              <table className="w-full text-gray-700">
                <thead className="text-white font-RobotoSemibold text-[18px]">
                  <tr className="bg-primary">
                    <td>STT</td>
                    <td>Sản Phẩm</td>
                    <td>Số Lượng đề nghị</td>
                    <td>Số Lượng muốn nhập</td>
                    <td>Đơn Giá</td>
                    <td>Lý do</td>
                    <td>Hành động</td>
                  </tr>
                </thead>
                <tbody>
                  {editingData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={item.product_request?.product_name}
                          onChange={(e) => handleSearchChange(e, index)} // Gọi hàm tìm kiếm
                          className="border p-2 rounded"
                        />
                        {currentRowIndex === index &&
                          searchResults.length > 0 && (
                            <ul className="absolute bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto">
                              {searchResults.map((product) => (
                                <li
                                  key={product.product_id}
                                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                  onClick={() => selectProduct(product, index)} // Chọn sản phẩm
                                >
                                  {product.product_name} - {product.product_id}
                                </li>
                              ))}
                            </ul>
                          )}
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity_request}
                          className="border p-2 rounded"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleInputChange(index, 'quantity', e.target.value)
                          }
                          className="border p-2 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleInputChange(index, 'price', e.target.value)
                          }
                          className="border p-2 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.note}
                          onChange={(e) =>
                            handleInputChange(index, 'note', e.target.value)
                          }
                          className="border p-2 rounded"
                        />
                      </td>
                      <td>
                        <button
                          className="bg-red-500 text-black px-4 py-2 rounded-md hover:bg-red-700"
                          onClick={() => handleDeleteRow(index)}
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-green-500 text-black px-4 py-2 rounded-md hover:bg-green-700"
                  onClick={handleAddRow}
                >
                  Thêm Dòng
                </button>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-500 text-back px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={handleSave}
                  >
                    Lưu
                  </button>
                  <button
                    className="bg-gray-500 text-back px-4 py-2 rounded-md hover:bg-gray-700"
                    onClick={closeEditModal}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="ml-[18%] w-[80%] flex justify-between">
        <div></div>
        <div className="flex gap-3">
          {requestDetail?.status === 'WAITING' && (
            <button
              onClick={() => handleCancelOrder()}
              className="mt-5 bg-main text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverRed ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
            >
              Hủy
            </button>
          )}

          {requestDetail?.status === 'WAITING' && (
            <button
              className="mt-5 bg-primary text-white font-RobotoMedium text-[16px] rounded-md p-2 shadow-md hover:bg-hoverPrimary ease-out duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-r border-none"
              onClick={() => handleConfirmOrder()}
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default TransactionRequestDetail
