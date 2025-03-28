import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NearmissComponent } from "../nearmiss/nearmiss.component";

export const routes: Routes = [{ path: "", component: NearmissComponent, title: "ニアミス属性情報一覧" }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
