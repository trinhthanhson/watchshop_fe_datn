import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminUserStaffDetail = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    phone: '',
    email: '',
    status: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/manager/staff/${id}/find`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const user = response.data.data
        setFormData({
          firstname: user.first_name,
          lastname: user.last_name,
          gender: user.gender,
          phone: user.phone,
          email: user.email,
          status: user?.user?.status
        })
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id, token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(
        `http://localhost:9999/api/manager/staff/${id}/update`,
        {
          status: formData.status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      alert('User updated successfully!')
      navigate('/manager/staffs')
    } catch (error) {
      setError('Failed to update user: ' + error.message)
    }
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>
  }

  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <main className="flex-1 p-8  min-h-screen">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-gray-700">
            Thông tin nhân viên
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                First Name
              </label>
              <input
                disabled
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-3 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Last Name
              </label>
              <input
                disabled
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-3 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Gender
              </label>
              <input
                disabled
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-3 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                disabled
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-3 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                disabled
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-3 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-3"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white w-full p-3 rounded hover:bg-blue-600"
            >
              Cập nhật
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AdminUserStaffDetail
