import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './authStyle.css'
import Helmet from '../../components/Helmet/Helmet'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getUserProfileRequest } from '../../redux/actions/actions'
import { encryptData } from '../../cryptoUtils/cryptoUtils'
import debounce from 'lodash/debounce'
import { toast } from 'react-toastify'

const Login = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user.data)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const userRole = user?.user?.role_user?.role_name
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  // Handle the home navigation
  const handleGoHome = () => {
    navigate('/')
  }

  // Handle changes in username and password
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  // Kiểm tra mật khẩu khi thay đổi
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value
    setPassword(newPassword)

    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt.'
      )
    } else {
      setPasswordError('')
    }
  }

  // Handle login using username and password
  const handleLogin = useCallback(
    debounce(async () => {
      try {
        if (typeof username !== 'string' || typeof password !== 'string') {
          throw new Error('Invalid input data')
        }
        if (!passwordRegex.test(password)) {
          setMessage('Mật khẩu không hợp lệ.')
          return
        }
        setIsLoggingIn(true)

        const response = await axios.post(
          'http://localhost:9999/api/auth/sign-in',
          {
            username,
            password
          }
        )

        const { token, status } = response.data

        if (status && token) {
          localStorage.setItem('token', token)
          toast.success('Đăng nhập thành công!')
          await dispatch(getUserProfileRequest())

          console.log(userRole)
        } else {
          setMessage(
            'Đăng nhập không thành công! Vui lòng kiểm tra lại username hoặc password'
          )
        }
      } catch (error) {
        setMessage('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.')
      } finally {
        setIsLoggingIn(false)
      }
    }, 300),
    [username, password, dispatch]
  )

  // Handle Google login
  const handleGoogleLogin = async () => {
    window.location.href = 'http://localhost:9999/oauth2/authorization/google'
  }

  // Handle success login from Google
  const handleGoogleSuccess = async () => {
    try {
      // Gọi API để lấy token
      const response = await axios.post('http://localhost:9999/login/success', {
        withCredentials: true // Đảm bảo rằng cookie được gửi trong yêu cầu
      })

      const { token, status } = response.data

      if (status && token) {
        localStorage.setItem('token', token)
        // Dispatch action để lấy thông tin hồ sơ người dùng
        await dispatch(getUserProfileRequest())
        console.log('Đăng nhập Google thành công')
      } else {
        setMessage('Đăng nhập Google không thành công')
      }
    } catch (error) {
      setMessage('Đã xảy ra lỗi khi đăng nhập Google. Vui lòng thử lại.')
      console.error('Error:', error)
    }
  }

  // Navigate after user profile data is updated
  useEffect(() => {
    console.log(userRole)
    if (userRole != null) {
      localStorage.setItem('role_name', encryptData(userRole))
      if (
        userRole === 'MANAGER' ||
        userRole === 'STAFF' ||
        userRole === 'BUSINESS_STAFF' ||
        userRole === 'SALESPERSON'
      ) {
        navigate('/manager')
      } else if (userRole === 'CUSTOMER') {
        navigate('/home')
      } else if (userRole === 'DELIVERY_STAFF') {
        navigate('/manager/shipper')
      } else if (
        userRole === 'WAREHOUSE_STAFF' ||
        userRole === 'WAREHOUSE_MANAGER' ||
        userRole === 'WAREHOUSE_KEEPER' ||
        userRole === 'DIRECTOR'
      ) {
        navigate('/inventory')
      }
    }
  }, [userRole, navigate])
  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false)
    setMessage('')
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleForgotPasswordSubmit = async () => {
    if (!email) {
      setMessage('Vui lòng nhập email')
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(
        'http://localhost:9999/api/auth/forgot-password',
        { email }
      )
      const { code, message } = response.data
      if (code === 200 && message === 'success') {
        setMessage(
          'Mật khẩu của bạn đã được gửi về email, vui lòng kiểm tra email để lấy mật khẩu đăng nhập'
        )
      } else {
        setMessage('Incorrect email please enter the correct registered email')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Failed to send reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Helmet title="Login">
      <div className="full-screen relative z-[-1]">
        {/* Background */}
        <img
          className="fixed h-full w-full object-cover hover:cursor-none"
          src="https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Fbackground.jpg?alt=media&token=edae71b6-7155-4d79-b78c-636c0a929ce6"
          alt="Background"
        />
        {/* Logo */}
        <img
          onClick={handleGoHome}
          className="absolute cursor-pointer w-16 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 top-4 left-4"
          src="https://firebasestorage.googleapis.com/v0/b/watch-shop-3a14f.appspot.com/o/images%2Flogo.png?alt=media&token=ff560732-bd5c-43d0-9271-7bcd3d9204ea"
          alt="Logo"
        />
        {/* Login Form */}
        <div
          className="layout_login absolute top-1/2 left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center w-[90%] max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] p-6 sm:p-8 rounded-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Nền trắng với độ trong suốt 90%
            backdropFilter: 'blur(5px)', // Hiệu ứng mờ nền phía sau
            border: '1px solid rgba(200, 200, 200, 0.8)', // Viền màu trắng xám
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', // Bóng đổ để hộp nổi bật
            marginTop: '10%'
          }}
        >
          {/* Forgot Password */}
          {showForgotPassword ? (
            <div className="forgot-password-form flex flex-col items-center justify-center w-full">
              <h1 className="text-center mb-8 text-main text-lg sm:text-xl lg:text-2xl uppercase text-black ">
                Quên mật khẩu
              </h1>
              <div className="input w-full mb-4">
                <label className="text-gray-700 block mb-2">Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                  className="h-10 w-full border border-gray-300 bg-gray-100 p-2 rounded-md"
                />
              </div>
              <button
                className="uppercase w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
                type="button"
                onClick={handleForgotPasswordSubmit}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi'}
              </button>
              {message && <p className="text-green-500 mt-4">{message}</p>}
              <button
                className="text-blue-500 mt-4 underline"
                onClick={handleCloseForgotPassword}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {/* Login */}
              <h1 className="font-RobotoSemibold text-center mb-8 text-main text-[25px] uppercase text-red ml-[50px]">
                Đăng Nhập
              </h1>
              {message && (
                <p className="text-red-500 text-center mb-4">{message}</p>
              )}
              <div className="input mb-4 w-full">
                <label className="text-gray-700 block text-center mb-2 font-RobotoSemibold text-red">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="h-10 w-full border border-gray-300 bg-gray-100 p-2 rounded-md"
                />
              </div>
              <div className="input mb-4 w-full">
                <label className="text-gray-700 block text-center mb-2 font-RobotoSemibold text-red">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="h-10 w-full border border-gray-300 bg-gray-100 p-2 rounded-md"
                />
              </div>
              {passwordError && (
                <p className="text-red text-center mb-4">{passwordError}</p>
              )}
              <a
                onClick={handleForgotPassword}
                className="font-RobotoSemibold text-red underline text-center block mb-4 cursor-pointer"
              >
                Quên Mật Khẩu
              </a>
              <button
                className="w-full bg-red text-white py-2 rounded-md hover:bg-red"
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
              <button
                className="w-full bg-red text-white py-2 rounded-md mt-4"
                type="button"
                onClick={handleGoogleLogin}
              >
                Đăng nhập bằng Google
              </button>
              <div className="text-center mt-6">
                <span>Bạn chưa có tài khoản? </span>
                <a className="text-red underline" href="/signup">
                  Đăng Ký Ngay
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </Helmet>
  )
}

export default Login
