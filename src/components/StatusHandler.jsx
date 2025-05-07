import React from 'react';
import { CircularProgress, Alert, Snackbar, Box } from '@mui/material';

const StatusHandler = ({ status, message = '', children }) => {
  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'error') {
    return <Alert severity="error">{message || 'Something went wrong.'}</Alert>;
  }

  if (status === 'success') {
    return (
      <>
        <Snackbar
          open
          message={message || 'Operation successful.'}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
        {children}
      </>
    );
  }

  return <>{children}</>;
};

export default StatusHandler;