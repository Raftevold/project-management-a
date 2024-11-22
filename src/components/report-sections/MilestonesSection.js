import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles, getMilestoneStatus, getMilestoneStatusStyle } from './reportStyles';

const MilestonesSection = ({ milestones }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Milepæler</Text>
    {milestones.map((milestone, index) => {
      const status = getMilestoneStatus(milestone);
      const statusStyle = getMilestoneStatusStyle(status);
      
      return (
        <View key={index} style={styles.tableRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.boldText}>{milestone.name}</Text>
            {milestone.description && (
              <Text style={styles.description}>{milestone.description}</Text>
            )}
            <Text style={styles.text}>
              Dato: {new Date(milestone.date).toLocaleDateString('nb-NO')}
            </Text>
            <Text style={[styles.milestoneStatus, statusStyle]}>
              Status: {status} {milestone.progress ? `(${milestone.progress}%)` : ''}
            </Text>
            <View style={{ marginTop: 5 }}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${milestone.progress || 0}%` }]} />
              </View>
            </View>
          </View>
        </View>
      );
    })}
  </View>
);

export default MilestonesSection;
