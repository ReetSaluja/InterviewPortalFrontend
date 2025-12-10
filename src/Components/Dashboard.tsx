import './Dashboard.css';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { FiEdit2 } from 'react-icons/fi';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface Candidate {
  id: number;
  CandidateName: string;
  TotalExperience: string;
  SkillSet: string;
  CurrentOrganization: string;
  NoticePeriod: string;
  Feedback?: string;
  Remarks?: string;
  InterviewerId?: number;
  Interviewer?: string;
  ClientName?: string;
  ClientManagerName?: string;
}

function Dashboard() {

  let role:"admin"|"interviewer"|null=null;
  const storedUser=sessionStorage.getItem("user");
if(storedUser){
  try{
    const user=JSON.parse(storedUser);
    const serverRole=(user.role ||"").toString().toLowerCase();
    if(serverRole==="admin" || serverRole==="interviewer"){
      role=serverRole;
    }
  }catch(err){
    console.error("Error parsing user from sessionStorage:",err);
  }
}




  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit button cell renderer
  const EditButtonRenderer = useCallback((params: ICellRendererParams<Candidate>) => {
    const handleEdit = () => {
      if ((role === "admin" || role === "interviewer") && params.data) {
        // Navigate to AddInterview page with candidate data for editing
        navigate('/add-interview', { 
          state: { 
            candidate: params.data,
            isEdit: true,
            editMode: role === "interviewer" ? "interviewer" : "admin" // Track edit mode
          } 
        });
      }
    };

    // Show Edit button for both admin and interviewer roles
    if (role !== "admin" && role !== "interviewer") {
      return null;
    }

    return (
      <button 
        className="edit-btn"
        onClick={handleEdit}
        type="button"
        title={role === "interviewer" ? "Add Feedback" : "Edit candidate"}
      >
        <FiEdit2 />
        <span>Edit</span>
      </button>
    );
  }, [navigate, role]);

  // AG Grid Column Definitions
  const columnDefs = useMemo<ColDef<Candidate>[]>(() => [
    { 
      headerName: 'S.No', 
      field: 'id', 
      width: 100,
      minWidth: 80,
      sortable: true,
      filter: true,
    },
    { 
      headerName: 'Candidate Name', 
      field: 'CandidateName', 
      flex: 1,
      minWidth: 150,
      sortable: true,
      filter: false,
    },
    { 
      headerName: 'Experience', 
      field: 'TotalExperience', 
      width: 130,
      minWidth: 100,
      sortable: true,
      filter: true,
    },
    { 
      headerName: 'Technology', 
      field: 'SkillSet', 
      flex: 1,
      minWidth: 150,
      sortable: true,
      filter: true,
    },
    { 
      headerName: 'Notice Period', 
      field: 'NoticePeriod', 
      width: 140,
      minWidth: 120,
      sortable: true,
      filter: true,
    },
    { 
      headerName: 'Current Organization', 
      field: 'CurrentOrganization', 
      flex: 1,
      minWidth: 180,
      sortable: true,
      filter: true,
    },
    ...((role === "admin" || role === "interviewer") ? [{
      headerName: 'Action', 
      field: 'id',
      width: 100,
      minWidth: 80,
      sortable: false,
      filter: false,
      cellRenderer: EditButtonRenderer,
    }] : []),
  ], [EditButtonRenderer, role]);

  // Default column properties
  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  // Fetch candidates data
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/candidates/');
        setCandidates(response.data || []);
      } catch (err) {
        console.warn('Could not fetch candidates:', err);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Auto-size columns on grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Dashboard Actions */}
      <div className="dashboard-actions">
        <button 
          className="import-btn"
          onClick={() => console.log('Import Data')}
          type="button"
        >
          Import Data
        </button>
        <button 
          className="add-candidate-btn"
          onClick={() => navigate('/add-interview')}
          type="button"
        >
          + Add Candidate
        </button>
      </div>
      
      {/* AG Grid Table */}
      <div className="ag-grid-wrapper">
        <AgGridReact<Candidate>
          rowData={candidates}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          domLayout="autoHeight"
          loading={loading}
          onGridReady={onGridReady}
          rowSelection="single"
          animateRows={true}
          suppressCellFocus={true}
          overlayNoRowsTemplate="<span class='ag-overlay-no-rows'>No candidates found. Add some interviews to see them here.</span>"
        />
      </div>
    </div>
    
  );
}

export default Dashboard;
