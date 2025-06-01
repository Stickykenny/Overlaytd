import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { GridComponent } from "./components/grid/grid.component";
import { NgIf } from "@angular/common";
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
];
export default routeConfig;
