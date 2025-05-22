/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

// Angular 19

import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import {
  ModuleRegistry,
  ClientSideRowModelModule, // or AllEnterpriseModule
} from "ag-grid-community";

// Register the module
ModuleRegistry.registerModules([
  ClientSideRowModelModule, // or AllEnterpriseModule
]);

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
};
