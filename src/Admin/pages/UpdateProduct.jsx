import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  updateProductRequest,
  getProductDetailRequest,
  getAllCategoriesRequest,
  getAllBrandRequest
} from '../../redux/actions/actions'
import { uploadImageToFirebase } from '../../firebase' // Import the function

const UpdateProduct = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const message = useSelector((state) => state.updateProduct)
  const productDetail = useSelector(
    (state) => state.productDetail.productDetail
  )
  const categories = useSelector((state) => state.categories.categories)
  const brands = useSelector((state) => state.brands.brands)
  const [loading, setLoading] = useState(false) // State to manage loading
  const [errorMessage, setErrorMessage] = useState('') // State for error messages

  const [formData, setFormData] = useState({
    data: {
      product_name: '',
      price: 0,
      detail: '',
      status: '',
      category_name: '',
      brand_name: '',
      band_material: '',
      band_width: '',
      case_diameter: '',
      case_material: '',
      case_thickness: '',
      color: '',
      dial_type: '',
      func: '',
      gender: '',
      machine_movement: '',
      model: '',
      quantity: 0,
      series: '',
      water_resistance: '',
      image: ''
    }
  })
  const [imageSrc, setImageSrc] = useState(null)
  const navigate = useNavigate()
  const formDataRef = useRef(formData)
  useEffect(() => {
    try {
      dispatch(getAllBrandRequest())
      dispatch(getProductDetailRequest(id))
      dispatch(getAllCategoriesRequest())
    } catch (error) {
      console.error('Error dispatch', error)
    }
  }, [dispatch, id])

  useEffect(() => {
    formDataRef.current = formData
  }, [formData])
  useEffect(() => {
    if (productDetail) {
      setFormData({
        ...formData,
        data: {
          product_name: productDetail?.data.product_name,
          price: productDetail?.data.updatePrices[0]?.price_new,
          detail: productDetail?.data.detail,
          status: productDetail?.data.status,
          category_name: productDetail?.data.category_product?.category_name,
          brand_name: productDetail?.data.brand_product?.brand_name,
          band_material: productDetail?.data.band_material,
          band_width: productDetail?.data.band_width,
          case_diameter: productDetail?.data.case_diameter,
          case_material: productDetail?.data.case_material,
          case_thickness: productDetail?.data.case_thickness,
          color: productDetail?.data.color,
          dial_type: productDetail?.data.dial_type,
          func: productDetail?.data.func,
          gender: productDetail?.data.gender,
          machine_movement: productDetail?.data.machine_movement,
          model: productDetail?.data.model,
          quantity: productDetail?.data.quantity,
          series: productDetail?.data.series,
          water_resistance: productDetail?.data.water_resistance,
          image: productDetail?.data.image
        }
      })
      setImageSrc(productDetail?.data.image)
    }
  }, [productDetail])
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'quantity' && value < 0) {
      return // Không cập nhật state nếu giá trị là âm
    }
    if (e.target.name === 'file') {
      setFormData({
        data: {
          ...formData.data,
          file: e.target.files[0] // Update with the selected file
        }
      })
    } else if (e.target.name === 'status') {
      const newStatus = e.target.checked ? 'ACTIVE' : 'INACTIVE'
      setFormData({
        data: {
          ...formData.data,
          status: newStatus
        }
      })
    } else {
      setFormData({
        data: {
          ...formData.data,
          [e.target.name]: e.target.value
        }
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    if (!formData.data.file && !formData.data.image) {
      setErrorMessage('Vui lòng chọn hình ảnh.')
      setLoading(false)
      return
    }

    let imageUrl = formData.data.image
    if (formData.data.file) {
      try {
        imageUrl = await uploadImageToFirebase(formData.data.file)
      } catch (error) {
        console.error('Error uploading image:', error)
        setErrorMessage('Đã xảy ra lỗi khi tải lên hình ảnh.')
        setLoading(false)
        return
      }
    }

    const dataToSend = {
      ...formData.data,
      image: imageUrl
    }

    dispatch(updateProductRequest(id, dataToSend))
  }

  useEffect(() => {
    if (message.code === 200) {
      setLoading(false) // Stop loading
      navigate('/manager/products')
    }
  }, [message, navigate])

  return (
    <>
      <div className="flex flex-col justify-center items-center ml-[18%]">
        <div className="flex mt-2 justify-center items-center">
          <h2 className="text-main font-RobotoSemibold text-[20px] uppercase">
            Update Product
          </h2>
        </div>
        <div className="w-[50%] p-2 rounded-md shadow-md bg-white text-primary mt-5">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
              <div className="loader"></div> {/* Add your loader CSS here */}
            </div>
          )}
          {errorMessage && (
            <div className="text-red-500 text-center mt-4">{errorMessage}</div>
          )}
          <form
            className="flex flex-col p-5 text-primary gap-5"
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <input
                type="file"
                name="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
              />
              <div className="bg-gray-200 rounded-md py-2 px-4 flex items-center justify-center gap-2 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {formData.data.file ? (
                  <span className="text-primary font-RobotoMedium">
                    {formData.data.file.name}
                  </span>
                ) : (
                  <span className="text-primary font-RobotoMedium">
                    Choose File
                  </span>
                )}
              </div>
            </div>
            {formData.data.file && (
              <img
                src={URL.createObjectURL(formData.data.file)}
                alt="Preview"
                className="w-full h-[280px] object-contain"
              />
            )}
            {imageSrc && !formData.data.file && (
              <img
                src={imageSrc}
                alt="Current file"
                className="w-full h-[280px] object-contain"
              />
            )}
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Product Name:
                </label>
                <input
                  className="border-b-2"
                  name="product_name"
                  onChange={handleChange}
                  value={formData.data.product_name}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Price:</label>
                <input
                  className="border-b-2"
                  name="price"
                  type="number"
                  onChange={handleChange}
                  value={formData.data.price}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Band Material:
                </label>
                <textarea
                  className="border-b-2"
                  name="band_material"
                  onChange={handleChange}
                  value={formData.data.band_material}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Gender:</label>
                <textarea
                  className="border-b-2"
                  name="gender"
                  onChange={handleChange}
                  value={formData.data.gender}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Color:</label>
                <textarea
                  className="border-b-2"
                  name="color"
                  onChange={handleChange}
                  value={formData.data.color}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Function:</label>
                <textarea
                  className="border-b-2"
                  name="func"
                  onChange={handleChange}
                  value={formData.data.func}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Model:</label>
                <textarea
                  className="border-b-2"
                  name="model"
                  onChange={handleChange}
                  value={formData.data.model}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Series:</label>
                <textarea
                  className="border-b-2"
                  name="series"
                  onChange={handleChange}
                  value={formData.data.series}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Band Width:
                </label>
                <textarea
                  className="border-b-2"
                  name="band_width"
                  onChange={handleChange}
                  value={formData.data.band_width}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Case Diameter:
                </label>
                <textarea
                  className="border-b-2"
                  name="case_diameter"
                  onChange={handleChange}
                  value={formData.data.case_diameter}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Case Material:
                </label>
                <textarea
                  className="border-b-2"
                  name="case_material"
                  onChange={handleChange}
                  value={formData.data.case_material}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">Quantity:</label>
                <input
                  className="border-b-2"
                  name="quantity"
                  type="number"
                  min={0}
                  onChange={handleChange}
                  value={formData.data.quantity}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Case Thickness
                </label>
                <textarea
                  className="border-b-2"
                  name="case_thickness"
                  onChange={handleChange}
                  value={formData.data.case_thickness}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Dial Type:
                </label>
                <textarea
                  className="border-b-2"
                  name="dial_type"
                  onChange={handleChange}
                  value={formData.data.dial_type}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Water Resistance:
                </label>
                <textarea
                  className="border-b-2"
                  name="water_resistance"
                  onChange={handleChange}
                  value={formData.data.water_resistance}
                  style={{ marginTop: '20px' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[14px] block font-bold">
                  Machine Movement:
                </label>
                <textarea
                  className="border-b-2"
                  name="machine_movement"
                  onChange={handleChange}
                  value={formData.data.machine_movement}
                  style={{ marginTop: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <label className="text-[14px] block mb-5 font-bold">
                  Category:
                </label>
                <select
                  className="p-2 rounded-md border-none"
                  name="category_name"
                  onChange={handleChange}
                  value={formData.data.category_name}
                >
                  {categories?.data &&
                    categories?.data.map((category) => (
                      <option
                        key={category.slug}
                        value={category.category_name}
                      >
                        {category.category_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[14px] block mb-5 font-bold">
                  Brand:
                </label>
                <select
                  className="p-2 rounded-md border-none"
                  name="brand_name"
                  onChange={handleChange}
                  value={formData.data.brand_name}
                >
                  {brands?.data &&
                    brands?.data.map((brand) => (
                      <option key={brand.brand_id} value={brand.brand_name}>
                        {brand.brand_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[14px] block font-bold">
                Description:
              </label>
              <textarea
                className="border-b-2"
                name="detail"
                onChange={handleChange}
                value={formData.data.detail}
                style={{ marginTop: '20px', width: '700px', height: '200px' }}
              />
            </div>

            <label className="switch">
              <input
                type="checkbox"
                name="status"
                onChange={handleChange}
                checked={formData.data.status === 'ACTIVE'}
              />
              <span className="slider round"></span>
            </label>
            <div className="flex justify-center">
              <button
                className="w-[40%] bg-primary text-white rounded-md shadow-md py-3 uppercase font-RobotoMedium"
                type="submit"
                disabled={loading} // Disable button when loading
              >
                Cập Nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default UpdateProduct
