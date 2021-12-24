import Vue from "vue";
import App from "./App.vue";
import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUserSecret);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");



// import Kuroshiro from "kuroshiro";
// import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
// async function setupShirokuro() {
//   // Initialize kuroshiro with an instance of analyzer (You could check the [apidoc](#initanalyzer) for more information):
//   // For this example, you should npm install and import the kuromoji analyzer first
//   // Instantiate
//   const kuroshiro = new Kuroshiro();
//   // Initialize
//   // Here uses async/await, you could also use Promise
//   await kuroshiro.init(new KuromojiAnalyzer());
//   // Convert what you want
//   const result = await kuroshiro.convert(
//     "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！",
//     { to: "hiragana" }
//   );
//   console.log(result);
// }
// setupShirokuro();
