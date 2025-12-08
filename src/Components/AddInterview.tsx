import React, { use, useEffect, useState } from "react";
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
}

interface Interviewers {
  id: number;
  InterviewerName: string;
  PrimarySkill: string;
  Proficiency: number;
}
 /*Errors object can contain some fields (not all)

    Each field holds a string (the error message) */
type InterviewFormErrors = Partial<Record<keyof InterviewFormData, string>>;

function AddInterview() {
  /*at the moment we declare the variable role
TypeScript has NO IDEA yet:
whether the user is logged in 
So if we remove null, TypeScript will throw an erro*/
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

  // ------------ interviewers list ------------
  const [interviewers, setInterviewers] = useState<Interviewers[]>([]);/*initially an empty array*/

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
  });

  // ------------ errors ------------
  const [errors, setErrors] = useState<InterviewFormErrors>({});

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
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
      const { Interviewer, ...payload } = formData;

      const response = await axios.post(
        "http://127.0.0.1:8000/candidates/",
        payload
      );
      console.log("Saved", response.data);
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
