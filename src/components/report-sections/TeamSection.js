import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from './reportStyles';

const TeamSection = ({ team }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Team</Text>
    <View style={styles.table}>
      {team.map((member, index) => (
        <View key={index} style={styles.teamMemberRow}>
          <Text style={styles.teamMemberName}>{member.name}</Text>
          <Text style={styles.teamMemberRole}>{member.role}</Text>
          <Text style={styles.teamMemberEmail}>{member.email}</Text>
        </View>
      ))}
    </View>
  </View>
);

export default TeamSection;
