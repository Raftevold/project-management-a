import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles, formatNumber } from './reportStyles';

const BudgetSection = ({ budget }) => {
  const totalActual = (budget.entries || [])
    .reduce((sum, entry) => sum + Number(entry.amount), 0);
  const budgetDifference = budget.planned - totalActual;
  const isOverBudget = budgetDifference < 0;

  // Sort budget entries by date in ascending order
  const sortedBudgetEntries = [...(budget.entries || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Budsjett</Text>
      <Text style={styles.boldText}>
        Planlagt budsjett: {formatNumber(budget.planned)} kr
      </Text>
      <Text style={styles.boldText}>
        Faktisk forbruk: {formatNumber(totalActual)} kr
      </Text>
      
      <View style={[
        styles.budgetStatus,
        isOverBudget ? styles.budgetNegative : styles.budgetPositive
      ]}>
        <Text style={styles.boldText}>
          {isOverBudget 
            ? `Overforbruk: ${formatNumber(Math.abs(budgetDifference))} kr`
            : `Gjenstående budsjett: ${formatNumber(budgetDifference)} kr`
          }
        </Text>
      </View>
      
      {sortedBudgetEntries.length > 0 && (
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Dato</Text>
            <Text style={styles.tableCell}>Beskrivelse</Text>
            <Text style={styles.tableCell}>Beløp</Text>
          </View>
          {sortedBudgetEntries.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {new Date(entry.date).toLocaleDateString('nb-NO')}
              </Text>
              <Text style={styles.tableCell}>{entry.description}</Text>
              <Text style={styles.tableCell}>
                {formatNumber(entry.amount)} kr
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default BudgetSection;
