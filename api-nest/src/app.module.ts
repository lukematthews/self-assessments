import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CriteriaAssessmentsModule } from './criteria-assessments/criteria-assessments.module';
import { DatabaseModule } from './database/database.module';
import { CriteriasModule } from './criterias/criterias.module';
import { UiController } from './ui/ui.controller';
import { UiService } from './ui/ui.service';

@Module({
  imports: [
    CriteriaAssessmentsModule,
    DatabaseModule,
    CriteriasModule,
    CriteriaAssessmentsModule,
  ],
  controllers: [AppController, UiController],
  providers: [AppService, UiService],
})
export class AppModule {}
