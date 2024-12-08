import {
  GET_ALL_STAFF_INVENTORY_FAILURE,
  GET_ALL_STAFF_INVENTORY_SUCCESS
} from '../../../actions/inventory/director/type'

const initialState = {
  staff: [],
  error: null
}

const allStaffInventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_STAFF_INVENTORY_SUCCESS:
      return {
        ...state,
        staff: action.payload,
        error: null
      }
    case GET_ALL_STAFF_INVENTORY_FAILURE:
      return {
        ...state,
        staff: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default allStaffInventoryReducer
