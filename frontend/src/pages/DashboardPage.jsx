import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Badge from '../components/Badge';

const compactText = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const periodOptions = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'all', label: 'Sempre' },
];

function formatDate(date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getDashboardParams(period) {
  if (period === 'all') return {};

  const to = new Date();
  const from = new Date(to);
  if (period === 'week') from.setDate(to.getDate() - 6);
  if (period === 'month') from.setDate(to.getDate() - 29);

  return { from: formatDate(from), to: formatDate(to) };
}

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [period, setPeriod] = useState('today');
  const [stats, setStats] = useState({ total: 0, ok: 0, nc: 0, imp: 0, conformity: 0 });
  const [byCrane, setByCrane] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [recentInspections, setRecentInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useMemo(() => getDashboardParams(period), [period]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [summary, craneData, itemData, recent] = await Promise.all([
          api.getDashboardSummary(params),
          api.getDashboardByCrane(params),
          api.getDashboardTopNcItems(params),
          api.getDashboardRecent(params),
        ]);

        setStats(summary);
        setByCrane(craneData);
        setTopItems(itemData);
        setRecentInspections(recent);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [params]);

  const maxCraneNc = useMemo(() => Math.max(1, ...byCrane.map((item) => item.ncCount || 0)), [byCrane]);
  const maxItemNc = useMemo(() => Math.max(1, ...topItems.map((item) => item.ncCount || 0)), [topItems]);

  const metricCards = [
    { label: 'Total', value: stats.total, color: 'var(--color-text-primary)' },
    { label: 'Conformidade', value: `${stats.conformity}%`, color: 'var(--color-success)' },
    { label: 'Com NC', value: stats.nc, color: 'var(--color-warning)' },
    { label: 'Impeditivos', value: stats.imp, color: 'var(--color-danger)' },
  ];

  const inspectionTotals = (inspection) => {
    const results = inspection.results || [];
    return results.reduce(
      (acc, result) => {
        if (result.answer === 'NC' || result.status === false) acc.nc += 1;
        else acc.c += 1;
        return acc;
      },
      { c: 0, nc: 0 },
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={logout} />

      <div className="container" style={{ maxWidth: '660px', paddingTop: '18px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h1 style={{ fontSize: '22px', marginBottom: '6px' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Resumo geral de inspeções</p>
        </div>

        <div className="tabs-scroll" style={{ marginBottom: '14px' }} aria-label="Filtro do dashboard">
          {periodOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setPeriod(option.id)}
              aria-pressed={period === option.id}
              style={{
                backgroundColor: period === option.id ? 'var(--color-accent)' : 'var(--color-bg-header)',
                color: period === option.id ? '#111' : 'var(--color-text-primary)',
                border: period === option.id ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                minHeight: '38px',
                fontWeight: 700,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginBottom: '14px' }}>
          {metricCards.map((card) => (
            <div
              key={card.label}
              className="card"
              style={{
                minHeight: '76px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '28px', lineHeight: 1, fontWeight: 800, color: card.color }}>{card.value}</div>
              <div style={{ marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '11px', fontWeight: 600 }}>{card.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '16px', marginBottom: '14px' }}>
          <label className="section-label">Por ponte rolante</label>
          <div style={{ display: 'grid', gap: '10px' }}>
            {byCrane.map((item) => {
              const value = item.ncCount || 0;
              const width = `${Math.max(value === 0 ? 0 : 8, (value / maxCraneNc) * 100)}%`;

              return (
                <div key={item.equipment_id} style={{ display: 'grid', gridTemplateColumns: '95px 1fr 28px', gap: '12px', alignItems: 'center' }}>
                  <span title={item.equipmentName} style={{ ...compactText, fontSize: '12px' }}>{item.equipmentName}</span>
                  <div style={{ height: '7px', borderRadius: '999px', backgroundColor: 'var(--color-bg-header)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width,
                        height: '100%',
                        borderRadius: '999px',
                        backgroundColor: value > 0 ? '#ff6370' : 'transparent',
                      }}
                    />
                  </div>
                  <strong style={{ color: value > 0 ? '#ff6370' : 'var(--color-success)', fontSize: '12px', textAlign: 'right' }}>{value}</strong>
                </div>
              );
            })}
            {!loading && byCrane.length === 0 && (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Nenhuma ponte cadastrada.</p>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '16px', marginBottom: '14px' }}>
          <label className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={13} color="#ff6370" /> Mais não conformes
          </label>
          <div style={{ display: 'grid', gap: '12px' }}>
            {topItems.map((item) => {
              const value = item.ncCount || 0;
              const width = `${Math.max(8, (value / maxItemNc) * 100)}%`;

              return (
                <div key={item.item_id} style={{ display: 'grid', gridTemplateColumns: '95px 1fr 28px', gap: '12px', alignItems: 'center' }}>
                  <span title={item.description} style={{ ...compactText, fontSize: '12px' }}>{item.description}</span>
                  <div style={{ height: '7px', borderRadius: '999px', backgroundColor: 'var(--color-bg-header)', overflow: 'hidden' }}>
                    <div style={{ width, height: '100%', borderRadius: '999px', backgroundColor: '#ff6370' }} />
                  </div>
                  <strong style={{ color: '#ff6370', fontSize: '12px', textAlign: 'right' }}>{value}</strong>
                </div>
              );
            })}
            {!loading && topItems.length === 0 && (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Nenhuma não conformidade registrada.</p>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <label className="section-label">Últimas inspeções</label>
          <div className="responsive-table">
            <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse', marginTop: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-header)', textAlign: 'left' }}>
                  <th style={{ padding: '10px', fontSize: '10px', fontWeight: '700' }}>DATA</th>
                  <th style={{ padding: '10px', fontSize: '10px', fontWeight: '700' }}>OPERADOR</th>
                  <th style={{ padding: '10px', fontSize: '10px', fontWeight: '700' }}>PONTE</th>
                  <th style={{ padding: '10px', fontSize: '10px', fontWeight: '700', textAlign: 'center' }}>C</th>
                  <th style={{ padding: '10px', fontSize: '10px', fontWeight: '700', textAlign: 'center' }}>NC</th>
                  <th style={{ padding: '10px', fontSize: '10px', fontWeight: '700', textAlign: 'center' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentInspections.map((inspection) => {
                  const totals = inspectionTotals(inspection);

                  return (
                    <tr key={inspection.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 700 }}>
                        {new Date(inspection.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td title={inspection.userName} style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 700, maxWidth: '160px', ...compactText }}>
                        {inspection.userName}
                      </td>
                      <td title={inspection.equipmentName} style={{ padding: '12px 10px', fontSize: '12px', fontWeight: 700, maxWidth: '120px', ...compactText }}>
                        {inspection.equipmentName}
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', color: 'var(--color-success)', fontWeight: 800, textAlign: 'center' }}>{totals.c}</td>
                      <td style={{ padding: '12px 10px', fontSize: '12px', color: totals.nc > 0 ? 'var(--color-danger)' : 'var(--color-text-primary)', fontWeight: 800, textAlign: 'center' }}>{totals.nc}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}><Badge type={inspection.status}>{inspection.status}</Badge></td>
                    </tr>
                  );
                })}
                {!loading && recentInspections.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      Nenhuma inspeção registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mobile-record-list">
            {recentInspections.map((inspection) => {
              const totals = inspectionTotals(inspection);

              return (
                <article key={inspection.id} className="mobile-record-card">
                  <div className="mobile-record-top">
                    <div>
                      <div className="mobile-record-title">{inspection.equipmentName}</div>
                      <div className="mobile-record-subtitle">{new Date(inspection.created_at).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <Badge type={inspection.status}>{inspection.status}</Badge>
                  </div>

                  <div className="mobile-record-grid">
                    <div className="mobile-record-field">
                      <span className="mobile-record-label">Operador</span>
                      <span className="mobile-record-value" title={inspection.userName}>{inspection.userName}</span>
                    </div>
                    <div className="mobile-record-field">
                      <span className="mobile-record-label">Resultado</span>
                      <span className="mobile-record-value">
                        <span style={{ color: 'var(--color-success)' }}>{totals.c} C</span>
                        {' / '}
                        <span style={{ color: totals.nc > 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>{totals.nc} NC</span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
            {!loading && recentInspections.length === 0 && (
              <p style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Nenhuma inspeção registrada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
