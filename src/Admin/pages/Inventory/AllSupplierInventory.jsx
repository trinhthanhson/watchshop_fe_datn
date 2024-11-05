import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosAddCircle } from 'react-icons/io'
import axios from 'axios'
import { MdModeEditOutline, MdDelete } from 'react-icons/md'
import {
  getAllBrandRequest,
  getAllSupplierRequest
} from '../../../redux/actions/actions'
import { getStatus } from '../../../constants/Status'

const AllSupplierInventory = () => {
  const dispatch = useDispatch()
  const suppliers = useSelector((state) => state.suppliers.suppliers)
  const [showDialog, setShowDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState(null)
  const [newSupplierName, setnewSupplierName] = useState('')
  const [deletedSupplier, setDeletedSupplier] = useState(null)
  useEffect(() => {
    try {
      dispatch(getAllSupplierRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, deletedSupplier])

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setnewSupplierName('')
  }
  const handleAddBrand = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:9999/api/staff/supplier/add',
        {
          brand_name: newSupplierName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 201) {
        handleCloseDialog()
        dispatch(getAllBrandRequest())
      }
    } catch (error) {
      console.error('Error adding brand', error)
    }
  }

  const getSupplierBrandNameById = (supplierId) => {
    const brand = suppliers?.data.find((cat) => cat.supplier_id === supplierId)
    return brand?.brand_name || ''
  }

  const handleShowUpdateDialog = (supplierId) => {
    setSelectedSupplierId(supplierId)
    setnewSupplierName(getSupplierBrandNameById(supplierId))
    setShowUpdateDialog(true)
  }

  const handleCloseUpdateDialog = () => {
    setShowUpdateDialog(false)
    setSelectedSupplierId(null)
    setnewSupplierName('')
  }

  const handleUpdateSupplier = async (supplierId) => {
    try {
      const token = localStorage.getItem('token')

      const response = await axios.put(
        `http://localhost:9999/api/staff/supplier/${supplierId}/update`,
        {
          brand_name: newSupplierName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.data.code === 200) {
        setShowUpdateDialog(false)
        setnewSupplierName('')
        dispatch(getAllBrandRequest())
      }
    } catch (error) {
      console.error('Error updating brand', error)
    }
  }

  const handleDeleteSupplier = async (supplierId) => {
    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn đổi trạng thái hãng này không?'
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
          `http://localhost:9999/api/staff/supplier/${supplierId}/delete`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setDeletedSupplier(supplierId)
        dispatch(getAllBrandRequest())
        alert('Brand deleted successfully!')
      } catch (error) {
        console.error('Error deleting brand:', error)
      }
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
              <td>Tên nhà cung cấp</td>
              <td>Địa chỉ</td>
              <td>Trạng Thái</td>
              <td className="rounded-e-md">Hành Động</td>
            </tr>
          </thead>
          <tbody>
            {suppliers?.data &&
              suppliers?.data.map((supplier, index) => (
                <tr key="supplier">
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        supplier?.image ||
                        'https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Flogo.png?alt=media&token=ff560732-bd5c-43d0-9271-7bcd3d9204ea'
                      }
                      alt={supplier?.supplier_name}
                      className="w-[68px] h-[50px] object-contain rounded-md bg-primary"
                    />
                  </td>
                  <td>{supplier?.supplier_name}</td>
                  <td>{supplier?.supplier_name}</td>
                  {/* <td>{new Date(supplier?.created_at).toLocaleDateString()}</td> */}
                  {/* <td>
                    {brand?.staff_create?.first_name +
                      ' ' +
                      brand?.staff_create?.last_name}
                  </td> */}
                  <td>{getStatus(supplier?.status)}</td>
                  <td>
                    <span>
                      <MdModeEditOutline
                        className="cursor-pointer text-primary"
                        fontSize={25}
                        onClick={() =>
                          handleShowUpdateDialog(supplier?.supplier_id)
                        }
                      />
                    </span>
                    <span>
                      <MdDelete
                        className="cursor-pointer text-primary"
                        fontSize={25}
                        onClick={() =>
                          handleDeleteSupplier(supplier?.supplier_id)
                        }
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
          onClick={() => handleShowDialog()}
        />
      </div>

      {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Thêm Nhà Cung Cấp</h2>
            <input
              type="text"
              value={newSupplierName}
              onChange={(e) => setnewSupplierName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
              placeholder="Nhập tên hãng"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCloseDialog}
                className="bg-gray-300 px-4 py-2 rounded-md mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleAddBrand}
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
            <h2 className="text-xl font-bold mb-4">Cập Nhật Nhà Cung Cấp</h2>
            <input
              type="text"
              value={newSupplierName}
              onChange={(e) => setnewSupplierName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
              placeholder="Nhập tên hãng"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCloseUpdateDialog}
                className="bg-gray-300 px-4 py-2 rounded-md mr-2"
              >
                Hủy
              </button>
              <button
                onClick={() => handleUpdateSupplier(selectedSupplierId)}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Cập Nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AllSupplierInventory
