// this is just object of the possible urls in ie app
// type tUrl = {
// url:string,
// param1?: string,
// param2?: string,
// param3?: string,
// param4?: string,
// }
//
// type tUrlList = tUrl

export const objUrl = {
  v1: {
    auth: {
      login: {
        url: "/v1/auth/login",
      },
      signUp: {
        url: "/v1/auth/signup",
      },
      resetPassVerify: {
        url: "/v1/auth/reset-pass-verify",
      },
      resetPassCreate: {
        url: "/v1/auth/reset-pass-create",
      },
      emailVerify: {
        url: "/v1/auth/email-verify",
      },
    },
    bus: {
      busList: {
        url: "/v1/bus/list",
      },
      busOver: {
        url: "/v1/bus/overview",
        param: "busId",
      },
      busProfile: {
        url: "/v1/bus/profile",
        param1: "busId",
      },
    },
    orders: {
      orderDetail: {
        url: "/v1/order/list/",
        param1: "ordId",
      },
      orderList: {
        url: "/v1/order/list",
      },
      orderCreate: {
        url: "/v1/order/create",
      },
    },
    services: {
      servicesMain: {
        list: {
          url: "/v1/service-main/list",
        },
        detail: {
          url: "/v1/service-main/",
          param1: "serId",
        },
      },
      servicesCategory: {
        list: {
          url: "/v1/service-category/list"
        },
        detail: {
          url: "/v1/service-category/detail",
          param1:"serCatId"
        }
      },
      servicesType: {
        list: {
          url: "/v1/service-type/list"
        },
        detail: {
          url: "/v1/service-type/detail",
          param1:"serTypeId"
        }
      }
    },
    invoice: {
      invList: {
        url: "/v1/invoice/list",
      },
      inv: {
        url: "/v1/invoice/",
        param1: "invId",
      },
      invCreate: {
        url: "/v1/invoice/create",
      },
    },
    wallet: {
      
    },
    user: {
      profile: {
        url: "/v1/user/profile",
      },
    },
  },
  gen: {
    notFound: {
      url: "/404",
    },
    unauth: {
      url: "/unauthorised",
    },
    forbidden: {
      url: "/forbidden",
    },
  },

  testing: {
    auth: {
      url: "/test/v1-auth",
    },
    cookie: {
      url: "/test/v1-cookie",
    },

    dates: {
      url: "/test/v1-dates",
    },
    ses: {
      url: "/test/v1-ses",
    },
    testing: {
      url: "/test/v1-testing",
    },
    ui: {
      url: "/test/v1-ui",
    },
  },
};