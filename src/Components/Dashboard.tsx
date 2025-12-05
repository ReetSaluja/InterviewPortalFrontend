import './Dashboard.css';
import { tableHeaders } from './Constants';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer/Footer';

interface Candidate {
  id: number;
  CandidateName: string;
  TotalExperience: string;
  SkillSet: string;
  CurrentOrganization: string;
  NoticePeriod: string;
  Feedback?: string;
  Remarks?: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/candidates/');
        setCandidates(response.data || []);
        setError(null);
      } catch (err) {
        // If API fails, just show empty dashboard instead of error
        console.warn('Could not fetch candidates:', err);
        setCandidates([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="add-candidate-btn"
          onClick={() => navigate('/add-interview')}
        >
          + Add Candidate
        </button>
      </div>
      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>{tableHeaders.sno}</th>
              <th>{tableHeaders.candidateName}</th>
              <th>{tableHeaders.experience}</th>
              <th>{tableHeaders.technology}</th>
              <th>{tableHeaders.noticePeriod}</th>
              <th>{tableHeaders.currentOrganization}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  <td><div className="skeleton skeleton-text"></div></td>
                  <td><div className="skeleton skeleton-text"></div></td>
                  <td><div className="skeleton skeleton-text"></div></td>
                  <td><div className="skeleton skeleton-text"></div></td>
                  <td><div className="skeleton skeleton-text"></div></td>
                  <td><div className="skeleton skeleton-text"></div></td>
                </tr>
              ))
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No candidates found. Add some interviews to see them here.
                </td>
              </tr>
            ) : (
              currentCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.id}</td>
                  <td>{candidate.CandidateName}</td>
                  <td>{candidate.TotalExperience}</td>
                  <td>{candidate.SkillSet}</td>
                  <td>{candidate.NoticePeriod}</td>
                  <td>{candidate.CurrentOrganization}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {candidates.length > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="pagination-numbers">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
              ) : (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {candidates.length > 0 && (
        <div className="pagination-info">
          Showing {startIndex + 1} to {Math.min(endIndex, candidates.length)} of {candidates.length} entries
        </div>
      )}
    </div>
  );
}

export default Dashboard;