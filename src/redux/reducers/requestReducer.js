import {
  GET_ALL_REQUEST_FAILURE,
  GET_ALL_REQUEST_SUCCESS
} from '../actions/types'

const initialState = {
  request: [],
  error: null
}

const requestReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_REQUEST_SUCCESS:
      return {
        ...state,
        request: action.payload,
        error: null
      }
    case GET_ALL_REQUEST_FAILURE:
      return {
        ...state,
        request: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default requestReducer
