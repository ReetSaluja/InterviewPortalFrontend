import React from "react";

type LabelProps={
    text:string;
}; /*Labels component expects one prop:*/
export const candidateNameLabel = "Candidate Name";
export const totalExperienceLabel = "Total Experience";
export const skillSetLabel = "Skill Set";
export const currentOrganizationLabel = "Current Organization";
export const noticePeriodLabel = "Notice Period";

function Labels({text}:LabelProps){
return <label className="field-Lable">{text}</label>;
}
export default Labels;

