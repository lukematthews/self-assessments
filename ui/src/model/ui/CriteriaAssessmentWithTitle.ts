import Criteria from "../Criteria";
import CriteriaAssessment from "../CriteriaAssessment";

export type CriteriaAssessmentWithTitle = {
    id: string,
    title: string,
    criteriaId: string,
    assessmentDate: string,
    value: string,
}

export type CriteriaAssessmentUI = CriteriaAssessment & { date: Date };
export type CriteriaUI = Criteria & { actionsVisible: boolean };
