import {
  CHECK_REQUEST_EXISTS_FAILURE,
  CHECK_REQUEST_EXISTS_REQUEST,
  CHECK_REQUEST_EXISTS_SUCCESS,
  CREATE_TRANS_FAILURE,
  CREATE_TRANS_REQUEST,
  CREATE_TRANS_SUCCESS,
  CREATE_TRANSACTION_EXPORT_FAILURE,
  CREATE_TRANSACTION_EXPORT_REQUEST,
  CREATE_TRANSACTION_EXPORT_SUCCESS,
  GET_ALL_REQUEST_EXPORT_FAILURE,
  GET_ALL_REQUEST_EXPORT_REQUEST,
  GET_ALL_REQUEST_EXPORT_SUCCESS,
  GET_ALL_REQUEST_IMPORT_FAILURE,
  GET_ALL_REQUEST_IMPORT_REQUEST,
  GET_ALL_REQUEST_IMPORT_SUCCESS,
  GET_ALL_REQUEST_NOT_FULL_FAILURE,
  GET_ALL_REQUEST_NOT_FULL_REQUEST,
  GET_ALL_REQUEST_NOT_FULL_SUCCESS,
  GET_ALL_TRANSACTION_EXPORT_FAILURE,
  GET_ALL_TRANSACTION_EXPORT_REQUEST,
  GET_ALL_TRANSACTION_EXPORT_SUCCESS,
  GET_ALL_TRANSACTION_IMPORT_FAILURE,
  GET_ALL_TRANSACTION_IMPORT_REQUEST,
  GET_ALL_TRANSACTION_IMPORT_SUCCESS,
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

// ------------- get all Request not full-------------
export const getAllRequestNotFullRequest = () => ({
  type: GET_ALL_REQUEST_NOT_FULL_REQUEST
})

export const getAllRequestNotFullSuccess = (request_all) => ({
  type: GET_ALL_REQUEST_NOT_FULL_SUCCESS,
  payload: request_all
})

export const getAllRequestNotFullFailure = (error) => ({
  type: GET_ALL_REQUEST_NOT_FULL_FAILURE,
  payload: error
})
// ----------------------------------------------

// -------- Get all transaction import ---------
export const getAllTransactionImportRequest = () => ({
  type: GET_ALL_TRANSACTION_IMPORT_REQUEST
})

export const getAllTransactionImportSuccess = (transaction) => ({
  type: GET_ALL_TRANSACTION_IMPORT_SUCCESS,
  payload: transaction
})

export const getAllTransactionImportFailure = (error) => ({
  type: GET_ALL_TRANSACTION_IMPORT_FAILURE,
  payload: error
})
// -----------------------------------------------

// -------- Get all transaction export ---------
export const getAllTransactionExportRequest = () => ({
  type: GET_ALL_TRANSACTION_EXPORT_REQUEST
})

export const getAllTransactionExportSuccess = (transaction) => ({
  type: GET_ALL_TRANSACTION_EXPORT_SUCCESS,
  payload: transaction
})

export const getAllTransactionExportFailure = (error) => ({
  type: GET_ALL_TRANSACTION_EXPORT_FAILURE,
  payload: error
})
// -----------------------------------------------

// -------- Get all transaction import ---------
export const getAllRequestImportRequest = (page, limit) => ({
  type: GET_ALL_REQUEST_IMPORT_REQUEST,
  payload: { page, limit }
})
export const getAllRequestImportSuccess = (request_import) => ({
  type: GET_ALL_REQUEST_IMPORT_SUCCESS,
  payload: request_import
})

export const getAllRequestImportFailure = (error) => ({
  type: GET_ALL_REQUEST_IMPORT_FAILURE,
  payload: error
})
// -----------------------------------------------

// -------- Get all transaction export ---------
export const getAllRequestExportRequest = () => ({
  type: GET_ALL_REQUEST_EXPORT_REQUEST
})

export const getAllRequestExportSuccess = (request_export) => ({
  type: GET_ALL_REQUEST_EXPORT_SUCCESS,
  payload: request_export
})

export const getAllRequestExportFailure = (error) => ({
  type: GET_ALL_REQUEST_EXPORT_FAILURE,
  payload: error
})
// -----------------------------------------------

// -------- create transaction export -----------
export const createTransactionExportRequest = (id) => ({
  type: CREATE_TRANSACTION_EXPORT_REQUEST,
  payload: { id }
})

export const createTransactionExportSuccess = (message) => ({
  type: CREATE_TRANSACTION_EXPORT_SUCCESS,
  payload: message
})

export const createTransactionExportFailure = (error) => ({
  type: CREATE_TRANSACTION_EXPORT_FAILURE,
  payload: error
})
// -----------------------------------------------

// -------- create transaction export -----------
export const checkRequestExistsRequest = (id) => ({
  type: CHECK_REQUEST_EXISTS_REQUEST,
  payload: { id }
})

export const checkRequestExistsSuccess = (data) => ({
  type: CHECK_REQUEST_EXISTS_SUCCESS,
  payload: data
})

export const checkRequestExistsFailure = (error) => ({
  type: CHECK_REQUEST_EXISTS_FAILURE,
  payload: error
})
// -----------------------------------------------
