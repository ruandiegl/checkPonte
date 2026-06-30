import React, { useCallback, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { Plus, Users, Settings, ClipboardList } from 'lucide-react';

const ManagementPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState([]);

  const loadData = useCallback(async () => {
    try {
      if (activeTab === 'users') setData(await api.getUsers());
      else if (activeTab === 'equipment') setData(await api.getEquipment());
      else if (activeTab === 'items') setData(await api.getAllItems());
    } catch (err) {
      alert(err.message);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs = [
    { id: 'users', label: 'Usuários', icon: <Users size={16} /> },
    { id: 'equipment', label: 'Equipamentos', icon: <Settings size={16} /> },
    { id: 'items', label: 'Itens de Verificação', icon: <ClipboardList size={16} /> },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1>Gestão do Sistema</h1>
          <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> ADICIONAR NOVO
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-bg-card)',
                color: activeTab === tab.id ? '#111' : '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-header)', textAlign: 'left' }}>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>
                  {activeTab === 'users' ? 'NOME' : 'DESCRIÇÃO'}
                </th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>
                  {activeTab === 'users' ? 'USUÁRIO' : (activeTab === 'equipment' ? 'DETALHES' : 'IMPEDITIVO')}
                </th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>STATUS</th>
                <th style={{ padding: '12px', fontSize: '11px', fontWeight: '600' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>#{item.id}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    {activeTab === 'users' ? item.name : item.description || item.name}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    {activeTab === 'users' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.username} <Badge type={item.role}>{item.role}</Badge>
                      </div>
                    ) : (activeTab === 'equipment' ? item.description : (item.is_imperative ? 'SIM' : 'NÃO'))}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Badge type={item.active ? 'active' : 'default'}>{item.active ? 'Ativo' : 'Inativo'}</Badge>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                      EDITAR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
