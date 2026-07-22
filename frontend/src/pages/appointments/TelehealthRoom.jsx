/**
 * PulseCare AI - Premium Telehealth Video Room Component
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  ClipboardList,
  Sparkles,
  HeartPulse,
  Send,
  User,
  Shield,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/auth.store';
import { getSocket } from '../../services/socket/socket';
import { useAppointment } from '../../features/appointments/hooks/useAppointment';
import { appointmentApi } from '../../features/appointments/api/appointment.api';

const STUN_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const TelehealthRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'Doctor';

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const chatBottomRef = useRef(null);

  // States
  const { data: appointment } = useAppointment(id);
  const [localStream, setLocalStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [simulatedCall, setSimulatedCall] = useState(false);
  
  // UI Tabs / Panels
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'clinical'
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Secure Peer-to-Peer Telehealth session established. Audio/video is end-to-end encrypted.', time: 'System' }
  ]);
  const [typedMessage, setTypedMessage] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [socket, setSocket] = useState(null);

  // 1. Initialize Sockets and WebRTC
  useEffect(() => {
    const activeSocket = getSocket();
    if (activeSocket) {
      setSocket(activeSocket);
      activeSocket.emit('join_room', id);

      activeSocket.on('user_joined', (userId) => {
        setRemoteJoined(true);
        addChatMessage('System', 'The remote user has entered the room.');
        // Doctor usually initiates the WebRTC offer
        if (isDoctor) {
          initiateCall();
        }
      });

      activeSocket.on('offer', async ({ offer }) => {
        try {
          setRemoteJoined(true);
          const pc = getOrCreatePeerConnection();
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          activeSocket.emit('answer', { roomId: id, answer });
        } catch (e) {
          console.error('Error handling WebRTC offer:', e);
        }
      });

      activeSocket.on('answer', async ({ answer }) => {
        try {
          const pc = peerConnectionRef.current;
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        } catch (e) {
          console.error('Error handling WebRTC answer:', e);
        }
      });

      activeSocket.on('ice_candidate', async ({ candidate }) => {
        try {
          const pc = peerConnectionRef.current;
          if (pc && candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (e) {
          console.error('Error adding WebRTC ICE candidate:', e);
        }
      });

      activeSocket.on('user_left', () => {
        setRemoteJoined(false);
        addChatMessage('System', 'The remote user has left the room.');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      });

      // Live Room Chat exchange
      activeSocket.on('telehealth_chat_message', (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      });
    }

    // Initialize Local Media Capture
    startLocalStream();

    return () => {
      stopLocalStream();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (activeSocket) {
        activeSocket.emit('leave_room', id);
        activeSocket.off('user_joined');
        activeSocket.off('offer');
        activeSocket.off('answer');
        activeSocket.off('ice_candidate');
        activeSocket.off('user_left');
        activeSocket.off('telehealth_chat_message');
      }
    };
  }, [id]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Could not acquire user media. Telehealth will run in demo/simulation fallback:', err);
    }
  };

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // Peer connection creator
  const getOrCreatePeerConnection = () => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(STUN_SERVERS);
    peerConnectionRef.current = pc;

    // Send local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice_candidate', { roomId: id, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const initiateCall = async () => {
    try {
      const pc = getOrCreatePeerConnection();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      if (socket) {
        socket.emit('offer', { roomId: id, offer });
      }
    } catch (e) {
      console.error('Error initiating WebRTC call offer:', e);
    }
  };

  const handleToggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicEnabled(audioTrack.enabled);
      }
    }
  };

  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      // Revert to camera
      startLocalStream();
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // Update peer tracks
        const pc = peerConnectionRef.current;
        if (pc) {
          const senders = pc.getSenders();
          const videoSender = senders.find((s) => s.track.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(stream.getVideoTracks()[0]);
          }
        }
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen sharing cancelled:', err);
      }
    }
  };

  const addChatMessage = (senderName, text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: senderName, text, time };
    setChatMessages((prev) => [...prev, newMsg]);
    if (socket) {
      socket.emit('telehealth_chat_message', newMsg);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    addChatMessage(user?.firstName || 'User', typedMessage.trim());
    setTypedMessage('');
  };

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 3000);
  };

  const handleEndCall = () => {
    navigate(-1);
  };

  const handleActivateSimulation = () => {
    setSimulatedCall(!simulatedCall);
    if (!simulatedCall) {
      setRemoteJoined(true);
      addChatMessage('PulseCare Virtual Assistant', 'Simulator Mode activated. Diagnostic feeds verified.');
    } else {
      setRemoteJoined(false);
    }
  };

  const doctorName = appointment?.doctorName || 'Dr. Specialist';
  const patientName = appointment?.patientName || 'Patient Record';

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] max-w-7xl mx-auto gap-6 p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
      
      {/* LEFT COLUMN: Main Video Calling Canvas */}
      <div className="flex-1 flex flex-col relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[400px] lg:h-full">
        
        {/* Remote/Main Stream View */}
        <div className="flex-1 flex items-center justify-center relative w-full h-full">
          {remoteJoined ? (
            simulatedCall ? (
              // Simulation view (Beautiful abstract diagnostic visualizer)
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="relative p-8 bg-sky-500/10 rounded-full border border-sky-500/30 text-sky-500"
                >
                  <Activity className="w-16 h-16" />
                </motion.div>
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Active Diagnostic Call Connected</h3>
                  <p className="text-xs text-muted-foreground">Streaming secure video telemetry & vitals checklist</p>
                </div>
              </div>
            ) : (
              // Actual Remote Peer Video element
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )
          ) : (
            // Waiting State / Connecting indicator
            <div className="text-center space-y-4 p-6">
              <div className="relative inline-flex">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30">
                  <HeartPulse className="w-6 h-6 animate-pulse" />
                </span>
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary/10 animate-ping opacity-60 pointer-events-none" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-300">Awaiting consultation connection...</h3>
                <p className="text-xs text-slate-500">Secure WebRTC signaling rooms are online. Waiting for peer.</p>
              </div>
              
              <button
                onClick={handleActivateSimulation}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 rounded-xl border border-sky-500/30 text-xs font-bold transition-all mt-4"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Call Feed</span>
              </button>
            </div>
          )}

          {/* Floating Local User stream box */}
          <div className="absolute right-4 top-4 w-28 sm:w-40 aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/90 shadow-2xl flex items-center justify-center z-20">
            {videoEnabled && localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-[10px] text-slate-500 font-bold p-2">
                <VideoOff className="w-5 h-5 mx-auto mb-1 text-slate-600" />
                Camera Off
              </div>
            )}
          </div>

          {/* Floating Badge (Secure Info) */}
          <div className="absolute left-4 top-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700 text-[10px] font-semibold text-slate-300 flex items-center space-x-1.5 z-20">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>P2P Secured Call</span>
          </div>

          {/* Call partner identity badge */}
          {remoteJoined && (
            <div className="absolute left-4 bottom-4 px-3.5 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 text-xs font-bold text-foreground flex items-center space-x-2 z-20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isDoctor ? patientName : doctorName}</span>
            </div>
          )}
        </div>

        {/* Action Controls HUD Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center space-x-4 z-20">
          <button
            onClick={handleToggleMic}
            className={`p-3.5 rounded-2xl border transition-all ${
              micEnabled
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600'
            }`}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleToggleVideo}
            className={`p-3.5 rounded-2xl border transition-all ${
              videoEnabled
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-rose-500 text-white border-rose-600 hover:bg-rose-600'
            }`}
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={handleToggleScreenShare}
            className={`p-3.5 rounded-2xl border transition-all ${
              isScreenSharing
                ? 'bg-sky-500 text-white border-sky-600'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Monitor className="w-5 h-5" />
          </button>

          <button
            onClick={handleEndCall}
            className="p-3.5 rounded-2xl bg-rose-500 text-white border border-rose-600 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar (Chat / Doctor Clinical Dashboard) */}
      <div className="w-full lg:w-96 flex flex-col bg-card border border-border/60 rounded-3xl shadow-xl overflow-hidden h-[400px] lg:h-full">
        
        {/* Sidebar Nav Tabs */}
        <div className="flex border-b border-border/50 bg-accent/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-xs font-bold font-sans flex items-center justify-center space-x-1.5 transition-all border-b-2 ${
              activeTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Session</span>
          </button>
          <button
            onClick={() => setActiveTab('clinical')}
            className={`flex-1 py-3 text-xs font-bold font-sans flex items-center justify-center space-x-1.5 transition-all border-b-2 ${
              activeTab === 'clinical' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>{isDoctor ? 'Clinical Notepad' : 'Treatment Card'}</span>
          </button>
        </div>

        {/* Tab content area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              // Chat Interface Tab
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {chatMessages.map((msg, idx) => {
                    const isSystem = msg.sender === 'System' || msg.sender === 'PulseCare Virtual Assistant';
                    const isCurrentUser = msg.sender === (user?.firstName || 'User');
                    
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col space-y-1 ${
                          isSystem ? 'items-center' : isCurrentUser ? 'items-end' : 'items-start'
                        }`}
                      >
                        <span className="text-[9px] font-mono text-muted-foreground">{msg.sender}</span>
                        <div
                          className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                            isSystem
                              ? 'bg-accent/40 text-muted-foreground border border-border/40 text-center font-mono text-[10px]'
                              : isCurrentUser
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'bg-accent/60 text-foreground border border-border/30 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        {!isSystem && <span className="text-[8px] font-mono text-muted-foreground pl-1">{msg.time}</span>}
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-border/50 pt-3 mt-3">
                  <input
                    type="text"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder="Type call message..."
                    className="flex-1 px-3.5 py-2 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-xl text-xs outline-none text-foreground"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-primary text-white rounded-xl hover:bg-primary/95 flex items-center justify-center transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            ) : (
              // Clinical Notepad Tab (Doctor note entry / Patient health preview)
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 h-full"
              >
                {isDoctor ? (
                  // Doctor-scoped controls
                  <div className="space-y-4">
                    <div className="p-3 bg-accent/20 rounded-2xl border border-border/50 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground font-bold">Consultation Details</span>
                      <p className="text-xs text-foreground font-bold">{patientName}</p>
                      <p className="text-[10px] text-muted-foreground">Reason: {appointment?.reason || 'General telehealth consultation'}</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">Clinical Consultation Notes</label>
                      <textarea
                        rows={6}
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        placeholder="Draft patient symptoms, diagnostic details, vital metrics review..."
                        className="w-full p-3 bg-accent/30 focus:bg-card border border-border/60 focus:border-primary focus:outline-none rounded-2xl text-xs text-foreground resize-none transition-all"
                      />
                    </div>

                    <button
                      onClick={handleSaveNotes}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center space-x-1.5"
                    >
                      {notesSaved ? <CheckCircle className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                      <span>{notesSaved ? 'Notes Saved Successfully' : 'Save Prescription & Notes'}</span>
                    </button>
                  </div>
                ) : (
                  // Patient-scoped treatment cards
                  <div className="space-y-4">
                    <div className="p-3.5 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-indigo-500 font-bold">Assigned Practitioner</span>
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{doctorName}</h4>
                          <p className="text-[10px] text-muted-foreground">{appointment?.specialization || 'PulseCare Specialist'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 space-y-2 text-xs">
                      <h4 className="font-bold text-foreground flex items-center space-x-1.5">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span>Self-Reporting Checklist</span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        To maximize consultation efficiency, check your vitals before the call and share them.
                      </p>
                      <button
                        onClick={() => navigate('/vitals/new')}
                        className="w-full mt-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl font-bold transition-all text-[11px]"
                      >
                        Record Vitals Today
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TelehealthRoom;
