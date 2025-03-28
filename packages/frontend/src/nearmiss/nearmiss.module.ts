import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InputTextModule } from "primeng/inputtext";
import { FieldsetModule } from "primeng/fieldset";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { PanelModule } from "primeng/panel";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from "primeng/tooltip";
import { ToolbarModule } from "primeng/toolbar";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";

import { NearmissComponent } from "./nearmiss.component";

import { provideHttpClient } from "@angular/common/http";
import { ByteFormatPipe } from "../pipes/byte-format.pipe";
import { EllipsisTooltipModule } from "../component/common/ellipsis-tooltip/ellipsis-tooltip.module";

/** ヒヤリハット検索画面モジュール */
@NgModule({
  declarations: [NearmissComponent, ByteFormatPipe],
  imports: [
    ToolbarModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    FieldsetModule,
    ButtonModule,
    DialogModule,
    TableModule,
    PanelModule,
    CalendarModule,
    ToastModule,
    MultiSelectModule,
    FormsModule,
    EllipsisTooltipModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [NearmissComponent],
})
export class NearmissModule {}
