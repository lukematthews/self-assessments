import { Criteria, CriteriaAssessment, CriteriaAssessmentModel, CriteriaDefinitionModel } from "../model/Model";
import { format, parse } from "date-fns";
import express from "express";
import { Schema } from "mongoose";
import { AssessmentGroup, AssessmentUi } from "../model/ControllerTypes";

export async function getAssessmentList(req: express.Request, res: express.Response) {
  const assessments: CriteriaAssessment[] = await CriteriaAssessmentModel.find();
  const groupedAssessments = createGroupedAssessments(assessments);
  if (groupedAssessments.size === 0) {
    res.status(204).json({ message: "No items found" });
  } else {
    const data: {
      [k: string]: any;
    } = {};
    Array.from(groupedAssessments.keys()).forEach((key) => {
      data[key] = groupedAssessments.get(key);
    });
    res.json(data);
  }
}

function createCriteriaMap(criteria: Criteria[]) {
  const criteriaMap: Map<string, Criteria> = new Map();
  criteria.forEach((e) => criteriaMap.set(e._id.toString(), e));
  return criteriaMap;
}

function createGroupedAssessments(assessments: CriteriaAssessment[], criteriaMap?: Map<string, Criteria>): Map<string, AssessmentGroup | undefined> {
  const groupedAssessments: Map<string, AssessmentGroup | undefined> = new Map();
  assessments.forEach((assessment) => {
    const assessmentUi: AssessmentUi = {
      _id: assessment._id.toString(),
      criteriaId: assessment.criteria._id.toString(),
    };

    let formattedDate = format(assessment.assessmentDate, "yyyy-MM-dd");
    let assessmentGroup: AssessmentGroup | undefined = groupedAssessments.get(formattedDate);
    if (!assessmentGroup) {
      assessmentGroup = {
        assessmentDate: formattedDate,
        title: "",
        assessments: [assessmentUi],
      };
      groupedAssessments.set(formattedDate, assessmentGroup);
    } else {
      assessmentGroup.assessments.push(assessmentUi);
    }
    const titleSet = new Set<string>();
    if (criteriaMap) {
      assessmentGroup.assessments.forEach((a) => titleSet.add(criteriaMap.get(a.criteriaId)!.title));
    }
    assessmentGroup.title = Array.from(titleSet).join(", ");
  });
  return groupedAssessments;
}

export async function getAssessmentListWithContent(req: express.Request, res: express.Response) {
  const assessments: CriteriaAssessment[] = await CriteriaAssessmentModel.find();
  const assessmentMap: Map<string, CriteriaAssessment> = new Map();
  assessments.forEach((a) => assessmentMap.set(a._id.toString(), a));
  const groupedAssessments = createGroupedAssessments(assessments, createCriteriaMap(await CriteriaDefinitionModel.find()));
  groupedAssessments.forEach((group) => {
    group?.assessments?.forEach((a) => (a.value = assessmentMap.get(a._id.toString())?.value));
  });

  if (groupedAssessments.size === 0) {
    return res.status(204).json({ message: "No items found" });
  }
  const data: {
    [k: string]: any;
  } = {};
  Array.from(groupedAssessments.keys()).forEach((key) => {
    data[key] = groupedAssessments.get(key);
  });
  res.json(data);
}

export async function getAssessment(req: express.Request, res: express.Response) {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  let assessment: CriteriaAssessment | null = await CriteriaAssessmentModel.findOne<CriteriaAssessment>({
    _id: req.params.id,
  }).exec();

  if (!assessment) {
    return res.status(204).json({ message: `No assessment matches ID ${req.body.id}` });
  }
  const criteria: Criteria | null = await CriteriaDefinitionModel.findOne({
    _id: assessment.criteria._id,
  }).exec();
  if (criteria) {
    let renderedAssessment = {
      assessmentDate: assessment.assessmentDate,
      value: assessment.value,
      criteria: {
        formattedDescription: `***${criteria.title}*** ${criteria.description}`,
        title: criteria.title,
        description: criteria.description,
      },
    };
    res.json(renderedAssessment);
  }
}

export async function getAssessmentsForCriteria(req: express.Request, res: express.Response) {
  const assessments: CriteriaAssessment[] = await CriteriaAssessmentModel.find({
    criteria: req.params.id,
  });
  res.json(assessments);
}

export async function editAssessment(req: express.Request, res: express.Response) {
  const assessment: CriteriaAssessment | null = await CriteriaAssessmentModel.findById(req.params.id);
  // handle assessment not found!
  if (!assessment || assessment === null) return res.status(404).json("Could not find assessment with provided id");
  console.log(`assessmentDate: ${assessment.assessmentDate}`);
  const result: AssessmentUi = {
    _id: assessment._id.toString(),
    criteriaId: assessment.criteria._id.toString(),
    assessmentDate: format(assessment.assessmentDate, "yyyy-MM-dd"),
  };
  console.log(req.params);
  res.json(result);
}

export async function newAssessmentTemplate(req: express.Request, res: express.Response) {
  const refItems = await CriteriaDefinitionModel.find();
  res.json({ items: refItems });
}

export async function getAllCriteria(req: express.Request, res: express.Response) {
  let items: Criteria[] = await CriteriaDefinitionModel.find();
  items = items.map((item) => {
    return {
      formattedDescription: `***${item.title}*** ${item.description}`,
      title: item.title,
      description: item.description,
      _id: item._id,
    };
  });
  res.json(items);
}

export async function getCriteriaForName(req: express.Request, res: express.Response) {
  let criteria: Criteria | null = await CriteriaDefinitionModel.findOne({
    title: req.params.name,
  })
    .collation({ locale: "en", strength: 2 })
    .exec();
  if (criteria) {
    res.json({
      formattedDescription: `***${criteria.title}*** ${criteria.description}`,
      title: criteria.title,
      description: criteria.description,
      _id: criteria._id,
    });
  }
}

export async function getNavigationCriteria(req: express.Request, res: express.Response) {
  type NavigationStats = { _id: Schema.Types.ObjectId; assessmentCount: number; title?: string };
  let items: NavigationStats[] = await CriteriaAssessmentModel.aggregate([
    {
      $group: {
        _id: "$criteria",
        assessmentCount: {
          $sum: 1,
        },
      },
    },
  ]).exec();
  const criteriaMap = createCriteriaMap(await CriteriaDefinitionModel.find());
  items.forEach((c) => {
    c.title = criteriaMap.get(c._id.toString())!.title;
  });
  res.json(items);
}
