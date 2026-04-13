import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verificando tu cuenta...');

  const accentColor = status === 'success' ? '#0f766e' : status === 'error' ? '#dc2626' : '#2563eb';
  const statusTitle =
    status === 'loading'
      ? 'Verificando cuenta'
      : status === 'success'
        ? 'Tu cuenta ha sido activada'
        : 'No se pudo activar la cuenta';

  useEffect(() => {
    // esta pantalla toma el token que viene en el link del correo.
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('El enlace de verificacion no es valido.');
      return;
    }

    const verify = async () => {
      try {
        // aqui el frontend le pide al backend activar la cuenta usando el token del email.
        const response = await api.get('/auth/verify-email', {
          params: { token }
        });

        setStatus('success');
        setMessage(response.data.message || 'Ya puedes iniciar sesion.');
      } catch (error) {
        //si el token vencio, ya se uso o no existe, mostramos error en esta misma vista.
        setStatus('error');
        setMessage(error.response?.data?.message || 'No fue posible completar la verificacion.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at top, #f8fafc 0%, #eef2ff 45%, #e5e7eb 100%)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '560px', background: '#ffffff', borderRadius: '24px', padding: '40px 36px', boxShadow: '0 22px 60px rgba(15, 23, 42, 0.16)', borderTop: `6px solid ${accentColor}`, textAlign: 'center', color: '#111827' }}>
        <h1 style={{ margin: '0 0 12px', color: '#111827', fontSize: '32px', lineHeight: 1.1 }}>
          {statusTitle}
        </h1>
        <p style={{ margin: '0 auto', maxWidth: '420px', color: '#4b5563', fontSize: '16px', lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;