import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';
import Navbar from '../components/Navbar';
import Badge from '../components/Badge';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, ok: 0, nc: 0, imp: 0 });
  const [recentInspections, setRecentInspections] = useState([]);

  useEffect(() => {
    const inspections = mockApi.getInspections();
    const equipment = mockApi.getEquipment();
    const users = mockApi.getUsers();

    const totals = inspections.reduce((acc, curr) => {
      acc.total++;
      if (curr.status === 'OK') acc.ok++;
      if (curr.status === 'NC') acc.nc++;
      if (curr.status === 'IMP') acc.imp++;
      return acc;
    }, { total: 0, ok: 0, nc: 0, imp: 0 });

    setStats(totals);

    const enriched = inspections.slice(-5).reverse().map(insp => ({
      ...insp,
      equipmentName: equipment.find(e => e.id == insp.equipment_id)?.name,
      userName: users.find(u => u.id == insp.user_id)?.name
    }));
    setRecentInspections(enriched);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <h1 style={{ marginBottom: '30px' }}>Dashboard Operacional</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <span className="section-label">Total de Inspeções</span>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '10px' }}>{stats.total}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--color-success)' }}>
            <span className="section-label">Liberadas (OK)</span>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '10px', color: 'var(--color-success)' }}>{stats.ok}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--color-warning)' }}>
            <span className="section-label">Atenção (NC)</span>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '10px', color: 'var(--color-warning)' }}>{stats.nc}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', borderTop: '4px solid var(--color-danger)' }}>
            <span className="section-label">Bloqueadas (IMP)</span>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '10px', color: 'var(--color-danger)' }}>{stats.imp}</div>
          </div>
        </div>

        <div className="card">
          <label className="section-label">Últimas Inspeções</label>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-header)', textAlign: 'left' }}>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>DATA</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>EQUIPAMENTO</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>OPERADOR</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentInspections.map((insp) => (
                <tr key={insp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(insp.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{insp.equipmentName}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{insp.userName}</td>
                  <td style={{ padding: '12px' }}><Badge type={insp.status}>{insp.status}</Badge></td>
                </tr>
              ))}
              {recentInspections.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    Nenhuma inspeção registrada.
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

export default DashboardPage;
