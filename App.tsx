
import React, { useState, useEffect } from 'react';
import { AppRoute, ScanResult } from './types';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import PatientsPage from './pages/PatientsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ResearchHubPage from './pages/ResearchHubPage';
import DiagnosticEnginePage from './pages/DiagnosticEnginePage';
import ResultsPage from './pages/ResultsPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';


import MedicineArbitragePage from './pages/MedicineArbitragePage';
import InteractiveMap from './components/InteractiveMap';
import Tumor3DViewer from './components/Tumor3DViewer';
import AmbulancePage from './pages/AmbulancePage';


import GrowthPredictionPage from './pages/GrowthPredictionPage';
import NeuroAnalysisPage from './pages/NeuroAnalysisPage';
import CaregiverDashboard from './pages/CaregiverDashboard';
import ClinicianDashboard from './pages/ClinicianDashboard';
import FuturisticAIChat from './components/FuturisticAIChat';




import ParticleField from './components/ParticleField';
import VoiceCommandSystem from './components/VoiceCommandSystem';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);

  // Initial Scan Data
  const [scans, setScans] = useState<ScanResult[]>([
    {
      id: 'SCN-8821',
      patientId: 'PAT-001',
      patientName: 'John Doe',
      scanDate: '2024-05-12 14:30',
      classification: 'Glioma',
      confidence: 0.94,
      status: 'Critical',
      imageUri: 'https://picsum.photos/seed/mri1/800/800',
      heatmapUri: 'https://picsum.photos/seed/heatmap1/800/800',
      probabilities: { 'Glioma': 0.94, 'Meningioma': 0.03, 'Pituitary': 0.02, 'No Tumor': 0.01 },
      metadata: { modality: 'MR', manufacturer: 'GE Medical', sliceThickness: '1mm', magneticFieldStrength: '3T' }
    }
  ]);

  const navigateToResults = (scanId: string) => {
    setSelectedScanId(scanId);
    setCurrentRoute(AppRoute.RESULTS);
  };

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.DASHBOARD: return <Dashboard scans={scans} onScanClick={navigateToResults} />;
      case AppRoute.PATIENTS: return <PatientsPage />;
      case AppRoute.SCAN:
        return <DiagnosticEnginePage />;
      case AppRoute.RESULTS:
        const scan = scans.find(s => s.id === selectedScanId) || scans[0];
        return <ResultsPage scan={scan} />;


      case AppRoute.MEDICINE_ORDER: return <MedicineArbitragePage />;
      case AppRoute.PHARMACY_MAP: return <InteractiveMap />;
      case AppRoute.AMBULANCE: return <AmbulancePage />;
      case AppRoute.TUMOR_3D: return <Tumor3DViewer />;

      case AppRoute.GROWTH_PREDICTION: return <GrowthPredictionPage />;

      case AppRoute.NEURO_ANALYSIS: return <NeuroAnalysisPage />;
      case AppRoute.CAREGIVER_DASHBOARD: return <CaregiverDashboard />;
      case AppRoute.CLINICIAN_DASHBOARD: return <ClinicianDashboard />;
      case AppRoute.KNOWLEDGE_BASE: return <ResearchHubPage />;
      case AppRoute.ANALYTICS: return <AnalyticsPage />;



      default: return <Dashboard scans={scans} onScanClick={navigateToResults} />;


    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">{/* White background */}
      <ParticleField />

      <VoiceCommandSystem
        onNavigate={setCurrentRoute}
        onAction={(action, params) => {
          console.log('Main Action:', action, params);
          if (action === 'open_file_selector') {
            // Logic to open file selector via ref or event dispatch
            const fileInput = document.getElementById('scan-upload-input');
            if (fileInput) fileInput.click();
          }
        }}
      />

      <AppShell currentRoute={currentRoute} onNavigate={setCurrentRoute}>
        {renderContent()}
      </AppShell>

      <FuturisticAIChat />
    </div>
  );
};

export default App;

