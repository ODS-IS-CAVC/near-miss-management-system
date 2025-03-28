import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { NearmissModule } from "./nearmiss/nearmiss.module";

platformBrowserDynamic()
  .bootstrapModule(NearmissModule)
  .catch((err) => console.error(err));
