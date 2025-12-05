import React, { useEffect, useState } from "react";
import axios from  "axios";
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
import {ToastContainer,toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";




interface InterviewFormData {
  CandidateName: string;
  TotalExperience: string;
  SkillSet: string;
  CurrentOrganization: string;
  NoticePeriod: string;
  Interviewer:string;
  Feedback:string;
  Remarks:string;
}


interface Interviewers{
  id:number;
  InterviewerName:string;
  PrimarySkill:string;
  Proficiency:string;

}
/* type = Tell TypeScript what shape the data should have.Partial<T> makes all fields optional.It extracts the keys of that interface as strings: */
type InterviewFormErrors=Partial<Record<keyof InterviewFormData,string>>;


function AddInterview() {




  const [interviewers,setInterviewers]=useState<Interviewers[]>([]);
  useEffect(()=>{
    const LoadInterviewers=async()=>{
      try{
        const res=await axios.get("http://127.0.0.1:8000/interviewers/")
        setInterviewers(res.data);
      }catch(error){
        console.error("Error loading Interviewers",error)
      }
    };
    LoadInterviewers();
  },[]);




  //  state for one form entry
  const [formData, setFormData] = useState<InterviewFormData>({
    CandidateName: "",
    TotalExperience: "",
    SkillSet: "",
    CurrentOrganization: "",
    NoticePeriod: "",
    Interviewer:"",
    Feedback: "",
    Remarks:"",
  });

  


/*errors – stores which fields are invalid and their messages*/
  const[errors,setErrors]=useState<InterviewFormErrors>({});



    const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev)=>({ /*setFormData updates the state.

(prev) is the previous formData.

...prev copies all existing fields.

[name]: value updates only that one field.*/
      ...prev,
      [name]: value,
    }));
    setErrors((prev)=>({
      ...prev,
      [name]:"",/* Copy all previous errors (...prev) Set [name] to an empty string  so that {errors[name]} becomes false and the red text disappears.*/
    }));
  };
  

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const  newErrors:InterviewFormErrors={}/*Create an empty object to collect validation errors on this submit */



      if(!formData.CandidateName.trim()){
        newErrors.CandidateName=" Please Enter Candidate Name";
        
      }
      if(!formData.TotalExperience.trim()){
        newErrors.TotalExperience="Please Enter Total Experience"
      }
      if(!formData.SkillSet.trim()){
        newErrors.SkillSet=" Please Enter SkillSet "
       
      }
      if(!formData.CurrentOrganization.trim()){
        newErrors.CurrentOrganization="Please Enter Current Organization"
       
      }
      
      
      
      
      if(!formData.NoticePeriod.trim()){
        newErrors.NoticePeriod="Please Select Notice Period"
       
      }

      if(!formData.Interviewer.trim()){
        newErrors.Interviewer="Please Select Interviewer"

      }


      if(!formData.Feedback.trim()){
        newErrors.Feedback="Please Select Feedback"
      }
      if(!formData.Remarks.trim()){
        newErrors.Remarks="Please Enter Remarks"

      }


      if(Object.keys(newErrors).length>0){
        setErrors(newErrors);
        return;
      }/*Object.keys(newErrors) gives an array of fields that have errors.

If there is at least one (length > 0):

setErrors(newErrors) → show errors on screen.

return; → stop here, do not call the API.*/
       

       try {
        // remove Interviewer from the object before sending
      const { Interviewer, ...payload } = formData;
      const response = await axios.post("http://127.0.0.1:8000/candidates/", payload);
      console.log("Saved", response.data);
       toast.success("Form Submitted");

      

      
      setFormData({
        CandidateName: "",
        TotalExperience: "",
        SkillSet: "",
        CurrentOrganization: "",
        NoticePeriod: "",
        Interviewer:"",
        Feedback:"",
        Remarks:"",
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
        <Labels text={candidateNameLabel} required/>
        <input
          name="CandidateName" /*this MUST match your formData*/
          value={formData.CandidateName}
          onChange={handleChange}
          className={errors.CandidateName ? "error-input":""} /*If errors.CandidateName has something (like "Required"), class is "error-input" (red border). Else, class is empty string.*/
          
        />
      </div>
      {errors.CandidateName &&(
        <p className="error-text">{errors.CandidateName}</p>
      )} 





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
      {errors.TotalExperience &&(
        <p className="error-text">{errors.TotalExperience}</p>
      )}





      <div className="form-row">
        <Labels text={skillSetLabel} required/>
        <input
          name="SkillSet"
          value={formData.SkillSet}
          onChange={handleChange}
          className={errors.SkillSet ? "error-input":""}
          
        />
      </div>
      {errors.SkillSet &&(
        <p className="error-text">{errors.SkillSet}</p>
      )}






      <div className="form-row">
        <Labels text={currentOrganizationLabel} required />
        <input
          name="CurrentOrganization"
          value={formData.CurrentOrganization}
          onChange={handleChange}
          className={errors.CurrentOrganization ? "error-input" :""}
          
        />
      </div>
      {errors.CurrentOrganization&&(
        <p className="error-text">{errors.CurrentOrganization}</p>
      )}




      <div className="form-row">
        <Labels text={noticePeriodLabel} required />
        <select
          name="NoticePeriod"
          value={formData.NoticePeriod}
          onChange={handleChange}
          className={errors.NoticePeriod ? "error-input" :""}
          
        >
          <option value="" disabled>Select</option>
          <option value="Immediate">Immediate</option>
          <option value="15 Days">15 Days</option>
          <option value="30 Days">30 Days</option>
          <option value="60 Days">60 Days</option>
          <option value="90 Days">90 Days</option>
          
        </select>
        
      </div>
      {errors.NoticePeriod &&(
        <p className="error-text">{errors.NoticePeriod}</p>
      )}


      <div className="form-row">
        <Labels text={InterviewerLabel} required />
        <select
          name="Interviewer"
          value={formData.Interviewer}
          onChange={handleChange}
          className={errors.Interviewer ? "error-input" :""}
          >
            <option value="" disabled>Select</option>

            {interviewers.map((iv)=>(
              // .map() loops through each interviewer and creates an <option> for it.
            <option key={iv.id} value={iv.id.toString()}>
              {iv.InterviewerName}
            </option>
          /*React requires a unique key for lists.
          iv.id is the unique ID of each interviewer.
          This is the dropdown value that gets stored in your form.*/
          ))}
            </select>
           </div>
          
           {errors.Interviewer &&(
            <p className="error-text">{errors.Interviewer}</p>
          )}
        









      <div className="form-row">
        <Labels text={FeedbackLabel} required/>
        <select
        name="Feedback"
        value={formData.Feedback}
        onChange={handleChange}
        className={errors.Feedback ? "error-input" :""}>
          <option value="" disabled>Select</option>
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
      {errors.Remarks &&(
        <p className="error-text">{errors.Remarks}</p>
      )}
          

  

      <div className="btn-box">
        <button type="submit">Save</button>
        <button type="button">
          Cancel
        </button>
      </div>
      
    </form>
    <ToastContainer position="top-center" autoClose={2000} />

    
    
    </>
  );
}

export default AddInterview;
