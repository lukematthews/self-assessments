import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { criteriaAssessmentsProviders } from './criteria-assessments.providers';
import { CriteriaAssessmentsController } from './criteria-assessments.controller';
import { CriteriaAssessmentsService } from './criteria-assessments.service';
import { CriteriasModule } from 'src/criterias/criterias.module';

@Module({
  imports: [DatabaseModule, CriteriasModule],
  controllers: [CriteriaAssessmentsController],
  providers: [CriteriaAssessmentsService, ...criteriaAssessmentsProviders],
  exports: [...criteriaAssessmentsProviders],
})
export class CriteriaAssessmentsModule {}
