import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { Model, Schema } from 'mongoose';
import { CriteriaAssessment } from 'src/criteria-assessments/interfaces/criteria-assessments.interface';
import { Criteria } from 'src/criterias/interfaces/criteria.interface';
import { v4 as uuidv4 } from 'uuid';

export type AssessmentGroup = {
  _id?: string;
  assessmentDate: string;
  title: string;
  assessments: AssessmentUi[];
};

export type AssessmentUi = {
  _id: string;
  assessmentDate?: string;
  title?: string;
  criteriaId: string;
  value?: string;
};

@Injectable()
export class UiService {
  constructor(
    @Inject('CRITERIA_ASSESSMENTS_MODEL')
    private criteriaAssessmentModel: Model<CriteriaAssessment>,
    @Inject('CRITERIA_MODEL')
    private criteriaModel: Model<Criteria>,
  ) {}

  async getList(includeValues: boolean) {
    const assessments: CriteriaAssessment[] =
      await this.criteriaAssessmentModel.find();
    const assessmentMap: Map<string, CriteriaAssessment> = new Map();
    assessments.forEach((a) => assessmentMap.set(a._id.toString(), a));

    const groupedAssessments: Map<string, AssessmentGroup | undefined> =
      this.createGroupedAssessments(
        assessments,
        this.createCriteriaMap(await this.criteriaModel.find()),
      );
    if (!groupedAssessments || groupedAssessments.size === 0) {
      return [];
    } else {
      const groupArray: (AssessmentGroup | undefined)[] = Array.from(
        groupedAssessments.values(),
      );
      groupArray?.forEach((group: AssessmentGroup | undefined) => {
        group!._id = uuidv4();
        if (includeValues) {
          group?.assessments?.forEach((a) => {
            a.value = assessmentMap.get(a._id.toString())?.value;
          });
        }
      });
      return groupArray;
    }
  }

  createCriteriaMap(criteria: Criteria[]): Map<string, Criteria> {
    const criteriaMap: Map<string, Criteria> = new Map();
    criteria.forEach((e) => criteriaMap.set(e._id.toString(), e));
    return criteriaMap;
  }

  createGroupedAssessments(
    assessments: CriteriaAssessment[],
    criteriaMap?: Map<string, Criteria>,
  ): Map<string, AssessmentGroup | undefined> {
    const groupedAssessments: Map<string, AssessmentGroup | undefined> =
      new Map();
    assessments.forEach((assessment) => {
      const assessmentUi: AssessmentUi = {
        _id: assessment._id.toString(),
        criteriaId: assessment.criteria?._id.toString(),
        title: criteriaMap?.get(assessment.criteria?._id.toString())?.title,
      };
      const formattedDate = format(assessment.assessmentDate, 'yyyy-MM-dd');
      let assessmentGroup: AssessmentGroup | undefined =
        groupedAssessments.get(formattedDate);
      if (!assessmentGroup) {
        assessmentGroup = {
          assessmentDate: formattedDate,
          title: '',
          assessments: [assessmentUi],
        };
        groupedAssessments.set(formattedDate, assessmentGroup);
      } else {
        assessmentGroup.assessments.push(assessmentUi);
      }
      const titleSet = new Set<string>();
      if (criteriaMap) {
        assessmentGroup.assessments.forEach((a) => {
          if (a.criteriaId && criteriaMap.get(a.criteriaId)) {
            titleSet.add(criteriaMap.get(a.criteriaId)!.title);
          }
        });
      }
      assessmentGroup.title = Array.from(titleSet).join(', ');
    });
    return groupedAssessments;
  }

  async getAssessmentForEdit(id: string) {
    const assessment: CriteriaAssessment | null =
      await this.criteriaAssessmentModel.findById(id);
    // handle assessment not found!
    if (!assessment || assessment === null)
      throw new NotFoundException('Could not find assessment with provided id');
    console.log(`assessmentDate: ${assessment.assessmentDate}`);
    const result: AssessmentUi = {
      _id: assessment._id.toString(),
      criteriaId: assessment.criteria?._id.toString(),
      assessmentDate: format(assessment.assessmentDate, 'yyyy-MM-dd'),
    };
    return result;
  }

  async getAssessment(id: string) {
    const assessment: CriteriaAssessment | null =
      await this.criteriaAssessmentModel
        .findOne<CriteriaAssessment>({
          _id: id,
        })
        .exec();

    if (!assessment) {
      return null;
    }
    const criteria: Criteria | null = await this.criteriaModel
      .findOne({
        _id: assessment.criteria._id,
      })
      .exec();
    if (criteria) {
      const renderedAssessment = {
        assessmentDate: assessment.assessmentDate,
        value: assessment.value,
        criteria: {
          formattedDescription: `***${criteria.title}*** ${criteria.description}`,
          title: criteria.title,
          description: criteria.description,
        },
      };
      return renderedAssessment;
    }
  }

  async getCriteria() {
    return (await this.criteriaModel.find()).map((item) => {
      return {
        formattedDescription: `***${item.title}*** ${item.description}`,
        title: item.title,
        description: item.description,
        _id: item._id,
      };
    });
  }

  async getCriteriaForName(name: string) {
    const criteria: Criteria | null = await this.criteriaModel
      .findOne({
        title: name,
      })
      .collation({ locale: 'en', strength: 2 })
      .exec();
    if (criteria) {
      return {
        formattedDescription: `***${criteria.title}*** ${criteria.description}`,
        title: criteria.title,
        description: criteria.description,
        _id: criteria._id,
      };
    }
    throw new NotFoundException('No criteria found for name');
  }

  async getAssessmentsForCriteria(id: string) {
    return await this.criteriaAssessmentModel.find({
      criteria: id,
    });
  }

  async navigation() {
    type NavigationStats = {
      _id: Schema.Types.ObjectId;
      assessmentCount: number;
      title?: string;
    };
    const items: NavigationStats[] = await this.criteriaAssessmentModel
      .aggregate([
        {
          $group: {
            _id: '$criteria',
            assessmentCount: {
              $sum: 1,
            },
          },
        },
      ])
      .exec();
    const criteriaMap = this.createCriteriaMap(await this.criteriaModel.find());
    items.forEach((c) => {
      if (c._id) {
        c.title = criteriaMap.get(c._id.toString())!.title;
      }
    });
    items
      .filter((c) => c._id)
      .forEach((c) => {
        c.title = criteriaMap.get(c._id.toString())!.title;
      });
    return items;
  }

  async getNavigation() {
    type NavigationStats = {
      _id: string;
      assessmentCount: number;
      title?: string;
    };
    const assessments = await this.criteriaAssessmentModel.find();
    const criteria = (await this.criteriaModel.find()) as Criteria[];

    const itemMap = new Map<string, NavigationStats>();
    criteria.forEach((c) => {
      itemMap.set(c._id.toString(), {
        _id: c._id.toString(),
        assessmentCount: 0,
        title: c.title,
      });
    });
    assessments.forEach((a) => {
      itemMap.get(a.criteria._id.toString()).assessmentCount++;
    });
    console.log(itemMap.values());
    return Array.from(itemMap.values());
  }
}
