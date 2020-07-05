export default {
  namespaced: true,

  state: {
    data: {
      Dashboard: {
        title: 'Dasbor',
        permalink: '#/',
        icon: 'dashboard',
      },

      Cms: {
        title: 'CMS',
        icon: 'write',
        collapse: false,

        child: {

          News: {
            title: 'Berita',
            permalink: '#/news/all-data',
          },

          Pages: {
            title: 'Halaman',
            permalink: '#/pages/all-data',
          },

          Images: {
            title: 'Gambar',
            permalink: '#/images/all-data',
          },

          Banner: {
            title: 'Banner',
            permalink: '#/banner/all-data',
          },

          Menus: {
            title: 'Menu',
            permalink: '#/menus/all-data',
          },

        },
      },

      Mailbox: {
        title: 'Kotak Surel',
        permalink: '#/mailbox/all-data',
        icon: 'email',
        hr: true,
      },

      Product: {
        title: 'Produk',
        icon: 'bag',
        collapse: false,
        hr: true,

        child: {

          ProductAllData: {
            title: 'Semua Data',
            permalink: '#/product/all-data',
          },

          ProductCategories: {
            title: 'Kategori',
            permalink: '#/product/categories/all-data',
          },

        },
      },

      MemberOrder: {
        title: 'Order Member',
        icon: 'receipt',
        hr: false,
        collapse: false,

        child: {

          NewOrder: {
            title: 'Order Baru',
            permalink: '#/member-new-order/all-data',
          },

          ConfirmedOrder: {
            title: 'Order Dikonfirmasi',
            permalink: '#/member-confirmed-order/all-data',
          },

          PaidOrder: {
            title: 'Order Dibayar',
            permalink: '#/member-paid-order/all-data',
          },

          ProcessedOrder: {
            title: 'Order Diproses',
            permalink: '#/member-processed-order/all-data',
          },

          DeliveredOrder: {
            title: 'Order Delivered',
            permalink: '#/member-delivered-order/all-data',
          },

          ExpiredOrder: {
            title: 'Order Expire',
            permalink: '#/member-expired-order/all-data',
          },

        },
      },

      Order: {
        title: 'Order Stokist',
        icon: 'receipt',
        collapse: false,
        hr: true,

        child: {

          NewOrder: {
            title: 'Order Baru',
            permalink: '#/new-order/all-data',
          },

          ProcessedOrder: {
            title: 'Order Diproses',
            permalink: '#/processed-order/all-data',
          },

          DeliveredOrder: {
            title: 'Order Delivered',
            permalink: '#/delivered-order/all-data',
          },

          ExpiredOrder: {
            title: 'Order Expire',
            permalink: '#/expired-order/all-data',
          },

        },
      },

      Pin: {
        title: 'PIN',
        icon: 'id-badge',
        collapse: false,

        child: {

          EditPinPrice: {
            title: 'Harga PIN',
            permalink: '#/pin/edit-pin-price',
          },

          RefillPin: {
            title: 'Isi Ulang PIN',
            permalink: '#/pin/all-data',
          },

          StockFlow: {
            title: 'Riwayat Stok PIN',
            permalink: '#/pin/stock',
          },

        },

      },

      Stockiest: {
        title: 'Stokist',
        icon: 'id-badge',
        collapse: false,

        child: {

          DistributionCenter: {
            title: 'Distribution Center',
            permalink: '#/stockiests/distribution-center',
          },

          MobileCenter: {
            title: 'Mobile Center',
            permalink: '#/stockiests/mobile-center',
          },

          AddNewStockiest: {
            title: 'Buat Stokist Baru',
            permalink: '#/stockiests/add-new-stockiest',
          },

        },

      },

      Member: {
        title: 'Member',
        icon: 'id-badge',
        collapse: false,
        hr: true,

        child: {

          PendingMember: {
            title: 'Member Pending',
            permalink: '#/member/pending-member/all-data',
          },

          ConfirmedMember: {
            title: 'Member Dikonfirmasi',
            permalink: '#/member/confirmed-member/all-data',
          },

          ActiveMember: {
            title: 'Member Aktif',
            permalink: '#/member/active-member/all-data',
          },

          InactiveMember: {
            title: 'Member Tidak Aktif',
            permalink: '#/member/inactive-member/all-data',
          },

          ImportMember: {
            title: 'Import Member',
            permalink: '#/import-member/add-new-data',
          },

        },

      },

      Withdraw: {
        icon: 'money',
        title: 'Withdraw',
        permalink: '#/withdraw',
        hr: true,
      },

      Report: {
        title: 'Laporan',
        icon: 'agenda',
        collapse: false,

        child: {

          StockiestPurchaseReport: {
            title: 'Pembelian Stokist',
            permalink: '#/report/stockiest-purchase',
          },

          StockiestSalesReport: {
            title: 'Penjualan Stokist',
            permalink: '#/report/stockiest-sales',
          },

          StockiestProductStockReport: {
            title: 'Stok Stokist',
            permalink: '#/report/stockiest-product-stock',
          },

          ProductSalesReport: {
            title: 'Penjualan Produk',
            permalink: '#/report/product-sales',
          },

          ProductBestSellerReport: {
            title: 'Produk Best Seller',
            permalink: '#/report/best-seller-product',
          },

          TopBuyerReport: {
            title: 'Top Buyer',
            permalink: '#/report/top-buyer',
          },

          TopReqruitmentReport: {
            title: 'Top Reqruitment',
            permalink: '#/report/top-reqruitment',
          },

          BonusTransferHistoryReport: {
            title: 'Riwayat Bonus',
            permalink: '#/report/bonus-transfer-history',
          },

          SerialNumberStockReport: {
            title: 'Stok Serial Number',
            permalink: '#/report/serial-number-stock',
          },
        },
      },

    },
  },

  getters: {

    data(state) {
      return state.data;
    },

  },

}
