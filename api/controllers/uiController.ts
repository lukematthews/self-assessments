import { Criteria, CriteriaAssessment, CriteriaAssessmentModel, CriteriaDefinitionModel } from "../model/Model";
import { format } from "date-fns";
import { RequestHandler } from "express";
import { Schema } from "mongoose";
import { AssessmentGroup, AssessmentUi } from "../model/ControllerTypes";
import { v4 as uuidv4 } from "uuid";

export const getAssessmentList: RequestHandler = async (req, res) => {
  const assessments: CriteriaAssessment[] = await CriteriaAssessmentModel.find();

  const groupedAssessments: Map<string, AssessmentGroup | undefined> = createGroupedAssessments(assessments, createCriteriaMap(await CriteriaDefinitionModel.find()));
  if (!groupedAssessments || groupedAssessments.size === 0) {
    res.status(204).json({ message: "No items found" });
  } else {
    let groupArray: (AssessmentGroup | undefined)[] = Array.from(groupedAssessments.values());
    groupArray?.forEach((group: AssessmentGroup | undefined) => (group!._id = uuidv4()));
    res.json(groupArray);
  }
};

function createCriteriaMap(criteria: Criteria[]): Map<string, Criteria> {
  const criteriaMap: Map<string, Criteria> = new Map();
  criteria.forEach((e) => criteriaMap.set(e._id.toString(), e));
  return criteriaMap;
}

function createGroupedAssessments(assessments: CriteriaAssessment[], criteriaMap?: Map<string, Criteria>): Map<string, AssessmentGroup | undefined> {
  const groupedAssessments: Map<string, AssessmentGroup | undefined> = new Map();
  assessments.forEach((assessment) => {
    const assessmentUi: AssessmentUi = {
      _id: assessment._id.toString(),
      criteriaId: assessment.criteria?._id.toString(),
      title: criteriaMap?.get(assessment.criteria?._id.toString())?.title,
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
      assessmentGroup.assessments.forEach((a) => {
        if (a.criteriaId && criteriaMap.get(a.criteriaId)) {
          titleSet.add(criteriaMap.get(a.criteriaId)!.title);
        }
      });
    }
    assessmentGroup.title = Array.from(titleSet).join(", ");
  });
  return groupedAssessments;
}

export const getAssessmentListWithContent: RequestHandler = async (req, res) => {
  const assessments: CriteriaAssessment[] = await CriteriaAssessmentModel.find();
  const assessmentMap: Map<string, CriteriaAssessment> = new Map();
  assessments.forEach((a) => assessmentMap.set(a._id.toString(), a));
  const groupedAssessments = createGroupedAssessments(assessments, createCriteriaMap(await CriteriaDefinitionModel.find()));
  groupedAssessments.forEach((group) => {
    group?.assessments?.forEach((a) => {
      a.value = assessmentMap.get(a._id.toString())?.value;
    });
  });

  if (groupedAssessments.size === 0) {
    return res.status(204).json({ message: "No items found" });
  }
  res.json(Array.from(groupedAssessments.values()));
};

export const getAssessment: RequestHandler<{id: string}> = async (req, res) => {
  if (!req.params.id) {
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
};

export const getAssessmentsForCriteria: RequestHandler<{id: string}> = async (req, res) => {
  const assessments: CriteriaAssessment[] = await CriteriaAssessmentModel.find({
    criteria: req.params.id,
  });
  res.json(assessments);
};

export const editAssessment: RequestHandler<{id: string}> = async (req, res) => {
  const assessment: CriteriaAssessment | null = await CriteriaAssessmentModel.findById(req.params.id);
  // handle assessment not found!
  if (!assessment || assessment === null) return res.status(404).json("Could not find assessment with provided id");
  console.log(`assessmentDate: ${assessment.assessmentDate}`);
  const result: AssessmentUi = {
    _id: assessment._id.toString(),
    criteriaId: assessment.criteria?._id.toString(),
    assessmentDate: format(assessment.assessmentDate, "yyyy-MM-dd"),
  };
  console.log(req.params);
  res.json(result);
};

export const newAssessmentTemplate: RequestHandler = async (req, res) => {
  const refItems = await CriteriaDefinitionModel.find();
  res.json({ items: refItems });
};

export const getAllCriteria: RequestHandler = async (req, res) => {
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
};

export const getCriteriaForName: RequestHandler<{name: string}> = async (req, res) => {
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
};

export const getNavigationCriteria: RequestHandler = async (req, res) => {
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
    if (c._id) {
      c.title = criteriaMap.get(c._id.toString())!.title;
    }
  });
  res.json(items);
};
