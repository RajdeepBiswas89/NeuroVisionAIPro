
export type TumorClass = 'Glioma' | 'Meningioma' | 'Pituitary' | 'No Tumor';

export interface ScanResult {
  id: string;
  patientId: string;
  patientName: string;
  scanDate: string;
  classification: TumorClass;
  confidence: number;
  status: 'Pending' | 'Reviewed' | 'Critical';
  imageUri: string;
  heatmapUri?: string;
  probabilities: Record<TumorClass, number>;
  metadata: {
    modality: string;
    manufacturer: string;
    sliceThickness: string;
    magneticFieldStrength: string;
  };
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  lastScanDate: string;
  status: 'Normal' | 'Under Treatment' | 'Critical';
  scans: string[]; // Scan IDs
}


export enum AppRoute {
  DASHBOARD = 'dashboard',
  PATIENTS = 'patients',
  SCAN = 'scan',
  RESULTS = 'results',
  KNOWLEDGE_BASE = 'knowledge-base',
  TUMOR_3D = '3d-viewer',
  GROWTH_PREDICTION = 'growth-prediction',
  NEURO_ANALYSIS = 'neuro-analysis',
  CAREGIVER_DASHBOARD = 'caregiver-dashboard',
  CLINICIAN_DASHBOARD = 'clinician-dashboard',
  MEDICINE_ORDER = 'medicine-order',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  COLLABORATION = 'collaboration',
  PHARMACY_MAP = 'pharmacy-map',
  AMBULANCE = 'ambulance',
  CITY_COMMAND = 'city-command',
  UOCM = 'uocm'
}

// --- Emergency Mobility Infrastructure Types ---

export enum AmbulanceType {
  BLS = 'Basic Life Support',
  ALS = 'Advanced Life Support',
  ICU = 'Mobile ICU',
  NEONATAL = 'Neonatal Transport',
  AIR_AMBULANCE = 'Helicopter EMS',
  MOTORBIKE = 'First Responder Bike'
}

export enum AmbulanceStatus {
  IDLE = 'IDLE',
  EN_ROUTE_TO_PICKUP = 'EN_ROUTE_TO_PICKUP',
  ON_SCENE = 'ON_SCENE',
  TRANSPORTING = 'TRANSPORTING',
  CLEANING = 'CLEANING',
  OFF_DUTY = 'OFF_DUTY'
}

export enum EmergencyLevel {
  CRITICAL = 'CRITICAL', // Immediate life threat
  URGENT = 'URGENT',     // Serious but stable
  NON_URGENT = 'NON_URGENT', // Transport only
  DISASTER = 'DISASTER'  // Mass casualty event
}

export enum SLALevel {
  PLATINUM_8MIN = 'PLATINUM_8MIN',
  GOLD_12MIN = 'GOLD_12MIN',
  SILVER_20MIN = 'SILVER_20MIN',
  STANDARD = 'STANDARD'
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  bearing?: number; // 0-360 degrees
}

export interface Ambulance {
  id: string;
  callSign: string;
  type: AmbulanceType;
  status: AmbulanceStatus;
  location: GeoLocation;
  heading: number;
  fuelLevel: number;
  oxygenLevel: number;
  crew: {
    driver: string;
    paramedic?: string;
    doctor?: string;
  };
  currentTripId?: string;
}

// --- Pre-Decision Field (PDF) Primitives ---

export interface FieldTensor {
  timestamp: Date;
  gridResolution: number; // e.g., 50 meters
  topologyMatrix: number[][]; // 2D array representing Resistance (0.0 = Frictionless, 1.0 = Impossible)
  entropyIntegral: number; // Total system stress
}

export interface SurvivalGradient {
  location: GeoLocation;
  vector: BiasVector;
  steepness: number; // How hard is it to move against the flow?
}

export interface BiasVector {
  dx: number; // Latitudinal drift
  dy: number; // Longitudinal drift
  magnitude: number;
  source: 'ENTROPY_DAEMON' | 'NATURAL_DECAY' | 'MANUAL_INJECTION';
}

export interface ResourceState {
  id: string;
  type: AmbulanceType; // "Agent Class" in PDF terms
  location: GeoLocation;
  fieldCoupling: number; // 0.0 to 1.0 (How strongly does it follow the bias?)
  status: AmbulanceStatus;
}


// --- Monetization & Market Types ---

export enum PaymentMethod {
  CASH = 'CASH',
  INSURANCE = 'INSURANCE',
  ONLINE = 'ONLINE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  GOVERNMENT = 'GOVERNMENT_SUBSIDY'
}

export interface PricingModel {
  baseFare: number;
  distanceRate: number; // per km
  timeRate: number; // per min
  urgentMultiplier: number;
  surgeMultiplier: number;
  surgeReason?: string;
  totalEstimated: number;
  currency: 'INR' | 'USD';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'SILVER' | 'GOLD' | 'PLATINUM' | 'CORPORATE';
  priceMonthly: number;
  coverage: {
    freeTrips: number;
    discountPercent: number;
    guaranteedSLA: SLALevel;
  };
}

// --- Infrastructure & Traffic Types ---

export interface TrafficSignal {
  id: string;
  location: GeoLocation;
  status: 'RED' | 'GREEN' | 'YELLOW' | 'PRE_EMPTION_ACTIVE';
  controlledBy: string; // "CityTraffic" or "NeuroVision"
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number; // 0.0 to 1.0 probability of emergency
  radius: number;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  eventType: 'DISPATCH' | 'PRICING_CALC' | 'SLA_BREACH' | 'ROUTE_CHANGE';
  details: string;
  actor: 'SYSTEM' | 'DISPATCHER' | 'GOV_OVERRIDE';
}

export interface ReasoningTrace {
  step: string;
  confidence: number;
  rationale: string;
  timestamp: Date;
}

export interface ClinicalProposal {
  id: string;
  type: 'DIAGNOSIS' | 'TREATMENT' | 'SURGERY';
  description: string;
  aiConfidence: number;
  reasoningTraces: ReasoningTrace[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  clinicianSignature?: string;
}

export interface PatientTrajectory {
  patientId: string;
  timeline: {
    date: string;
    event: string;
    type: 'SCAN' | 'MEDICINE' | 'SYMPTOM';
  }[];
  proposals: ClinicalProposal[];
}
