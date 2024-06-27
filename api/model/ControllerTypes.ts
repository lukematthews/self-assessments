export type AssessmentGroup = {
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

export type AssessmentPostRequest = {
  criteriaId: string;
  assessmentDate: string;
  value: string;
};

export type CreateCriteriaRequest = {
  title: string;
  description: string;
}