import React, { useState } from "react";
import axios from  "axios";
import Labels, {
  candidateNameLabel,
  currentOrganizationLabel,
  skillSetLabel,
  totalExperienceLabel,
  noticePeriodLabel,
} from "./Constants";
import "./AddInterview.css";
import {toast,ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";



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




  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();



      if(!formData.CandidateName.trim()){
        toast.error("Candidate Name Missing");
        return;
      }
      if(!formData.TotalExperience.trim()){
        toast.error("Total Experience Missing")
        return;
      }
      if(!formData.SkillSet.trim()){
        toast.error("Please enter Skills")
        return;
      }
      if(!formData.CurrentOrganization.trim()){
        toast.error("Current Organization Missing")
        return;
      }
      
      
      
      
      if(!formData.NoticePeriod.trim()){
        toast.error("Please Select Notice Period")
        return;
      }



      
          try {
      const response = await axios.post("http://127.0.0.1:8000/candidates/", formData);
      console.log("Saved", response.data);
       toast.success("Form Submitted");

      

      
      setFormData({
        CandidateName: "",
        TotalExperience: "",
        SkillSet: "",
        CurrentOrganization: "",
        NoticePeriod: "",
      });

      
    } catch (err) {
      toast.error("Error saving candidate");
      console.error(err);
    }
  };

  

  return (
    <>
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
        type="number"
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
          <option value="" disabled>Select</option>
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
    <ToastContainer position="top-center" autoClose={3000}/>
    </>
  );
}

export default AddInterview;
