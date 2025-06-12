import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { GridComponent } from "./components/grid/grid.component";
import { NgIf } from "@angular/common";
import { OauthCallbackComponent } from "./oauth-callback/oauth-callback.component";
//import { HomeComponent } from "./home/home.component";

const routeConfig: Routes = [
  /*{
    path: "",
    component: HomeComponent,
    title: "Home page",
  },*/
  /*{
    path: "details/:id",
    component: DetailsComponent,
    title: "Home details",
  },*/
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
    path: "oauth-callback",
    component: OauthCallbackComponent,
    title: "Redirecting",
  },
];
export default routeConfig;
