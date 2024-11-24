import {
  CREATE_TRANS_FAILURE,
  CREATE_TRANS_REQUEST,
  CREATE_TRANS_SUCCESS
} from './type'

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
