import { GET_REQUEST_DETAIL_FAILURE, GET_REQUEST_DETAIL_SUCCESS } from "../actions/types";

  const initialState = {
    requestDetail: null,
    error: null
  };
  
  const requestDetailReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_REQUEST_DETAIL_SUCCESS:
        return {
          ...state,
          requestDetail: action.payload,
          error: null
        };
      case GET_REQUEST_DETAIL_FAILURE:
        return {
          ...state,
          requestDetail: [],
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default requestDetailReducer;
  