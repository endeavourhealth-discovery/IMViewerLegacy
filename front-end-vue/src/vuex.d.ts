import { ComponentCustomProperties } from "vue";
import { Store } from "@/vuex";

import { Store } from "@/store/index";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
  }
}
