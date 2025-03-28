import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ImportService } from "./import.service";

@ApiTags("import")
@Controller()
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  // local-debug用
  @Get("test")
  test() {
    this.importService.handleS3Event(null);
  }
}
