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
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
  const columnDefs = useMemo<ColDef<Candidate>[]>(() => {
    // Base columns visible to all users
    const baseColumns: ColDef<Candidate>[] = [
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
    ];

    // Additional columns for admin only
    const adminOnlyColumns: ColDef<Candidate>[] = [
      { 
        headerName: 'Interviewer', 
        field: 'Interviewer', 
        flex: 1,
        minWidth: 150,
        sortable: true,
        filter: true,
      },
      { 
        headerName: 'Client Name', 
        field: 'ClientName', 
        flex: 1,
        minWidth: 150,
        sortable: true,
        filter: true,
      },
      { 
        headerName: 'Client Manager', 
        field: 'ClientManagerName', 
        flex: 1,
        minWidth: 150,
        sortable: true,
        filter: true,
      },
    ];

    // Feedback and Remarks columns for both admin and interviewer
    const feedbackColumns: ColDef<Candidate>[] = [
      { 
        headerName: 'Feedback', 
        field: 'Feedback', 
        flex: 1,
        minWidth: 150,
        sortable: true,
        filter: true,
      },
      { 
        headerName: 'Remarks', 
        field: 'Remarks', 
        flex: 1,
        minWidth: 150,
        sortable: true,
        filter: true,
      },
    ];

    // Action column for admin and interviewer
    const actionColumn: ColDef<Candidate>[] = (role === "admin" || role === "interviewer") ? [{
      headerName: 'Action', 
      field: 'id' as const,
      width: 100,
      minWidth: 80,
      sortable: false,
      filter: false,
      cellRenderer: EditButtonRenderer,
    }] : [];

    // Build columns based on role
    if (role === "admin") {
      // Admin sees all columns
      return [...baseColumns, ...adminOnlyColumns, ...feedbackColumns, ...actionColumn];
    } else if (role === "interviewer") {
      // Interviewer sees base columns + feedback/remarks
      return [...baseColumns, ...feedbackColumns, ...actionColumn];
    } else {
      // Other users see only base columns
      return baseColumns;
    }
  }, [EditButtonRenderer, role]);

  // Default column properties
  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  // Fetch candidates data with pagination
  const fetchCandidates = useCallback(async (skip: number, limit: number) => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/candidates/paginated', {
        params: { skip, limit }
      });
      
      // Backend returns { candidates: [...], totalcount: X }
      const { candidates: candidatesData, totalcount } = response.data;
      setCandidates(candidatesData || []);
      setTotalRecords(totalcount || 0);
    } catch (err) {
      console.warn('Could not fetch candidates:', err);
      setCandidates([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch paginated data when page or pageSize changes
  useEffect(() => {
    const skip = currentPage * pageSize;
    fetchCandidates(skip, pageSize);
  }, [currentPage, pageSize, fetchCandidates]);

  // Auto-size columns on grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  // Calculate pagination info
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = totalRecords > 0 ? currentPage * pageSize + 1 : 0;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalRecords);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(0);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(0, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages - 1);
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

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
        {role === "admin" && (
          <button 
            className="add-candidate-btn"
            onClick={() => navigate('/add-interview')}
            type="button"
          >
            + Add Candidate
          </button>
        )}
      </div>
      
      {/* AG Grid Table */}
      <div className="ag-grid-wrapper">
        <AgGridReact<Candidate>
          rowData={candidates}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          domLayout="autoHeight"
          loading={loading}
          onGridReady={onGridReady}
          rowSelection="single"
          animateRows={true}
          suppressCellFocus={true}
          overlayNoRowsTemplate="<span class='ag-overlay-no-rows'>No candidates found. Add some interviews to see them here.</span>"
        />
      </div>

      {/* Custom Pagination Controls */}
      <div className="pagination-controls">
        <div className="pagination-info">
          <span>Rows per page:</span>
          <select 
            value={pageSize} 
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="page-size-selector"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="record-info">
            {startRecord} - {endRecord} of {totalRecords}
          </span>
        </div>
        <div className="pagination-buttons">
          <button 
            onClick={goToFirstPage} 
            disabled={currentPage === 0 || loading}
            className="pagination-btn"
            title="First Page"
          >
            ⟪
          </button>
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 0 || loading}
            className="pagination-btn"
            title="Previous Page"
          >
            ⟨
          </button>
          <span className="page-indicator">
            Page {totalPages > 0 ? currentPage + 1 : 0} of {totalPages}
          </span>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages - 1 || loading}
            className="pagination-btn"
            title="Next Page"
          >
            ⟩
          </button>
          <button 
            onClick={goToLastPage} 
            disabled={currentPage >= totalPages - 1 || loading}
            className="pagination-btn"
            title="Last Page"
          >
            ⟫
          </button>
        </div>
      </div>
    </div>
    
  );
}

export default Dashboard;
