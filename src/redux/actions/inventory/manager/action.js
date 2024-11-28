import {
  CREATE_TRANS_FAILURE,
  CREATE_TRANS_REQUEST,
  CREATE_TRANS_SUCCESS,
  GET_DATA_NOT_FULL_FAILURE,
  GET_DATA_NOT_FULL_REQUEST,
  GET_DATA_NOT_FULL_SUCCESS
} from './type'

// ------------- Transaction-------------
export const createTransactionRequest = (payload, navigate) => ({
  type: CREATE_TRANS_REQUEST,
  payload,
  navigate
})

export const createTransactionSuccess = (data) => ({
  type: CREATE_TRANS_SUCCESS,
  data
})

export const createTransactionFailure = (error) => ({
  type: CREATE_TRANS_FAILURE,
  error
})
// ----------------------------------------------

// ------------- Request detail not full-------------
export const getDataNotFullRequest = (id) => ({
  type: GET_DATA_NOT_FULL_REQUEST,
  payload: id
})

export const getDataNotFullSuccess = (data) => ({
  type: GET_DATA_NOT_FULL_SUCCESS,
  data
})

export const getDataNotFullFailure = (error) => ({
  type: GET_DATA_NOT_FULL_FAILURE,
  error
})
// ----------------------------------------------
