import { Inject, Injectable } from '@nestjs/common';
import { CreateCriteriaDto } from './dto/create-criteria.dto';
import { UpdateCriteriaDto } from './dto/update-criteria.dto';
import { Criteria } from './interfaces/criteria.interface';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CriteriasService {
  constructor(
    @Inject('CRITERIA_MODEL')
    private criteriaModel: Model<Criteria>,
  ) {}

  create(createCriteriaDto: CreateCriteriaDto) {
    const newCriteria = this.criteriaModel.create({
      _id: new mongoose.Types.ObjectId(),
      ...createCriteriaDto,
    });
    return newCriteria;
  }

  findAll() {
    return this.criteriaModel.find();
  }

  findOne(id: string) {
    return this.criteriaModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateCriteriaDto: UpdateCriteriaDto) {
    return await this.criteriaModel
      .findByIdAndUpdate(id, updateCriteriaDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string) {
    return await this.criteriaModel.findByIdAndDelete(id).exec();
  }
}
