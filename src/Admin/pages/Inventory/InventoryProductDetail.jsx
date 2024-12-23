import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  getProductDetailRequest,
  getReviewProductRequest
} from '../../../redux/actions/actions'
import { getStatus } from '../../../constants/Status'
import { getPriceByProductIdRequest } from '../../../redux/actions/inventory/product/action'

const InventoryProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const productDetail = useSelector(
    (state) => state.productDetail.productDetail?.data
  )
  const reviews = useSelector((state) => state.reviewProduct?.reviews?.data)
  const priceProduct = useSelector(
    (state) => state.priceByProduct.priceByProduct
  )
  let latestReviews = []
  useEffect(() => {
    try {
      dispatch(getProductDetailRequest(id))
      dispatch(getReviewProductRequest(id))
      dispatch(getPriceByProductIdRequest(id))
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, id])
  if (Array.isArray(reviews) && reviews.length > 0) {
    // Sắp xếp đánh giá theo thời gian mới nhất và lấy 10 đánh giá gần nhất
    latestReviews = [...reviews]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8)
  }

  return (
    <>
      {productDetail && (
        <div className="flex">
          <div className="flex flex-[0.6] gap-4 w-[80%] ml-[18%] rounded-md shadow-md bg-white mt-2">
            <div className="flex">
              <div className="flex-[0.6] w-full ml-5">
                <h5 className="text-left text-lg font-RobotoSemibold text-primary py-3">
                  Thông Tin Sản Phẩm
                </h5>
                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Mã Sản Phẩm:
                  </span>
                  <span className="text-primary font-RobotoSemibold">
                    {productDetail?.product_id}
                  </span>
                </p>
                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Tên Sản Phẩm:
                  </span>
                  <span className="text-primary font-RobotoSemibold">
                    {productDetail?.product_name}
                  </span>
                </p>
                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Category:
                  </span>
                  <span className="text-primary font-RobotoSemibold">
                    {productDetail?.category_product.category_name}
                  </span>
                </p>
                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Brand:
                  </span>
                  <span className="text-primary font-RobotoSemibold">
                    {productDetail?.brand_product.brand_name}
                  </span>
                </p>
                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Đơn Giá:
                  </span>
                  <span className="text-primary font-RobotoSemibold">
                    {priceProduct?.data?.price_new.toLocaleString('en') + ' '}
                    VNĐ
                  </span>
                </p>

                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Tạo Bởi:
                  </span>
                  <span className="font-RobotoSemibold">
                    {productDetail?.staff_created.first_name}{' '}
                    {productDetail?.staff_created.last_name}
                  </span>
                </p>
                {productDetail?.updated_product && (
                  <p className="p-5">
                    <span className="text-primary font-RobotoMedium mr-2">
                      Cập Nhật Bởi:
                    </span>
                    <span className="font-RobotoSemibold">
                      {productDetail?.staff_updated.first_name}{' '}
                      {productDetail?.staff_updated.last_name}
                    </span>
                  </p>
                )}
                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Ngày tạo:
                  </span>
                  <span className="text-primary font-RobotoSemibold">
                    {new Date(productDetail.created_at).toLocaleDateString()}
                  </span>
                </p>
                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Ngày cập nhật:
                  </span>
                  <span className="text-primary font-RobotoSemibold">
                    {new Date(productDetail.updated_at).toLocaleDateString()}
                  </span>
                </p>
                <p className="p-5">
                  <span className="text-primary font-RobotoMedium mr-2">
                    Trạng Thái:
                  </span>
                  {productDetail?.status && (
                    <span className="font-RobotoSemibold">
                      {getStatus(productDetail?.status)}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-[0.4] justify-center items-center">
                <img
                  src={productDetail?.image}
                  alt={productDetail?.product_name}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex-[0.4] w-[80%] ml-[20px] mr-[30px] rounded-md shadow-md bg-white mt-2">
            <div className="ml-5">
              <h5 className="text-left text-lg font-RobotoSemibold text-primary py-3">
                Đánh Giá Sản Phẩm
              </h5>
              {latestReviews.length > 0 ? (
                latestReviews.map((review) => (
                  <p key={review.review_id} className="p-5">
                    <span className="text-primary font-RobotoMedium mr-2">
                      {review.review_created.first_name +
                        ' ' +
                        review.review_created.last_name}
                      :
                    </span>
                    <span className="text-primary font-RobotoSemibold">
                      {review.content}
                    </span>
                  </p>
                ))
              ) : (
                <p className="p-5 text-primary font-RobotoMedium">
                  Không có đánh giá nào
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InventoryProductDetail
