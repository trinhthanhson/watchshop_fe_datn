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
import createRequestReducer from './createRequestReducer'
import requestDetailReducer from './requestDetailReducer'
import transactionDetailReducer from './transactionDetailReducer'
import typeReducer from './typeReducer'
import staffManagerReducer from './manager/staffReducer'
import createTransactionReducer from './inventory/manager/createTransactionReducer'
import statisticReducer from './statistic/statisticReducer'
import getDataNotFullReducer from './inventory/manager/getDataNotFullReducer'
import quantityReportReducer from './statistic/quantityReportReducer'
import revenueProductReducer from './statistic/revenueProductReducer'
import getProductCouponReducer from './user/getProductCouponReducer'
import getAllRequestNotFullReducer from './inventory/manager/getAllRequestNotFullReducer'
import transactionImportReducer from './inventory/manager/transactionImportReducer'
import transactionExportReducer from './inventory/manager/transactionExportReducer'
import requestImportReducer from './inventory/manager/requestImportReducer'
import requestExportReducer from './inventory/manager/requestExportReducer'
import updateRequestReducer from './inventory/director/updateRequestReducer'
import allStaffInventoryReducer from './inventory/director/allStaffInventoryReducer'
import createTransactionExportReducer from './inventory/manager/createTransactionExportReducer'
import checkRequestExistsReducer from './inventory/manager/checkTransactionExistReducer'
import orderShipperReducer from './shipper/orderShipperReducer'
import getProductPageReducer from './user/getProductPageReducer'
import getProductByIdReducer from './user/getProductByIdReducer'
import orderStatusReducer from './order-status/orderStatusReducer'
import orderPageReducer from './order/orderPageReducer'
import findOrderByStatusReducer from './order/findOrderByStatusReducer'
import findOrderByDateReducer from './order/findOrderByDateReducer'
import findOrderByDateAndStatusReducer from './order/findOrderByDateAndStatusReducer'
import findOrderByInfo from './order/findOrderByInfoReducer'

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
  request_import: requestImportReducer,
  request_export: requestExportReducer,
  requestDetail: requestDetailReducer,
  transaction_import: transactionImportReducer,
  transaction_export: transactionExportReducer,
  transactionDetail: transactionDetailReducer,
  type: typeReducer,
  managerStaff: staffManagerReducer,
  createTransaction: createTransactionReducer,
  statistic: statisticReducer,
  notfull: getDataNotFullReducer,
  quantity_report: quantityReportReducer,
  revenue_product: revenueProductReducer,
  product_coupon: getProductCouponReducer,
  request_all: getAllRequestNotFullReducer,
  update_request: updateRequestReducer,
  staff_inventory: allStaffInventoryReducer,
  create_export: createTransactionExportReducer,
  check_transaction: checkRequestExistsReducer,
  order_shipper: orderShipperReducer,
  product_page: getProductPageReducer,
  product_find: getProductByIdReducer,
  order_status: orderStatusReducer,
  order_page: orderPageReducer,
  orderByStatus: findOrderByStatusReducer,
  orderByDate: findOrderByDateReducer,
  orderByDateStatus: findOrderByDateAndStatusReducer,
  orderByInfo: findOrderByInfo
})

export default rootReducer
