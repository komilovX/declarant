module.exports = {
  mode: "spa",

  head: {
    title: "Declarant" || process.env.npm_package_name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  loading: { color: "#00b4d8" },

  css: ["element-ui/lib/theme-chalk/index.css", "@/styles/index.scss"],

  plugins: [
    "@/plugins/element-ui",
    "@/plugins/nuxt-client-init.js",
    "@/plugins/axios",
  ],

  buildModules: [],

  modules: ["@nuxtjs/axios", "@nuxtjs/pwa", "@nuxtjs/dotenv"],

  axios: {},

  build: {
    transpile: [/^element-ui/],

    extend(config, ctx) {},
  },
};
