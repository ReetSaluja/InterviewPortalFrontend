import "./Dashboard.css";
import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import { FiEdit2 } from "react-icons/fi";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

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
  ResumePath?: string;
}

function Dashboard() {
  /*  role based on sessionStorage */
  let role: "admin" | "interviewer" | null = null;
  const storedUser = sessionStorage.getItem("user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const serverRole = (user.role || "").toString().toLowerCase();
      if (serverRole === "admin" || serverRole === "interviewer") {
        role = serverRole;
      }
    } catch (err) {
      console.error("Error parsing user from sessionStorage:", err);
    }
  }

  const navigate = useNavigate();

  /* grid + pagination state */
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const fileInputRef = useRef<HTMLInputElement | null>(null);/* ref for hidden file input inside export button (Excel upload) */
  const [importing, setImporting] = useState(false);  /* importing loader state (disable button + show "Importing...") */
  


  const handleImportClick = () => { /*click handler that opens the hidden file selector */
    fileInputRef.current?.click(); // triggers hidden <input type="file">
  };

  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => { /* read excel -> convert to JSON -> send to backend */
    const file = e.target.files?.[0];
    if (!file) return;                                                        //  select first file,if user cancels file selection

    try {
      setImporting(true); // show loader
      const buffer = await file.arrayBuffer();  /* Read file content */
      const workbook = XLSX.read(buffer, { type: "array" }); /* Parse workbook */
      const sheet = workbook.Sheets[workbook.SheetNames[0]];/* Pick first sheet */
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });/* Convert rows to JSON objects.Column headers in Excel become keys in JSON objects */

       /* Build payload for backend.Excel headers MUST match DB fields (same spelling) */
        const payload = rows.map((r) => ({
        CandidateName: r.CandidateName,
        TotalExperience: r.TotalExperience,
        SkillSet: r.SkillSet,
        CurrentOrganization: r.CurrentOrganization,
        NoticePeriod: r.NoticePeriod,
        Feedback: r.Feedback,
        Remarks: r.Remarks,
        ClientName: r.ClientName,
        ClientManagerName: r.ClientManagerName,
        InterviewerId: r.InterviewerId ? Number(r.InterviewerId) : null, /* Excel numeric cells may come as string/float -> convert to number */
        ResumePath: r.ResumePath, 
      }));

      
      await axios.post("http://127.0.0.1:8000/candidates/import", payload);
      await fetchCandidates(currentPage * pageSize, pageSize);  /* Refresh grid after import */
      toast.success("Candidates imported successfully");
      

    } catch (err) {
      console.error(err);
      toast.error("Failed to import Candidates");
     

    } finally {
      setImporting(false);
     e.target.value = "";  /* Reset input value so you can upload the same file again */
    }
  };

  // Edit button cell renderer 
  const EditButtonRenderer = useCallback(
    (params: ICellRendererParams<Candidate>) => {
      const handleEdit = () => {
        if ((role === "admin" || role === "interviewer") && params.data) {
          navigate("/add-interview", {
            state: {
              candidate: params.data,
              isEdit: true,
              editMode: role === "interviewer" ? "interviewer" : "admin",
            },
          });
        }
      };

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
    },
    [navigate, role]
  );

  // Column defs 
  const columnDefs = useMemo<ColDef<Candidate>[]>(() => {
    const baseColumns: ColDef<Candidate>[] = [
      { headerName: "S.No", field: "id", width: 100, minWidth: 80, sortable: true, filter: true },
      { headerName: "Candidate Name", field: "CandidateName", flex: 1, minWidth: 150, sortable: true, filter: false },
      { headerName: "Experience", field: "TotalExperience", width: 130, minWidth: 100, sortable: true, filter: true },
      { headerName: "Technology", field: "SkillSet", flex: 1, minWidth: 150, sortable: true, filter: true },
      { headerName: "Notice Period", field: "NoticePeriod", width: 140, minWidth: 120, sortable: true, filter: true },
      { headerName: "Current Organization", field: "CurrentOrganization", flex: 1, minWidth: 180, sortable: true, filter: true },
    ];

    const adminOnlyColumns: ColDef<Candidate>[] = [
      { headerName: "Interviewer", field: "Interviewer", flex: 1, minWidth: 150, sortable: true, filter: true },
      { headerName: "Client Name", field: "ClientName", flex: 1, minWidth: 150, sortable: true, filter: true },
      { headerName: "Client Manager", field: "ClientManagerName", flex: 1, minWidth: 150, sortable: true, filter: true },
    ];

    const feedbackColumns: ColDef<Candidate>[] = [
      { headerName: "Feedback", field: "Feedback", flex: 1, minWidth: 150, sortable: true, filter: true },
      { headerName: "Remarks", field: "Remarks", flex: 1, minWidth: 150, sortable: true, filter: true },
    ];

    const actionColumn: ColDef<Candidate>[] =
      role === "admin" || role === "interviewer"
        ? [
            {
              headerName: "Action",
              field: "id" as const,
              width: 100,
              minWidth: 80,
              sortable: false,
              filter: false,
              cellRenderer: EditButtonRenderer,
            },
          ]
        : [];

    if (role === "admin") {
      return [...baseColumns, ...adminOnlyColumns, ...feedbackColumns, ...actionColumn];
    } else if (role === "interviewer") {
      return [...baseColumns, ...feedbackColumns, ...actionColumn];
    } else {
      return baseColumns;
    }
  }, [EditButtonRenderer, role]);

  // Default column properties 
  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  // Fetch candidates data with pagination 
  const fetchCandidates = useCallback(async (skip: number, limit: number) => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/candidates/paginated", {
        params: { skip, limit },
      });

      const { candidates: candidatesData, totalcount } = response.data;
      setCandidates(candidatesData || []);
      setTotalRecords(totalcount || 0);
    } catch (err) {
      console.warn("Could not fetch candidates:", err);
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

  // Pagination info 
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = totalRecords > 0 ? currentPage * pageSize + 1 : 0;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalRecords);

  // Pagination handlers 
  const goToFirstPage = () => setCurrentPage(0);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages - 1);
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Actions */}
      <div className="dashboard-actions">
        {/*Import button + hidden input */}
        <button className="import-btn" onClick={handleImportClick} disabled={importing} type="button">
          {importing ? "Importing..." : "Import Data"}
        </button>

        {/*  hidden input for Excel upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

       
        
        

        {/*  Add Candidate button */}
        {role === "admin" && (
          <button className="add-candidate-btn" onClick={() => navigate("/add-interview")} type="button">
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
          <button onClick={goToFirstPage} disabled={currentPage === 0 || loading} className="pagination-btn" title="First Page">
            ⟪
          </button>
          <button onClick={goToPreviousPage} disabled={currentPage === 0 || loading} className="pagination-btn" title="Previous Page">
            ⟨
          </button>
          <span className="page-indicator">
            Page {totalPages > 0 ? currentPage + 1 : 0} of {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage >= totalPages - 1 || loading} className="pagination-btn" title="Next Page">
            ⟩
          </button>
          <button onClick={goToLastPage} disabled={currentPage >= totalPages - 1 || loading} className="pagination-btn" title="Last Page">
            ⟫
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Dashboard;
