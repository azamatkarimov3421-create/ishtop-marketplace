import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Square,
  Image as ImageIcon, 
  DollarSign, 
  MapPin, 
  ChevronLeft, 
  Check, 
  CheckCheck, 
  Play, 
  Pause,
  User as UserIcon,
  Phone,
  Radio,
  FileText
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { ChatRoom, ChatMessage } from '../../types';
import { formatCurrency, getCurrentGpsPosition, reverseGeocodeOsm } from '../../lib/geo';

interface ChatViewProps {
  onBackToHome?: () => void;
  onOpenProfileById?: (participantId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onBackToHome, onOpenProfileById }) => {
  const { chatRooms, messages, user, actions } = useStore();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('room-1');
  const [inputText, setInputText] = useState('');
  const [showPriceOfferModal, setShowPriceOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(500000);
  const [offerNote, setOfferNote] = useState('Usta xizmati uchun kelishilgan narx');

  // Real MediaRecorder Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  // Hidden File input ref for Real Photo picking
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeRoom = chatRooms.find((r) => r.id === selectedRoomId);
  const activeMessages = selectedRoomId ? messages[selectedRoomId] || [] : [];

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedRoomId || !activeRoom) return;

    actions.sendMessage(selectedRoomId, {
      senderId: user?.id || 'current-user-id',
      receiverId: activeRoom.participantId,
      roomId: selectedRoomId,
      text: inputText.trim(),
      type: 'text',
    });

    setInputText('');
  };

  const handleSendPriceOffer = () => {
    if (!selectedRoomId || !activeRoom) return;

    actions.sendMessage(selectedRoomId, {
      senderId: user?.id || 'current-user-id',
      receiverId: activeRoom.participantId,
      roomId: selectedRoomId,
      text: `Yangi narx taklifi: ${formatCurrency(offerAmount)}`,
      type: 'price_offer',
      priceOffer: {
        amount: offerAmount,
        note: offerNote,
        status: 'pending',
      },
    });

    setShowPriceOfferModal(false);
  };

  // Real Voice Recording via MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (selectedRoomId && activeRoom) {
          actions.sendMessage(selectedRoomId, {
            senderId: user?.id || 'current-user-id',
            receiverId: activeRoom.participantId,
            roomId: selectedRoomId,
            text: `Ovozli xabar (${recordSeconds}s)`,
            type: 'voice',
            mediaUrl: audioUrl,
          });
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Mikrofondan foydalanish uchun ruxsat berishingiz kerak.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  // Real Image Upload via Camera / Device Storage
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRoomId || !activeRoom) return;

    const reader = new FileReader();
    reader.onload = () => {
      actions.sendMessage(selectedRoomId, {
        senderId: user?.id || 'current-user-id',
        receiverId: activeRoom.participantId,
        roomId: selectedRoomId,
        text: file.name,
        type: 'image',
        mediaUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Real GPS Location Sharing in Chat
  const handleShareLocation = async () => {
    if (!selectedRoomId || !activeRoom) return;
    try {
      const pos = await getCurrentGpsPosition();
      const geo = await reverseGeocodeOsm(pos.lat, pos.lng);
      actions.sendMessage(selectedRoomId, {
        senderId: user?.id || 'current-user-id',
        receiverId: activeRoom.participantId,
        roomId: selectedRoomId,
        text: `📍 Mening joylashuvim: ${geo.displayName} (Koordinata: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})`,
        type: 'location',
      });
    } catch (e) {
      alert("GPS koordinata olish uchun ruxsat bering");
    }
  };

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-80px)] flex flex-col bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 animate-fade-in">
      {/* Hidden Real File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* If No room selected or on room list */}
      {!selectedRoomId ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Xabarlar</h2>
            <p className="text-xs text-slate-500">Mijoz va ustalar bilan yozishmalar</p>
          </div>

          {/* Rooms list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
              >
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0">
                  <img src={room.participantAvatar} alt={room.participantName} className="w-full h-full object-cover" />
                  {room.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {room.participantName}
                    </h4>
                    <span className="text-[10px] text-slate-400">{room.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-brand-600 font-semibold">{room.participantProfession}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{room.lastMessage}</p>
                </div>

                {room.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {room.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Conversation Screen */
        <div className="flex-1 flex flex-col h-full bg-slate-100/70 dark:bg-slate-950">
          {/* Active Header */}
          <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSelectedRoomId(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div
                onClick={() => onOpenProfileById && activeRoom && onOpenProfileById(activeRoom.participantId)}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  <img src={activeRoom?.participantAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  {activeRoom?.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {activeRoom?.participantName}
                  </h4>
                  <p className="text-[10px] text-emerald-600 font-semibold">● Tarmoqda</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Real Phone Call Dialer */}
              <a
                href="tel:+998901234567"
                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                title="Haqiqiy telefon qo'ng'irog'i"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Tel</span>
              </a>

              {/* Price Offer Negotiation Button */}
              <button
                onClick={() => setShowPriceOfferModal(true)}
                title="Narx taklif qilish"
                className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center gap-1 hover:bg-brand-100 transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Narx</span>
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.map((msg) => {
              const isMe = msg.senderId === (user?.id || 'current-user-id');
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl shadow-sm text-xs ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-bl-xs'
                    }`}
                  >
                    {/* Normal text */}
                    {msg.type === 'text' && <p className="leading-relaxed">{msg.text}</p>}

                    {/* Location Pin */}
                    {msg.type === 'location' && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <MapPin className="w-4 h-4" />
                          <span>Ulashilgan joylashuv</span>
                        </div>
                        <p className="text-[11px] opacity-95">{msg.text}</p>
                      </div>
                    )}

                    {/* Image Message */}
                    {msg.type === 'image' && msg.mediaUrl && (
                      <div className="space-y-1.5">
                        <img
                          src={msg.mediaUrl}
                          alt="Photo"
                          className="rounded-xl w-full max-h-56 object-cover border border-white/20"
                        />
                        {msg.text && <p className="text-[11px] opacity-90">{msg.text}</p>}
                      </div>
                    )}

                    {/* Real Audio Voice Message */}
                    {msg.type === 'voice' && (
                      <div className="py-1 min-w-[200px] space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                          <span className="font-bold text-[11px]">{msg.text || "Ovozli xabar"}</span>
                        </div>
                        {msg.mediaUrl ? (
                          <audio src={msg.mediaUrl} controls className="w-full h-8 mt-1 rounded-lg" />
                        ) : (
                          <div className="flex items-center gap-2 p-1 bg-black/10 rounded-lg">
                            <Play className="w-4 h-4" />
                            <span className="text-[10px]">Ovozli xabar eshittirish</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Price Offer Card with Accept / Reject Actions */}
                    {msg.type === 'price_offer' && msg.priceOffer && (
                      <div className="p-2.5 rounded-xl bg-slate-900/10 dark:bg-black/20 border border-current/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                            Kelishilgan Narx Taklifi
                          </span>
                          <span className="font-black text-sm">
                            {formatCurrency(msg.priceOffer.amount)}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90">{msg.priceOffer.note}</p>

                        {msg.priceOffer.status === 'accepted' ? (
                          <div className="p-1.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-center font-bold text-[10px] flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Taklif qabul qilindi!
                          </div>
                        ) : msg.priceOffer.status === 'declined' ? (
                          <div className="p-1.5 bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded-lg text-center font-bold text-[10px]">
                            Taklif rad etildi
                          </div>
                        ) : (
                          <div className="flex gap-1.5 pt-1">
                            <button
                              onClick={() => actions.updatePriceOfferStatus(selectedRoomId, msg.id, 'accepted')}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] transition-colors"
                            >
                              Qabul qilish
                            </button>
                            <button
                              onClick={() => actions.updatePriceOfferStatus(selectedRoomId, msg.id, 'declined')}
                              className="py-1.5 px-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] transition-colors"
                            >
                              Rad etish
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timestamp & read status */}
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isMe ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            {/* Real Audio Mic Button */}
            {isRecording ? (
              <button
                onClick={stopRecording}
                title="Yozishni to'xtatish va yuborish"
                className="p-2.5 rounded-2xl bg-rose-600 text-white animate-pulse flex items-center gap-1.5 shadow-md"
              >
                <Square className="w-4 h-4 fill-white" />
                <span className="text-xs font-black">{recordSeconds}s</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                title="Haqiqiy ovozli xabar yozish"
                className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}

            {/* Real Image Picker */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Kamera yoki fayllardan rasm yuklash"
              className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Real GPS Location Share */}
            <button
              onClick={handleShareLocation}
              title="Jonli GPS lokatsiyani chatga yuborish"
              className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MapPin className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecording ? "Ovoz yozilmoqda..." : "Xabar yozing..."}
              disabled={isRecording}
              className="flex-1 py-2 px-3.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <button
              onClick={handleSendMessage}
              className="w-9 h-9 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-brand-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Price Offer Modal */}
      {showPriceOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-3.5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Kelishilgan Narx Taklifini Yuborish
            </h4>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Taklif summasi (so'm)</label>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Izoh / Shartlar</label>
              <input
                type="text"
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPriceOfferModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSendPriceOffer}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20"
              >
                Yuborish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
