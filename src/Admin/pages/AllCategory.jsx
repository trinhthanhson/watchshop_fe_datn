import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategoriesRequest } from '../../redux/actions/actions'
import { getStatus } from '../../constants/Status'
import { IoIosAddCircle } from 'react-icons/io'
import axios from 'axios'
import { MdModeEditOutline, MdDelete } from 'react-icons/md'

const AllCategory = () => {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.categories.categories)
  const [showDialog, setShowDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [deletedCategoryId, setDeletedCategoryId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1) // Trang hiện tại
  const itemsPerPage = 10 // Số s
  useEffect(() => {
    try {
      dispatch(getAllCategoriesRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, deletedCategoryId])

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setNewCategoryName('')
  }

  // Tính toán sản phẩm cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = categories?.data?.slice(startIndex, endIndex)

  const totalPages = Math.ceil((categories?.data?.length || 0) / itemsPerPage)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:9999/api/staff/category/add',
        {
          category_name: newCategoryName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 201) {
        handleCloseDialog()
        dispatch(getAllCategoriesRequest())
      }
    } catch (error) {
      console.error('Error adding category', error)
    }
  }

  const getCategoryNameById = (categoryId) => {
    const category = categories?.data.find(
      (cat) => cat.category_id === categoryId
    )
    return category?.category_name || ''
  }

  const handleShowUpdateDialog = (categoryId) => {
    setSelectedCategoryId(categoryId)
    setNewCategoryName(getCategoryNameById(categoryId))
    setShowUpdateDialog(true)
  }

  const handleCloseUpdateDialog = () => {
    setShowUpdateDialog(false)
    setSelectedCategoryId(null)
    setNewCategoryName('')
  }

  const handleUpdateCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token')

      const response = await axios.put(
        `http://localhost:9999/api/staff/category/${categoryId}/update`,
        {
          category_name: newCategoryName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.data.code === 200) {
        setShowUpdateDialog(false)
        setNewCategoryName('')

        dispatch(getAllCategoriesRequest())
      }
    } catch (error) {
      console.error('Error updating category', error)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa loại này không?'
    )

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token')

    if (!token) {
      console.error('Authorization token is missing.')
      return
    }

    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:9999/api/staff/category/${categoryId}/delete`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setDeletedCategoryId(categoryId)
        dispatch(getAllCategoriesRequest())
        alert('Category deleted successfully!')
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }
  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 w-[90%] ml-[15%] rounded-md shadow-md bg-white mt-3">
        <table className="w-full text-gray-700">
          <thead className="text-white font-RobotoSemibold text-[18px] ">
            <tr className="bg-primary">
              <td className="rounded-s-md">ID</td>
              <td>Hình Ảnh</td>
              <td>Tên Loại</td>
              <td>Ngày Tạo</td>
              <td>Người Tạo</td>
              <td>Trạng Thái</td>
              <td className="rounded-e-md">Hành Động</td>
            </tr>
          </thead>
          <tbody>
            {currentProducts &&
              currentProducts.map((category, index) => (
                <tr
                  key={category.slug}
                  className=" hover:bg-gray-100 transition-colors ease-in-out transform "
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        category?.image ||
                        'https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Flogo.png?alt=media&token=ff560732-bd5c-43d0-9271-7bcd3d9204ea'
                      }
                      alt={category?.category_name}
                      className="w-[68px] h-[50px] object-contain rounded-md bg-primary"
                    />
                  </td>
                  <td>{category?.category_name}</td>
                  <td>{new Date(category?.created_at).toLocaleDateString()}</td>
                  <td>
                    {category?.staff_create?.first_name +
                      ' ' +
                      category?.staff_create?.last_name}
                  </td>
                  <td>{getStatus(category?.status)}</td>
                  <td>
                    <span className="cursor-pointer inline-flex rounded-full hover:bg-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-125 p-2">
                      <MdModeEditOutline
                        className="cursor-pointer text-primary"
                        fontSize={25}
                        onClick={() =>
                          handleShowUpdateDialog(category?.category_id)
                        }
                      />
                    </span>
                    <span className="cursor-pointer inline-flex rounded-full hover:bg-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-125 p-2">
                      <MdDelete
                        className="cursor-pointer text-primary"
                        fontSize={25}
                        onClick={() =>
                          handleDeleteCategory(category?.category_id)
                        }
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
          onClick={() => handleShowDialog()}
        />
      </div>

      {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Thêm Loại</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
              placeholder="Nhập tên loại"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCloseDialog}
                className="bg-gray-300 px-4 py-2 rounded-md mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Cập Nhật Loại</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
              placeholder="Nhập tên loại"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCloseUpdateDialog}
                className="bg-gray-300 px-4 py-2 rounded-md mr-2"
              >
                Hủy
              </button>
              <button
                onClick={() => handleUpdateCategory(selectedCategoryId)}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Cập Nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllCategory
