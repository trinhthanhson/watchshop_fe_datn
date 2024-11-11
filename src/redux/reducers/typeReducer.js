import { GET_ALL_TYPE_FAILURE, GET_ALL_TYPE_SUCCESS } from '../actions/types'

const initialState = {
  type: [],
  error: null
}

const typeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TYPE_SUCCESS:
      return {
        ...state,
        type: action.payload,
        error: null
      }
    case GET_ALL_TYPE_FAILURE:
      return {
        ...state,
        type: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default typeReducer
