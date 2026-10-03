import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Send, Globe, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { SpecialistProfile } from '../../types';

interface ShareQRModalProps {
  isOpen: boolean;
  specialist: SpecialistProfile | null;
  onClose: () => void;
}

export const ShareQRModal: React.FC<ShareQRModalProps> = ({
  isOpen,
  specialist,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const profileUrl = specialist ? `https://ishtop.uz/user/${specialist.username}` : 'https://ishtop.uz';

  useEffect(() => {
    if (isOpen && specialist) {
      QRCode.toDataURL(profileUrl, { width: 220, margin: 1 })
        .then((url: string) => setQrDataUrl(url))
        .catch((err: any) => console.error(err));
    }
  }, [isOpen, specialist, profileUrl]);

  if (!isOpen || !specialist) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Profilni Ulashish & QR Code</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 rounded-xl shadow-xs" />
          ) : (
            <div className="w-44 h-44 bg-slate-200 animate-pulse rounded-xl" />
          )}
          <span className="text-[11px] text-slate-400 mt-2 font-medium">Kamerani yo'naltirib profilga kiring</span>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <input
            type="text"
            readOnly
            value={profileUrl}
            className="flex-1 bg-transparent px-2 text-xs text-slate-800 dark:text-slate-200 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-2 text-xs font-bold pt-1">
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(`${specialist.name} (${specialist.profession}) - IshTop platformasidagi profili`)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 flex flex-col items-center justify-center gap-1 hover:bg-sky-100"
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span>Telegram</span>
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(profileUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex flex-col items-center justify-center gap-1 hover:bg-emerald-100"
          >
            <Share2 className="w-4 h-4 text-emerald-500" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex flex-col items-center justify-center gap-1 hover:bg-blue-100"
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
};
