import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminUserCustomerDetail = () => {
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
  const navigate = useNavigate() // Use useNavigate for redirection
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/staff/customer/${id}/find`,
          {
            headers: {
              Authorization: `Bearer ${token}` // Add the Authorization header
            }
          }
        )
        const user = response.data.data
        console.log(user)
        setFormData({
          firstname: user.first_name,
          lastname: user.last_name,
          gender: user.gender,
          phone: user.phone,
          email: user.email,
          status: user.user.status
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
        `http://localhost:9999/api/staff/user/${id}/update`,
        {
          status: formData.status // Send the updated status
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // Add the Authorization header
          }
        }
      )
      alert('User updated successfully!')
      navigate('/manager/customers')
    } catch (error) {
      setError('Failed to update user: ' + error.message)
    }
  }
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="flex  min-h-screen">
      <aside className="w-[200px] bg-gray-800 text-white h-screen">
        {/* Sidebar content */}
      </aside>
      <main className="flex-1">
        {/* Vùng nội dung chính */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
            Thông tin cá nhân
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-600">First Name:</span>
              <input
                disabled
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-3 bg-gray-50 focus:ring focus:ring-blue-300"
              />
            </label>
            <label className="block">
              <span className="text-gray-600">Last Name:</span>
              <input
                disabled
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-3 bg-gray-50 focus:ring focus:ring-blue-300"
              />
            </label>
            <label className="block">
              <span className="text-gray-600">Gender:</span>
              <input
                disabled
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-3 bg-gray-50 focus:ring focus:ring-blue-300"
              />
            </label>
            <label className="block">
              <span className="text-gray-600">Email:</span>
              <input
                disabled
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-3 bg-gray-50 focus:ring focus:ring-blue-300"
              />
            </label>
            <label className="block">
              <span className="text-gray-600">Phone:</span>
              <input
                disabled
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-3 bg-gray-50 focus:ring focus:ring-blue-300"
              />
            </label>
            <label className="block">
              <span className="text-gray-600">Status:</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-3 bg-gray-50 focus:ring focus:ring-blue-300"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Cập nhật
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AdminUserCustomerDetail
