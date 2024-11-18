import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) =>
  message ? <p style={{ color: 'red', marginTop: '20px' }}>{message}</p> : null;

export default ErrorMessage;
