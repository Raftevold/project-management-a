import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import './ProjectReport.css';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e293b',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 4
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: '#1e293b',
    fontWeight: 'bold',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    color: '#4b5563'
  },
  boldText: {
    fontSize: 10,
    marginBottom: 5,
    color: '#1e293b',
    fontWeight: 'bold'
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 25,
    alignItems: 'center',
    paddingVertical: 5
  },
  tableHeader: {
    backgroundColor: '#f1f5f9'
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10
  },
  teamMemberRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  teamMemberName: {
    flex: 2,
    paddingHorizontal: 8,
    fontSize: 10,
    color: '#1e293b'
  },
  teamMemberRole: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 10,
    color: '#4b5563'
  },
  teamMemberEmail: {
    flex: 2,
    paddingHorizontal: 8,
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8'
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e2e8f0',
    marginVertical: 5,
    borderRadius: 6
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 6
  },
  budgetStatus: {
    marginTop: 10,
    padding: 8,
    borderRadius: 4
  },
  budgetPositive: {
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  budgetNegative: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  statusNotStarted: {
    color: '#dc2626'
  },
  statusInProgress: {
    color: '#2563eb'
  },
  statusCompleted: {
    color: '#16a34a'
  }
});

const getMilestoneStatus = (milestone) => {
  if (milestone.completed) return 'fullført';
  if (!milestone.progress || milestone.progress === 0) return 'ikke påbegynt';
  return 'påbegynt';
};

const getMilestoneStatusStyle = (status) => {
  switch (status) {
    case 'fullført':
      return styles.statusCompleted;
    case 'påbegynt':
      return styles.statusInProgress;
    default:
      return styles.statusNotStarted;
  }
};

const ProjectReportDocument = ({ project }) => {
  const totalActual = (project.budget.entries || [])
    .reduce((sum, entry) => sum + Number(entry.amount), 0);
  const budgetDifference = project.budget.planned - totalActual;
  const isOverBudget = budgetDifference < 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{project.name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prosjektinformasjon</Text>
          <Text style={styles.text}>Beskrivelse: {project.description}</Text>
          <Text style={styles.text}>
            Periode: {new Date(project.startDate).toLocaleDateString('nb-NO')} - 
            {new Date(project.endDate).toLocaleDateString('nb-NO')}
          </Text>
          
          <View style={{ marginTop: 10 }}>
            <Text style={styles.text}>Fremdrift: {project.progress}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budsjett</Text>
          <Text style={styles.boldText}>
            Planlagt budsjett: {project.budget.planned.toLocaleString('nb-NO')} kr
          </Text>
          <Text style={styles.boldText}>
            Faktisk forbruk: {totalActual.toLocaleString('nb-NO')} kr
          </Text>
          
          <View style={[
            styles.budgetStatus,
            isOverBudget ? styles.budgetNegative : styles.budgetPositive
          ]}>
            <Text style={styles.boldText}>
              {isOverBudget 
                ? `Overforbruk: ${Math.abs(budgetDifference).toLocaleString('nb-NO')} kr`
                : `Gjenstående budsjett: ${budgetDifference.toLocaleString('nb-NO')} kr`
              }
            </Text>
          </View>
          
          {project.budget.entries && project.budget.entries.length > 0 && (
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Dato</Text>
                <Text style={styles.tableCell}>Beskrivelse</Text>
                <Text style={styles.tableCell}>Beløp</Text>
              </View>
              {project.budget.entries.map((entry, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {new Date(entry.date).toLocaleDateString('nb-NO')}
                  </Text>
                  <Text style={styles.tableCell}>{entry.description}</Text>
                  <Text style={styles.tableCell}>
                    {entry.amount.toLocaleString('nb-NO')} kr
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team</Text>
          <View style={styles.table}>
            {project.team.map((member, index) => (
              <View key={index} style={styles.teamMemberRow}>
                <Text style={styles.teamMemberName}>{member.name}</Text>
                <Text style={styles.teamMemberRole}>{member.role}</Text>
                <Text style={styles.teamMemberEmail}>{member.email}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milepæler</Text>
          {project.milestones.map((milestone, index) => {
            const status = getMilestoneStatus(milestone);
            const statusStyle = getMilestoneStatusStyle(status);
            
            return (
              <View key={index} style={styles.tableRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.boldText}>{milestone.name}</Text>
                  {milestone.description && (
                    <Text style={styles.text}>{milestone.description}</Text>
                  )}
                  <Text style={styles.text}>
                    Dato: {new Date(milestone.date).toLocaleDateString('nb-NO')}
                  </Text>
                  <Text style={[styles.boldText, statusStyle]}>
                    Status: {status} {milestone.progress ? `(${milestone.progress}%)` : ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.footer}>
          Rapport generert: {new Date().toLocaleString('nb-NO')}
        </Text>
      </Page>
    </Document>
  );
};

const ProjectReport = ({ project }) => (
  <PDFDownloadLink
    document={<ProjectReportDocument project={project} />}
    fileName={`${project.name.toLowerCase().replace(/\s+/g, '-')}-rapport.pdf`}
    className="report-btn"
  >
    {({ blob, url, loading, error }) => (
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
