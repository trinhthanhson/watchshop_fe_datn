import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import { getAllTypeFailure, getAllTypeSuccess } from '../actions/actions'
import { GET_ALL_TYPE_REQUEST } from '../actions/types'

function* getAllTypeSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/inventory/type/all',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getAllTypeSuccess(response.data))
  } catch (error) {
    yield put(getAllTypeFailure(error))
  }
}

export default function* typeSaga() {
  yield takeLatest(GET_ALL_TYPE_REQUEST, getAllTypeSaga)
}
