import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from './reportStyles';

const ProjectInfoSection = ({ project }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Prosjektinformasjon</Text>
    <Text style={styles.description}>Beskrivelse: {project.description}</Text>
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
);

export default ProjectInfoSection;
