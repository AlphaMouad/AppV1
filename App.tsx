
import React, { useState } from 'react';
import { TargetLanguage, AppState } from './types';
import { 
  analyzeVideoContext, 
  runEliteTranscreationPass, 
  transcribeVideoSceneExact, 
  refineCinematicAesthetic
} from './services/geminiService';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'upload-context',
    contextVideo: null,
    sceneVideo: null,
    contextData: null,
    targetLanguage: TargetLanguage.EMARATI,
    result: null,
    error: null,
    isRecording: false,
    processingStatus: '',
    micTranscript: null,
    exactSceneScript: null,
  });

  const handleContextUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setState(prev => ({ ...prev, contextVideo: file }));
  };

  const handleSceneUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setState(prev => ({ ...prev, sceneVideo: file, exactSceneScript: null, result: null }));
  };

  const startAnalysis = async () => {
    if (!state.contextVideo) return;
    setState(prev => ({ ...prev, step: 'analyzing-context', error: null, processingStatus: 'Deconstructing Persona DNA & Context...' }));
    try {
      const result = await analyzeVideoContext(state.contextVideo);
      setState(prev => ({ ...prev, contextData: result, step: 'upload-scene' }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, step: 'upload-context' }));
    }
  };

  const startExactTranscription = async () => {
    if (!state.sceneVideo) return;
    setState(prev => ({ ...prev, step: 'transcribing-scene', error: null, processingStatus: 'Decoding Scene Narrative Function...' }));
    try {
      const script = await transcribeVideoSceneExact(state.sceneVideo);
      setState(prev => ({ ...prev, exactSceneScript: script, step: 'upload-scene' }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: "Script extraction failed: " + err.message, step: 'upload-scene' }));
    }
  };

  const executeEliteProtocol = async () => {
    if (!state.sceneVideo || !state.contextData || !state.exactSceneScript) return;
    
    setState(prev => ({ 
      ...prev, 
      step: 'elite-processing', 
      processingStatus: 'Engineering Native Elite Transcreation...',
      error: null 
    }));

    try {
      const pass1 = await runEliteTranscreationPass(
        state.sceneVideo, 
        state.contextData, 
        state.exactSceneScript, 
        state.targetLanguage, 
        1
      );

      setState(prev => ({ ...prev, processingStatus: 'Synthesizing World-Class Masterclass...' }));
      const refinedPrompt = await refineCinematicAesthetic(state.sceneVideo!, pass1, state.contextData!);

      setState(prev => ({
        ...prev,
        step: 'result',
        processingStatus: '',
        result: {
          ...pass1,
          masterPrompt: refinedPrompt
        }
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, step: 'upload-scene' }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Elite Performance Blueprint Exported.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-12 bg-[#020617] text-slate-200">
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-16 gap-12 border-b border-white/5 pb-12">
        <div className="text-center md:text-left">
          <h1 className="text-[8rem] md:text-[10rem] font-black font-serif italic tracking-tighter gold-glow text-white animate-pulse leading-none select-none">
            AL-NOKHBA
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-0.5 w-16 bg-yellow-600/40"></div>
            <p className="text-yellow-600 font-bold uppercase text-[12px] tracking-[1.5em] italic">Elite Performance Protocol v6.5</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl glass rounded-[4rem] shadow-[0_80px_150px_rgba(0,0,0,0.9)] overflow-hidden p-8 md:p-20 relative ring-1 ring-white/5 bg-gradient-to-br from-[#020617] via-[#020617] to-[#0a0a0f]">
        {state.error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-12 py-6 rounded-[2rem] mb-12 flex justify-between items-center animate-shake">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase">SYSTEM ERROR: {state.error}</span>
            <button onClick={() => setState(s => ({...s, error: null}))} className="hover:text-white transition-opacity font-black">✕</button>
          </div>
        )}

        {state.step === 'upload-context' && (
          <div className="space-y-16 py-12">
            <div className="relative border-2 border-dashed border-white/5 rounded-[4rem] p-20 md:p-32 text-center group hover:border-yellow-600/30 transition-all duration-1000 cursor-pointer bg-slate-950/20 shadow-2xl">
              <input type="file" accept="video/*" onChange={handleContextUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className="space-y-10 relative z-10">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-900/60 rounded-full flex items-center justify-center mx-auto text-yellow-600 group-hover:scale-110 transition-all duration-700 border border-white/5 group-hover:border-yellow-600/40">
                  <svg className="w-16 h-16 md:w-20 md:h-20 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-white font-serif tracking-tighter uppercase mb-4 italic">Full Context DNA</h3>
                <p className="text-slate-500 text-xs tracking-[0.5em] uppercase">Upload full video for persona & context mapping</p>
              </div>
            </div>
            <Button className="w-full py-10 md:py-12 text-2xl md:text-3xl font-black rounded-[3rem] bg-white text-slate-950 hover:bg-slate-200 tracking-tighter font-serif italic shadow-3xl" disabled={!state.contextVideo} onClick={startAnalysis}>MAP PERSONA & CONTEXT</Button>
          </div>
        )}

        {(state.step === 'analyzing-context' || state.step === 'transcribing-scene' || state.step === 'elite-processing') && (
          <div className="py-48 text-center space-y-20">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-yellow-600 animate-[spin_1s_linear_infinite]"></div>
              <div className="text-yellow-600 font-black text-[10px] tracking-widest uppercase animate-pulse">DIRECTOR MONITOR</div>
            </div>
            <h3 className="text-4xl md:text-7xl font-black text-white font-serif tracking-tighter uppercase italic px-4">
              {state.processingStatus || 'Initializing Elite Directing Engine...'}
            </h3>
          </div>
        )}

        {state.step === 'upload-scene' && state.contextData && (
          <div className="space-y-16 animate-fadeIn">
            {/* Persona Deep Dive Card */}
            <div className="bg-slate-950/40 p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-2xl mb-12">
               <div className="flex justify-between items-center">
                 <h4 className="text-[12px] font-black text-yellow-600 uppercase tracking-[1em] italic">Decoded Narrative Architecture</h4>
                 <div className="flex gap-4">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">{state.contextData.persona.socialRegister}</span>
                    <span className="text-[10px] bg-white/5 text-slate-500 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">{state.contextData.persona.vocalArchetype}</span>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <p className="text-xl font-serif italic text-white/80 leading-relaxed">{state.contextData.persona.description}</p>
                     <div className="space-y-4">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-60">Status-Signal Vocabulary</span>
                        <div className="flex flex-wrap gap-2">
                            {state.contextData.persona.keyVocabulary.map((v, i) => (
                              <span key={i} className="px-3 py-1 bg-white/5 rounded-md text-[9px] font-mono text-slate-400 border border-white/5 uppercase tracking-tighter">{v}</span>
                            ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-60">Linguistic Fingerprint</span>
                        <p className="text-sm font-mono text-slate-300 mt-2 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">{state.contextData.linguisticFingerprint}</p>
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-60">Psychological Motivation</span>
                        <p className="text-sm font-mono text-slate-300 mt-2">{state.contextData.persona.psychologicalProfile}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] ml-6 opacity-50 italic">Target Elite Register</label>
                <select 
                  value={state.targetLanguage}
                  onChange={(e) => setState(prev => ({ ...prev, targetLanguage: e.target.value as TargetLanguage }))}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-[2.5rem] px-8 md:px-12 py-6 md:py-8 text-white font-serif italic text-2xl md:text-3xl outline-none shadow-3xl appearance-none cursor-pointer hover:border-yellow-600/30 transition-all"
                >
                  {Object.values(TargetLanguage).map(lang => (
                    <option key={lang} value={lang} className="bg-slate-900 text-white">{lang}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] ml-6 opacity-50 italic">Scene to Master</label>
                <div className="relative">
                  <input type="file" accept="video/*" onChange={handleSceneUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="bg-slate-950/60 border border-white/5 rounded-[2.5rem] px-8 md:px-12 py-6 md:py-8 text-slate-400 font-serif italic text-xl md:text-2xl truncate shadow-3xl flex items-center justify-between">
                    <span>{state.sceneVideo ? state.sceneVideo.name : "Select Scene File..."}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 pt-8">
              <Button 
                variant="outline" 
                className="flex-1 py-8 md:py-10 text-xl md:text-2xl font-black rounded-[3rem] font-serif italic tracking-tighter" 
                disabled={!state.sceneVideo} 
                onClick={startExactTranscription} 
              >
                {state.exactSceneScript ? 'Scene Function Decoded' : 'Decode Scene Narrative Beat'}
              </Button>
              <Button className="flex-1 py-8 md:py-10 text-2xl md:text-3xl font-black rounded-[3rem] bg-white text-slate-950 hover:bg-slate-200 font-serif italic tracking-tighter shadow-3xl" disabled={!state.sceneVideo || !state.exactSceneScript} onClick={executeEliteProtocol}>PRODUCE NATIVE MASTERPIECE</Button>
            </div>
          </div>
        )}

        {state.step === 'result' && state.result && (
          <div className="space-y-16 animate-fadeIn pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/5 pb-10 gap-6">
              <div className="space-y-4">
                <h3 className="text-6xl md:text-8xl font-black text-white font-serif tracking-tighter uppercase italic gold-glow leading-none">Native Masterpiece</h3>
                <div className="flex flex-wrap gap-4">
                  <span className="px-6 py-2 bg-yellow-600/20 text-yellow-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-yellow-600/30">SCENE ROLE: {state.result.breakdown.sceneRole}</span>
                  <span className="px-6 py-2 bg-indigo-600/20 text-indigo-400 rounded-full text-[10px] font-black tracking-widest uppercase border border-indigo-500/30">PASSED: ELITE AUTHENTICITY</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => copyToClipboard(state.result!.masterPrompt)} className="px-10 py-4 bg-white text-black font-black uppercase text-xs rounded-full hover:bg-slate-200 transition-all tracking-widest italic font-serif shadow-xl">Export Blueprint</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-8 space-y-12">
                 {/* Production Master View */}
                 <div className="bg-black/90 p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col h-[600px] md:h-[900px]">
                    <div className="flex justify-between items-center mb-10">
                       <h5 className="text-[12px] font-black text-yellow-600 uppercase tracking-[1em] italic flex items-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        AL-NOKHBA NATIVE MASTERCLASS
                       </h5>
                       <span className="text-[10px] text-slate-500 uppercase tracking-widest">Better Than Original Performance</span>
                    </div>
                    <div className="flex-1 bg-slate-950/40 p-8 md:p-12 rounded-[2.5rem] border border-white/5 overflow-y-auto custom-scrollbar custom-markdown">
                       <pre className="text-slate-100 text-lg md:text-xl font-mono whitespace-pre-wrap leading-[1.8]">
                         {state.result.masterPrompt}
                       </pre>
                    </div>
                 </div>

                 {/* Transcreation Philosophy */}
                 <div className="bg-slate-950/40 p-12 rounded-[3rem] border border-white/5 space-y-4 shadow-2xl">
                    <h4 className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.8em] italic">Transcreation Philosophy</h4>
                    <p className="text-xl font-serif italic text-white/90 leading-relaxed">{state.result.breakdown.transcreationPhilosophy}</p>
                 </div>

                 {/* Directive Acting Masterclass */}
                 <div className="space-y-12">
                    <div className="flex items-center gap-4">
                       <div className="h-px flex-1 bg-white/5"></div>
                       <h4 className="text-[14px] font-black text-white uppercase tracking-[1.5em] italic py-4">Elite Acting Archetype</h4>
                       <div className="h-px flex-1 bg-white/5"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-slate-950/40 p-12 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl">
                          <div>
                            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest opacity-60">Acting Motivation</span>
                            <p className="text-2xl font-serif italic text-white mt-3 leading-relaxed">{state.result.breakdown.performanceBlueprint.actingMotivation}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest opacity-60">Social Signaling Logic</span>
                            <p className="text-lg font-serif italic text-white/70 mt-3 leading-relaxed">{state.result.breakdown.performanceBlueprint.socialSignalingLogic}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest opacity-60">Status Register</span>
                            <p className="text-xl font-serif italic text-white/70 mt-3 leading-relaxed">{state.result.breakdown.performanceBlueprint.statusRegisterShift}</p>
                          </div>
                       </div>

                       <div className="bg-slate-950/40 p-12 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Native Idiosyncrasies</span>
                               <p className="text-lg font-mono text-slate-300 mt-2">{state.result.breakdown.performanceBlueprint.nativeIdiosyncrasies}</p>
                            </div>
                            <div>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vocal Texture</span>
                               <p className="text-lg font-mono text-slate-300 mt-2">{state.result.breakdown.performanceBlueprint.vocalTexture}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cultural Resonance Markers</span>
                            <div className="flex flex-wrap gap-3 mt-4">
                              {state.result.breakdown.performanceBlueprint.culturalResonanceMarkers.map((cue, i) => (
                                <span key={i} className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 border border-white/10 italic hover:border-yellow-600/40 transition-all">{cue}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Native Micro-Expressions (15+ Tells)</span>
                             <div className="mt-4 grid grid-cols-1 gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-4">
                                {state.result.breakdown.performanceBlueprint.microExpressionDirectives.map((directive, i) => (
                                  <div key={i} className="text-sm font-serif italic text-slate-400 flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600/40"></div> {directive}
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>

               <div className="lg:col-span-4 space-y-8">
                  {/* Persona Overview in Result */}
                  <div className="bg-slate-950/60 p-10 rounded-[3.5rem] border border-white/5 space-y-6 shadow-2xl">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[1em] italic">Full Context Resonance</h5>
                    <div className="space-y-4">
                      <p className="text-lg font-serif italic text-white leading-snug">{state.contextData?.summary.slice(0, 150)}...</p>
                      <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">SOCIAL REGISTER</span>
                            <p className="text-xs font-mono text-indigo-400 uppercase">{state.contextData?.persona.socialRegister}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">VOCAL ARCHETYPE</span>
                            <p className="text-xs font-mono text-slate-400 uppercase">{state.contextData?.persona.vocalArchetype}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Eye-Line & Gaze Map */}
                  <div className="bg-slate-950/60 p-10 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[1em] italic">Native Gaze Map</h5>
                    <div className="space-y-4">
                      {state.result.breakdown.performanceBlueprint.gazeDirectionMap.map((gaze, i) => (
                        <div key={i} className="flex items-center gap-5 p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                          <div className="w-4 h-4 rounded-full border border-indigo-500/40 flex items-center justify-center">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform"></div>
                          </div>
                          <span className="text-white font-serif italic text-lg leading-tight">{gaze}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Camera Choreography Panel */}
                  <div className="bg-slate-950/60 p-10 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[1em] italic">Camera Choreography</h5>
                    <div className="space-y-4">
                      {state.result.breakdown.cinematicDirection.cameraChoreography.map((cue, i) => (
                        <div key={i} className="flex flex-col gap-3 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 group hover:border-yellow-600/30 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-600 font-mono text-sm tracking-tighter">{cue.timestamp}</span>
                            <span className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-full ${cue.intensity === 'Aggressive' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                              {cue.intensity}
                            </span>
                          </div>
                          <span className="text-white font-serif italic text-xl leading-tight group-hover:text-yellow-100 transition-colors">{cue.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grounding Panel */}
                  <div className="bg-slate-950/60 p-10 rounded-[3.5rem] border border-white/5 space-y-6 shadow-2xl">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[1em] italic opacity-60">Native Register Research</h5>
                    <div className="space-y-4">
                      {state.result.groundingSources?.slice(0, 4).map((source, i) => (
                        <a key={i} href={source.uri} target="_blank" className="flex items-center gap-4 p-5 bg-black/40 rounded-2xl border border-white/5 text-xs text-slate-400 hover:text-white hover:border-yellow-600/40 transition-all">
                          <div className="w-2 h-2 rounded-full bg-yellow-600/40"></div>
                          <span className="truncate flex-1 font-serif italic">{source.title}</span>
                          <svg className="w-3 h-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-24 mb-10 text-slate-800 text-[11px] font-black uppercase tracking-[3em] opacity-10 text-center px-4">
        <span>AL-NOKHBA ELITE PERFORMANCE v6.5.0</span>
      </footer>
    </div>
  );
};

export default App;
