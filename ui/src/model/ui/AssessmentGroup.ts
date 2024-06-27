export type AssessmentWithTitle = { id: string; title: string; criteriaId: string; value: string };

export type AssessmentGroup = {
  id: number;
  assessmentDate: string;
  title: string;
  assessments: AssessmentWithTitle[];
};
