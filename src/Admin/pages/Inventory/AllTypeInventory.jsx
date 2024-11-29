import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosAddCircle } from 'react-icons/io'
import axios from 'axios'
import { getAllTypeRequest } from '../../../redux/actions/actions'

const AllTypeInventory = () => {
  const dispatch = useDispatch()
  const type = useSelector((state) => state.type.type)
  console.log(type)
  const [showDialog, setShowDialog] = useState(false)
  const [newTypeName, setnewTypeName] = useState('')
  useEffect(() => {
    try {
      dispatch(getAllTypeRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch])

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setnewTypeName('')
  }
  const handleAddType = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:9999/api/inventory/type/add',
        {
          type_name: newTypeName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 201) {
        handleCloseDialog()
        dispatch(getAllTypeRequest())
      }
    } catch (error) {
      console.error('Error adding brand', error)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-5">
        <table className="w-full text-gray-700">
          <thead className="text-white font-RobotoSemibold text-[18px] ">
            <tr className="bg-primary">
              <td className="rounded-s-md">ID</td>
              <td>Hình Ảnh</td>
              <td>Tên Hãng</td>
              <td>Ngày Tạo</td>
            </tr>
          </thead>
          <tbody>
            {type?.data &&
              type?.data.map((type, index) => (
                <tr key="">
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        type?.image ||
                        'https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Flogo.png?alt=media&token=ff560732-bd5c-43d0-9271-7bcd3d9204ea'
                      }
                      alt={type?.type_name}
                      className="w-[68px] h-[50px] object-contain rounded-md bg-primary"
                    />
                  </td>
                  <td>{type?.type_name}</td>
                  <td>{new Date(type?.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
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
              value={newTypeName}
              onChange={(e) => setnewTypeName(e.target.value)}
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
                onClick={handleAddType}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AllTypeInventory
