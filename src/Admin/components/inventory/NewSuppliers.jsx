import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllSupplierRequest } from '../../../redux/actions/actions'
import { sortByDate } from '../../../utils/sort'

const NewSuppliers = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const supplier = useSelector((state) => state.suppliers.suppliers)
  console.log(supplier)
  useEffect(() => {
    try {
      dispatch(getAllSupplierRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch])

  return (
    <div className="flex-[0.45] bg-white p-4 rounded-md border border-gray-200">
      <div className="flex justify-between">
        <strong className="text-sub font-medium">Nhà cung cấp mới</strong>
        <p
          onClick={() => navigate('/manager/customers')}
          className="text-sky-600 text-[14px] font-medium cursor-pointer hover:underline"
        >
          More
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {supplier?.data &&
          sortByDate(supplier?.data, 'created_at')
            .slice(0, 5)
            .map((supplier) => (
              <div key={supplier?.supplier_id} className="flex items-start">
                <div
                  className="w-[50px] h-[50px] bg-primary rounded-md"
                  style={{ backgroundColor: 'rgb(167 167 167)' }}
                >
                  <img
                    className="w-full h-full object-contain"
                    src={
                      supplier?.avatar ||
                      'https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Flogo.png?alt=media&token=ff560732-bd5c-43d0-9271-7bcd3d9204ea'
                    }
                    alt={supplier?.supplier_name}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p
                    className="text-sm text-gray-800"
                    style={{ marginTop: '15px' }}
                  >
                    {supplier?.supplier_name}
                  </p>
                </div>
                {supplier?.created_at && (
                  <div className="text-xs text-gray-400 pl-1.5">
                    {new Date(supplier.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  )
}

export default NewSuppliers
