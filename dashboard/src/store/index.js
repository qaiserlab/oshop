import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

import MenuStore from './MenuStore';
import WebsiteMenuStore from './WebsiteMenuStore';
import AccountStore from './AccountStore';
import MemberStore from './MemberStore';
import SettingStore from './SettingStore';

import PublicationStore from './PublicationStore';
import TemplateStore from './TemplateStore';
import SizeStore from './SizeStore';
import GenderStore from './GenderStore';

import ImageStore from './ImageStore';
import BannerStore from './BannerStore';
import MailboxStore from './MailboxStore';
import NewsStore from './NewsStore';
import PageStore from './PageStore';
import BankStore from './BankStore';
import ProductCategoryStore from './ProductCategoryStore';
import ProductStore from './ProductStore';
import StockiestStore from './StockiestStore';
import StockiestTypeStore from './StockiestTypeStore';
import MemberOrderStore from './MemberOrderStore';
import StockiestOrderStore from './StockiestOrderStore';
import PinStore from './PinStore';
import PinStockStore from './PinStockStore';

import ProductSalesStore from './ProductSalesStore';
import StockiestProductStockStore from './StockiestProductStockStore';
import StockiestSalesStore from './StockiestSalesStore';
import StockiestPurchaseStore from './StockiestPurchaseStore';
import BestSellerProductStore from './BestSellerProductStore';
import TopBuyerStore from './TopBuyerStore';
import TopReqruitmentStore from './TopReqruitmentStore';
import BonusTransferHistoryStore from './BonusTransferHistoryStore';
import SerialNumberStockStore from './SerialNumberStockStore';

import WithdrawStore from './WithdrawStore';

const store = new Vuex.Store({

  modules: {
    MenuStore,
    WebsiteMenuStore,
    AccountStore,
    MemberStore,
    SettingStore,

    SizeStore,
    GenderStore,
    PublicationStore,
    TemplateStore,

    ImageStore,
    BannerStore,
    NewsStore,
    PageStore,
    MailboxStore,
    BankStore,
    ProductStore,
    ProductCategoryStore,
    StockiestStore,
    StockiestTypeStore,
    MemberOrderStore,
    StockiestOrderStore,
    PinStore,
    PinStockStore,

    ProductSalesStore,
    StockiestProductStockStore,
    StockiestSalesStore,
    StockiestPurchaseStore,
    BestSellerProductStore,
    TopBuyerStore,
    TopReqruitmentStore,
    BonusTransferHistoryStore,
    SerialNumberStockStore,

    WithdrawStore,
  },

});

export default store;
