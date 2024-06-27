import Criteria from "../Criteria";
import CriteriaAssessment from "../CriteriaAssessment";

export type NavigationCriteria = {
    _id: string,
    title: string,
    assessmentCount: number
}

export type CriteriaAssessmentUI = CriteriaAssessment & { date: Date };
export type CriteriaUI =  Criteria & { actionsVisible: boolean };
