import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ResultAi = () => {
  const [predictedResults, setPredictedResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/predict')
        console.log(response)
        setPredictedResults(response.data.results) // Gán kết quả trả về từ API
      } catch (error) {
        console.error('Error fetching predictions:', error)
      }
    }

    fetchPredictions()
  }, [])
  console.log(predictedResults)
  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
      <div className="flex justify-between">
        <strong className="text-sub font-semibold">Kết quả dự đoán</strong>

        <p
          onClick={() => navigate('/manager/orders')}
          className="cursor-pointer text-sky-600 hover:underline text-[14px] font-semibold"
        >
          More
        </p>
      </div>
      <div className="mt-3">
        <table className="w-full text-gray-700">
          <thead className="text-white font-medium bg-primary">
            <tr
              className="bg-primary"
              style={{
                backgroundColor: 'rgb(171, 171, 171)',
                color: 'rgba(0, 0, 0, 0.8)'
              }}
            >
              <td className="rounded-s-md">STT</td>
              <td>ID Sản phẩm</td>
              <td>Giá dự đoán</td>
              <td>Số lượng dự đoán</td>
            </tr>
          </thead>
          <tbody>
            {predictedResults &&
              predictedResults.map((result, index) => (
                <tr
                  key={result.productId}
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => navigate(`/manager/order/${result.productId}`)}
                >
                  <td>{index + 1}</td>
                  <td>{result.productId}</td>
                  <td>
                    {(result.predicted_price.toFixed(0) * 10000).toLocaleString(
                      'vi-VN',
                      {
                        currency: 'VND'
                      }
                    )}{' '}
                    VND
                  </td>

                  <td>{result.predicted_quantity.toFixed(0)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultAi
