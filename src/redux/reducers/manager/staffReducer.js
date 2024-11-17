import {
  GET_ALL_STAFFS_FAILURE,
  GET_ALL_STAFFS_SUCCESS
} from '../../actions/types'

const initialState = {
  staffs: [],
  error: null
}

const staffManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_STAFFS_SUCCESS:
      return {
        ...state,
        staffs: action.payload,
        error: null
      }
    case GET_ALL_STAFFS_FAILURE:
      return {
        ...state,
        staffs: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default staffManagerReducer
