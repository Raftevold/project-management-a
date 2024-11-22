import React from 'react';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import { styles } from './report-sections/reportStyles';
import ProjectInfoSection from './report-sections/ProjectInfoSection';
import BudgetSection from './report-sections/BudgetSection';
import TeamSection from './report-sections/TeamSection';
import MilestonesSection from './report-sections/MilestonesSection';
import './ProjectReport.css';

const ProjectReportDocument = ({ project }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{project.name}</Text>
      
      <ProjectInfoSection project={project} />
      <BudgetSection budget={project.budget} />
      <TeamSection team={project.team} />
      <MilestonesSection milestones={project.milestones} />

      <Text style={styles.footer}>
        Rapport generert: {new Date().toLocaleString('nb-NO')}
      </Text>
    </Page>
  </Document>
);

const ProjectReport = ({ project }) => (
  <PDFDownloadLink
    document={<ProjectReportDocument project={project} />}
    fileName={`${project.name.toLowerCase().replace(/\s+/g, '-')}-rapport.pdf`}
    className="report-btn"
  >
    {({ loading }) => (
      loading ? (
        <span className="report-loading">
          <span className="report-spinner" />
          Genererer rapport...
        </span>
      ) : (
        <>
          <svg className="report-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5zm2 2h6v2H7V5zm0 4h6v2H7V9zm0 4h6v2H7v-2z" />
          </svg>
          Last ned rapport
        </>
      )
    )}
  </PDFDownloadLink>
);

export default ProjectReport;
