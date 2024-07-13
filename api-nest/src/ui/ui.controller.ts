import { Controller, Get, Injectable, Param, Res } from '@nestjs/common';
import { UiService } from './ui.service';

@Controller('ui')
@Injectable()
export class UiController {
  constructor(private readonly uiService: UiService) {}

  @Get('/list')
  getList() {
    return this.uiService.getList(false);
  }

  @Get('/list-with-values')
  getListWithValues() {
    return this.uiService.getList(true);
  }

  @Get('/edit/:id')
  getAssessmentForEdit(@Param('id') id: string) {
    return this.uiService.getAssessmentForEdit(id);
  }

  @Get('/assessment/:id')
  getAssessment(@Param('id') id: string) {
    return this.uiService.getAssessment(id);
  }

  @Get('/criteria')
  getCriteria() {
    return this.uiService.getCriteria();
  }

  @Get('/criteria/:name')
  getCriteriaForName(@Param('name') name: string) {
    return this.uiService.getCriteriaForName(name);
  }

  @Get('/assessments/criteria/:id')
  getAssessmentsForCriteria(@Param('id') id: string) {
    return this.uiService.getAssessmentsForCriteria(id);
  }

  @Get('/navigation')
  getNavigation() {
    return this.uiService.getNavigation();
  }
}
