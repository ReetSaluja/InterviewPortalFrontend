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
  ResumeLabel
} from "./Constants";
import "./AddInterview.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";



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
  Resume:File|null;
  ResumePath:string
}



interface Interviewers {
  id: number;
  InterviewerName: string;
  PrimarySkill: string;
  Proficiency: string;
}


 /*Errors object can contain some fields (not all).Each field holds a string (the error message) */
type InterviewFormErrors = Partial<Record<keyof InterviewFormData, string>>;



function AddInterview() { 
 
 
  /*at the moment we declare the variable role TypeScript has NO IDEA yet:whether the user is logged in ,So if we remove null, TypeScript will throw an erro*/
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
  const location = useLocation();
  const [interviewers, setInterviewers] = useState<Interviewers[]>([]);/* interviewers list -initially an empty array*/
  
  // Check if we're in edit mode
  const editCandidate = location.state?.candidate;
  const isEditMode = location.state?.isEdit && editCandidate;
  const editMode = location.state?.editMode; // "admin" or "interviewer"
  const candidateId = editCandidate?.id;
  const isInterviewerEditMode = isEditMode && editMode === "interviewer";
  const returnToPage = location.state?.returnToPage ?? 0; // Page to return to after edit

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
    Resume:null,
    ResumePath:""
  });

  // ------------ errors ------------
  const [errors, setErrors] = useState<InterviewFormErrors>({});

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

  // Fetch full candidate details if in edit mode
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (isEditMode && candidateId) {
        try {
          // Fetch full candidate details including InterviewerId and ClientName
          const response = await axios.get(`http://127.0.0.1:8000/candidates/${candidateId}`);
          const candidate = response.data;
          
          // Populate form with candidate data
          setFormData({
            CandidateName: candidate.CandidateName || "",
            TotalExperience: candidate.TotalExperience || "",
            SkillSet: candidate.SkillSet || "",
            CurrentOrganization: candidate.CurrentOrganization || "",
            NoticePeriod: candidate.NoticePeriod || "",
            Interviewer: candidate.InterviewerId?.toString() || candidate.Interviewer || "",
            Feedback: candidate.Feedback || "",
            Remarks: candidate.Remarks || "",
            ClientName: candidate.ClientName || "",
            ClientManagerName: candidate.ClientManagerName || "",
            Resume:null,
            ResumePath:candidate.ResumePath||"",
          });
        } catch (error: unknown) {
          console.error("Error fetching candidate details:", error);
          // If GET fails, try using the data passed from Dashboard as fallback
          if (editCandidate) {
            setFormData({
              CandidateName: editCandidate.CandidateName || "",
              TotalExperience: editCandidate.TotalExperience || "",
              SkillSet: editCandidate.SkillSet || "",
              CurrentOrganization: editCandidate.CurrentOrganization || "",
              NoticePeriod: editCandidate.NoticePeriod || "",
              Interviewer: editCandidate.InterviewerId?.toString() || editCandidate.Interviewer || "",
              Feedback: editCandidate.Feedback || "",
              Remarks: editCandidate.Remarks || "",
              ClientName: editCandidate.ClientName || "",
              ClientManagerName: editCandidate.ClientManagerName || "",
              Resume:null,
              ResumePath:editCandidate.ResumePath||"",
            });
          }
          // Only show error if we don't have fallback data
          if (!editCandidate) {
            toast.error("Error loading candidate details. Please try again.");
          }
        }
      }
    };
    
    fetchCandidateDetails();
  }, [isEditMode, candidateId, editCandidate]);

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
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;

  setFormData((prev) => ({
    ...prev,
    Resume: file,
    ResumePath:""
  }));

  setErrors((prev) => ({
    ...prev,
    Resume: "",
  }));
};



  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); /*Stops the browser from doing its default form submission (page reload)*/
    const newErrors: InterviewFormErrors = {};

    // If interviewer is editing, only validate Feedback and Remarks
    if (isInterviewerEditMode) {
      if (!formData.Feedback.trim()) {
        newErrors.Feedback = "Please Select Feedback";
      }
      if (!formData.Remarks.trim()) {
        newErrors.Remarks = "Please Enter Remarks";
      }
    } else {
      // Regular validation for admin or new candidate creation
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
      if(!isEditMode && !formData.Resume){
        newErrors.Resume="Please Upload Resume";
      }
      
      if (role === "interviewer") {
        if (!formData.Feedback.trim()) {
          newErrors.Feedback = "Please Select Feedback";
        }
        if (!formData.Remarks.trim()) {
          newErrors.Remarks = "Please Enter Remarks";
        }
      
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let payload;
      
      if (isInterviewerEditMode) {
        // For interviewer edit mode, only send Feedback and Remarks
        payload = {
          Feedback: formData.Feedback,
          Remarks: formData.Remarks,
        };
      } else {
        // For admin edit or new candidate, send all fields
        payload = {
          ...formData,
          InterviewerId: formData.Interviewer ? Number(formData.Interviewer) : null,
        };
      }
      
      if (isEditMode && candidateId) {
        // Update existing candidate using PUT
        await axios.put(`http://127.0.0.1:8000/candidates/${candidateId}`, payload);
        toast.success(isInterviewerEditMode ? "Feedback Updated Successfully" : "Candidate Updated Successfully");
      } else {
        // Create new candidate using POST
        const submitDta=new FormData();
        submitDta.append("CandidateName",formData.CandidateName);
        submitDta.append("TotalExperience",formData.TotalExperience);
        submitDta.append("SkillSet",formData.SkillSet);
        submitDta.append("CurrentOrganization",formData.CurrentOrganization);
        submitDta.append("NoticePeriod",formData.NoticePeriod);
        submitDta.append("InterviewerId",formData.Interviewer);
        submitDta.append("ClientName",formData.ClientName);
        submitDta.append("ClientManagerName",formData.ClientManagerName);


        if(formData.Interviewer){
          submitDta.append("InterviewerId",formData.Interviewer);
        }
         
        if(formData.Feedback){
          submitDta.append("Feedback",formData.Feedback); 

        }
        if(formData.Remarks){
          submitDta.append("Remarks",formData.Remarks);
        }
        if(formData.Resume){
          submitDta.append("resume",formData.Resume,formData.Resume.name);
        }





        await axios.post("http://127.0.0.1:8000/candidates/", submitDta,{
        headers:{"Content-Type":"multipart/form-data"},
       });
         toast.success("Form Submitted");
      }

      
      
      console.log("Saved", payload);
      
      // Reset form only if not in edit mode (stay on page for edit)
      if (!isEditMode) {
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
          Resume:null,
          ResumePath:""
        });
      }
      setErrors({});
      
      // Navigate back to dashboard after save with page info
      navigate("/dashboard", {
        state: {
          returnToPage: isEditMode ? returnToPage : undefined,
          action: isEditMode ? "edited" : "added",
        },
      });
    } catch (err) {
      toast.error(isEditMode ? "Error updating candidate" : "Error saving candidate");
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="Page_Heading">
        {isInterviewerEditMode 
          ? "Add Feedback" 
          : isEditMode 
          ? "Edit Candidate" 
          : "Add Candidate"}
      </h1>
      <form className="form-box" onSubmit={handleSave}>
        
        {/* Candidate Name */}
        <div className="form-row">
          <Labels text={candidateNameLabel} required={!isInterviewerEditMode} />
          <div className="input-wrapper">
            <input
              name="CandidateName"
              value={formData.CandidateName}
              onChange={handleChange}
              readOnly={role === "interviewer" || isInterviewerEditMode}
              className={errors.CandidateName ? "error-input" : ""}
            />
            {errors.CandidateName && (
              <p className="error-text">{errors.CandidateName}</p>
            )}
          </div>
        </div>

        {/* Total Experience */}
        <div className="form-row">
          <Labels text={totalExperienceLabel} required={!isInterviewerEditMode} />
          <div className="input-wrapper">
            <input
              type="number"
              name="TotalExperience"
              value={formData.TotalExperience}
              onChange={handleChange}
              readOnly={role === "interviewer" || isInterviewerEditMode}
              className={errors.TotalExperience ? "error-input" : ""}
            />
            {errors.TotalExperience && (
              <p className="error-text">{errors.TotalExperience}</p>
            )}
          </div>
        </div>

        {/* Skill Set */}
        <div className="form-row">
          <Labels text={skillSetLabel} required={!isInterviewerEditMode} />
          <div className="input-wrapper">
            <input
              name="SkillSet"
              value={formData.SkillSet}
              onChange={handleChange}
              readOnly={role === "interviewer" || isInterviewerEditMode}
              className={errors.SkillSet ? "error-input" : ""}
            />
            {errors.SkillSet && <p className="error-text">{errors.SkillSet}</p>}
          </div>
        </div>

        {/* Current Org */}
        <div className="form-row">
          <Labels text={currentOrganizationLabel} required={!isInterviewerEditMode} />
          <div className="input-wrapper">
            <input
              name="CurrentOrganization"
              value={formData.CurrentOrganization}
              onChange={handleChange}
              readOnly={role === "interviewer" || isInterviewerEditMode}
              className={errors.CurrentOrganization ? "error-input" : ""}
            />
            {errors.CurrentOrganization && (
              <p className="error-text">{errors.CurrentOrganization}</p>
            )}
          </div>
        </div>

        {/* Notice Period */}
        <div className="form-row">
          <Labels text={noticePeriodLabel} required={!isInterviewerEditMode} />
          <div className="input-wrapper">
            <select
              name="NoticePeriod"
              value={formData.NoticePeriod}
              onChange={handleChange}
              disabled={role === "interviewer" || isInterviewerEditMode}
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
            {errors.NoticePeriod && (
              <p className="error-text">{errors.NoticePeriod}</p>
            )}
          </div>
        </div>

        {/* Interviewer dropdown (ONLY admin, hidden when interviewer is editing) */}
        {role === "admin" && !isInterviewerEditMode && (
          <div className="form-row">
            <Labels text={InterviewerLabel} required />
            <div className="input-wrapper">
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
              {errors.Interviewer && (
                <p className="error-text">{errors.Interviewer}</p>
              )}
            </div>
          </div>
        )}

 {role === "admin" && !isInterviewerEditMode && (
    <div className="form-row">
      <Labels text={ResumeLabel} required />
      <div className="input-wrapper">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={handleResumeChange}
          className={errors.Resume ? "error-input" : ""}
        />

        {/* Show existing resume name only when editing AND when a path exists */}
        {isEditMode && formData.ResumePath && (() => {
          const normalizedPath = formData.ResumePath.replace(/\\/g, "/");
          const fileUrl = `http://127.0.0.1:8000/${normalizedPath}`;

          return (
            <a href={fileUrl} className="existing-resume" target="_blank" rel="noopener noreferrer">
              {normalizedPath.split("/").pop()}
            </a>
          );
        })()}

        {errors.Resume && (
          <p className="error-text">{errors.Resume}</p>
        )}
      </div>
    </div>
  )}

  {/* Show resume for interviewer in edit mode as downloadable link */}
  {isInterviewerEditMode && formData.ResumePath && (() => {
    const normalizedPath = formData.ResumePath.replace(/\\/g, "/");
    const fileUrl = `http://127.0.0.1:8000/${normalizedPath}`;
    const fileName = normalizedPath.split("/").pop() || "Resume";
   
    return (
      <div className="form-row">
        <Labels text={ResumeLabel} required={false} />
        <div className="input-wrapper">
          <input
            type="text"
            value={fileName}
            className="resume-input-like"
            onClick={() => window.open(fileUrl, "_blank", "noopener,noreferrer")}
            title="Click to open resume"
          />
        </div>
      </div>
    );
  })()}

        <div className="form-row">
          <Labels text={ClientNameLabel} required={!isInterviewerEditMode} />
          <div className="input-wrapper">
            <select
              name="ClientName"
              value={formData.ClientName}
              onChange={handleChange}
              disabled={isInterviewerEditMode}
              className={errors.ClientName ? "error-input": ""}
            >
              <option value="" disabled>Select</option>
              <option value="Fidelity">Fidelity</option>
              <option value="Airbus">Airbus</option>
              <option value="Google">Google</option>
              <option value="Amazon">Amazon</option>  
              <option value="Microsoft">Microsoft</option>
            </select>
            {errors.ClientName && (
              <p className="error-text">{errors.ClientName}</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <Labels text={ClientManagerNameLabel} required={!isInterviewerEditMode} />
          <div className="input-wrapper">
            <input
              name="ClientManagerName"
              value={formData.ClientManagerName}
              onChange={handleChange}
              readOnly={isInterviewerEditMode}
              className={errors.ClientManagerName ? "error-input" : ""}
            />
            {errors.ClientManagerName && (
              <p className="error-text">{errors.ClientManagerName}</p>
            )}
          </div>
        </div>
      
        {/* Feedback + Remarks - Always show when interviewer role OR when interviewer is editing */}
        {(role === "interviewer" || isInterviewerEditMode) && (
          <>
            <div className="form-row">
              <Labels text={FeedbackLabel} required />
              <div className="input-wrapper">
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
                {errors.Feedback && (
                  <p className="error-text">{errors.Feedback}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <Labels text={RemarksLable} required />
              <div className="input-wrapper">
                <textarea
                  name="Remarks"
                  value={formData.Remarks}
                  onChange={handleChange}
                  rows={4}
                  cols={80}
                  className={errors.Remarks ? "error-input" : ""}
                />
                {errors.Remarks && (
                  <p className="error-text">{errors.Remarks}</p>
                )}
              </div>
            </div>
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
