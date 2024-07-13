import { Test, TestingModule } from '@nestjs/testing';
import { CriteriaAssessmentsController } from './criteria-assessments.controller';
import { CriteriaAssessmentsService } from './criteria-assessments.service';

describe('CriteriaAssessmentsController', () => {
  let controller: CriteriaAssessmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CriteriaAssessmentsController],
      providers: [CriteriaAssessmentsService],
    }).compile();

    controller = module.get<CriteriaAssessmentsController>(
      CriteriaAssessmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
