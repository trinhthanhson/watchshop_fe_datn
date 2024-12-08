import {
  GET_ALL_STAFF_INVENTORY_FAILURE,
  GET_ALL_STAFF_INVENTORY_REQUEST,
  GET_ALL_STAFF_INVENTORY_SUCCESS,
  UPDATE_TRANSACTION_FAILURE,
  UPDATE_TRANSACTION_REQUEST,
  UPDATE_TRANSACTION_SUCCESS
} from './type'

// -------- update transaction request -----------
export const updateTransactionRequest = (id) => ({
  type: UPDATE_TRANSACTION_REQUEST,
  payload: { id }
})

export const updateTransactionSuccess = (message) => ({
  type: UPDATE_TRANSACTION_SUCCESS,
  payload: message
})

export const updateTransactionFailure = (error) => ({
  type: UPDATE_TRANSACTION_FAILURE,
  payload: error
})
// -----------------------------------------------

// -------- Get all staff inventory ---------
export const getAllStaffInventoryRequest = () => ({
  type: GET_ALL_STAFF_INVENTORY_REQUEST
})

export const getAllStaffInventorySuccess = (staff) => ({
  type: GET_ALL_STAFF_INVENTORY_SUCCESS,
  payload: staff
})

export const getAllStaffInventoryFailure = (error) => ({
  type: GET_ALL_STAFF_INVENTORY_FAILURE,
  payload: error
})
// -----------------------------------------------
