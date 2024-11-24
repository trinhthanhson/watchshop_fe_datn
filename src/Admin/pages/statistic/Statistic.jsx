const Statistic = () => {
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
            {/* Ví dụ một số hàng dữ liệu */}
            {[1, 2, 3, 4, 5].map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2">{index + 1}</td>
                <td className="border border-gray-400 p-2">MVT-{index + 1}</td>
                <td className="border border-gray-400 p-2">
                  Vật tư {index + 1}
                </td>
                <td className="border border-gray-400 p-2">Cái</td>
                <td className="border border-gray-400 p-2">
                  <div className="flex justify-between">
                    <span>100</span>
                    <span>1,000,000</span>
                  </div>
                </td>
                <td className="border border-gray-400 p-2">
                  <div className="flex justify-between">
                    <span>50</span>
                    <span>500,000</span>
                  </div>
                </td>
                <td className="border border-gray-400 p-2">
                  <div className="flex justify-between">
                    <span>30</span>
                    <span>300,000</span>
                  </div>
                </td>
                <td className="border border-gray-400 p-2">
                  <div className="flex justify-between">
                    <span>120</span>
                    <span>1,200,000</span>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="border border-gray-400 p-2" colSpan="4">
                TỔNG CỘNG
              </td>
              <td className="border border-gray-400 p-2">
                <div className="flex justify-between">
                  <span>500</span>
                  <span>5,000,000</span>
                </div>
              </td>
              <td className="border border-gray-400 p-2">
                <div className="flex justify-between">
                  <span>200</span>
                  <span>2,000,000</span>
                </div>
              </td>
              <td className="border border-gray-400 p-2">
                <div className="flex justify-between">
                  <span>100</span>
                  <span>1,000,000</span>
                </div>
              </td>
              <td className="border border-gray-400 p-2">
                <div className="flex justify-between">
                  <span>600</span>
                  <span>6,000,000</span>
                </div>
              </td>
            </tr>
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

export default Statistic
