import { tr } from "vuetify/locale";
import colors from "vuetify/util/colors";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["@/assets/css/globals.scss"],
  modules: ["vuetify-nuxt-module", "@vueuse/nuxt", "@vee-validate/nuxt"],
  runtimeConfig: {
    public: {
      baseURL: "",
    },
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
      /* https://www.youtube.com/watch?v=aamWg1TuC3o */
      disableVuetifyStyles: true,
      styles: {
        configFile: "assets/css/components.scss",
      },
    },
    vuetifyOptions: {
      locale: {
        locale: "tr",
        messages: { tr },
      },
      localeMessages: ["tr"],
      date: {
        adapter: "date-fns",
      },
      theme: {
        themes: {
          light: {
            dark: false,
            colors: {
              background: colors.grey.lighten4,
            },
          },
          dark: {
            dark: true,
            colors: {},
          },
        },
      },
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
});
