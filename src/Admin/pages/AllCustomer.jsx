import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCustomersRequest } from '../../redux/actions/actions'
import { getStatus } from '../../constants/Status'
import { getRank } from '../../constants/Rank'
import { MdModeEditOutline } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const AllCustomers = () => {
  const dispatch = useDispatch()
  const customers = useSelector((state) => state.customers.customers)
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1) // Trang hiện tại
  const itemsPerPage = 10 // Số sản phẩm mỗi trang
  useEffect(() => {
    try {
      dispatch(getAllCustomersRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch])

  // Tính toán sản phẩm cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCustomer = customers?.data?.slice(startIndex, endIndex)

  const totalPages = Math.ceil((customers?.data?.length || 0) / itemsPerPage)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-5">
      <table className="w-full text-gray-700">
        <thead className="text-white font-RobotoSemibold text-[18px] ">
          <tr className="bg-primary">
            <td className="rounded-s-md">ID</td>
            <td>Avatar</td>
            <td>Username</td>
            <td>Ngay Tao</td>
            <td>Diem</td>
            <td>Hang</td>
            <td>Trạng Thái</td>
            <td className="rounded-e-md">Actions</td>
          </tr>
        </thead>
        <tbody>
          {currentCustomer &&
            currentCustomer
              .filter((customer) => customer.username !== 'admin')
              .map((customer) => (
                <tr
                  key={customer.user_id}
                  className=" hover:bg-gray-100 transition-colors"
                >
                  <td>{customer?.user_id}</td>
                  <td>
                    <img
                      src={
                        customer?.avatar ||
                        'https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Flogo.png?alt=media&token=ff560732-bd5c-43d0-9271-7bcd3d9204ea'
                      }
                      alt={customer?.username}
                      className="w-[68px] h-[50px] object-contain rounded-md bg-primary"
                    />
                  </td>
                  <td>{customer?.username}</td>
                  <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                  <td>{customer?.points.toLocaleString('en')}</td>
                  <td>{getRank(customer?.points)}</td>
                  <td>{getStatus(customer?.status)}</td>
                  <td className="">
                    <MdModeEditOutline
                      className="cursor-pointer inline-flex rounded-full h-10 w-10 hover:bg-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-125 p-2"
                      fontSize={25}
                      onClick={() =>
                        navigate(`/manager/user-customer/${customer?.user_id}`)
                      }
                    />
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
  )
}

export default AllCustomers
