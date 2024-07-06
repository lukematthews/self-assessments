import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  open: boolean;
  onConfirm: () => void;
  onCancel?: () => void; // Optional cancel function
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  open,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleClose = () => setConfirmationOpen(false);

  useEffect(() => {
    setConfirmationOpen(open);
  }, [open]);


  const handleConfirmation = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <Dialog open={confirmationOpen} onClose={handleClose} aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleConfirmation}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
