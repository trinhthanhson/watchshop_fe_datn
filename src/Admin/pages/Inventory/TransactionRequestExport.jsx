import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosAddCircle } from 'react-icons/io'
import { MdFileDownload } from 'react-icons/md'
import { BiDetail } from 'react-icons/bi'
import * as XLSX from 'xlsx'
import { getStatusRequest, getStatusText } from '../../../constants/Status'
import { getAllRequestExportRequest } from '../../../redux/actions/inventory/manager/action'

const TransactionRequestExport = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const request = useSelector((state) => state.request_export?.request_export)
  const [sortOrder, setSortOrder] = useState('all') // Trạng thái bộ lọc
  useEffect(() => {
    try {
      dispatch(getAllRequestExportRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch])

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
              <td>Số phiếu</td>
              <td>Số lượng</td>
              <td>Tổng giá</td>
              <td>Ngày tạo</td>
              <td>Người tạo</td>
              <td>Loại phiếu</td>
              <td>Trạng Thái</td>
              <td>Chi tiết</td>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRequest?.map((request, index) => (
              <tr key={request.request_id}>
                <td>{index + 1}</td>
                <td>{request?.transaction_code}</td>
                <td>{request?.total_quantity}</td>
                <td>{request?.total_price.toLocaleString('vi-VN')}</td>
                <td>{new Date(request?.created_at).toLocaleDateString()}</td>
                <td>
                  {request?.staff_created_request?.first_name +
                    ' ' +
                    request?.staff_created_request?.last_name}
                </td>

                <td>{request?.type_request?.type_name}</td>
                <td>{getStatusRequest(request?.status)}</td>
                <td>
                  <BiDetail
                    className="cursor-pointer"
                    size={30}
                    onClick={() =>
                      navigate(`/inventory/request/${request?.request_id}`)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TransactionRequestExport
