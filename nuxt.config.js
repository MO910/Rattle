import colors from "vuetify/es5/util/colors";
// translation
import en from "./lang/en";
import ar from "./lang/ar";
//
const local = "http://localhost:3000",
    publicHost = "https://rattel.herokuapp.com",
    host = local;
export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    static: {
        prefix: false,
    },
    head: {
        titleTemplate: "%s - rattel",
        title: "rattel",
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            { hid: "description", name: "description", content: "" },
            { name: "format-detection", content: "telephone=no" },
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
        script: [
            {
                src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
            },
            {
                src: "https://cdnjs.cloudflare.com/ajax/libs/jquery.nicescroll/3.7.6/jquery.nicescroll.min.js",
            },
            {
                src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.6/gsap.min.js",
            },
            {
                src: "/js/progressLine.js",
            },
            {
                src: "/js/inputNumber.js",
            },
        ],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/vuetify
        "@nuxtjs/vuetify",
        "@nuxtjs/apollo",
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
        // https://go.nuxtjs.dev/pwa
        "@nuxtjs/pwa",
        "@nuxtjs/auth-next",
        // "nuxt-socket-io",
    ],
    io: {
        // module options
        sockets: [
            {
                name: "main",
                url: host,
            },
        ],
    },
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
        baseURL: host,
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ["~/assets/variables.sass"],
        rtl: true,
        lang: {
            current: "ar",
            locales: { en, ar },
        },
        theme: {
            dark: true,
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3,
                },
            },
        },
    },
    // auth
    auth: {
        strategies: {
            facebook: {
                endpoints: {
                    userInfo:
                        "https://graph.facebook.com/v6.0/me?fields=id,name,picture{url}",
                },
                clientId: "388033906347657",
                scope: ["public_profile", "email"],
            },
            local: {
                token: {
                    property: "token",
                },
                user: {
                    property: "user",
                    autoFetch: true,
                },
                endpoints: {
                    login: {
                        url: "/api/auth/login",
                        method: "post",
                        propertyName: "token",
                    },
                    logout: { url: "/api/auth/logout", method: "delete" },
                    user: { url: "/api/auth/user", method: "get" },
                },
            },
        },
    },
    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        icon: { fileName: "./icon/logo.png" },
        manifest: {
            lang: "en",
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},

    serverMiddleware: { "/api": "~/api/index.js" },

    apollo: {
        clientConfigs: {
            default: {
                httpEndpoint: `${host}/api/graphql`,
            },
        },
    },
};
