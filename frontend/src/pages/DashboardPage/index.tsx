import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context';
import { api } from '../../services/api';
import Navbar from '../../components/Navbar';
import Badge from '../../components/Badge';
import { HorizontalBarChart, type ChartDatum } from '../../components/ui/Chart';
import { PageRoot } from './styles';
import type { DashboardCraneItem, DashboardSummary, DashboardTopItem, Inspection } from '../../types/domain';
import { getErrorMessage } from '../../types/domain';

const compactText: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const periodOptions: Array<{ id: DashboardPeriod; label: string }> = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'all', label: 'Sempre' },
];

type DashboardPeriod = 'today' | 'week' | 'month' | 'all';

function formatDate(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getDashboardParams(period: DashboardPeriod) {
  if (period === 'all') return {};

  const to = new Date();
  const from = new Date(to);
  if (period === 'week') from.setDate(to.getDate() - 6);
  if (period === 'month') from.setDate(to.getDate() - 29);

  return { from: formatDate(from), to: formatDate(to) };
}

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [period, setPeriod] = useState<DashboardPeriod>('today');
  const [stats, setStats] = useState<DashboardSummary>({ total: 0, ok: 0, nc: 0, imp: 0, conformity: 0 });
  const [byCrane, setByCrane] = useState<DashboardCraneItem[]>([]);
  const [topItems, setTopItems] = useState<DashboardTopItem[]>([]);
  const [recentInspections, setRecentInspections] = useState<Inspection[]>([]);
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
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [params]);

  const craneChartData = useMemo<ChartDatum[]>(
    () => byCrane.map((item) => {
      const value = item.ncCount || 0;
      return {
        id: item.equipment_id,
        label: item.equipmentName,
        value,
        color: value > 0 ? '#ff6370' : 'var(--color-success)',
      };
    }),
    [byCrane],
  );

  const topItemChartData = useMemo<ChartDatum[]>(
    () => topItems.map((item) => ({
      id: item.item_id,
      label: item.description,
      value: item.ncCount || 0,
      color: '#ff6370',
    })),
    [topItems],
  );

  const metricCards = [
    { label: 'Total', value: stats.total, color: 'var(--color-text-primary)' },
    { label: 'Conformidade', value: `${stats.conformity}%`, color: 'var(--color-success)' },
    { label: 'Com NC', value: stats.nc, color: 'var(--color-warning)' },
    { label: 'Impeditivos', value: stats.imp, color: 'var(--color-danger)' },
  ];

  const inspectionTotals = (inspection: Inspection) => {
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
    <PageRoot>
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

        <div style={{ display: 'grid', gap: '14px', marginBottom: '14px' }}>
          <HorizontalBarChart
            title="Por ponte rolante"
            data={loading ? [] : craneChartData}
            emptyMessage="Nenhuma ponte cadastrada."
            valueLabel="NC"
          />

          <HorizontalBarChart
            title={<><TrendingUp size={13} color="#ff6370" /> Mais nao conformes</>}
            data={loading ? [] : topItemChartData}
            emptyMessage="Nenhuma nao conformidade registrada."
            valueLabel="Ocorrencias"
          />
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
                    <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
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
    </PageRoot>
  );
};

export default DashboardPage;
