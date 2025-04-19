// src/components/ProvvigioniList.js
import React, { useState, useEffect } from 'react';
import { getProvvigioni, deleteProvvigione } from '../utils/api';

const ProvvigioniList = () => {
  const [provvigioni, setProvvigioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvvigioni = async () => {
      try {
        const data = await getProvvigioni();
        setProvvigioni(data);
        setLoading(false);
      } catch (err) {
        setError('Errore nel caricamento delle provvigioni');
        setLoading(false);
      }
    };

    fetchProvvigioni();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa provvigione?')) {
      try {
        await deleteProvvigione(id);
        setProvvigioni(provvigioni.filter(provvigione => provvigione._id !== id));
      } catch (err) {
        setError('Errore nell\'eliminazione della provvigione');
      }
    }
  };

  if (loading) return <div>Caricamento in corso...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Lista Provvigioni</h2>
      {provvigioni.length === 0 ? (
        <p>Nessuna provvigione trovata</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Agente</th>
              <th>Cliente</th>
              <th>Importo</th>
              <th>Data</th>
              <th>Stato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {provvigioni.map((provvigione) => (
              <tr key={provvigione._id}>
                <td>{provvigione.agente}</td>
                <td>{provvigione.cliente}</td>
                <td>€{provvigione.importo.toFixed(2)}</td>
                <td>{new Date(provvigione.data).toLocaleDateString()}</td>
                <td>{provvigione.stato}</td>
                <td>
                  <button onClick={() => handleDelete(provvigione._id)}>
                    Elimina
                  </button>
                  {/* Puoi aggiungere altri pulsanti per modificare, visualizzare dettagli, ecc. */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProvvigioniList;
