import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TooltipModule } from "primeng/tooltip";
import { EllipsisTooltipComponent } from "./ellipsis-tooltip.component";

/** 要素幅表示サイズ超過文字Tooltipモジュール */
@NgModule({
  declarations: [EllipsisTooltipComponent],
  exports: [EllipsisTooltipComponent],
  imports: [CommonModule, TooltipModule],
})
export class EllipsisTooltipModule {}
