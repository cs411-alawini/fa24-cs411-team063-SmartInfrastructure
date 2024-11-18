import React from 'react';
import './styles/ErrorMessage.css';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) =>
  message ? <p style={{ color: 'red', marginTop: '20px' }}>{message}</p> : null;

export default ErrorMessage;
