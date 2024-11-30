import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProductsRequest } from '../../redux/actions/actions'
import { getStatus, getStatusText } from '../../constants/Status'
import { IoIosAddCircle } from 'react-icons/io'
import { MdModeEditOutline, MdDelete, MdFileDownload } from 'react-icons/md'
import axios from 'axios'
import * as XLSX from 'xlsx'

const AllProducts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const products = useSelector((state) => state.products.products)
  const [deletedProductId, setDeletedProductId] = useState(null)
  const [sortOrder, setSortOrder] = useState('all') // Trạng thái bộ lọc
  const [currentPage, setCurrentPage] = useState(1) // Trang hiện tại
  const itemsPerPage = 10 // Số sản phẩm mỗi trang

  useEffect(() => {
    try {
      dispatch(getAllProductsRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, deletedProductId])

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

  // Tính toán sản phẩm cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredAndSortedProducts?.slice(startIndex, endIndex)

  const totalPages = Math.ceil(
    (filteredAndSortedProducts?.length || 0) / itemsPerPage
  )

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

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
    <>
      <div className="flex flex-col  w-[80%] ml-[18%] rounded-md shadow-md bg-white">
        {/* Bộ lọc theo ngày */}
        <div className="flex justify-end p-4">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
          <MdFileDownload
            className="cursor-pointer text-primary mt-1 ml-1 hover:bg-gray-300 transition-transform rounded-full duration-200 transform"
            fontSize={25}
            onClick={exportToExcel}
          />
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
              <td>Mô tả</td>
              <td>Số lượng</td>
              <td>Trạng Thái</td>
              <td className="rounded-e-md">Action</td>
            </tr>
          </thead>
          <tbody>
            {currentProducts?.map((product) => (
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
                <td
                  onClick={() =>
                    navigate(`/manager/product/${product?.product_id}`)
                  }
                >
                  {product?.detail && product.detail.length > 50
                    ? `${product?.detail.substring(0, 10)}...`
                    : product.detail}
                </td>
                <td>{product?.quantity}</td>
                <td>{getStatus(product?.status)}</td>
                <td>
                  <span className="cursor-pointer inline-flex rounded-full hover:bg-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-125 p-2">
                    <MdModeEditOutline
                      className="cursor-pointer text-primary"
                      fontSize={25}
                      onClick={() =>
                        navigate(
                          `/manager/update-product/${product?.product_id}`
                        )
                      }
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
        <div className="flex justify-center mt-4 space-x-2 mb-2">
          {/* Nút Previous */}
          <button
            className="p-2 border rounded-md hover:bg-gray-300 transition-transform duration-200 transform cursor-pointer"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* Hiển thị số trang */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                className={`p-2 border rounded-md transition-transform duration-200 transform cursor-pointer ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-300'
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}

          {/* Nút Next */}
          <button
            className="p-2 border rounded-md hover:bg-gray-300 transition-transform duration-200 transform cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
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
    </>
  )
}

export default AllProducts
