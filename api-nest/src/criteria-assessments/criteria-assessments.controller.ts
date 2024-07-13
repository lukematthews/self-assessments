import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CriteriaAssessmentsService } from './criteria-assessments.service';
import { CreateCriteriaAssessmentDto } from './dto/create-criteria-assessment.dto';
import { UpdateCriteriaAssessmentDto } from './dto/update-criteria-assessment.dto';

@Controller('api')
export class CriteriaAssessmentsController {
  constructor(
    private readonly criteriaAssessmentsService: CriteriaAssessmentsService,
  ) {}

  @Post()
  create(@Body() createCriteriaAssessmentDto: CreateCriteriaAssessmentDto) {
    return this.criteriaAssessmentsService.create(createCriteriaAssessmentDto);
  }

  @Get()
  findAll() {
    return this.criteriaAssessmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criteriaAssessmentsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCriteriaAssessmentDto: UpdateCriteriaAssessmentDto,
  ) {
    return this.criteriaAssessmentsService.update(
      id,
      updateCriteriaAssessmentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criteriaAssessmentsService.remove(id);
  }
}
