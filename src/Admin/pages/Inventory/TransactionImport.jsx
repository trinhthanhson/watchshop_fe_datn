import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosAddCircle } from 'react-icons/io'
import { MdFileDownload } from 'react-icons/md'
import { BiDetail } from 'react-icons/bi'
import * as XLSX from 'xlsx'
import { getStatusText } from '../../../constants/Status'
import { getAllTransactionImportRequest } from '../../../redux/actions/inventory/manager/action'

const TransactionImport = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const transaction = useSelector(
    (state) => state.transactionImport?.transactionImport
  )
  const [sortOrder, setSortOrder] = useState('asc') // Trạng thái bộ lọc
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10 // Số bản ghi mỗi trang
  const totalPages = transaction?.totalPages || 1 // Tổng số trang từ API
  useEffect(() => {
    try {
      dispatch(
        getAllTransactionImportRequest(
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
      transaction?.data.map((Request) => ({
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
          <thead className="text-white font-RobotoSemibold text-[18px] ">
            <tr className="bg-primary">
              <td className="rounded-s-md">ID</td>
              <td>Số phiếu</td>
              <td>Số lượng</td>
              <td>Tổng giá</td>
              <td>Ngày tạo</td>
              <td>Người tạo</td>
              <td>Loại phiếu</td>
              <td>Chi tiết</td>
            </tr>
          </thead>
          <tbody>
            {transaction?.data?.map((transaction, index) => (
              <tr key={transaction.request_id}>
                <td>{index + 1}</td>
                <td>{transaction?.transaction_code}</td>
                <td>{transaction?.total_quantity}</td>
                <td>{transaction?.total_price.toLocaleString('vi-VN')}</td>
                <td>
                  {new Date(transaction?.created_at).toLocaleDateString()}
                </td>

                <td>
                  {transaction?.staff_transaction?.first_name +
                    ' ' +
                    transaction?.staff_transaction?.last_name}
                </td>
                <td>{transaction?.type_transaction?.type_name}</td>
                <td>
                  <BiDetail
                    className="cursor-pointer"
                    size={30}
                    onClick={() =>
                      navigate(
                        `/inventory/transaction/${transaction?.transaction_id}`
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <div className="fixed right-6 bottom-3 hover:bg-gray-300 transition-transform rounded-full duration-200 transform hover:scale-125 p-2 ">
        <IoIosAddCircle
          fontSize={50}
          className="cursor-pointer text-primary"
          onClick={() => navigate('/inventory/create-transaction')}
        />
      </div>
    </>
  )
}

export default TransactionImport
