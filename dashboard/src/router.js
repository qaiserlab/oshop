import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ProfileFormView from './views/profile/ProfileFormView';
import EditProfileView from './views/profile/EditProfileView';
import EditPasswordView from './views/profile/EditPasswordView';

import ImageAllDataView from './views/images/AllDataView';
import ImageAddNewDataView from './views/images/AddNewDataView';
import ImageEditDataView from './views/images/EditDataView';

import BannerAllDataView from './views/banner/AllDataView';
import BannerAddNewDataView from './views/banner/AddNewDataView';
import BannerEditDataView from './views/banner/EditDataView';

import PagesAllDataView from './views/pages/AllDataView';
import PagesAddNewDataView from './views/pages/AddNewDataView';
import PagesEditDataView from './views/pages/EditDataView';

import NewsAllDataView from './views/news/AllDataView';
import NewsAddNewDataView from './views/news/AddNewDataView';
import NewsEditDataView from './views/news/EditDataView';

import MenusAllDataView from './views/menus/AllDataView';
import MenusAddNewDataView from './views/menus/AddNewDataView';
import MenusEditDataView from './views/menus/EditDataView';

import MailboxAllDataView from './views/mailbox/AllDataView';
import MailboxEditDataView from './views/mailbox/EditDataView';

import BankAllDataView from './views/bank/AllDataView';
import BankAddNewDataView from './views/bank/AddNewDataView';
import BankEditDataView from './views/bank/EditDataView';

import ProductAllDataView from './views/product/AllDataView';
import ProductAddNewDataView from './views/product/AddNewDataView';
import ProductEditDataView from './views/product/EditDataView';

import ProductCategoriesAllDataView from './views/product-categories/AllDataView';
import ProductCategoriesAddNewDataView from './views/product-categories/AddNewDataView';
import ProductCategoriesEditDataView from './views/product-categories/EditDataView';

import EditPinPriceView from './views/pin/EditPinPriceView';
import PinAllDataView from './views/pin/AllDataView';
import PinAddNewDataView from './views/pin/AddNewDataView';
import PinEditDataView from './views/pin/EditDataView';
import PinStockView from './views/pin/StockView';

import StockiestsMobileCenterView from './views/stockiests/MobileCenterView';
import StockiestsDistributionCenterView from './views/stockiests/DistributionCenterView';
import StockiestsAddNewStockiestView from './views/stockiests/AddNewStockiestView';

import PendingMemberListView from './views/member/PendingMemberListView';
import ConfirmedMemberListView from './views/member/ConfirmedMemberListView';
import ActiveMemberListView from './views/member/ActiveMemberListView';
import InactiveMemberListView from './views/member/InactiveMemberListView';
import InactiveMemberFormView from './views/member/InactiveMemberFormView';
import ImportMemberFormView from './views/member/ImportMemberFormView';
import MemberFormView from './views/member/MemberFormView';

import MemberNewOrderListView from './views/member-order/NewOrderListView';
import MemberNewOrderFormView from './views/member-order/NewOrderFormView';
import MemberConfirmedOrderListView from './views/member-order/ConfirmedOrderListView';
import MemberConfirmedOrderFormView from './views/member-order/ConfirmedOrderFormView';
import MemberProcessedOrderListView from './views/member-order/ProcessedOrderListView';
import MemberProcessedOrderFormView from './views/member-order/ProcessedOrderFormView';
import MemberDeliveredOrderListView from './views/member-order/DeliveredOrderListView';
import MemberDeliveredOrderFormView from './views/member-order/DeliveredOrderFormView';
import MemberPaidOrderListView from './views/member-order/PaidOrderListView';
import MemberPaidOrderFormView from './views/member-order/PaidOrderFormView';
import MemberExpiredOrderListView from './views/member-order/ExpiredOrderListView';
import MemberExpiredOrderFormView from './views/member-order/ExpiredOrderFormView';

import NewOrderListView from './views/stockiest-order/NewOrderListView';
import NewOrderFormView from './views/stockiest-order/NewOrderFormView';
import ConfirmedOrderListView from './views/stockiest-order/ConfirmedOrderListView';
import ConfirmedOrderFormView from './views/stockiest-order/ConfirmedOrderFormView';
import ProcessedOrderListView from './views/stockiest-order/ProcessedOrderListView';
import ProcessedOrderFormView from './views/stockiest-order/ProcessedOrderFormView';
import DeliveredOrderListView from './views/stockiest-order/DeliveredOrderListView';
import DeliveredOrderFormView from './views/stockiest-order/DeliveredOrderFormView';
import PaidOrderListView from './views/stockiest-order/PaidOrderListView';
import PaidOrderFormView from './views/stockiest-order/PaidOrderFormView';
import ExpiredOrderListView from './views/stockiest-order/ExpiredOrderListView';
import ExpiredOrderFormView from './views/stockiest-order/ExpiredOrderFormView';

import ProductSalesView from './views/report/ProductSalesView';
import StockiestProductStockView from './views/report/StockiestProductStockView';
import StockiestSalesView from './views/report/StockiestSalesView';
import StockiestPurchaseView from './views/report/StockiestPurchaseView';
import BestSellerProductView from './views/report/BestSellerProductView';
import TopBuyerView from './views/report/TopBuyerView';
import TopReqruitmentView from './views/report/TopReqruitmentView';
import BonusTransferHistoryView from './views/report/BonusTransferHistoryView';
import SerialNumberStockView from './views/report/SerialNumberStockView';

import WithdrawAllDataView from './views/withdraw/AllDataView';

export default new Router({
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', component: DashboardView },

    { path: '/profile', component: ProfileFormView },
    { path: '/profile/edit-profile', component: EditProfileView },
    { path: '/profile/edit-password', component: EditPasswordView },

    { path: '/images/all-data', component: ImageAllDataView },
    { path: '/images/add-new-data', component: ImageAddNewDataView },
    { path: '/images/edit-data/:id', component: ImageEditDataView },

    { path: '/banner/all-data', component: BannerAllDataView },
    { path: '/banner/add-new-data', component: BannerAddNewDataView },
    { path: '/banner/edit-data/:id', component: BannerEditDataView },

    { path: '/pages/all-data', component: PagesAllDataView },
    { path: '/pages/add-new-data', component: PagesAddNewDataView },
    { path: '/pages/edit-data/:id', component: PagesEditDataView },

    { path: '/news/all-data', component: NewsAllDataView },
    { path: '/news/add-new-data', component: NewsAddNewDataView },
    { path: '/news/edit-data/:id', component: NewsEditDataView },

    { path: '/menus/all-data', component: MenusAllDataView },
    { path: '/menus/add-new-data', component: MenusAddNewDataView },
    { path: '/menus/edit-data/:id', component: MenusEditDataView },

    { path: '/mailbox/all-data', component: MailboxAllDataView },
    { path: '/mailbox/edit-data/:id', component: MailboxEditDataView },

    { path: '/bank/all-data', component: BankAllDataView },
    { path: '/bank/add-new-data', component: BankAddNewDataView },
    { path: '/bank/edit-data/:id', component: BankEditDataView },

    { path: '/product/all-data', component: ProductAllDataView },
    { path: '/product/add-new-data', component: ProductAddNewDataView },
    { path: '/product/edit-data/:id', component: ProductEditDataView },
    { path: '/import-member/add-new-data', component: ImportMemberFormView },

    { path: '/product/categories/all-data', component: ProductCategoriesAllDataView },
    { path: '/product/categories/add-new-data', component: ProductCategoriesAddNewDataView },
    { path: '/product/categories/edit-data/:id', component: ProductCategoriesEditDataView },

    { path: '/member/pending-member/all-data', component: PendingMemberListView },
    { path: '/member/confirmed-member/all-data', component: ConfirmedMemberListView },
    { path: '/member/active-member/all-data', component: ActiveMemberListView },
    { path: '/member/inactive-member/all-data', component: InactiveMemberListView },
    { path: '/member/inactive-member/edit-data/:id', component: InactiveMemberFormView },
    { path: '/member/view-data/:id', component: MemberFormView },

    { path: '/pin/edit-pin-price', component: EditPinPriceView },
    { path: '/pin/all-data', component: PinAllDataView },
    { path: '/pin/add-new-data', component: PinAddNewDataView },
    { path: '/pin/edit-data/:id', component: PinEditDataView },
    { path: '/pin/stock', component: PinStockView },

    { path: '/stockiests/mobile-center', component: StockiestsMobileCenterView },
    { path: '/stockiests/distribution-center', component: StockiestsDistributionCenterView },
    { path: '/stockiests/add-new-stockiest', component: StockiestsAddNewStockiestView },

    { path: '/member-new-order/all-data', component: MemberNewOrderListView },
    { path: '/member-new-order/view-data/:id', component: MemberNewOrderFormView },
    { path: '/member-confirmed-order/all-data', component: MemberConfirmedOrderListView },
    { path: '/member-confirmed-order/view-data/:id', component: MemberConfirmedOrderFormView },
    { path: '/member-processed-order/all-data', component: MemberProcessedOrderListView },
    { path: '/member-processed-order/view-data/:id', component: MemberProcessedOrderFormView },
    { path: '/member-delivered-order/all-data', component: MemberDeliveredOrderListView },
    { path: '/member-delivered-order/view-data/:id', component: MemberDeliveredOrderFormView },
    { path: '/member-paid-order/all-data', component: MemberPaidOrderListView },
    { path: '/member-paid-order/view-data/:id', component: MemberPaidOrderFormView },
    { path: '/member-expired-order/all-data', component: MemberExpiredOrderListView },
    { path: '/member-expired-order/view-data/:id', component: MemberExpiredOrderFormView },

    { path: '/new-order/all-data', component: NewOrderListView },
    { path: '/new-order/view-data/:id', component: NewOrderFormView },
    { path: '/confirmed-order/all-data', component: ConfirmedOrderListView },
    { path: '/confirmed-order/view-data/:id', component: ConfirmedOrderFormView },
    { path: '/processed-order/all-data', component: ProcessedOrderListView },
    { path: '/processed-order/view-data/:id', component: ProcessedOrderFormView },
    { path: '/delivered-order/all-data', component: DeliveredOrderListView },
    { path: '/delivered-order/view-data/:id', component: DeliveredOrderFormView },
    { path: '/paid-order/all-data', component: PaidOrderListView },
    { path: '/paid-order/view-data/:id', component: PaidOrderFormView },
    { path: '/expired-order/all-data', component: ExpiredOrderListView },
    { path: '/expired-order/view-data/:id', component: ExpiredOrderFormView },

    { path: '/withdraw', component: WithdrawAllDataView },

    { path: '/report/product-sales', component: ProductSalesView },
    { path: '/report/best-seller-product', component: BestSellerProductView },
    { path: '/report/stockiest-product-stock', component: StockiestProductStockView },
    { path: '/report/stockiest-sales', component: StockiestSalesView },
    { path: '/report/stockiest-purchase', component: StockiestPurchaseView },
    { path: '/report/top-buyer', component: TopBuyerView },
    { path: '/report/top-reqruitment', component: TopReqruitmentView },
    { path: '/report/bonus-transfer-history', component: BonusTransferHistoryView },
    { path: '/report/serial-number-stock', component: SerialNumberStockView },
  ],
});
