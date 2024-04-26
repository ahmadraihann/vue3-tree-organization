import DefaultLayout from "../../../layouts/Default.vue";

export const routeOrganization = [
  {
    path: "/",
    name: "organization",
    component: () => import("../views/Index.vue"),
    meta: { layout: DefaultLayout, onlyGuest: true },
  },
];
