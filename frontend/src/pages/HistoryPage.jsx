import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import Navbar from '../components/Navbar';
import Badge from '../components/Badge';
import { Search, Download } from 'lucide-react';

const HistoryPage = () => {
  const { user, logout } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = mockApi.getInspections();
    const equipment = mockApi.getEquipment();
    const users = mockApi.getUsers();

    const enriched = data.map(insp => ({
      ...insp,
      equipmentName: equipment.find(e => e.id == insp.equipment_id)?.name,
      userName: users.find(u => u.id == insp.user_id)?.name
    })).reverse();

    setInspections(enriched);
  }, []);

  const filteredInspections = inspections.filter(insp =>
    insp.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insp.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insp.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Histórico de Inspeções</h1>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            <Download size={16} /> EXPORTAR EXCEL
          </button>
        </div>

        <div className="card" style={{ marginBottom: '20px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={18} color="var(--color-text-secondary)" />
          <input
            type="text"
            placeholder="Buscar por equipamento, operador ou status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'none', padding: '5px' }}
          />
        </div>

        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-header)', textAlign: 'left' }}>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>DATA</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>EQUIPAMENTO</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>OPERADOR</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>STATUS</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredInspections.map((insp) => (
                <tr key={insp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(insp.created_at).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{insp.equipmentName}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{insp.userName}</td>
                  <td style={{ padding: '12px' }}><Badge type={insp.status}>{insp.status}</Badge></td>
                  <td style={{ padding: '12px' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                      VER DETALHES
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInspections.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    Nenhuma inspeção encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
