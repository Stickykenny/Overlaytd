import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { GridComponent } from "./components/grid/grid.component";
import { OauthCallbackComponent } from "./login/oauth-callback.component";
import { HomeComponent } from "./components/home/home.component";
import { TagsManagerComponent } from "./components/tags-manager/tags-manager.component";

const routeConfig: Routes = [
  {
    path: "home",
    component: HomeComponent,
    title: "Home page",
  },
  /*{
    path: "details/:id",
    component: DetailsComponent,
    title: "Home details",
  },*/
  {
    path: "",
    component: LoginComponent,
    title: "Login page",
  },
  {
    path: "login",
    component: LoginComponent,
    title: "Login Page",
  },
  {
    path: "grid",
    component: GridComponent,
    title: "Grid Page",
  },
  {
    path: "tags-manager",
    component: TagsManagerComponent,
    title: "Tags Manager Page",
  },
  {
    path: "oauth-callback",
    component: OauthCallbackComponent,
    title: "Redirecting",
  },
  {
    path: "tree",
    title: "Tree",
    // Lazy-load
    loadComponent: () => import("./components/tree/tree.component").then((m) => m.TreeComponent),
  },
];
export default routeConfig;
