import { Test, TestingModule } from '@nestjs/testing';
import { CriteriaAssessmentsService } from './criteria-assessments.service';

describe('CriteriaAssessmentsService', () => {
  let service: CriteriaAssessmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CriteriaAssessmentsService],
    }).compile();

    service = module.get<CriteriaAssessmentsService>(
      CriteriaAssessmentsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
