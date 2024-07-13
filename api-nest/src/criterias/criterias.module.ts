import { Module } from '@nestjs/common';
import { CriteriasService } from './criterias.service';
import { CriteriasController } from './criterias.controller';
import { DatabaseModule } from 'src/database/database.module';
import { criteriasProviders } from './criterias.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CriteriasController],
  providers: [CriteriasService, ...criteriasProviders],
  exports: [...criteriasProviders],
})
export class CriteriasModule {}
