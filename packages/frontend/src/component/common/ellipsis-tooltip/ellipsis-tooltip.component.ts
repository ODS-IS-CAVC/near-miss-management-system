import { Component, AfterViewInit, ViewChild, ElementRef, Input, ChangeDetectorRef, HostListener, NgZone } from "@angular/core";

/** 要素幅表示サイズ超過文字Tooltipコンポーネント */
@Component({
  selector: "ellipsis-tooltip",
  templateUrl: "./ellipsis-tooltip.component.html",
})
export class EllipsisTooltipComponent implements AfterViewInit {
  @Input() content: string = "";
  @ViewChild("ellipsisCell") ellipsisCell!: ElementRef;
  isOverflownElement: boolean = false;

  /**
   * @param cdref ChangeDetectorRefクラス
   * @param zone NgZoneクラス
   */
  constructor(
    private cdref: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.checkOverflow();
        this.zone.run(() => this.cdref.detectChanges());
      });
    });
  }

  private checkOverflow() {
    const element = this.ellipsisCell.nativeElement;
    this.isOverflownElement = element.scrollWidth > element.clientWidth;
  }
}
