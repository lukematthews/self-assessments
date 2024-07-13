/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCriteriaAssessmentDto } from './create-criteria-assessment.dto';

export class UpdateCriteriaAssessmentDto extends PartialType(CreateCriteriaAssessmentDto) {}
