import axios from "axios";
import { format } from "date-fns";
import CriteriaAssessment from "./model/CriteriaAssessment";
import Criteria from "./model/Criteria";
import { AssessmentGroup } from "./model/ui/AssessmentGroup";
import { CriteriaAssessmentUpdateRequest } from "./model/ui/CriteriaAssessmentUpdateRequest";
import { NavigationCriteria } from "./model/ui/DisplayTypes";

export class ApiService {
  async FetchTemplate(setTemplate: (assessment: CriteriaAssessment) => void) {
    await axios.get("/ui/new").then((response) => {
      setTemplate({
        title: "A new assessment",
        assessmentDate: format(new Date(), "yyyy-MM-dd"),
        ...response.data,
      });
    });
  }

  static FetchAssessment(id: string, setAssessment: (assessment: CriteriaAssessment) => void) {
    if (!id) {
      return;
    }
    return axios.get(`/ui/assessment/${id}`).then((response) => {
      setAssessment(response.data);
      return response.data;
    });
  }

  static async FetchCriteria(name: string, setCriteria: (criteria: Criteria) => void) {
    const response = await axios.get(`/ui/criteria/${name}`);
    setCriteria(response.data);
    return response.data;
  }

  static async FetchAssessmentsForCriteria(id: string, setAssessments: (assessments: CriteriaAssessment[]) => void) {
    const response = await axios.get(`/ui/assessments/criteria/${id}`);
    setAssessments(response.data);
    return response.data;
  }

  static CreateNewAssessment(event: CriteriaAssessment, successCallback: (assessment: CriteriaAssessment) => void, errorCallback: (error: Error) => void) {
    const newAssessment = { ...event };
    axios
      .post<CriteriaAssessment>("/api/", newAssessment)
      .then((response) => {
        successCallback(response.data);
      })
      .catch((error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      });
    return newAssessment;
  }

  static DeleteAssessment(id: string, successCallback: () => void) {
    axios.delete<CriteriaAssessment>(`/api`, { data: { id: id } }).then(() => {
      successCallback ? successCallback() : "";
    });
  }

  static UpdateAssessment(event: CriteriaAssessmentUpdateRequest, successCallback: () => void) {
    const newAssessment = { ...event };
    axios.put<CriteriaAssessmentUpdateRequest>("/api/", newAssessment).then(() => {
      if (successCallback) {
        successCallback();
      }
    });
  }

  static async fetchAllAssessments() {
    return await axios.get<AssessmentGroup[]>("/ui/list");
  }

  static async fetchAllAssessmentsWithValues(setAssessments: (assessments: AssessmentGroup[]) => void) {
    const response = await axios.get<AssessmentGroup[]>("/ui/list-with-values");
    setAssessments(response.data.map((item) => item));
    return response.data;
  }

  static async FetchNavigation(setCriteria: (criteria: NavigationCriteria[]) => void, errorCallback: (error: string) => void) {
    const response = await axios
      .get<NavigationCriteria[]>("/ui/navigation")
      .then((response) => {
        setCriteria(response.data.map((item) => item));
      })
      .catch((error) => {
        errorCallback(error);
      });
    return response;
  }

  static fetchCriteriaDescriptions(setCriteriaDescriptions: (criteria: Criteria[]) => void, errorCallback: (error: Error) => void) {
    axios
      .get("/ui/criteria")
      .then((response) => setCriteriaDescriptions(response.data))
      .catch((error) => {
        setCriteriaDescriptions([]);
        if (errorCallback) {
          errorCallback(error);
        }
      });
  }
}
