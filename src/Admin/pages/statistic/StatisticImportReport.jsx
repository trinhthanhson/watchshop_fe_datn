import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStatisticRequest } from '../../../redux/actions/statistic/action'

const StatisticImportReport = () => {
  const dispatch = useDispatch()

  // Lấy data từ Redux store
  const data = useSelector((state) => state.statistic.statistic)
  console.log(data)

  useEffect(() => {
    // Dispatch action để lấy dữ liệu
    dispatch(getStatisticRequest('IMPORT', '2024-01-01', '2024-11-30'))
  }, [dispatch])

  return (
    <div className="p-6 ml-[250px] bg-white">
      <div className="text-center mb-6 ">
        <h1 className="text-xl font-bold">TỔNG HỢP NHẬP XUẤT TỒN</h1>
        <p className="text-sm">KHO: TẤT CẢ CÁC KHO</p>
        <p className="text-sm">
          TỪ NGÀY: .... / .... / .... ĐẾN NGÀY: .... / .... / ....
        </p>
      </div>

      <div className="flex justify-between text-sm mb-4">
        <p>ĐƠN VỊ: ...............................................</p>
        <p>Địa chỉ: ...............................................</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 text-sm text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">STT</th>
              <th className="border border-gray-400 p-2">MÃ VẬT TƯ</th>
              <th className="border border-gray-400 p-2">TÊN VẬT TƯ</th>
              <th className="border border-gray-400 p-2">ĐVT</th>
              <th className="border border-gray-400 p-2">
                TỒN ĐẦU KỲ
                <div className="flex justify-between">
                  <span>SỐ LƯỢNG</span>
                  <span>TIỀN</span>
                </div>
              </th>
              <th className="border border-gray-400 p-2">
                NHẬP TRONG KỲ
                <div className="flex justify-between">
                  <span>SỐ LƯỢNG</span>
                  <span>TIỀN</span>
                </div>
              </th>
              <th className="border border-gray-400 p-2">
                XUẤT TRONG KỲ
                <div className="flex justify-between">
                  <span>SỐ LƯỢNG</span>
                  <span>TIỀN</span>
                </div>
              </th>
              <th className="border border-gray-400 p-2">
                TỒN CUỐI KỲ
                <div className="flex justify-between">
                  <span>SỐ LƯỢNG</span>
                  <span>TIỀN</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2">{index + 1}</td>
                <td className="border border-gray-400 p-2">
                  {item.productCode}
                </td>
                <td className="border border-gray-400 p-2">
                  {item.productName}
                </td>
                <td className="border border-gray-400 p-2">Cái</td>
                <td className="border border-gray-400 p-2">
                  <div className="flex justify-between">
                    <span>{item.openingQty}</span>
                    <span>{item.openingValue}</span>
                  </div>
                </td>
                <td className="border border-gray-400 p-2">
                  <div className="flex justify-between">
                    <span>{item.importQty}</span>
                    <span>{item.importValue}</span>
                  </div>
                </td>
                <td className="border border-gray-400 p-2">
                  <div className="flex justify-between">
                    <span>{item.exportQty}</span>
                    <span>{item.exportValue}</span>
                  </div>
                </td>
                <td className="border border-gray-400 p-2">
                  <div className="flex justify-between">
                    <span>{item.closingQty}</span>
                    <span>{item.closingValue}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between text-sm mt-6">
        <div>
          <p>NGƯỜI LẬP BIỂU</p>
          <p className="mt-10">(Ký, họ tên)</p>
        </div>
        <div>
          <p>KẾ TOÁN TRƯỞNG</p>
          <p className="mt-10">(Ký, họ tên)</p>
        </div>
      </div>
    </div>
  )
}

export default StatisticImportReport
