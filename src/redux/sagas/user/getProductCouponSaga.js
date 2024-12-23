import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getAllProductCouponFailure,
  getAllProductCouponSuccess
} from '../../actions/user/action'
import { GET_ALL_PRODUCT_COUPON_REQUEST } from '../../actions/user/type'

function* getAllProductCouponSaga() {
  try {
    const response = yield call(
      axios.get,
      'http://localhost:9999/api/user/product/all/product'
    )

    yield put(getAllProductCouponSuccess(response.data))
  } catch (error) {
    yield put(getAllProductCouponFailure(error))
  }
}

export default function* getProductCouponSaga() {
  yield takeLatest(GET_ALL_PRODUCT_COUPON_REQUEST, getAllProductCouponSaga)
}
