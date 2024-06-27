import Criteria from "./Criteria";
import { format, parseISO } from "date-fns";

export default class CriteriaAssessment {
  _id: string;
  assessmentDate: string;
  value: string;
  criteria: Criteria;

  constructor(
    _id: string,
    assessmentDate: string,
    value: string,
    criteria: Criteria
  ) {
    this._id = _id;
    this.assessmentDate = assessmentDate;
    this.value = value;
    this.criteria = criteria;
  }

  static FormatDate(dateString: string, pattern?: string) {
    if (typeof pattern === "undefined") {
        pattern = "PPPP";
    }
    return format(parseISO(dateString), pattern);
  }
}
