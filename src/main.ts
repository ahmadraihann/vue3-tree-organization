import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import vue3TreeOrg from "vue3-tree-org";
import "vue3-tree-org/lib/vue3-tree-org.css";

const app = createApp(App);

app.use(router);
app.use(vue3TreeOrg);

app.mount("#app");
