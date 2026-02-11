import { GoogleGenAI, Type } from "@google/genai";
import { VideoContext, AlNokhbaResult, GroundingSource, SceneRole, ELITE_ENGLISH } from "../types";

const GEMINI_MODEL = 'gemini-2.0-flash-thinking-exp-01-21'; // Updated to a capable model, assuming this is available or similar

const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const transcribeVideoSceneExact = async (videoFile: File): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const videoBase64 = await fileToBase64(videoFile);

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        parts: [
          { inlineData: { mimeType: videoFile.type, data: videoBase64 } },
          { text: `OSCAR-WINNING PERFORMANCE EXTRACTION PROTOCOL - ELITE ENGLISH

You are a legendary acting coach who has trained Daniel Day-Lewis, Meryl Streep, and Cate Blanchett. Extract the COMPLETE performance DNA of this scene for an Elite English Transcreation.

### 🎬 PHASE 1: VERBATIM SCRIPT EXTRACTION
- Extract EXACT words with zero interpretation
- Capture every pause filler, self-correction, restart
- Note word elongations and emphasis patterns
- Mark the POWER WORDS that carry emotional weight

### 🎬 PHASE 2: WORLD-CLASS VOCAL PERFORMANCE MAPPING
- **Projection Level**: Room-filling presence (1-10 scale)
- **Chest Resonance**: Percentage of grounded, authoritative tone
- **Attack Style**: How words BEGIN (crisp/soft/punchy)
- **Sustain Control**: How words are HELD for emphasis
- **Release Pattern**: How phrases END (with authority, not trailing off)

### 🎬 PHASE 3: RHYTHMIC DNA FOR MAXIMUM ENGAGEMENT
- **Staccato Punches**: Quick, impactful phrases
- **Legato Flow**: Smooth connective tissue
- **Strategic Pauses**: The SILENCE that makes the next word LAND

OUTPUT: A complete PERFORMANCE SCORE that an Oscar-caliber actor could use to deliver this EXACT performance with 99% fidelity. PURE COMMANDING VOCAL EXCELLENCE.` },
        ],
      }
    ],
    config: { thinkingConfig: { thinkingBudget: 12000 } }
  });

  return response.text || "Scene extraction failed.";
};

export const analyzeVideoContext = async (videoFile: File): Promise<VideoContext> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const videoBase64 = await fileToBase64(videoFile);

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        parts: [
          { inlineData: { mimeType: videoFile.type, data: videoBase64 } },
          { text: `OSCAR-WINNING DIRECTOR'S FULL VIDEO CONTEXT FORENSICS

You are the convergence of: Martin Scorsese's narrative insight, a Cannes-winning cinematographer, and a viral content strategist.

### 🏆 MISSION: Extract WORLD-CLASS Narrative & Performance DNA for the ENTIRE VIDEO.

---

## PHASE 1: FULL NARRATIVE ARC & SCENE ROADMAP
Break down the video into a precise SCENE ROADMAP. We need to know exactly what happens scene by scene to engineer future contexts.

For each scene, identify:
- **Scene ID**: Chronological order.
- **Description**: What happens visually and narratively.
- **Key Action**: The main event.
- **Emotional Beat**: The feeling conveyed.
- **Future Implication**: How this scene sets up the NEXT scenes (Future Scenes Engineering).
- **Estimated Duration**: Approximate length.

---

## PHASE 2: COMMANDING VOCAL & PHYSICAL PRESENCE
Analyze the protagonist's overall persona:
- **Power Voice Architecture**: Projection, Resonance, Articulation.
- **Elite Prosodic Signature**: Pitch, Pace, Pauses.
- **Physical Authority**: Gaze, Posture, Micro-expressions.

---

## PHASE 3: LINGUISTIC & CULTURAL POWER CODE
- **Word Choice**: Vocabulary that signals competence.
- **Cultural Code**: How they connect with an Elite English audience.

---

## PHASE 4: CINEMATIC IDENTITY
- **Visual Power**: Lighting, Framing, Color.
- **Audio Mood**: Professionalism, Clarity.

---

OUTPUT: A comprehensive JSON profile containing the Narrative Architecture, Scene Roadmap, Persona, and Cinematography.` },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          narrativeArchitecture: { type: Type.STRING },
          sceneRoadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneId: { type: Type.INTEGER },
                description: { type: Type.STRING },
                keyAction: { type: Type.STRING },
                emotionalBeat: { type: Type.STRING },
                futureImplication: { type: Type.STRING },
                estimatedDuration: { type: Type.STRING }
              },
              required: ["sceneId", "description", "keyAction", "emotionalBeat", "futureImplication", "estimatedDuration"]
            }
          },
          linguisticFingerprint: { type: Type.STRING },
          persona: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              speakingStyle: { type: Type.STRING },
              keyVocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
              demographic: { type: Type.STRING },
              socialRegister: { type: Type.STRING },
              vocalArchetype: { type: Type.STRING },
              culturalEquivalent: { type: Type.STRING },
              psychologicalProfile: { type: Type.STRING },
            },
            required: ["description", "speakingStyle", "keyVocabulary", "demographic", "socialRegister", "vocalArchetype", "culturalEquivalent", "psychologicalProfile"],
          },
          cinematography: {
            type: Type.OBJECT,
            properties: {
              visualStyle: { type: Type.STRING },
              lightingSignature: { type: Type.STRING },
              audioMood: { type: Type.STRING },
            },
            required: ["visualStyle", "lightingSignature", "audioMood"]
          },
          transcription: { type: Type.STRING },
        },
        required: ["summary", "narrativeArchitecture", "sceneRoadmap", "linguisticFingerprint", "persona", "cinematography", "transcription"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const runEliteTranscreationPass = async (
  sceneFile: File,
  context: VideoContext,
  verifiedScript: string,
  passNumber: number = 1
): Promise<AlNokhbaResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const sceneBase64 = await fileToBase64(sceneFile);

  // ELITE GROUNDING: Research for Elite English Performance
  const searchPrompt = `ELITE ENGLISH COMMANDING PERFORMANCE RESEARCH.

MISSION: Intelligence for WORLD-CLASS native English performance (Elite, High-Status, Engaging).

### RESEARCH VECTORS:
1. **COMMANDING VOICE PATTERNS**: How do powerful English speakers project authority?
2. **OSCAR-LEVEL DELIVERY**: Pacing, pausing, and emphasis for elite storytelling.
3. **ELITE LEXICAL POWER**: Vocabulary that commands respect and signals high status.
4. **VIRAL AUTHORITY**: Patterns that stop the scroll through sheer competence and presence.`;

  const searchResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: searchPrompt,
    config: { tools: [{ googleSearch: {} }] }
  });

  const groundingSources: GroundingSource[] = (searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter(chunk => chunk.web)
    .map(chunk => ({ title: chunk.web!.title || 'Elite Research Note', uri: chunk.web!.uri }));

  // THE OSCAR-WINNING TRANSCREATION & VEO PROMPT
  const finalPrompt = `
🏆 SUPREME DIRECTIVE: ELITE ENGLISH TRANSCREATION & VEO3.1 SCENE ENGINEERING

You are the Director.

**CONTEXT - FULL NARRATIVE ARC:**
${JSON.stringify(context.sceneRoadmap)}

**CURRENT SCENE MISSION:**
Identify which scene from the Roadmap this clip corresponds to. Use the "Future Implication" of this scene to engineer the prompt for MAXIMUM CONTINUITY and NARRATIVE DRIVE.

**THE GOAL:**
1.  **Transcreate** the script into ELITE ENGLISH.
2.  **Engineer a VEO3.1 PROMPT** to RECREATE this scene with heightened cinematic quality.

---

## 🎬 VEO3.1 PROMPT ENGINEERING RULES
The \`veoPrompt\` must be a self-contained, highly descriptive prompt for a video generation model.
- **Subject**: Detailed description of appearance, clothing, and posture.
- **Action**: Precise movement and activity.
- **Camera**: Specific camera moves (Dolly, Pan, Zoom, Handheld).
- **Lighting**: Cinematic lighting (Golden hour, Softbox, Rim light).
- **Style**: "Cinematic, Photorealistic, 8k, High Production Value".
- **Context Awareness**: Incorporate elements that foreshadow the NEXT scene based on the Roadmap.

---

## 📋 OUTPUT REQUIREMENTS

Generate a COMPLETE breakdown:

1.  **Breakdown**: Deep analysis of the scene role, philosophy, and performance blueprint.
2.  **Master Prompt**: Text-based direction for an actor (Performance Blueprint).
3.  **Veo Prompt**: The specific string to feed into Veo3.1 to generate the video.

---

EXECUTE NOW. Create the Elite English Masterpiece.`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        parts: [
          { inlineData: { mimeType: sceneFile.type, data: sceneBase64 } },
          { text: finalPrompt }
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 48000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          breakdown: {
            type: Type.OBJECT,
            properties: {
              originalAudio: { type: Type.STRING },
              sceneRole: { type: Type.STRING, enum: Object.values(SceneRole) },
              culturalArchetype: { type: Type.STRING },
              contextVibe: { type: Type.STRING },
              translation: { type: Type.STRING },
              phoneticTranscription: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              sources: { type: Type.ARRAY, items: { type: Type.STRING } },
              nativeGroundingInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
              prosodicAnalysis: { type: Type.STRING },
              viralEngagementStrategy: { type: Type.STRING },
              transcreationPhilosophy: { type: Type.STRING },
              cinematicDirection: {
                type: Type.OBJECT,
                properties: {
                  lightingMood: { type: Type.STRING },
                  cameraMovement: { type: Type.STRING },
                  colorPalette: { type: Type.STRING },
                  engagementHook: { type: Type.STRING },
                  shotComposition: { type: Type.STRING },
                  depthOfField: { type: Type.STRING },
                  colorGradingStyle: { type: Type.STRING },
                  cameraChoreography: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timestamp: { type: Type.STRING },
                        action: { type: Type.STRING },
                        intensity: { type: Type.STRING }
                      },
                      required: ["timestamp", "action", "intensity"]
                    }
                  }
                },
                required: ["lightingMood", "cameraMovement", "colorPalette", "engagementHook", "shotComposition", "depthOfField", "colorGradingStyle", "cameraChoreography"]
              },
              performanceBlueprint: {
                type: Type.OBJECT,
                properties: {
                  actingIntention: { type: Type.STRING },
                  statusRegisterShift: { type: Type.STRING },
                  loanWordAuthenticity: { type: Type.STRING },
                  vocalTexture: { type: Type.STRING },
                  cadenceDirectives: { type: Type.STRING },
                  vocalAttackStyle: { type: Type.STRING },
                  articulationPrecision: { type: Type.STRING },
                  sovereignPresenceCues: { type: Type.ARRAY, items: { type: Type.STRING } },
                  visemeDirectives: { type: Type.STRING },
                  rhythmicPulse: { type: Type.STRING },
                  phoneticStressMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  prosodyMap: { type: Type.STRING },
                  emotionalArc: { type: Type.STRING },
                  vocalTimbreScore: { type: Type.STRING },
                  metricalTimingMap: { type: Type.STRING },
                  breathControlMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  microExpressionDirectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                  facialActingKeys: { type: Type.ARRAY, items: { type: Type.STRING } },
                  physicalityCues: { type: Type.ARRAY, items: { type: Type.STRING } },
                  subtextualDirectives: { type: Type.STRING },
                  actingMotivation: { type: Type.STRING },
                  subtleHumming: { type: Type.STRING },
                  gazeDirectionMap: { type: Type.ARRAY, items: { type: Type.STRING } },
                  microEngagementTactics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  powerDynamicDirective: { type: Type.STRING },
                  culturalResonanceMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  nativeIdiosyncrasies: { type: Type.STRING },
                  socialSignalingLogic: { type: Type.STRING }
                },
                required: ["actingIntention", "statusRegisterShift", "loanWordAuthenticity", "vocalTexture", "cadenceDirectives", "vocalAttackStyle", "articulationPrecision", "sovereignPresenceCues", "visemeDirectives", "rhythmicPulse", "phoneticStressMarkers", "prosodyMap", "emotionalArc", "vocalTimbreScore", "metricalTimingMap", "breathControlMarkers", "microExpressionDirectives", "facialActingKeys", "physicalityCues", "subtextualDirectives", "actingMotivation", "subtleHumming", "gazeDirectionMap", "microEngagementTactics", "powerDynamicDirective", "culturalResonanceMarkers", "nativeIdiosyncrasies", "socialSignalingLogic"]
              }
            },
            required: ["originalAudio", "sceneRole", "culturalArchetype", "contextVibe", "translation", "phoneticTranscription", "reasoning", "sources", "nativeGroundingInsights", "prosodicAnalysis", "viralEngagementStrategy", "cinematicDirection", "performanceBlueprint", "transcreationPhilosophy"]
          },
          masterPrompt: { type: Type.STRING },
          veoPrompt: { type: Type.STRING }
        },
        required: ["breakdown", "masterPrompt", "veoPrompt"]
      }
    }
  });

  const parsed = JSON.parse(response.text);
  parsed.optimizationPass = passNumber;
  parsed.groundingSources = groundingSources;
  return parsed;
};

export const refineCinematicAesthetic = async (
  sceneFile: File,
  currentResult: AlNokhbaResult,
  context: VideoContext
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const sceneBase64 = await fileToBase64(sceneFile);

  // THE VEO3.1 PROMPT REFINEMENT
  const formatInstruction = `
🏆 SUPREME DIRECTIVE: REFINE VEO3.1 VIDEO GENERATION PROMPT

You are an expert Prompt Engineer for Veo3.1 (Google's Video Generation Model).

**MISSION:**
Take the existing \`veoPrompt\` and the Performance Blueprint, and refine it into the PERFECT Veo3.1 prompt.

**CURRENT VEO PROMPT:**
"${currentResult.veoPrompt}"

**CONTEXT:**
- Narrative: ${currentResult.breakdown.sceneRole}
- Visual Style: ${context.cinematography.visualStyle}
- Future Context: Ensure it aligns with the Scene Roadmap.

**VEO3.1 OPTIMIZATION RULES:**
- Start with style: "Cinematic, Photorealistic..."
- Be explicit about Lighting, Camera Angle, and Movement.
- Describe the subject's appearance and action clearly.
- Use "High quality, 4k, HDR" keywords.

**OUTPUT:**
Just the refined prompt string. Nothing else.
`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        parts: [
          { inlineData: { mimeType: sceneFile.type, data: sceneBase64 } },
          { text: formatInstruction }
        ]
      }
    ],
    config: { thinkingConfig: { thinkingBudget: 12000 } }
  });

  return response.text || currentResult.veoPrompt;
};
