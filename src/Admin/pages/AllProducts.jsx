import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getStatus, getStatusText } from '../../constants/Status'
import { IoIosAddCircle } from 'react-icons/io'
import { MdModeEditOutline, MdDelete, MdFileDownload } from 'react-icons/md'
import axios from 'axios'
import * as XLSX from 'xlsx'
import {
  getAllProductsPageRequest,
  searchProductByIdRequest
} from '../../redux/actions/user/action'
import { HiOutlineSearch } from 'react-icons/hi'

const AllProducts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const products = useSelector((state) => state.product_page.product_page)
  const product_find = useSelector((state) => state?.product_find?.product_find)
  const [deletedProductId, setDeletedProductId] = useState(null)
  const [sortOrder, setSortOrder] = useState('all') // Trạng thái bộ lọc
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false) // Đánh dấu trạng thái tìm kiếm
  const [timeoutId, setTimeoutId] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10 // Số bản ghi mỗi trang
  const totalPages = products?.totalPages || 1 // Lấy totalPages từ API
  useEffect(() => {
    try {
      dispatch(getAllProductsPageRequest(currentPage, recordsPerPage))
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, deletedProductId, currentPage, recordsPerPage])

  const filteredAndSortedProducts = products?.data
    ?.filter(
      (product) => (sortOrder === 'all' ? true : product.quantity > 0) // Nếu 'all' được chọn, không lọc
    )
    ?.slice()
    .sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  const handleSearch = (value) => {
    if (value.trim() !== '') {
      dispatch(searchProductByIdRequest(value, currentPage, recordsPerPage))
      setIsSearching(true) // Đang trong trạng thái tìm kiếm
    } else {
      setIsSearching(false) // Không tìm kiếm
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchValue(value)

    // Nếu có timeout trước đó, xóa nó
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Đặt timeout mới
    const newTimeoutId = setTimeout(() => {
      handleSearch(value) // Gọi hàm tìm kiếm
    }, 300) // Đợi 300ms trước khi gọi API
    setTimeoutId(newTimeoutId)
  }

  const displayedProducts = isSearching
    ? product_find
    : filteredAndSortedProducts || []

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredAndSortedProducts.map((product) => ({
        ID: product.product_id,
        Image: product.image,
        Name: product.product_name,
        Category: product.category_product?.category_name,
        Brand: product.brand_product?.brand_name,
        Price: product.updatePrices[0]?.price_new.toLocaleString('en'),
        Quantity: product.quantity,
        Status: getStatusText(product.status)
      }))
    )

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    })
    const fileURL = URL.createObjectURL(file)

    // Tạo liên kết để tải xuống và kích hoạt sự kiện click
    const a = document.createElement('a')
    a.href = fileURL
    a.download = 'products.xlsx'
    a.click()

    // Giải phóng URL sau khi sử dụng
    URL.revokeObjectURL(fileURL)
  }
  const handleUpdateProduct = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/manager/update-product/${id}`)
  }
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa sản phẩm này không?'
    )

    const token = localStorage.getItem('token')

    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:9999/api/staff/product/${productId}/delete`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setDeletedProductId(productId)
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col  w-[90%] ml-[15%] rounded-md shadow-md bg-white">
        <div className="flex justify-between items-center mt-5">
          {/* Tìm kiếm */}
          <div className="relative ml-[30%] mb-2">
            <HiOutlineSearch
              fontSize={20}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by Product ID..."
              value={searchValue}
              onChange={handleInputChange} // Gọi khi giá trị thay đổi
              className="w-[500px] border border-gray-300 rounded-md px-4 py-2 pl-9 focus:font-medium focus:text-primary focus:outline-none focus:ring-1 focus:ring-primary transition duration-500 ease-in-out"
            />
          </div>
          {/* Bộ lọc và xuất */}
          <div className="flex items-center">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">All</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
            <div className="border border-gray-300 rounded-md p-2 flex items-center ml-3 mr-2 hover:bg-gray-300">
              <MdFileDownload
                className="cursor-pointer text-primary  transition-transform rounded-full duration-200 transform"
                fontSize={20}
                onClick={exportToExcel}
              />
            </div>
          </div>
        </div>

        <table className="w-full text-gray-700">
          <thead className="text-white font-RobotoSemibold text-[18px] ">
            <tr className="bg-primary">
              <td className="rounded-s-md">ID</td>
              <td>Ảnh</td>
              <td>Tên</td>
              <td>Loại Sản phẩm</td>
              <td>Hãng Sản Phẩm</td>
              <td>Giá Sản Phẩm</td>
              <td>Số lượng</td>
              <td>Trạng Thái</td>
              <td className="rounded-e-md">Hành Động</td>
            </tr>
          </thead>
          <tbody>
            {displayedProducts?.map((product) => (
              <tr
                key={product.product_id}
                className="cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <td>{product?.product_id}</td>
                <td
                  onClick={() =>
                    navigate(`/manager/product/${product?.product_id}`)
                  }
                >
                  <img
                    src={product?.image}
                    alt={product?.product_name}
                    className="w-[88px] object-cover rounded-md"
                  />
                </td>
                <td
                  className="cursor-pointer truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]"
                  onClick={() =>
                    navigate(`/manager/product/${product?.product_id}`)
                  }
                >
                  {product?.product_name}
                </td>
                <td>{product?.category_product?.category_name}</td>
                <td>{product?.brand_product?.brand_name}</td>
                <td>
                  {product?.updatePrices[0]?.price_new.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </td>
                <td>{product?.quantity}</td>
                <td>{getStatus(product?.status)}</td>
                <td>
                  <span
                    className="cursor-pointer inline-flex rounded-full hover:bg-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-125 p-2"
                    onClick={(e) => handleUpdateProduct(product?.product_id, e)}
                  >
                    <MdModeEditOutline
                      className="cursor-pointer text-primary"
                      fontSize={25}
                    />
                  </span>
                  <span className="cursor-pointer inline-flex rounded-full hover:bg-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-125 p-2">
                    <MdDelete
                      className="cursor-pointer text-primary"
                      fontSize={25}
                      onClick={() => handleDeleteProduct(product?.product_id)}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Điều khiển phân trang */}
        <div className="flex justify-center items-center gap-4 mt-4 border p-4 rounded-md">
          <button
            className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
            disabled={currentPage === 1} // Disable khi đang ở trang đầu
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} // Tránh trang âm
          >
            Previous
          </button>

          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
            disabled={currentPage === totalPages} // Disable khi đang ở trang cuối
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            } // Tránh vượt quá totalPages
          >
            Next
          </button>
        </div>
      </div>
      <div className="fixed right-6 bottom-3 hover:bg-gray-300 transition-transform rounded-full duration-200 transform hover:scale-125 p-2 ">
        <IoIosAddCircle
          fontSize={50}
          className="cursor-pointer text-primary"
          onClick={() => navigate('/manager/create-product')}
        />
      </div>
    </div>
  )
}

export default AllProducts
