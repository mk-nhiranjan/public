import React from 'react';
import { Button } from './ui/button';
import { X, LogIn } from 'lucide-react';
import { redirectToLogin } from '../utils/auth';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-gray-900">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Login required</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-3">You must be logged in to view this page. Continue to the login provider to sign in.</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { redirectToLogin(); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <LogIn className="w-4 h-4" />
            Continue to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
