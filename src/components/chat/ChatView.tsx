import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Image as ImageIcon, 
  DollarSign, 
  MapPin, 
  ChevronLeft, 
  Check, 
  CheckCheck, 
  Play, 
  Pause,
  User as UserIcon,
  Phone
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { ChatRoom, ChatMessage } from '../../types';
import { formatCurrency } from '../../lib/geo';

interface ChatViewProps {
  onBackToHome?: () => void;
  onOpenProfileById?: (participantId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onBackToHome, onOpenProfileById }) => {
  const { chatRooms, messages, user, actions } = useStore();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('room-1');
  const [inputText, setInputText] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [showPriceOfferModal, setShowPriceOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(500000);
  const [offerNote, setOfferNote] = useState('Usta xizmati uchun kelishilgan narx');

  const activeRoom = chatRooms.find((r) => r.id === selectedRoomId);
  const activeMessages = selectedRoomId ? messages[selectedRoomId] || [] : [];

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

  const handleSendVoiceSimulation = () => {
    if (!selectedRoomId || !activeRoom) return;

    actions.sendMessage(selectedRoomId, {
      senderId: user?.id || 'current-user-id',
      receiverId: activeRoom.participantId,
      roomId: selectedRoomId,
      text: 'Ovozli xabar (0:15)',
      type: 'voice',
    });
  };

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-80px)] flex flex-col bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 animate-fade-in">
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
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 dark:text-slate-300"
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
              <button
                onClick={() => setShowPriceOfferModal(true)}
                title="Narx taklif qilish"
                className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center gap-1 hover:bg-brand-100"
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Narx</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.map((msg) => {
              const isMe = msg.senderId === (user?.id || 'current-user-id');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-3 shadow-xs ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {/* Plain Text */}
                    {msg.type === 'text' && (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Image Message */}
                    {msg.type === 'image' && (
                      <div className="space-y-1.5">
                        <img
                          src={msg.mediaUrl || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'}
                          alt="Photo"
                          className="rounded-xl w-full max-h-48 object-cover"
                        />
                        {msg.text && <p className="text-xs">{msg.text}</p>}
                      </div>
                    )}

                    {/* Voice Message Simulation */}
                    {msg.type === 'voice' && (
                      <div className="flex items-center gap-2.5 py-1 min-w-[180px]">
                        <button
                          onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isMe ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'
                          }`}
                        >
                          {isPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <div className="flex-1">
                          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div className="h-full bg-brand-400 w-1/2"></div>
                          </div>
                          <span className="text-[10px] opacity-80 mt-1 block">0:15 / Ovozli xabar</span>
                        </div>
                      </div>
                    )}

                    {/* Price Offer Card */}
                    {msg.type === 'price_offer' && msg.priceOffer && (
                      <div className="p-2.5 rounded-xl bg-brand-50/20 border border-white/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Narx Taklifi
                          </span>
                          <span className="font-black text-sm">
                            {formatCurrency(msg.priceOffer.amount)}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90">{msg.priceOffer.note}</p>
                        <div className="flex gap-1.5 pt-1">
                          <button className="flex-1 py-1 px-2 rounded-lg bg-emerald-500 text-white font-bold text-[10px]">
                            Qabul qilish
                          </button>
                          <button className="py-1 px-2 rounded-lg bg-rose-500/80 text-white font-bold text-[10px]">
                            Rad etish
                          </button>
                        </div>
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
            <button
              onClick={handleSendVoiceSimulation}
              title="Ovozli xabar"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                actions.sendMessage(selectedRoomId, {
                  senderId: user?.id || 'current-user-id',
                  receiverId: activeRoom?.participantId || 'spec-1',
                  roomId: selectedRoomId,
                  text: 'Namunaviy rasm yuklandi',
                  type: 'image',
                  mediaUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
                });
              }}
              title="Rasm yuborish"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Xabar yozing..."
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-3.5 border border-slate-200 dark:border-slate-800">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Kelishilgan Narx Taklifini Yuborish
            </h4>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Taklif summasi (so'm)</label>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Izoh</label>
              <input
                type="text"
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPriceOfferModal(false)}
                className="flex-1 py-2 rounded-xl border text-xs font-bold"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSendPriceOffer}
                className="flex-1 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
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
