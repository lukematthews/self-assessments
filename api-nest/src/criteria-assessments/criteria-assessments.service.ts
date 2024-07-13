import { Inject, Injectable } from '@nestjs/common';
import { CreateCriteriaAssessmentDto } from './dto/create-criteria-assessment.dto';
import { UpdateCriteriaAssessmentDto } from './dto/update-criteria-assessment.dto';
import { CriteriaAssessment } from './interfaces/criteria-assessments.interface';
import { Model } from 'mongoose';
import { Criteria } from 'src/criterias/interfaces/criteria.interface';

@Injectable()
export class CriteriaAssessmentsService {
  constructor(
    @Inject('CRITERIA_ASSESSMENTS_MODEL')
    private criteriaAssessmentModel: Model<CriteriaAssessment>,
    @Inject('CRITERIA_MODEL')
    private criteriaModel: Model<Criteria>,
  ) {}

  async create(createCriteriaAssessmentDto: CreateCriteriaAssessmentDto) {
    const criteria = await this.criteriaModel
      .findById(createCriteriaAssessmentDto.criteriaId)
      .exec();
    const assessment = {
      criteria: criteria._id,
      value: createCriteriaAssessmentDto.value,
      assessmentDate: new Date(createCriteriaAssessmentDto.assessmentDate),
    };
    return this.criteriaAssessmentModel.create(assessment);
  }

  findAll() {
    return this.criteriaAssessmentModel
      .find()
      .sort({ assessmentDate: 'desc' })
      .exec();
  }

  findOne(id: string) {
    return this.criteriaAssessmentModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCriteriaAssessmentDto: UpdateCriteriaAssessmentDto,
  ) {
    return await this.criteriaAssessmentModel
      .findByIdAndUpdate(id, updateCriteriaAssessmentDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string) {
    return await this.criteriaAssessmentModel.findByIdAndDelete(id).exec();
  }
}
