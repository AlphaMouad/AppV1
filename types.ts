
export const ELITE_ENGLISH = 'English (Elite Transcreation)';

export enum SceneRole {
  HOOK = 'The Hook (0-3s High Energy/Magnetic)',
  PATTERN_INTERRUPT = 'Pattern Interrupt (Abrupt Cognitive Shift)',
  VALUE_PILLAR = 'Value Pillar (Sovereign Authority)',
  BRIDGE = 'The Bridge (Cinematic Transition)',
  CTA = 'High-Status CTA (Elite Urgency)',
  STORYTELLING = 'Emotional Core (Vulnerable/Magnetic)'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface CameraCue {
  timestamp: string;
  action: string;
  intensity: 'Subtle' | 'Dynamic' | 'Aggressive';
}

export interface SceneNode {
  sceneId: number;
  description: string;
  keyAction: string;
  emotionalBeat: string;
  futureImplication: string;
  estimatedDuration: string;
}

export interface PerformanceBlueprint {
  actingIntention: string;
  statusRegisterShift: string;
  loanWordAuthenticity: string;
  vocalTexture: string;
  cadenceDirectives: string;
  vocalAttackStyle: string;
  articulationPrecision: string;
  sovereignPresenceCues: string[];
  visemeDirectives: string; 
  rhythmicPulse: string;
  phoneticStressMarkers: string[];
  prosodyMap: string; 
  emotionalArc: string;
  vocalTimbreScore: string;
  metricalTimingMap: string;
  breathControlMarkers: string[];
  microExpressionDirectives: string[];
  facialActingKeys: string[];
  physicalityCues: string[];
  subtextualDirectives: string;
  actingMotivation: string;
  subtleHumming: string;
  gazeDirectionMap: string[];
  microEngagementTactics: string[];
  powerDynamicDirective: string;
  // New Enhanced Fields
  culturalResonanceMarkers: string[];
  nativeIdiosyncrasies: string;
  socialSignalingLogic: string;
}

export interface AlNokhbaResult {
  breakdown: {
    originalAudio: string;
    sceneRole: SceneRole;
    culturalArchetype: string;
    contextVibe: string;
    translation: string;
    phoneticTranscription: string;
    reasoning: string;
    sources: string[];
    nativeGroundingInsights: string[];
    performanceBlueprint: PerformanceBlueprint;
    prosodicAnalysis: string;
    viralEngagementStrategy: string;
    cinematicDirection: {
      lightingMood: string;
      cameraMovement: string;
      colorPalette: string;
      engagementHook: string;
      shotComposition: string;
      depthOfField: string;
      colorGradingStyle: string;
      cameraChoreography: CameraCue[];
    };
    transcreationPhilosophy: string; // Explaining why it's "better than the original"
  };
  masterPrompt: string; // Keeping this as the "Performance Blueprint" text
  veoPrompt: string; // New field for Veo3.1 video generation prompt
  optimizationPass: number;
  groundingSources?: GroundingSource[];
}

export interface VideoContext {
  summary: string;
  narrativeArchitecture: string;
  linguisticFingerprint: string;
  persona: {
    description: string;
    speakingStyle: string;
    keyVocabulary: string[];
    demographic: string;
    socialRegister: string;
    vocalArchetype: string;
    culturalEquivalent: string;
    psychologicalProfile: string;
  };
  cinematography: {
    visualStyle: string;
    lightingSignature: string;
    audioMood: string;
  };
  transcription: string;
  sceneRoadmap: SceneNode[]; // New field for Full Video Context & Future Scenes
}

export interface AppState {
  step: 'upload-context' | 'analyzing-context' | 'upload-scene' | 'transcribing-scene' | 'elite-processing' | 'result';
  contextVideo: File | null;
  sceneVideo: File | null;
  contextData: VideoContext | null;
  result: AlNokhbaResult | null;
  error: string | null;
  isRecording: boolean;
  processingStatus: string;
  micTranscript: string | null;
  exactSceneScript: string | null;
}
