import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getDataNotFullFailure,
  getDataNotFullSuccess
} from '../../../actions/inventory/manager/action'
import { GET_DATA_NOT_FULL_REQUEST } from '../../../actions/inventory/manager/type'

function* getDataNotFullSaga(action) {
  try {
    const id = action.payload

    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/inventory/request/${id}/find`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const productDetail = response.data

    yield put(getDataNotFullSuccess(productDetail))
  } catch (error) {
    yield put(getDataNotFullFailure(error))
  }
}

export default function* dataNotFullSaga() {
  yield takeLatest(GET_DATA_NOT_FULL_REQUEST, getDataNotFullSaga)
}
