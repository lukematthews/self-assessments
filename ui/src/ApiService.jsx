import axios from "axios";
import { format } from "date-fns";

export const FetchTemplate = async (setTemplate) => {
  await axios.get("/ui/new").then((response) => {
    setTemplate({
      title: "A new assessment",
      assessmentDate: format(new Date(), "yyyy-MM-dd"),
      ...response.data,
    });
  });
};

export const FetchAssessment = async (id, setAssessment) => {
  if (!id) {
    return;
  }
  return axios.get(`/ui/assessment/${id}`).then((response) => {
    setAssessment(response.data);
    return response.data;
  });
};

export const FetchCriteria = async (name, setCriteria) => {
  return axios.get(`/ui/criteria/${name}`).then((response) => {
    setCriteria(response.data);
    return response.data;
  });
}

export const FetchAssessmentsForCriteria = async (id, setAssessments) => {
  return axios.get(`/ui/assessments/criteria/${id}`).then((response) => {
    setAssessments(response.data);
    return response.data;
  });
}

export const CreateNewAssessment = (event, successCallback, errorCallback) => {
  let newAssessment = { ...event };
  axios.post("/api/", newAssessment).then((response) => {
    successCallback(response);
  }).catch((error) => {
    if (errorCallback) {
      errorCallback(error);
    }
  });
};

export const DeleteAssessment = async (id, successCallback) => {
  await axios.delete(`/api`, { data: { id: id } }).then((response) => {
    successCallback ? successCallback() : "";
  });
};

export const UpdateAssessment = (event, successCallback) => {
  let newAssessment = { ...event };
  axios.put("/api/", newAssessment).then((response) => {
    if (successCallback) {
      successCallback();
    }
  });
};

export const FetchAllAssessments = async (setAssessments) => {
  return axios.get("/ui/list").then((response) => {
    setAssessments(response.data.map(item => item));
    return response.data
  });
};

export const FetchAllAssessmentsWithValues = async (setAssessments) => {
  return axios.get("/ui/list-with-values").then((response) => {
    setAssessments(response.data.map(item => item));
    return response.data
  });
};

export const FetchNavigation = async (setCriteria) => {
  return axios.get("/ui/navigation").then((response) => {
    setCriteria(response.data.map(item => item));
    return response.data
  });
};

export async function FetchCriteriaDescriptions(setCriteriaDescriptions, errorCallback) {
  await axios.get("/ui/criteria")
    .then((response) => setCriteriaDescriptions(response.data))
    .catch((error) => {
      setCriteriaDescriptions([]);
      if (errorCallback) {
        errorCallback(error);
      }
    });
}
