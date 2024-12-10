import {
  CREATE_TRANSACTION_EXPORT_FAILURE,
  CREATE_TRANSACTION_EXPORT_SUCCESS
} from '../../../actions/inventory/manager/type'

const initialState = {
  create_export: null,
  error: null
}

const createTransactionExportReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TRANSACTION_EXPORT_SUCCESS:
      return {
        ...state,
        create_export: action.data, // Sửa thành action.data
        error: null
      }
    case CREATE_TRANSACTION_EXPORT_FAILURE:
      return {
        ...state,
        create_export: null, // Đặt về null thay vì mảng rỗng
        error: action.error
      }
    default:
      return state
  }
}

export default createTransactionExportReducer
