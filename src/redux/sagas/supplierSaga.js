import { takeLatest, call, put } from 'redux-saga/effects'
import axios from 'axios'
import {
  getAllSupplierFailure,
  getAllSupplierSuccess
} from '../actions/actions'
import { GET_ALL_SUPPLIER_REQUEST } from '../actions/types'

function* getAllSupplierSaga() {
  try {
    const token = localStorage.getItem('token')

    const response = yield call(
      axios.get,
      'http://localhost:9999/api/staff/supplier/all',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    console.log('dđ', response)
    yield put(getAllSupplierSuccess(response.data))
  } catch (error) {
    yield put(getAllSupplierFailure(error))
  }
}

export default function* supplierSaga() {
  yield takeLatest(GET_ALL_SUPPLIER_REQUEST, getAllSupplierSaga)
}
