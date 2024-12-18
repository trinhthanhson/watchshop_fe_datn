import axios from 'axios'
import { takeLatest, call, put } from 'redux-saga/effects'
import {
  getDataAIByQuantityLimitFailure,
  getDataAIByQuantityLimitSuccess
} from '../../actions/ai/action'
import { GET_DATA_AI_BY_QUANTITY_REQUEST } from '../../actions/ai/type'

function* getAllDataAiSaga(action) {
  try {
    const token = localStorage.getItem('token')
    const quantity = action.payload // Nhận page và limit từ payload

    const response = yield call(
      axios.get,
      `http://localhost:9999/api/data/ai/all?quantity=${quantity}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    yield put(getDataAIByQuantityLimitSuccess(response.data))
  } catch (error) {
    yield put(getDataAIByQuantityLimitFailure(error))
  }
}

export default function* getDataAiSaga() {
  yield takeLatest(GET_DATA_AI_BY_QUANTITY_REQUEST, getAllDataAiSaga)
}
