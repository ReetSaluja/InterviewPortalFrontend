import React, { useEffect, useState } from "react";
import axios from "axios";
import Labels, {
  candidateNameLabel,
  currentOrganizationLabel,
  skillSetLabel,
  totalExperienceLabel,
  noticePeriodLabel,
  InterviewerLabel,
  FeedbackLabel,
  RemarksLable,
  ClientManagerNameLabel,
  ClientNameLabel,
} from "./Constants";
import "./AddInterview.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";



interface InterviewFormData {
  CandidateName: string;
  TotalExperience: string;
  SkillSet: string;
  CurrentOrganization: string;
  NoticePeriod: string;
  Interviewer: string;
  Feedback: string;
  Remarks: string;
  ClientName:string;
  ClientManagerName:string;
}



interface Interviewers {
  id: number;
  InterviewerName: string;
  PrimarySkill: string;
  Proficiency: number;
}


 /*Errors object can contain some fields (not all).Each field holds a string (the error message) */
type InterviewFormErrors = Partial<Record<keyof InterviewFormData, string>>;



function AddInterview() { /*at the moment we declare the variable role TypeScript has NO IDEA yet:whether the user is logged in ,So if we remove null, TypeScript will throw an erro*/
  let role: "admin" | "interviewer" | null = null; 
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);/*storedUser is a JSON.This converts it into a JavaScript object.*/
      const serverRole = (user.role || "").toString().toLowerCase();/*if role doesn't exist, use an empty string. converts to sting just in case*/   
      if (serverRole === "admin" || serverRole === "interviewer") {
        role = serverRole;
      }
    } catch (error) {
      console.error("Error parsing user from sessionStorage", error);
    }
  }

  const navigate=useNavigate();
  const [interviewers, setInterviewers] = useState<Interviewers[]>([]);/* interviewers list -initially an empty array*/

  useEffect(() => {
    const LoadInterviewers = async () => {/*asynchronous (it returns a promise)*/
      try {
        const res = await axios.get("http://127.0.0.1:8000/interviewers/");
        setInterviewers(res.data);
      } catch (error) {
        console.error("Error loading Interviewers", error);
      }
    };
    LoadInterviewers();
  }, []);/*empty dependency array means this effect runs only once when the component loads*/

  // ------------ form data ------------
  const [formData, setFormData] = useState<InterviewFormData>({
    CandidateName: "",
    TotalExperience: "",
    SkillSet: "",
    CurrentOrganization: "",
    NoticePeriod: "",
    Interviewer: "",
    Feedback: "",
    Remarks: "",
    ClientName:"",
    ClientManagerName:"",


  });

  // ------------ errors ------------
  const [errors, setErrors] = useState<InterviewFormErrors>({});

  const handleChange = (
    event: React.ChangeEvent< /*it handles changes from input, select, textarea*/
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target; /*extract name anf value from the event target*/

    setFormData((prev) => ({
      ...prev, /*React keeps the old values using: ...prev*/
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "", /*clear the error message for this field*/
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); /*Stops the browser from doing its default form submission (page reload)*/
    const newErrors: InterviewFormErrors = {};

    if (!formData.CandidateName.trim()) {
      newErrors.CandidateName = " Please Enter Candidate Name";
    }
    if (!formData.TotalExperience.trim()) {
      newErrors.TotalExperience = "Please Enter Total Experience";
    }
    if (!formData.SkillSet.trim()) {
      newErrors.SkillSet = " Please Enter SkillSet ";
    }
    if (!formData.CurrentOrganization.trim()) {
      newErrors.CurrentOrganization = "Please Enter Current Organization";
    }
    if (!formData.NoticePeriod.trim()) {
      newErrors.NoticePeriod = "Please Select Notice Period";
    }

    // role-based validation
    if (role === "admin") {
      if (!formData.Interviewer.trim()) {
        newErrors.Interviewer = "Please Select Interviewer";
      }
    }
    if(!formData.ClientName.trim()){
      newErrors.ClientName="Please Select Client Name";
    }
    if(!formData.ClientManagerName.trim()){
      newErrors.ClientManagerName="Please Enter Client Manager Name";
    }

    if (role === "interviewer") {
      if (!formData.Feedback.trim()) {
        newErrors.Feedback = "Please Select Feedback";
      }
      if (!formData.Remarks.trim()) {
        newErrors.Remarks = "Please Enter Remarks";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload={
        ...formData,
        InterviewerId:formData.Interviewer ? Number(formData.Interviewer):null,
      };
      await axios.post("http://127.0.0.1:8000/candidates/", payload);

      
      
      console.log("Saved", payload);
      toast.success("Form Submitted");

      setFormData({
        CandidateName: "",
        TotalExperience: "",
        SkillSet: "",
        CurrentOrganization: "",
        NoticePeriod: "",
        Interviewer: "",
        Feedback: "",
        Remarks: "",
        ClientName:"",
        ClientManagerName:"",
      });
      setErrors({});
    } catch (err) {
      toast.error("Error saving candidate");
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="Page_Heading">Add Candidate</h1>
      <form className="form-box" onSubmit={handleSave}>
        
        {/* Candidate Name */}
        <div className="form-row">
          <Labels text={candidateNameLabel} required />
          <input
            name="CandidateName"
            value={formData.CandidateName}
            onChange={handleChange}
            readOnly={role === "interviewer"}

            className={errors.CandidateName ? "error-input" : ""}
          />
        </div>
        {errors.CandidateName && (
          <p className="error-text">{errors.CandidateName}</p>
        )}

        {/* Total Experience */}
        <div className="form-row">
          <Labels text={totalExperienceLabel} required />
          <input
            type="number"
            name="TotalExperience"
            value={formData.TotalExperience}
            onChange={handleChange}
            readOnly={role === "interviewer"}
            className={errors.TotalExperience ? "error-input" : ""}
          />
        </div>
        {errors.TotalExperience && (
          <p className="error-text">{errors.TotalExperience}</p>
        )}

        {/* Skill Set */}
        <div className="form-row">
          <Labels text={skillSetLabel} required />
          <input
            name="SkillSet"
            value={formData.SkillSet}
            onChange={handleChange}
            readOnly={role === "interviewer"}
            className={errors.SkillSet ? "error-input" : ""}
          />
        </div>
        {errors.SkillSet && <p className="error-text">{errors.SkillSet}</p>}

        {/* Current Org */}
        <div className="form-row">
          <Labels text={currentOrganizationLabel} required />
          <input
            name="CurrentOrganization"
            value={formData.CurrentOrganization}
            onChange={handleChange}
            readOnly={role === "interviewer"}
            className={errors.CurrentOrganization ? "error-input" : ""}
          />
        </div>
        {errors.CurrentOrganization && (
          <p className="error-text">{errors.CurrentOrganization}</p>
        )}

        {/* Notice Period */}
        <div className="form-row">
          <Labels text={noticePeriodLabel} required />
          <select
            name="NoticePeriod"
            value={formData.NoticePeriod}
            onChange={handleChange}
            disabled={role === "interviewer"}
            className={errors.NoticePeriod ? "error-input" : ""}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Immediate">Immediate</option>
            <option value="15 Days">15 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="60 Days">60 Days</option>
            <option value="90 Days">90 Days</option>
          </select>
        </div>
        {errors.NoticePeriod && (
          <p className="error-text">{errors.NoticePeriod}</p>
        )}

        {/* Interviewer dropdown (ONLY admin) */}
        {role === "admin" && (
          <>
            <div className="form-row">
              <Labels text={InterviewerLabel} required />
              <select
                name="Interviewer"
                value={formData.Interviewer}
                onChange={handleChange}
                className={errors.Interviewer ? "error-input" : ""}
              >
                <option value="" disabled>
                  Select
                </option>
                {interviewers.map((iv) => (
                  <option key={iv.id} value={iv.id.toString()}>
                    {iv.InterviewerName}
                  </option>
                ))}
              </select>
            </div>
            {errors.Interviewer && (
              <p className="error-text">{errors.Interviewer}</p>
            )}
          </>
        )}



        <div className="form-row">
        <Labels text={ClientNameLabel} required />
        <select
        name="ClientName"
        value={formData.ClientName}
        onChange={handleChange}
        className={errors.ClientName ? "error-input": ""}
        >
          <option value="" disabled>Select</option>
          <option value="Fidelity">Fidelity</option>
          <option value="Airbus">Airbus</option>
          <option value="Google">Google</option>
          <option value="Amazon">Amazon</option>  
          <option value="Microsoft">Microsoft</option>
        </select>
        </div>
        {errors.ClientName && (
        <p className="error-text">{errors.ClientName}</p>)}

        <div className="form-row">
          <Labels text={ClientManagerNameLabel} required />
          <input
            name="ClientManagerName"
            value={formData.ClientManagerName}
            onChange={handleChange}
            className={errors.ClientManagerName ? "error-input" : ""}
          />
        </div>
        {errors.ClientManagerName && (
          <p className="error-text">{errors.ClientManagerName}</p>
        )}
      


        {/* Feedback + Remarks (ONLY interviewer) */}
        {role === "interviewer" && (
          <>
            <div className="form-row">
              <Labels text={FeedbackLabel} required />
              <select
                name="Feedback"
                value={formData.Feedback}
                onChange={handleChange}
                className={errors.Feedback ? "error-input" : ""}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            {errors.Feedback && (
              <p className="error-text">{errors.Feedback}</p>
            )}

            <div className="form-row">
              <Labels text={RemarksLable} required />
              <textarea
                name="Remarks"
                value={formData.Remarks}
                onChange={handleChange}
                rows={4}
                cols={80}
                className={errors.Remarks ? "error-input" : ""}
              />
            </div>
            {errors.Remarks && (
              <p className="error-text">{errors.Remarks}</p>
            )}
          </>
        )}

        {/* BUTTONS */}
        <div className="btn-box">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/dashboard")}>Cancel</button>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default AddInterview;
