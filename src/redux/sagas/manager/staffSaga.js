import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { getAllStaffsFailure, getAllStaffsSuccess } from '../../actions/actions'
import { GET_ALL_STAFFS_REQUEST } from '../../actions/types'

function* getAllStaffsSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/manager/staff/all',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllStaffsSuccess(response.data))
  } catch (error) {
    yield put(getAllStaffsFailure(error))
  }
}

export default function* staffManagerSaga() {
  yield takeLatest(GET_ALL_STAFFS_REQUEST, getAllStaffsSaga)
}
