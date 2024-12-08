import {
  UPDATE_TRANSACTION_FAILURE,
  UPDATE_TRANSACTION_REQUEST,
  UPDATE_TRANSACTION_SUCCESS
} from '../../../actions/inventory/director/type'

const initialState = {
  loading: false,
  successMessage: '',
  errorMessage: ''
}

const updateRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TRANSACTION_REQUEST:
      return { ...state, loading: true, successMessage: '', errorMessage: '' }
    case UPDATE_TRANSACTION_SUCCESS:
      return { ...state, loading: false, successMessage: action.payload }
    case UPDATE_TRANSACTION_FAILURE:
      return { ...state, loading: false, errorMessage: action.payload }
    default:
      return state
  }
}

export default updateRequestReducer
