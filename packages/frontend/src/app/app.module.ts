import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NearmissModule } from "../nearmiss/nearmiss.module";
import { EllipsisTooltipModule } from "../component/common/ellipsis-tooltip/ellipsis-tooltip.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, EllipsisTooltipModule, AppRoutingModule, NearmissModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
