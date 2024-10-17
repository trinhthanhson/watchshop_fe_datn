import { call, put, takeEvery } from 'redux-saga/effects'
import axios from 'axios'

function* addCoupon(action) {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.post,
      'http://localhost:9999/api/staff/coupon/add',
      action.payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    yield put({ type: 'ADD_COUPON_SUCCESS', payload: response.data })
  } catch (error) {
    yield put({ type: 'ADD_COUPON_FAILURE', error: error.message })
  }
}

function* postAddCoupon() {
  yield takeEvery('ADD_COUPON_REQUEST', addCoupon)
}

export default postAddCoupon
