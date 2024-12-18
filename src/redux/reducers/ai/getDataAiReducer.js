import {
  GET_DATA_AI_BY_QUANTITY_FAILURE,
  GET_DATA_AI_BY_QUANTITY_SUCCESS
} from '../../actions/ai/type'

const initialState = {
  dataAI: [],
  error: null
}

const getDataAiReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_AI_BY_QUANTITY_SUCCESS:
      return {
        ...state,
        dataAI: action.payload,
        error: null
      }
    case GET_DATA_AI_BY_QUANTITY_FAILURE:
      return {
        ...state,
        dataAI: [],
        error: action.payload
      }
    default:
      return state
  }
}

export default getDataAiReducer
