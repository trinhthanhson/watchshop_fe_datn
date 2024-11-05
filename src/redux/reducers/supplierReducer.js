import {
  GET_ALL_SUPPLIER_FAILURE,
  GET_ALL_SUPPLIER_SUCCESS
} from '../actions/types'

const initialState = {
  suppliers: [],
  error: null
}

const supplierReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SUPPLIER_SUCCESS:
      return {
        ...state,
        suppliers: action.payload,
        error: null
      }
    case GET_ALL_SUPPLIER_FAILURE:
      return {
        ...state,
        suppliers: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default supplierReducer
