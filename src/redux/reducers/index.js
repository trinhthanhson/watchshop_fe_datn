import { combineReducers } from 'redux'
import newsReducer from './newsReducer'
import productsReducer from './productsReducer'
import productsCustomerReducer from './productsCustomerReducer'
import ordersReducer from './ordersReducer'
import customersReducer from './customersReducer'
import orderDetailReducer from './orderDetailReducer'
import productDetailReducer from './productDetailReducer'
import addProductReducer from './addProductReducer'
import categoriesReducer from './categoriesReducer'
import updateProductReducer from './updateProductReducer'
import userProfileReducer from './userProfileReducer'
import customerOrdersReducer from './customerOrderReducer'
import cartReducer from './cartReducer'
import addOrderReducer from './addOrderReducer'
import couponsReducer from './couponsReducer'
import addCartReducer from './addCartReducer'
import addCouponReducer from './addCouponReducer'
import brandReducer from './brandReducer'
import reviewCustomerReducer from './reviewCustomerReducer'
import couponDetailReducer from './coupondetailReducer'
import reviewProductReducer from './reviewProductReducer'
import roleReducer from './roleReducer'
import addProductsBatchReducers from './addProductBatchReducers'
import supplierReducer from './supplierReducer'
import requestReducer from './requestReducer'
import createRequestReducer from './createRequestReducer'
import requestDetailReducer from './requestDetailReducer'
import transactionReducer from './transactionReducer'
import transactionDetailReducer from './transactionDetailReducer'
import typeReducer from './typeReducer'
import staffManagerReducer from './manager/staffReducer'
import createTransactionReducer from './inventory/manager/createTransactionReducer'

const rootReducer = combineReducers({
  news: newsReducer,
  products: productsReducer,
  productsCustomer: productsCustomerReducer,
  orders: ordersReducer,
  customers: customersReducer,
  orderDetail: orderDetailReducer,
  productDetail: productDetailReducer,
  addProduct: addProductReducer,
  addProductBatch: addProductsBatchReducers,
  categories: categoriesReducer,
  brands: brandReducer,
  updateProduct: updateProductReducer,
  user: userProfileReducer,
  customerOrders: customerOrdersReducer,
  cart: cartReducer,
  reviews: reviewCustomerReducer,
  addOrder: addOrderReducer,
  coupons: couponsReducer,
  coupondetail: couponDetailReducer,
  addCoupon: addCouponReducer,
  addCart: addCartReducer,
  reviewProduct: reviewProductReducer,
  roles: roleReducer,
  suppliers: supplierReducer,
  createRequest: createRequestReducer,
  request: requestReducer,
  requestDetail: requestDetailReducer,
  transaction: transactionReducer,
  transactionDetail: transactionDetailReducer,
  type: typeReducer,
  managerStaff: staffManagerReducer,
  createTransaction: createTransactionReducer
})

export default rootReducer
