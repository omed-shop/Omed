import React from 'react';
import { Lock, X, KeyRound, ShieldAlert, Check } from 'lucide-react';
import { BRAND_LOGO } from '../data/products';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = React.useState('');
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'omedyfz2026') {
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-2xl p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="h-12 w-12 rounded-lg bg-black p-1 border border-stone-800 shadow-md">
            <img src={BRAND_LOGO} alt="OMED" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 font-display">
              Espace Privé OMED
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Gestion des commandes & coordonnées clients
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Code d'accès administrateur
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Entrez le mot de passe..."
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 font-mono tracking-widest"
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-500 mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>Mot de passe incorrect.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs uppercase tracking-wider font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-800 dark:hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Déverrouiller le Tableau de Bord</span>
          </button>
        </form>
      </div>
    </div>
  );
};
