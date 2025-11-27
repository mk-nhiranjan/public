import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { hasSessionExpiredFlag, clearSessionExpiredFlag, redirectToLogin } from '../utils/auth';

const SessionExpiredModal: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (hasSessionExpiredFlag()) setOpen(true);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleClose = () => {
    try { clearSessionExpiredFlag(); } catch {}
    setOpen(false);
  };

  const handleLogin = () => {
    try { clearSessionExpiredFlag(); } catch {}
    // redirect user to Keycloak login
    redirectToLogin();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Session expired</DialogTitle>
        </DialogHeader>
        <div className="py-4 px-2 text-sm text-gray-700">Your session has expired. You need to sign in again to continue.</div>
        <DialogFooter>
          <Button variant="ghost" className=' hover:bg-gray-100' onClick={handleClose}>Close</Button>
          <Button className="ml-2 hover:bg-gray-100" onClick={handleLogin}>Sign in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionExpiredModal;
