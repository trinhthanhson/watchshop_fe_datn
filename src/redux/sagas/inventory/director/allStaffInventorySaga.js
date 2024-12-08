import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { GET_ALL_STAFF_INVENTORY_REQUEST } from '../../../actions/inventory/director/type'
import {
  getAllStaffInventoryFailure,
  getAllStaffInventorySuccess
} from '../../../actions/inventory/director/action'

function* allStaffInventorySaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/director/staff/inventory',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllStaffInventorySuccess(response.data))
  } catch (error) {
    yield put(getAllStaffInventoryFailure(error))
  }
}

export default function* staffInventorySaga() {
  yield takeLatest(GET_ALL_STAFF_INVENTORY_REQUEST, allStaffInventorySaga)
}
