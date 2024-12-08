import { all } from 'redux-saga/effects'
import newSaga from './newSaga'
import productSaga from './productSaga'
import productsCustomerSaga from './productsCustomerSaga'
import orderSaga from './orderSaga'
import customerSaga from './customerSaga'
import orderDetailSaga from './orderDetailSaga'
import productDetailSaga from './productDetailSaga'
import postAddProduct from './addProductSaga'
import categoriesSaga from './categoriesSaga'
import putUpdateProduct from './updateProductSaga'
import userProfileSaga from './userProfileSaga'
import customerOrdersSaga from './customerOrdersSaga'
import cartSaga from './cartSaga'
import addOrderSaga from './addOrderSaga'
import couponsSaga from './couponsSaga'
import putAddCart from './addCartSaga'
import postAddCoupon from './addCouponSaga'
import brandSaga from './brandSaga'
import reviewCustomerSaga from './reviewCustomerSaga'
import couponDetailSaga from './coupondetailSaga'
import reviewProductSaga from './reviewProductSaga'
import roleSaga from './roleSaga'
import watchAddProductsBatch from './addProductBatchSaga'
import supplierSaga from './supplierSaga'
import createRequestSaga from './createRequestSaga'
import requestDetailSaga from './requestDetailSaga'
import transactionDetailSaga from './transactionDetailSaga'
import typeSaga from './typeSaga'
import staffManagerSaga from './manager/staffSaga'
import createTransactionSaga from './inventory/manager/createTransaction'
import statisticSaga from './statistic/statisticSaga'
import dataNotFullSaga from './inventory/manager/getDataNotFullSaga'
import quantityReportSaga from './statistic/quantityReportSaga'
import revenueProductSaga from './statistic/revenueProductSaga'
import getProductCouponSaga from './user/getProductCouponSaga'
import getAllRequestNotFullSaga from './inventory/manager/getAllRequestNotFullSaga'
import transactionImportSaga from './inventory/manager/transactionImportSaga'
import transactionExportSaga from './inventory/manager/transactionExportSaga'
import requestImportSaga from './inventory/manager/requestImportSaga'
import requestExportSaga from './inventory/manager/requestExportSaga'
import updateRequestDirectorSaga from './inventory/director/updateRequestSaga'
import staffInventorySaga from './inventory/director/allStaffInventorySaga'
export default function* rootSaga() {
  yield all([
    newSaga(),
    productSaga(),
    productsCustomerSaga(),
    orderSaga(),
    customerSaga(),
    orderDetailSaga(),
    productDetailSaga(),
    postAddProduct(),
    watchAddProductsBatch(),
    categoriesSaga(),
    brandSaga(),
    staffManagerSaga(),
    reviewCustomerSaga(),
    putUpdateProduct(),
    userProfileSaga(),
    customerOrdersSaga(),
    cartSaga(),
    addOrderSaga(),
    couponsSaga(),
    couponDetailSaga(),
    putAddCart(),
    postAddCoupon(),
    reviewProductSaga(),
    roleSaga(),
    supplierSaga(),
    createRequestSaga(),
    requestImportSaga(),
    requestExportSaga(),
    requestDetailSaga(),
    transactionImportSaga(),
    transactionExportSaga(),
    transactionDetailSaga(),
    typeSaga(),
    createTransactionSaga(),
    statisticSaga(),
    dataNotFullSaga(),
    quantityReportSaga(),
    revenueProductSaga(),
    getProductCouponSaga(),
    getAllRequestNotFullSaga(),
    updateRequestDirectorSaga(),
    staffInventorySaga()
  ])
}
