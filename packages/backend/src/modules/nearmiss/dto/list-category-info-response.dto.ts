import { ApiPropertyOptional } from "@nestjs/swagger";
import { CategoryInfo } from "./category-info";

/** 分類情報一覧取得APIレスポンス */
export class ListCategoryResponseDTO {
  /** 分類リスト */
  @ApiPropertyOptional({
    description: "分類リスト",
    type: () => [CategoryInfo],
  })
  categories: CategoryInfo[];
}
