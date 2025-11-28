import React, { useState } from "react";
import Labels, {
  candidateNameLabel,
  currentOrganizationLabel,
  skillSetLabel,
  totalExperienceLabel,
  noticePeriodLabel,
} from "./Constants";
import "./AddInterview.css";
import * as XLSX from "xlsx";

interface InterviewFormData {
  CandidateName: string;
  TotalExperience: string;
  SkillSet: string;
  CurrentOrganization: string;
  NoticePeriod: string;
}

function AddInterview() {
  //  state for one form entry
  const [formData, setFormData] = useState<InterviewFormData>({
    CandidateName: "",
    TotalExperience: "",
    SkillSet: "",
    CurrentOrganization: "",
    NoticePeriod: "",
  });

  // Saves an array of form submissions.
  const [allRows, setAllRows] = useState<InterviewFormData[]>([]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = (event: React.FormEvent) => {
    
    event.preventDefault();

    // add current form to array.Creates a new array that includes previous data + newly filled formData.
    const newRows = [...allRows, formData];
    setAllRows(newRows);

    // create Excel from all rows
    const worksheet = XLSX.utils.json_to_sheet(newRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "interview-data.xlsx"); //  correct extension

    // clear the form
    setFormData({
      CandidateName: "",
      TotalExperience: "",
      SkillSet: "",
      CurrentOrganization: "",
      NoticePeriod: "",
    });

    console.log("Form Submitted");
  };

  

  return (
    <form className="form-box" onSubmit={handleSave}>
      <div className="form-row">
        <Labels text={candidateNameLabel} />
        <input
          name="CandidateName"
          value={formData.CandidateName}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <Labels text={totalExperienceLabel} />
        <input
          name="TotalExperience"
          value={formData.TotalExperience}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <Labels text={skillSetLabel} />
        <input
          name="SkillSet"
          value={formData.SkillSet}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <Labels text={currentOrganizationLabel} />
        <input
          name="CurrentOrganization"
          value={formData.CurrentOrganization}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <Labels text={noticePeriodLabel} />
        <select
          name="NoticePeriod"
          value={formData.NoticePeriod}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Immediate">Immediate</option>
          <option value="15 Days">15 Days</option>
          <option value="30 Days">30 Days</option>
          <option value="60 Days">60 Days</option>
          <option value="90 Days">90 Days</option>
        </select>
      </div>

      <div className="btn-box">
        <button type="submit">Save</button>
        <button type="button">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddInterview;
