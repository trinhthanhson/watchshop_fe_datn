import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MdFileDownload } from 'react-icons/md'
import { BiDetail } from 'react-icons/bi'
import * as XLSX from 'xlsx'
import { getStatusRequest, getStatusText } from '../../../constants/Status'
import { getAllRequestExportPageRequest } from '../../../redux/actions/inventory/manager/action'

const TransactionRequestExport = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const request = useSelector((state) => state?.requestExport?.requestExport)
  const [sortOrder, setSortOrder] = useState('asc') // Trạng thái bộ lọc
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10 // Số bản ghi mỗi trang
  const totalPages = request?.totalPages || 1 // Tổng số trang từ API
  console.log(request)
  useEffect(() => {
    try {
      dispatch(
        getAllRequestExportPageRequest(
          currentPage,
          recordsPerPage,
          'created_at',
          sortOrder
        )
      )
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, currentPage, sortOrder])

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      request?.data?.map((request) => ({
        ID: request.request_id,
        Image: request.image,
        Name: request.request_name,
        Category: request.category_request?.category_name,
        Brand: request.brand_request?.brand_name,
        Price: request.updatePrices[0]?.price_new.toLocaleString('en'),
        Quantity: request.quantity,
        Status: getStatusText(request.status)
      }))
    )

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Requests')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    })
    const fileURL = URL.createObjectURL(file)

    const a = document.createElement('a')
    a.href = fileURL
    a.download = 'Requests.xlsx'
    a.click()

    URL.revokeObjectURL(fileURL)
  }

  return (
    <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-5">
      {/* Bộ lọc theo ngày */}
      <div className="flex justify-end p-4">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
        <MdFileDownload
          className="cursor-pointer text-primary"
          fontSize={25}
          onClick={exportToExcel}
        />
      </div>

      <table className="w-full text-gray-700">
        <thead className="text-white font-RobotoSemibold text-[18px]">
          <tr className="bg-primary">
            <td className="rounded-s-md">STT</td>
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
          {request?.data?.map((req, index) => (
            <tr key={req.request_id}>
              <td>{index + 1 + (currentPage - 1) * recordsPerPage}</td>
              <td>{req.transaction_code}</td>
              <td>{req.total_quantity}</td>
              <td>{req.total_price.toLocaleString('vi-VN')}</td>
              <td>{new Date(req.created_at).toLocaleDateString()}</td>
              <td>
                {req.staff_created_request?.first_name +
                  ' ' +
                  req.staff_created_request?.last_name}
              </td>
              <td>{req.type_request?.type_name}</td>
              <td>{getStatusRequest(req.status)}</td>
              <td>
                <BiDetail
                  className="cursor-pointer"
                  size={30}
                  onClick={() =>
                    navigate(`/inventory/request/${req.request_id}`)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4 border p-4 rounded-md ml-[200px]">
        <button
          className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn p-2 border border-gray-300 rounded-md hover:border-blue-500 disabled:border-gray-200 disabled:text-gray-400"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default TransactionRequestExport
