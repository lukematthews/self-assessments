export type AssessmentWithTitle = { _id: string; title: string; criteriaId: string; value: string };

export type AssessmentGroup = {
  _id: number;
  id?: string;
  assessmentDate: string;
  title: string;
  assessments: AssessmentWithTitle[];
};
