import { GoogleGenAI, Type } from "@google/genai";
import { TargetLanguage, VideoContext, AlNokhbaResult, GroundingSource, SceneRole } from "../types";

const GEMINI_MODEL = 'gemini-3-pro-preview';

// Language-specific script formatting rules
const SCRIPT_FORMATTING_RULES: Record<string, string> = {
  'Emarati (Native UAE Elite Shakl)': `
**MANDATORY SCRIPT FORMAT - UAE ARABIC:**
- Write the FULL script in Arabic with COMPLETE Tashkeel/Shakl (فَتْحَة، ضَمَّة، كَسْرَة، سُكُون، شَدَّة، تَنْوِين)
- Every single letter MUST have its diacritical mark - NO EXCEPTIONS
- Loan words (English/French brands, tech terms) remain in LATIN script exactly as pronounced by UAE elite
- Example: "هَذَا الـ iPhone الجَدِيد مَا شَاء اللّٰه" NOT "هذا الايفون الجديد"
- Use UAE-specific vocabulary and expressions naturally`,

  'Gulf (High-Status Khaleeji)': `
**MANDATORY SCRIPT FORMAT - KHALEEJI ARABIC:**
- Write the FULL script in Arabic with COMPLETE Tashkeel/Shakl (فَتْحَة، ضَمَّة، كَسْرَة، سُكُون، شَدَّة، تَنْوِين)
- Every single letter MUST have its diacritical mark - NO EXCEPTIONS
- Loan words (English/French brands, tech terms) remain in LATIN script exactly as elite Khaleeji speakers say them
- Example: "وَاللّٰه هَذَا الـ brand حِلْو مَرَّة" NOT "والله هذا البراند حلو"
- Preserve Khaleeji dialectal features with proper Shakl`,

  'Moroccan (Elite Pro Darija)': `
**MANDATORY SCRIPT FORMAT - MOROCCAN DARIJA:**
- Write the FULL script in Arabic with COMPLETE Tashkeel/Shakl (فَتْحَة، ضَمَّة، كَسْرَة، سُكُون، شَدَّة، تَنْوِين)
- Every single Darija word MUST have its diacritical mark - NO EXCEPTIONS
- Loan words (French especially - très important for Moroccan elite) remain in LATIN script
- Example: "هَادْ الـ style زْوِينْ بَزَّافْ، c'est vraiment magnifique" NOT "هاد الستايل زوين بزاف"
- Preserve authentic Darija phonetics with Shakl (ڭ for /g/, etc.)`,

  'Levantine (Modern Shami Elite)': `
**MANDATORY SCRIPT FORMAT - LEVANTINE ARABIC:**
- Write the FULL script in Arabic with COMPLETE Tashkeel/Shakl (فَتْحَة، ضَمَّة، كَسْرَة، سُكُون، شَدَّة، تَنْوِين)
- Every single letter MUST have its diacritical mark - NO EXCEPTIONS
- Loan words remain in LATIN script as Shami elite naturally use them
- Example: "كْتِير حِلْوِة هَالـ look الجْدِيدَة" NOT "كتير حلوة هاللوك الجديدة"
- Authentic Shami expressions with proper voweling`,

  'Egyptian (Zamalek Influencer)': `
**MANDATORY SCRIPT FORMAT - EGYPTIAN ARABIC:**
- Write the FULL script in Arabic with COMPLETE Tashkeel/Shakl (فَتْحَة، ضَمَّة، كَسْرَة، سُكُون، شَدَّة، تَنْوِين)
- Every single letter MUST have its diacritical mark - NO EXCEPTIONS
- Loan words remain in LATIN script as Cairo elite pronounce them
- Example: "دَه الـ outfit أَحْلَى حَاجَة شُفْتَهَا" NOT "ده الاوتفت احلى حاجه شفتها"
- Zamalek/Maadi elite register vocabulary`,

  'Spanish (Cine Latam Elite)': `
**MANDATORY SCRIPT FORMAT - SPANISH:**
- Use COMPLETE Spanish punctuation including ¡ and ¿ for exclamations and questions
- ALL accent marks MUST be present (á, é, í, ó, ú, ñ, ü)
- Example: "¡Esto es increíble! ¿No crees?" NOT "Esto es increible! No crees?"
- Loan words (English tech/brand terms) remain in original with native Spanish pronunciation notes
- Use sophisticated Latam elite vocabulary, avoid slang unless intentionally code-switching`,

  'French (Parisian Influencer)': `
**MANDATORY SCRIPT FORMAT - FRENCH:**
- ALL French accents and diacritics MUST be present (é, è, ê, ë, à, â, ù, û, ç, œ, etc.)
- Proper French punctuation with spaces before : ; ! ?
- Example: "C'est vraiment incroyable ! Qu'est-ce que t'en penses ?"
- Loan words (English) styled as Parisian influencers naturally integrate them
- 16ème arrondissement vocabulary register`,

  'English (Elite RP Podcast)': `
**MANDATORY SCRIPT FORMAT - BRITISH RP:**
- Proper British spelling (colour, favourite, realise)
- Sophisticated vocabulary befitting elite British podcaster
- Loan words from other languages styled with RP pronunciation
- Natural contractions and elite British expressions`
};

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
          { text: `OSCAR-WINNING PERFORMANCE EXTRACTION PROTOCOL

You are a legendary acting coach who has trained Daniel Day-Lewis, Meryl Streep, and Cate Blanchett. Extract the COMPLETE performance DNA of this scene.

### 🎬 PHASE 1: VERBATIM SCRIPT EXTRACTION
- Extract EXACT words with zero interpretation
- Capture every pause filler, self-correction, restart
- Note word elongations and emphasis patterns
- Mark the POWER WORDS that carry emotional weight

### 🎬 PHASE 2: WORLD-CLASS VOCAL PERFORMANCE MAPPING

**CRITICAL ACTING RULES - NON-NEGOTIABLE:**
❌ NO WHISPERING - Elite performers PROJECT with controlled power
❌ NO ASMR BREATHINESS - This is COMMANDING presence, not pillow talk
❌ NO SOUND EFFECTS - Pure vocal performance only
❌ NO VOCAL FRY FOR "COOL" - Only strategic deployment by masters

✅ FULL VOICE PROJECTION - Chest resonance with authority
✅ DYNAMIC RANGE - Soft to powerful, never weak to weird
✅ CRYSTAL ARTICULATION - Every syllable lands with intention
✅ COMMANDING PRESENCE - The voice of someone who OWNS the room

**Vocal Architecture to Extract:**
1. **Projection Level**: Room-filling presence (1-10 scale, 7+ required)
2. **Chest Resonance**: Percentage of grounded, authoritative tone
3. **Attack Style**: How words BEGIN (crisp/soft/punchy)
4. **Sustain Control**: How words are HELD for emphasis
5. **Release Pattern**: How phrases END (with authority, not trailing off)

### 🎬 PHASE 3: RHYTHMIC DNA FOR MAXIMUM ENGAGEMENT

Map the performance rhythm that HOOKS viewers:
- **Staccato Punches**: Quick, impactful phrases that CREATE urgency
- **Legato Flow**: Smooth connective tissue between power moments
- **Strategic Pauses**: The SILENCE that makes the next word LAND
- **Acceleration Zones**: Building energy toward key points
- **Deceleration Zones**: Slowing for emphasis and weight

### 🎬 PHASE 4: OSCAR-LEVEL EMOTIONAL ARCHITECTURE

- Entry State: What emotion does the performer ARRIVE with?
- Transformation Points: Where does the emotional color SHIFT?
- Peak Moment: The single most powerful beat
- Resolution: How does the energy SETTLE?
- Lingering Impression: What stays with the viewer?

### 🎬 PHASE 5: ENGAGEMENT MAXIMIZATION MARKERS

- **Hook Moment** (0-1s): What STOPS the scroll?
- **Commitment Lock** (1-3s): What makes them STAY?
- **Value Delivery**: When does the viewer feel REWARDED?
- **Share Trigger**: What moment makes them want to SHARE?

OUTPUT: A complete PERFORMANCE SCORE that an Oscar-caliber actor could use to deliver this EXACT performance with 99% fidelity. NO SOUND EFFECTS. NO WHISPERING. PURE COMMANDING VOCAL EXCELLENCE.` },
        ],
      }
    ],
    config: { thinkingConfig: { thinkingBudget: 24000 } }
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
          { text: `OSCAR-WINNING DIRECTOR'S PERSONA FORENSICS

You are the convergence of: Martin Scorsese's character insight, Meryl Streep's dialect mastery, a Cannes-winning cinematographer, and a viral content strategist with 500M+ views.

### 🏆 MISSION: Extract WORLD-CLASS Performance DNA

---

## PHASE 1: COMMANDING VOCAL PRESENCE (Not Whisper Culture)

### A. Power Voice Architecture
- **Projection Authority**: How does this person FILL a room with their voice?
- **Chest Resonance Ratio**: Grounded power vs airy weakness (aim for 70%+ chest)
- **Articulation Precision**: How CLEANLY do they hit consonants?
- **Dynamic Command**: Range from intimate-but-strong to powerful-and-present

### B. Elite Prosodic Signature
- **Pitch Authority**: Centered, grounded pitch (not uptalk weakness)
- **Pace Mastery**: Deliberate speed that commands attention
- **Power Pause Deployment**: Strategic silence that amplifies next words
- **Statement Finality**: How they END phrases with CERTAINTY

### C. Status Voice Markers
- **The "I Don't Need Your Approval" Tone**: Relaxed confidence without trying
- **Effortless Authority**: Speaking as someone who is ALWAYS heard
- **Selective Energy**: Knowing when to push and when to pull back

**CRITICAL**: NO whispering analysis. NO ASMR qualities. NO breathy affectation.
We want COMMANDING PRESENCE that owns every room.

---

## PHASE 2: OSCAR-LEVEL PHYSICAL PRESENCE

### A. The Commanding Gaze
- Direct eye contact patterns (dominance through connection)
- Strategic look-aways (thinking, not avoiding)
- The "slow blink of certainty"
- Eye energy: ALIVE and PRESENT, not sleepy or detached

### B. Micro-Expression Mastery
- Eyebrow vocabulary for emphasis
- Mouth corners: the subtle smile of someone winning
- Nostril engagement for passion points
- Jaw set for determination moments

### C. Postural Authority
- Spine alignment: the posture of earned confidence
- Shoulder position: open, not defensive
- Chin angle: level (equals) or slightly raised (authority)
- Stillness: the power of NOT fidgeting

---

## PHASE 3: LINGUISTIC POWER CODE

### A. Word Choice Architecture
- Power vocabulary that signals competence
- Strategic simplicity (smart people speak clearly)
- Code-switching mastery (when to elevate, when to connect)

### B. Sentence Construction
- Short punches for impact
- Longer flows for storytelling
- The rule of three for memorability
- Callback patterns for engagement

### C. Cultural Code Integration
- How loanwords are wielded (naturally, not showing off)
- Register shifts that feel EARNED not performative
- Insider language that creates belonging

---

## PHASE 4: CINEMATIC IDENTITY

### A. Visual Power
- Lighting that sculpts authority
- Framing that commands attention
- Color palette psychology
- Background as status signal

### B. Production Excellence
- Audio clarity (professional, not bedroom)
- Visual sharpness
- Intentional composition

---

## PHASE 5: PSYCHOLOGICAL ARCHITECTURE

### A. Core Drive
- What does this person STAND FOR?
- What authority have they EARNED?
- What value do they DELIVER?

### B. Audience Relationship
- Teacher/Guide positioning
- Peer/Ally connection
- Aspirational figure dynamics

### C. Engagement Psychology
- How they CREATE investment
- How they MAINTAIN attention
- How they REWARD watching

---

OUTPUT: A comprehensive profile for creating OSCAR-CALIBER performances.
Focus on COMMANDING PRESENCE, not whisper culture.
AUTHORITY, not ASMR.
WORLD-CLASS ACTING, not influencer affectation.` },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 48000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          narrativeArchitecture: { type: Type.STRING },
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
        required: ["summary", "narrativeArchitecture", "linguisticFingerprint", "persona", "cinematography", "transcription"],
      },
    },
  });

  return JSON.parse(response.text);
};

export const runEliteTranscreationPass = async (
  sceneFile: File,
  context: VideoContext,
  verifiedScript: string,
  targetLang: TargetLanguage,
  passNumber: number = 1
): Promise<AlNokhbaResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const sceneBase64 = await fileToBase64(sceneFile);

  // Get language-specific formatting rules
  const scriptFormatRules = SCRIPT_FORMATTING_RULES[targetLang] || SCRIPT_FORMATTING_RULES['English (Elite RP Podcast)'];

  // ELITE GROUNDING: Cultural intelligence for COMMANDING performance
  const searchPrompt = `ELITE ${targetLang} COMMANDING PERFORMANCE RESEARCH 2024-2025.

MISSION: Intelligence for WORLD-CLASS native performance (NO whisper culture, NO ASMR).

### RESEARCH VECTORS:

**1. COMMANDING VOICE PATTERNS IN ${targetLang}**
- How do POWERFUL speakers in ${targetLang} project authority?
- What vocal patterns signal "I own this room" vs "please like me"?
- Elite pronunciation that sounds EFFORTLESS not try-hard
- The voice of OLD MONEY confidence in this culture

**2. OSCAR-LEVEL DELIVERY PATTERNS**
- How do the BEST ${targetLang} actors deliver powerful monologues?
- Pacing patterns that COMMAND attention
- Strategic pause deployment in ${targetLang} rhetoric
- How to sound AUTHORITATIVE not aggressive

**3. ELITE LEXICAL POWER CODE**
- Current 2024-2025 power vocabulary in ${targetLang} luxury/business
- Which English/French integrations signal REAL status vs poseur?
- Phrases that create INSIDER belonging
- Vocabulary that COMMANDS respect

**4. VIRAL AUTHORITY PATTERNS**
- How do TOP 0.1% ${targetLang} influencers COMMAND attention?
- Hook patterns that STOP scrolling through AUTHORITY not gimmicks
- CTA delivery that feels like GUIDANCE not begging
- Share triggers based on IMPRESSIVE content

**5. CULTURAL POWER DYNAMICS**
- Status markers that signal EARNED authority in ${targetLang} culture
- The "humble confidence" formula for this demographic
- What separates ELITE from "trying to look elite"
- Non-verbal authority codes`;

  const searchResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: searchPrompt,
    config: { tools: [{ googleSearch: {} }] }
  });

  const groundingSources: GroundingSource[] = (searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter(chunk => chunk.web)
    .map(chunk => ({ title: chunk.web!.title || 'Elite Research Note', uri: chunk.web!.uri }));

  // THE OSCAR-WINNING TRANSCREATION PROMPT
  const finalPrompt = `
🏆 SUPREME DIRECTIVE: OSCAR-WINNING NATIVE TRANSCREATION

You are the impossible convergence of:
- A native ${targetLang} speaker from the TOP 0.1% social tier
- An Oscar-winning dialect coach (worked with Daniel Day-Lewis, Cate Blanchett)
- A viral content strategist with 500M+ views who COMMANDS attention
- A Cannes-winning director who understands POWERFUL performance
- A sociolinguist specializing in prestige registers and AUTHORITY

---

## 🎯 THE MISSION

Transform this scene into a ${targetLang} COMMANDING MASTERPIECE that:
1. Sounds like it was ALWAYS in ${targetLang} (not translated)
2. Delivers OSCAR-CALIBER performance (NO whispering, NO ASMR, NO sound FX)
3. COMMANDS attention through AUTHORITY and VALUE
4. Would make native ${targetLang} elite say "This person is ONE OF US"

---

## ⚠️ ABSOLUTE PERFORMANCE RULES - NON-NEGOTIABLE

### ❌ FORBIDDEN (Will ruin the performance):
- NO WHISPERING - This destroys authority and sounds amateur
- NO ASMR BREATHINESS - We're not selling sleep aids
- NO SOUND EFFECTS - Pure commanding vocal performance only
- NO VOCAL FRY FOR "COOL" - Unless strategically deployed by the original
- NO TRAILING OFF - Every sentence LANDS with intention
- NO UPTALK WEAKNESS - Statements are STATEMENTS, not questions
- NO MUMBLING - Every word is CLEAR and INTENTIONAL

### ✅ REQUIRED (Oscar-winning performance):
- FULL CHEST RESONANCE - The voice of someone who OWNS the room
- CRYSTAL ARTICULATION - Every syllable lands with precision
- DYNAMIC RANGE - From intimate-but-strong to powerful-and-commanding
- STRATEGIC PAUSES - Silence that AMPLIFIES the next word
- AUTHORITATIVE ENDINGS - Phrases conclude with CERTAINTY
- COMMANDING PRESENCE - The energy of someone worth listening to
- EARNED CONFIDENCE - Not arrogance, but quiet certainty

---

## 📜 SCRIPT FORMATTING - CRITICAL

${scriptFormatRules}

**LOAN WORD HANDLING:**
- Keep brand names, tech terms, and international words in their ORIGINAL SCRIPT
- Integrate them NATURALLY as elite ${targetLang} speakers actually do
- Example: A Moroccan elite says "هَذَا الـ iPhone" not "هَذَا الآيفُون"
- Example: Spanish elite says "¡Este iPhone es increíble!" not "¡Este aifon es increíble!"

---

## 📊 SOURCE INTELLIGENCE

### Original Performance DNA:
- **Persona**: ${context.persona.description}
- **Psychological Core**: ${context.persona.psychologicalProfile}
- **Vocal Archetype**: ${context.persona.vocalArchetype}
- **Status Register**: ${context.persona.socialRegister}
- **Visual Style**: ${context.cinematography.visualStyle}
- **Key Vocabulary**: ${context.persona.keyVocabulary.join(', ')}

### Verified Scene Script:
${verifiedScript}

### Live Cultural Intelligence (${targetLang} Elite):
${searchResponse.text}

---

## 🎬 THE OSCAR-WINNING TRANSCREATION PROTOCOL

### STEP 1: CULTURAL POWER TRANSMUTATION

Find the ${targetLang} NATIVE EQUIVALENT that COMMANDS:
- What would the most RESPECTED ${targetLang} voice in this niche say?
- What authority markers resonate with THIS elite audience?
- How does POWER humor land in this culture?
- What makes someone UNDENIABLY elite here?

### STEP 2: COMMANDING PHONETIC ENGINEERING

Create pronunciation that projects AUTHORITY:
- Full vowels, crisp consonants (no lazy mumbling)
- Strategic emphasis on POWER WORDS
- The specific way ${targetLang} LEADERS handle loanwords
- Breath control for SUSTAINED delivery (not gasping whispers)
- Pauses that CREATE anticipation, not awkward silence

### STEP 3: OSCAR-LEVEL PERFORMANCE BLUEPRINT

**VOICE DIRECTION (World-Class):**
- Projection: 7-9/10 (room-filling without shouting)
- Chest Resonance: 70%+ (grounded authority)
- Articulation: Crystal clear, every consonant lands
- Dynamic Range: Soft-but-strong to powerful-and-commanding
- Breath: Controlled, invisible, supporting the voice
- Speed: Deliberate, never rushed, never dragging

**PHYSICAL DIRECTION (Oscar-Caliber):**
- Eyes: ALIVE and PRESENT, direct engagement
- Posture: Open, centered, confident stillness
- Micro-expressions: Purposeful, not twitchy
- Gestures: Economical, meaningful, authoritative

**ENERGY DIRECTION (Maximum Engagement):**
- Entry: Confident arrival, immediate command
- Build: Strategic escalation to key moments
- Peak: Full power delivery on crucial points
- Resolution: Authoritative conclusion, lasting impression

### STEP 4: VIRAL AUTHORITY OPTIMIZATION

Maximize for ${targetLang} social media through COMMAND not gimmicks:
- Hook: IMMEDIATE value/authority signal (0-1s)
- Retention: COMPELLING delivery that rewards attention
- Peak: MEMORABLE moment worth sharing
- CTA: GUIDANCE from authority, not begging

---

## 📋 OUTPUT REQUIREMENTS

Generate a COMPLETE Oscar-winning transcreation:

1. **The Script**: EXACT ${targetLang} text with FULL formatting (Shakl for Arabic, ¡¿ for Spanish, all accents)
   - Loan words in ORIGINAL script (Latin for English/French terms)
   - Every diacritical mark present for Arabic dialects
   - Every accent mark present for Spanish/French

2. **IPA Transcription**: Precise phonetics with AUTHORITY markers
   - No breathy notation - FULL VOICE
   - Stress patterns that COMMAND

3. **Performance Score**: Beat-by-beat OSCAR-LEVEL direction
   - NO whisper directions
   - NO ASMR cues
   - COMMANDING presence throughout

4. **Director's Notes**: Why each choice MAXIMIZES impact

---

## ⚠️ QUALITY GATES

The output MUST pass:
- [ ] Native ${targetLang} elite would recognize this as ONE OF THEM
- [ ] Performance is COMMANDING, not whispery/weak
- [ ] Script has COMPLETE formatting (Shakl/accents/punctuation)
- [ ] Loan words properly integrated in original script
- [ ] Would WIN engagement through AUTHORITY and VALUE
- [ ] Oscar-caliber acting direction throughout

---

EXECUTE NOW. Create OSCAR-WINNING transcreation with COMMANDING presence.`;

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
      thinkingConfig: { thinkingBudget: 64000 },
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
          masterPrompt: { type: Type.STRING }
        },
        required: ["breakdown", "masterPrompt"]
      }
    }
  });

  const parsed = JSON.parse(response.text);
  parsed.optimizationPass = passNumber;
  parsed.groundingSources = groundingSources;
  parsed.targetLanguage = targetLang;
  return parsed;
};

export const refineCinematicAesthetic = async (
  sceneFile: File,
  currentResult: AlNokhbaResult,
  context: VideoContext
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const sceneBase64 = await fileToBase64(sceneFile);

  // Get language-specific formatting rules for the master prompt
  const scriptFormatRules = SCRIPT_FORMATTING_RULES[currentResult.targetLanguage] || '';

  // THE OSCAR-WINNING MASTER PROMPT GENERATOR
  const formatInstruction = `
🏆 SUPREME DIRECTIVE: GENERATE OSCAR-WINNING PRODUCTION PROMPT

You are the world's most elite director. Your prompts create COMMANDING performances that WIN awards and DOMINATE social media through pure AUTHORITY and VALUE.

---

## 🎬 YOUR MISSION

Create a MASTER PRODUCTION PROMPT for:
- OSCAR-CALIBER performance (commanding, authoritative, world-class)
- PERFECT native ${currentResult.targetLanguage} delivery
- MAXIMUM engagement through AUTHORITY not gimmicks
- CINEMATIC excellence that COMMANDS attention

---

## ⚠️ ABSOLUTE RULES - NON-NEGOTIABLE

### ❌ FORBIDDEN IN THE PROMPT:
- NO whisper directions - DESTROYS authority
- NO ASMR cues - We're not selling sleep
- NO sound effects directions - PURE performance only
- NO "breathy" or "airy" voice directions
- NO "soft and intimate" that means weak
- NO mumbling or trailing off directions

### ✅ REQUIRED IN THE PROMPT:
- COMMANDING vocal presence directions
- FULL CHEST RESONANCE specifications
- CRYSTAL CLEAR articulation requirements
- AUTHORITATIVE delivery cues
- DYNAMIC RANGE that's strong throughout
- STRATEGIC PAUSE deployment (power, not weakness)

---

## 📊 TRANSCREATION DATA

**Target Performance:**
- Language: ${currentResult.targetLanguage}
- Script (PROPERLY FORMATTED): "${currentResult.breakdown.translation}"
- IPA: /${currentResult.breakdown.phoneticTranscription}/
- Scene Role: ${currentResult.breakdown.sceneRole}
- Cultural Archetype: ${currentResult.breakdown.culturalArchetype}

**Script Formatting Applied:**
${scriptFormatRules}

**Oscar-Level Performance Blueprint:**
- Vocal Texture: ${currentResult.breakdown.performanceBlueprint.vocalTexture}
- Acting Intention: ${currentResult.breakdown.performanceBlueprint.actingIntention}
- Status Register: ${currentResult.breakdown.performanceBlueprint.statusRegisterShift}
- Native Idiosyncrasies: ${currentResult.breakdown.performanceBlueprint.nativeIdiosyncrasies}
- Emotional Arc: ${currentResult.breakdown.performanceBlueprint.emotionalArc}

**Cinematic Direction:**
- Lighting: ${currentResult.breakdown.cinematicDirection.lightingMood}
- Camera: ${currentResult.breakdown.cinematicDirection.cameraMovement}
- Color: ${currentResult.breakdown.cinematicDirection.colorPalette}
- Composition: ${currentResult.breakdown.cinematicDirection.shotComposition}

**Original Persona DNA:**
- Archetype: ${context.persona.vocalArchetype}
- Visual Style: ${context.cinematography.visualStyle}
- Psychological Profile: ${context.persona.psychologicalProfile}

---

## 🎯 MASTER PROMPT ARCHITECTURE

### SECTION 1: SCENE & SUBJECT (The World)

[SETTING]
- Location with ${currentResult.targetLanguage} elite cultural markers
- Lighting that creates AUTHORITY
- Background signaling EARNED status
- Audio: Clean, professional, no gimmicks

[SUBJECT]
- Physical presence: COMMANDING, not passive
- Wardrobe: Status-appropriate, understated excellence
- Posture: OPEN, CENTERED, CONFIDENT
- Energy: ALIVE, PRESENT, ENGAGED

### SECTION 2: OSCAR-WINNING PERFORMANCE SCORE

For EACH beat, specify:

**BEAT [X]: [NAME] (00:0X.X - 00:0X.X)**

[VOICE - COMMANDING]
- Script: "${currentResult.breakdown.translation}"
- Projection: 7-9/10 (fills the room)
- Resonance: 70%+ chest (grounded authority)
- Articulation: CRYSTAL CLEAR, every consonant lands
- Speed: Deliberate, confident, NEVER rushed or dragging
- Breath: INVISIBLE, controlled, supporting full voice
- NO whisper, NO breathiness, NO trailing off

[FACE - OSCAR-CALIBER]
- Eyes: ALIVE, DIRECT, PRESENT (not sleepy/dreamy)
- Expression: EARNED confidence, subtle command
- Micro-movements: PURPOSEFUL, not twitchy
- Energy: Someone worth listening to

[BODY - AUTHORITY]
- Posture: OPEN, GROUNDED, STILL confidence
- Gestures: ECONOMICAL, MEANINGFUL
- Stillness: The POWER of not fidgeting
- Presence: OWNS the frame

[CAMERA - MAXIMUM ENGAGEMENT]
- Movement: Serves the PERFORMANCE
- Focus: On POWER MOMENTS
- Framing: Creates AUTHORITY

### SECTION 3: TECHNICAL EXCELLENCE

[VIDEO]
- Resolution: 4K minimum
- Frame rate: Cinematic
- Color: Rich, professional
- Depth: Cinematic separation

[AUDIO]
- Voice: CLEAN, PRESENT, PROFESSIONAL
- Room: Treated, no echo
- NO sound effects, NO music bed, PURE VOICE

### SECTION 4: AUTHENTICITY & ENGAGEMENT

[NATIVE ${currentResult.targetLanguage} MARKERS]
- Cultural authority signals
- Insider vocabulary properly deployed
- Status markers that feel EARNED
- Loan words naturally integrated

[ENGAGEMENT MAXIMIZATION]
- Hook (0-1s): IMMEDIATE authority/value
- Retention: COMMANDING delivery that REWARDS watching
- Peak: MEMORABLE moment of maximum impact
- CTA: GUIDANCE from authority position

---

## 📜 CRITICAL SCRIPT FORMAT

The script in the prompt MUST be:
${scriptFormatRules}

Example for Arabic: "شُوفُوا هَذَا الـ brand الجَدِيد" (Full Shakl + Latin loan words)
Example for Spanish: "¡Miren este nuevo look! ¿No es increíble?"

---

## ⚠️ FINAL QUALITY CHECK

Before outputting, verify:
- [ ] ZERO whisper/ASMR/breathy directions
- [ ] ZERO sound effect cues
- [ ] ALL voice directions are COMMANDING
- [ ] Script has COMPLETE proper formatting
- [ ] Loan words in ORIGINAL script
- [ ] Performance is OSCAR-CALIBER authority

---

## OUTPUT FORMAT

Generate ONE continuous, PRODUCTION-READY prompt that creates:
- WORLD-CLASS commanding performance
- PROPER ${currentResult.targetLanguage} script formatting
- MAXIMUM engagement through AUTHORITY
- OSCAR-CALIBER acting direction

BEGIN GENERATION:`;

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
    config: { thinkingConfig: { thinkingBudget: 64000 } }
  });

  return response.text || currentResult.masterPrompt;
};
