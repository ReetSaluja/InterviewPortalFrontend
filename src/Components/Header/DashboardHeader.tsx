/**
 * DASHBOARD HEADER COMPONENT
 * 
 * This component renders the sub-header specifically for the Dashboard page.
 * Features:
 * - Page title with professional styling
 * - Consistent spacing below main header
 * - Responsive design for various screen sizes
 * - Props-based customization for title
 */

import React from 'react';
import './DashboardHeader.css';

interface DashboardHeaderProps {
  title?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Dashboard',
}) => {
  return (
    <div className="dashboard-page-header">
      {/* PAGE TITLE - Main heading for the dashboard */}
      <h1 className="dashboard-page-title">{title}</h1>
    </div>
  );
};

export default DashboardHeader;
