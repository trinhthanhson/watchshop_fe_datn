import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCouponsRequest } from '../../redux/actions/actions'
import { IoIosAddCircle } from 'react-icons/io'
import { MdDelete, MdModeEditOutline } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AllCoupons = () => {
  const dispatch = useDispatch()
  const coupons = useSelector((state) => state.coupons.coupons)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      dispatch(getAllCouponsRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch])
  const handleDeleteCoupon = async (couponId) => {
    const token = localStorage.getItem('token') // Lấy token từ localStorage

    try {
      await axios.delete(
        `http://localhost:9999/api/staff/coupon/${couponId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}` // Thêm header Authorization
          }
        }
      )
      alert('Coupon deleted successfully.')
      dispatch(getAllCouponsRequest()) // Refresh the coupon list after deletion
    } catch (error) {
      alert('Error deleting coupon. Please try again.')
    }
  }
  return (
    <>
      <div className="flex flex-col gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-5">
        <table className="w-full text-gray-700">
          <thead className="text-white font-RobotoSemibold text-[18px] ">
            <tr className="bg-primary">
              <td className="rounded-s-md">ID</td>
              <td>Ngày Tạo</td>
              <td> Ngày Bắt Đầu</td>
              <td>Ngày Kết Thúc</td>
              <td>Giá trị (%)</td>
              <td>Người Tạo</td>
              <td>Người Chỉnh sửa</td>
              <td className="rounded-e-md">Action</td>
            </tr>
          </thead>
          <tbody>
            {coupons.data &&
              coupons?.data.map((coupon) => (
                <tr
                  key={coupons.coupon_id}
                  className=" hover:bg-gray-100 transition-colors ease-in-out transform "
                >
                  <td>{coupon?.coupon_id}</td>
                  <td>
                    <img
                      src={
                        coupon?.image ||
                        'https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Flogo.png?alt=media&token=ff560732-bd5c-43d0-9271-7bcd3d9204ea'
                      }
                      alt={coupon?.type}
                      className="w-[68px] object-contain rounded-md bg-primary"
                    />
                  </td>
                  <td>{new Date(coupon?.start_date).toLocaleDateString()}</td>
                  <td>{new Date(coupon?.end_date).toLocaleDateString()}</td>
                  <td>{coupon?.couponDetails[0].percent * 100 + '%'}</td>
                  <td>
                    {coupon?.staff_create?.first_name +
                      ' ' +
                      coupon?.staff_create?.last_name}
                  </td>
                  <td>
                    {coupon?.staff_update?.first_name +
                      ' ' +
                      coupon?.staff_update?.last_name}
                  </td>
                  <td>
                    <span className="cursor-pointer inline-flex rounded-full hover:bg-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-125 p-2">
                      <MdModeEditOutline
                        className="cursor-pointer text-primary"
                        fontSize={25}
                        onClick={() =>
                          navigate(
                            `/manager/coupon-detail/${coupon?.coupon_id}`
                          )
                        }
                      />
                    </span>
                    <span className="cursor-pointer inline-flex rounded-full hover:bg-gray-300 transition-transform duration-200 ease-in-out transform hover:scale-125 p-2">
                      <MdDelete
                        className="cursor-pointer text-primary"
                        fontSize={25}
                        onClick={() => handleDeleteCoupon(coupon?.coupon_id)}
                      />
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Link to="/manager/create-coupon">
        <div className="fixed right-8 bottom-3">
          <IoIosAddCircle
            fontSize={50}
            className="cursor-pointer text-primary"
          />
        </div>
      </Link>
    </>
  )
}

export default AllCoupons
