import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
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
  description: {
    fontSize: 10,
    marginBottom: 5,
    color: '#4b5563',
    whiteSpace: 'pre-wrap'
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
  },
  milestoneStatus: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: 'bold'
  }
});

export const getMilestoneStatus = (milestone) => {
  if (milestone.completed) return 'fullført';
  if (!milestone.progress || milestone.progress === 0) return 'ikke påbegynt';
  return 'påbegynt';
};

export const getMilestoneStatusStyle = (status) => {
  switch (status) {
    case 'fullført':
      return styles.statusCompleted;
    case 'påbegynt':
      return styles.statusInProgress;
    default:
      return styles.statusNotStarted;
  }
};

export const formatNumber = (number) => {
  return Number(number).toLocaleString('nb-NO');
};
