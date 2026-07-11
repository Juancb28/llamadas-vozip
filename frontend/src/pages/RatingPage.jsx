import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function RatingPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  const enviarCalificacion = async () => {
    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_AZURE_API_URL}/api/sessions/${sessionId}/rating`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score, comment }),
        }
      );

      if (!respuesta.ok) throw new Error('Error al enviar la calificación');

      setEnviado(true);
    } catch (err) {
      setError('No se pudo enviar la calificación. Intenta de nuevo.');
    }
  };

  if (enviado) {
    return <p>Gracias por tu calificación.</p>;
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Califica tu sesión</h2>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setScore(n)}>
            {n <= score ? '★' : '☆'}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Comentario (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={enviarCalificacion} disabled={score === 0}>
        Enviar calificación
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RatingPage;