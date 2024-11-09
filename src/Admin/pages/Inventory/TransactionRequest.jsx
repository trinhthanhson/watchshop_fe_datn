import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosAddCircle } from 'react-icons/io'
import { MdModeEditOutline, MdDelete, MdFileDownload } from 'react-icons/md'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { getAllRequestRequest } from '../../../redux/actions/actions'
import { getStatus, getStatusText } from '../../../constants/Status'

const TransactionRequest = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const request = useSelector((state) => state.request?.request)
  const [deletedRequestId, setDeletedRequestId] = useState(null)
  const [sortOrder, setSortOrder] = useState('all') // Trạng thái bộ lọc
  useEffect(() => {
    try {
      dispatch(getAllRequestRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, deletedRequestId])

  const filteredAndSortedRequest = request?.data
    ?.filter(
      () => (sortOrder === 'all' ? true : Request.quantity > 0) // Nếu 'all' được chọn, không lọc
    )
    ?.slice()
    .sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredAndSortedRequest.map((Request) => ({
        ID: Request.Request_id,
        Image: Request.image,
        Name: Request.Request_name,
        Category: Request.category_Request?.category_name,
        Brand: Request.brand_Request?.brand_name,
        Price: Request.updatePrices[0]?.price_new.toLocaleString('en'),
        Quantity: Request.quantity,
        Status: getStatusText(Request.status)
      }))
    )

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Requests')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    })
    const fileURL = URL.createObjectURL(file)

    // Tạo liên kết để tải xuống và kích hoạt sự kiện click
    const a = document.createElement('a')
    a.href = fileURL
    a.download = 'Requests.xlsx'
    a.click()

    // Giải phóng URL sau khi sử dụng
    URL.revokeObjectURL(fileURL)
  }

  const handleDeleteRequest = async (RequestId) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa sản phẩm này không?'
    )

    const token = localStorage.getItem('token')

    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:9999/api/staff/Request/${RequestId}/delete`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setDeletedRequestId(RequestId)
      } catch (error) {
        console.error('Error deleting Request:', error)
      }
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-5">
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
            className="cursor-pointer text-primary"
            fontSize={25}
            onClick={exportToExcel}
          />
        </div>

        <table className="w-full text-gray-700">
          <thead className="text-white font-RobotoSemibold text-[18px] ">
            <tr className="bg-primary">
              <td className="rounded-s-md">ID</td>
              <td>Tổng số lượng</td>
              <td>Tổng giá</td>
              <td>Ngày tạo</td>
              <td>Người tạo</td>
              <td>Người xác nhận</td>
              <td>Trạng Thái</td>
              <td className="rounded-e-md">Action</td>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRequest?.map((request) => (
              <tr key={request.request_id}>
                <td
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/manager/inventory/request/${request?.request_id}`
                    )
                  }
                >
                  {request?.request_id}
                </td>
                <td
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/manager/inventory/request/${request?.request_id}`
                    )
                  }
                >
                  {request?.total_quantity}
                </td>

                <td
                  onClick={() =>
                    navigate(
                      `/manager/inventory/request/${request?.request_id}`
                    )
                  }
                >
                  {request?.total_price}
                </td>
                <td>{new Date(request?.created_at).toLocaleDateString()}</td>
                <td>
                  {request?.staff_created_request?.first_name +
                    ' ' +
                    request?.staff_created_request?.last_name}
                </td>
                <td>
                  <td>
                    {request?.staff_updated_request
                      ? request.staff_updated_request.first_name +
                        ' ' +
                        request.staff_updated_request.last_name
                      : 'chưa xác nhận'}
                  </td>
                </td>
                <td>{getStatus(request?.status)}</td>

                <td>
                  <span>
                    <MdModeEditOutline
                      className="cursor-pointer text-primary"
                      fontSize={25}
                      onClick={() =>
                        navigate(
                          `/manager/inventory/update-request/${request?.request_id}`
                        )
                      }
                    />
                  </span>
                  <span>
                    <MdDelete
                      className="cursor-pointer text-primary"
                      fontSize={25}
                      onClick={() => handleDeleteRequest(request?.request_id)}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fixed right-6 bottom-3">
        <IoIosAddCircle
          fontSize={50}
          className="cursor-pointer text-primary"
          onClick={() => navigate('/manager/inventory/create-request')}
        />
      </div>
    </>
  )
}

export default TransactionRequest
