import * as datefns from "date-fns";
import { tr } from "date-fns/locale";

export default defineNuxtPlugin((nuxtApp) => {
  datefns.setDefaultOptions({
    locale: tr,
  });
  nuxtApp.provide("datefns", datefns);
});
