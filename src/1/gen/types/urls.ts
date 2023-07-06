export const objUrl = {
  v1: {
    report: {
      dash: {
        url: "/v1/dash",
        dbId: 2,
        ruleName: "dashboard",
      },
    },
    auth: {
      login: {
        url: "/v1/auth/login",
        dbId: null,
        ruleName: null,
      },
      signUp: {
        url: "/v1/auth/signup",
        dbId: null,
        ruleName: null,
      },
      resetPassVerify: {
        url: "/v1/auth/reset-pass-verify",
        dbId: null,
        ruleName: null,

        param: "id",
      },
      resetPassCreate: {
        url: "/v1/auth/reset-pass-create",
        dbId: null,
        ruleName: null,
      },
      emailVerify: {
        url: "/v1/auth/email-verify",
        dbId: null,
        ruleName: null,

        param: "id",
      },
    },
    bus: {
      busList: {
        url: "/v1/bus/list",
        dbId: 15,
        ruleName: "business info",
      },
      busOver: {
        url: "/v1/bus/overview",
        dbId: 44,
        ruleName: "business overview",

        param: "busId",
      },
      busProfile: {
        url: "/v1/bus/profile",
        dbId: 41,
        ruleName: "business details",

        param1: "busId",
      },
    },
    orders: {
      orderDetail: {
        url: "/v1/order/list/",
        dbId: 6,
        ruleName: "order details",
        param1: "ordId",
      },
      orderList: {
        url: "/v1/order/list",
        dbId: 5,
        ruleName: "orders",
      },
      orderCreate: {
        url: "/v1/order/create",
        dbId: 1,
        ruleName: "new order",
      },
      qc: {
        url: "/v1/order/qc",
        dbId: 11,
        ruleName: "quality control",
      },
    },
    jobApp: {
      jobPosts: {
        url: "/v1/job-posts/",
        dbId: 4,
        ruleName: "job posts",
      },
      edUserService: {
        url: "/v1/job-app/user",
        dbId: 10,
        ruleName: "editor user services",
      },
      edBusService: {
        url: "/v1/job-app/bus",
        dbId: 9,
        ruleName: "editor bus services",
      },


    },
    services: {
      servicesMain: {
        list: {
          url: "/v1/service-main/list",
          dbId: 14,
          ruleName: "services",
        },
        detail: {
          url: "/v1/service-main/",
          dbId: 1,
          ruleName: null,

          param1: "serId",
        },
      },
      servicesCategory: {
        list: {
          url: "/v1/service-category/list",
          dbId: 12,
          ruleName: "service categories",
        },
        detail: {
          url: "/v1/service-category/detail",
          dbId: null,
          ruleName: null,

          param1: "serCatId",
        },
      },
      servicesType: {
        list: {
          url: "/v1/service-type/list",
          dbId: 13,
          ruleName: "service types",
        },
        detail: {
          url: "/v1/service-type/detail",
          dbId: 1,
          ruleName: null,
          param1: "serTypeId",
        },
      },
    },
    invoice: {
      invList: {
        url: "/v1/invoice/list",
        dbId: 7,
        ruleName: "invoices",
      },
      inv: {
        url: "/v1/invoice/",
        dbId: 8,
        ruleName: "invoice details",
        param1: "invId",
      },
      invCreate: {
        url: "/v1/invoice/create",
        dbId: null,
        ruleName: null,
      },
      discount: {
        url: "/v1/discount/",
        dbId: 17,
        ruleName: "discounts",
      },
    },
    wallet: {
      details: {
        url: "/v1/wallet/detail",
        dbId: 28,
        ruleName: "wallet details",
      },
    },
    user: {
      profile: {
        url: "/v1/user/profile",
        dbId: 23,
        ruleName: "profile",
      },
      details: {
        url: "/v1/user/details",
        dbId: 40,
        ruleName: "user details",
      },
      list: {
        url: "/v1/user/list",
        dbId: 18,
        ruleName: "users",
      },
      overview: {
        url: "/v1/user/overview",
        dbId: 43,
        ruleName: "user overview",
      },
      roles: {
        url: "/v1/user/roles",
        dbId: 20,
        ruleName: "roles",
      },

    },
    project: {
      projList: {
        url: "/v1/project/list",
        dbId: 3,
        ruleName: "projects",
      },
      projOver: {
        url: "/v1/project/overview",
        dbId: 45,
        ruleName: "project overview",
      },
      projDets: {
        url: "/v1/project/detail",
        dbId: 42,
        ruleName: "project details",
      },
    },
    webapp: {
      adminFunc: {
        url: "/v1/webapp/admin-func",
        dbId: null,
        ruleName: null,
      },
      portfolio: {
        url: "/v1/webapp/portfolio/manage",
        dbId: 19,
        ruleName: "portfolio",
      },
    },
  },
  gen: {
    notFound: {
      url: "/404",
      dbId: null,
      ruleName: null,
    },
    unauth: {
      url: "/unauthorised",
      dbId: null,
      ruleName: null,
    },
    forbidden: {
      url: "/forbidden",
      dbId: null,
      ruleName: null,
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
    uiDialog: {
      url: "/test/v1-ui-dialog",
    },
    url: {
      url: "/test/v1-url",
    },
    queries: {
      url: "/test/v1-queries",
    },
    genBasics: {
      url: "/test/v1-gen-basic",
    },
    arrObj: {
      url: "/test/v1-obj-arr",
    },
    zod: {
      url: "/test/v1-zod",
    },
    theme: {
      url: "/test/v1-theme",
    },
    redirect: {
      url: "/test/v1-redirect",
    },
    spread: {
      url: "/test/v1-spread",
    },
  },
};
