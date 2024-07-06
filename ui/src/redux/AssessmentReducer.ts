import { createSlice } from '@reduxjs/toolkit'
import CriteriaAssessment from '../model/CriteriaAssessment';

export enum ModificationAction { MODIFIED, ADDED, DELETED};
export enum EditState { EDITING, SAVED};

export interface AssessmentModificationProps {
  assessment:CriteriaAssessment;
  currentAssessment:CriteriaAssessment;
  modified:CriteriaAssessment;
  modifcationAction:ModificationAction;
  editState:EditState
}

export const assessmentFocusSlice = createSlice({
  name: 'assessment',
  initialState: {
    assessment: null,
    currentAssessment: null,
    modified: null,
    modificationAction: null,
    editState: null
  },
  reducers: {
    setCurrentAssessment(state, action) {
      state.assessment = action.payload
    },
    setLastModifiedAssessment(state, action) {
      state.modified = action.payload.assessment;
      state.modificationAction = action.payload.action;
    },
    setModifiedAssessment(state, action) {
      state.modified = {...action.payload.assessment};
      state.modificationAction = action.payload.modifcationAction;
    },
    setEditState(state, action) {
      state.editState = action.payload.editState;
    }
  }
});

export const { setCurrentAssessment, setLastModifiedAssessment, setModifiedAssessment } = assessmentFocusSlice.actions;
export default assessmentFocusSlice.reducer;