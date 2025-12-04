import React from "react";
import { useNavigate } from "react-router-dom";

function Blankpage(){

    const navigate = useNavigate();
    return(
        <>

    <h1>This is blank page</h1>
    <div className="btn-box">
        <button type="button" onClick={()=>navigate("/add-interview")}>
             Add Candidate
            </button>
    </div>
    </>
    )
    
}
export default Blankpage;