import { Component, HostListener, OnInit } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";

@Component({
  selector: "app-root",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  constructor(private readonly primengConfig: PrimeNGConfig) {}

  ngOnInit() {}
}
