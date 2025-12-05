import React from "react";

export const candidateNameLabel = "Candidate Name";
export const totalExperienceLabel = "Total Experience";
export const skillSetLabel = "Skill Set";
export const currentOrganizationLabel = "Current Organization";
export const noticePeriodLabel = "Notice Period";
export const InterviewerLabel="Interviewer"
export const FeedbackLabel="Feedback"
export const RemarksLable="Remarks"

type LabelProps={
    text:string;
    required:boolean;
}

function Labels({text,required}:LabelProps){
return (
<label className="field-Lable">
    {text}
    {required &&<span className="required-star">*</span>}
    
    </label>);
}
export default Labels;

export const tableHeaders = {
  sno: 'Sno',
  candidateName: 'Candidate name',
  experience: 'Experience',
  technology: 'Technology',
  noticePeriod: 'Notice period',
  currentOrganization: 'Current organization',
};


