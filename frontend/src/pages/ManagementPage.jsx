import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardList, Eye, Pencil, Plus, Power, PowerOff, Settings, Trash2, Users, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Badge from '../components/Badge';

const emptyForms = {
  users: { name: '', login: '', email: '', role: 'operator', password: '', active: true },
  equipment: { name: '', description: '', location: '', active: true },
  items: { description: '', is_imperative: false, order_index: 0, active: true },
};

const tabLabels = {
  users: 'usuário',
  equipment: 'equipamento',
  items: 'item',
};

const ManagementPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [form, setForm] = useState(emptyForms.users);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      if (activeTab === 'users') setData(await api.getUsers());
      else if (activeTab === 'equipment') setData(await api.getEquipment());
      else if (activeTab === 'items') setData(await api.getAllItems());
    } catch (err) {
      toast.error(err.message);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
    setModalMode(null);
    setSelectedItem(null);
    setForm(emptyForms[activeTab]);
  }, [activeTab, loadData]);

  const tabs = [
    { id: 'users', label: 'Usuários', icon: <Users size={16} /> },
    { id: 'equipment', label: 'Equipamentos', icon: <Settings size={16} /> },
    { id: 'items', label: 'Itens de verificação', icon: <ClipboardList size={16} /> },
  ];

  const modalTitle = useMemo(() => {
    const label = tabLabels[activeTab];
    if (modalMode === 'view') return `Detalhes do ${label}`;
    if (modalMode === 'edit') return `Editar ${label}`;
    if (modalMode === 'create') return `Novo ${label}`;
    return '';
  }, [activeTab, modalMode]);

  const getItemTitle = (item) => {
    if (activeTab === 'users') return item.name;
    return item.name || item.description;
  };

  const getItemSubtitle = (item) => {
    if (activeTab === 'users') return item.username || item.login;
    if (activeTab === 'equipment') return item.location || item.description || 'Sem local informado';
    return item.is_imperative ? 'Item impeditivo' : 'Item não impeditivo';
  };

  const openCreate = () => {
    setSelectedItem(null);
    setForm(emptyForms[activeTab]);
    setModalMode('create');
  };

  const openView = (item) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    if (activeTab === 'users') {
      setForm({
        id: item.id,
        name: item.name || '',
        login: item.login || item.username || '',
        email: item.email || '',
        role: item.role || 'operator',
        password: '',
        active: item.active,
      });
    } else if (activeTab === 'equipment') {
      setForm({
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        location: item.location || '',
        active: item.active,
      });
    } else {
      setForm({
        id: item.id,
        description: item.description || '',
        is_imperative: Boolean(item.is_imperative),
        order_index: item.order_index || 0,
        active: item.active,
      });
    }
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
    setForm(emptyForms[activeTab]);
    setSaving(false);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const buildPayload = () => {
    if (activeTab === 'users') {
      return {
        id: form.id,
        name: form.name.trim(),
        login: form.login.trim(),
        email: form.email.trim() || null,
        role: form.role,
        active: Boolean(form.active),
        ...(modalMode === 'create' ? { password: form.password } : {}),
      };
    }

    if (activeTab === 'equipment') {
      return {
        id: form.id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        active: Boolean(form.active),
      };
    }

    return {
      id: form.id,
      description: form.description.trim(),
      is_imperative: Boolean(form.is_imperative),
      order_index: Number(form.order_index || 0),
      active: Boolean(form.active),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = buildPayload();

      if (activeTab === 'users') {
        await api.saveUser(payload);
        if (modalMode === 'edit' && form.password) {
          await api.updateUserPassword(form.id, form.password);
        }
      } else if (activeTab === 'equipment') {
        await api.saveEquipment(payload);
      } else {
        await api.saveItem(payload);
      }

      await loadData();
      closeModal();
      toast.success(modalMode === 'create' ? 'Registro criado com sucesso.' : 'Registro atualizado com sucesso.');
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  };

  const openConfirmAction = (item) => {
    if (activeTab === 'users') {
      setConfirmAction({
        type: 'toggleUser',
        item,
        title: item.active ? 'Desativar usuário' : 'Reativar usuário',
        message: item.active
          ? 'Este usuário não conseguirá acessar o sistema até ser reativado.'
          : 'Este usuário voltará a acessar o sistema conforme seu perfil.',
        confirmLabel: item.active ? 'Desativar' : 'Reativar',
      });
      return;
    }

    setConfirmAction({
      type: activeTab === 'equipment' ? 'deleteEquipment' : 'deleteItem',
      item,
      title: activeTab === 'equipment' ? 'Excluir equipamento' : 'Excluir item',
      message: activeTab === 'equipment'
        ? 'O equipamento será removido do cadastro. Se houver inspeções vinculadas, a API impedirá a exclusão para preservar o histórico.'
        : 'O item será removido do checklist. Se houver respostas vinculadas, a API impedirá a exclusão para preservar o histórico.',
      confirmLabel: 'Excluir',
    });
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;
    const { item, type } = confirmAction;

    try {
      if (type === 'toggleUser') {
        await api.saveUser({
          id: item.id,
          name: item.name,
          login: item.login || item.username,
          email: item.email || null,
          role: item.role,
          active: !item.active,
        });
        toast.success(item.active ? 'Usuário desativado.' : 'Usuário reativado.');
      } else if (type === 'deleteEquipment') {
        await api.deleteEquipment(item.id);
        toast.success('Equipamento excluído.');
      } else {
        await api.deleteItem(item.id);
        toast.success('Item excluído.');
      }

      setConfirmAction(null);
      await loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const renderForm = () => {
    if (modalMode === 'view') return renderDetails();

    if (activeTab === 'users') {
      return (
        <div className="form-grid">
          <div className="form-field is-full">
            <label>Nome completo</label>
            <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} required />
          </div>
          <div className="form-field">
            <label>Login</label>
            <input value={form.login} onChange={(event) => updateForm('login', event.target.value)} required />
          </div>
          <div className="form-field">
            <label>E-mail</label>
            <input type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
          </div>
          <div className="form-field">
            <label>Perfil</label>
            <select value={form.role} onChange={(event) => updateForm('role', event.target.value)}>
              <option value="master">Master</option>
              <option value="operator">Operador</option>
            </select>
          </div>
          <div className="form-field">
            <label>{modalMode === 'create' ? 'Senha' : 'Nova senha'}</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateForm('password', event.target.value)}
              required={modalMode === 'create'}
              minLength={form.password ? 6 : undefined}
              placeholder={modalMode === 'edit' ? 'Manter senha atual' : ''}
            />
          </div>
          <div className="form-field is-full">
            <label className="toggle-row">
              <input type="checkbox" checked={form.active} onChange={(event) => updateForm('active', event.target.checked)} />
              Usuário ativo
            </label>
          </div>
        </div>
      );
    }

    if (activeTab === 'equipment') {
      return (
        <div className="form-grid">
          <div className="form-field is-full">
            <label>Nome</label>
            <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} required />
          </div>
          <div className="form-field">
            <label>Descrição</label>
            <input value={form.description} onChange={(event) => updateForm('description', event.target.value)} />
          </div>
          <div className="form-field">
            <label>Local</label>
            <input value={form.location} onChange={(event) => updateForm('location', event.target.value)} />
          </div>
        </div>
      );
    }

    return (
      <div className="form-grid">
        <div className="form-field is-full">
          <label>Descrição do item</label>
          <textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} required rows={4} />
        </div>
        <div className="form-field">
          <label>Ordem</label>
          <input type="number" value={form.order_index} onChange={(event) => updateForm('order_index', event.target.value)} min="0" />
        </div>
        <div className="form-field">
          <label className="toggle-row">
            <input type="checkbox" checked={form.is_imperative} onChange={(event) => updateForm('is_imperative', event.target.checked)} />
            Impeditivo
          </label>
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    if (!selectedItem) return null;

    const fields = activeTab === 'users'
      ? [
          ['Nome', selectedItem.name],
          ['Login', selectedItem.login || selectedItem.username],
          ['E-mail', selectedItem.email || '-'],
          ['Perfil', selectedItem.role],
          ['Status', selectedItem.active ? 'Ativo' : 'Inativo'],
        ]
      : activeTab === 'equipment'
        ? [
            ['Nome', selectedItem.name],
            ['Descrição', selectedItem.description || '-'],
            ['Local', selectedItem.location || '-'],
            ['Status', selectedItem.active ? 'Ativo' : 'Inativo'],
          ]
        : [
            ['Descrição', selectedItem.description],
            ['Impeditivo', selectedItem.is_imperative ? 'Sim' : 'Não'],
            ['Ordem', selectedItem.order_index ?? 0],
            ['Status', selectedItem.active ? 'Ativo' : 'Inativo'],
          ];

    return (
      <div className="detail-grid">
        {fields.map(([label, value]) => (
          <div key={label} className={label === 'Descrição' ? 'form-field is-full' : 'form-field'}>
            <span className="detail-label">{label}</span>
            <div className="detail-value">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderActions = (item) => (
    <div className="action-group">
      <button type="button" className="icon-action" onClick={() => openView(item)} title="Visualizar" aria-label="Visualizar">
        <Eye size={16} />
      </button>
      <button type="button" className="icon-action" onClick={() => openEdit(item)} title="Editar" aria-label="Editar">
        <Pencil size={16} />
      </button>
      <button
        type="button"
        className={`icon-action ${item.active ? 'is-danger' : 'is-warning'}`}
        onClick={() => openConfirmAction(item)}
        title={activeTab === 'users' ? item.active ? 'Desativar' : 'Reativar' : 'Excluir'}
        aria-label={activeTab === 'users' ? item.active ? 'Desativar' : 'Reativar' : 'Excluir'}
      >
        {activeTab === 'users' ? item.active ? <PowerOff size={16} /> : <Power size={16} /> : <Trash2 size={16} />}
      </button>
    </div>
  );

  return (
    <div className="has-bottom-nav" style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100dvh' }}>
      <Navbar user={user} onLogout={logout} />

      <div className="container">
        <div className="page-header">
          <h1>Gestão do sistema</h1>
          <div className="page-actions">
            <Button variant="primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} /> Adicionar novo
            </Button>
          </div>
        </div>

        <div className="tabs-scroll">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
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
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="card">
          <div className="responsive-table">
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
                    <td style={{ padding: '12px' }}>{renderActions(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-record-list">
            {data.map((item) => (
              <article key={item.id} className="mobile-record-card">
                <div className="mobile-record-top">
                  <div style={{ minWidth: 0 }}>
                    <div className="mobile-record-title">{getItemTitle(item)}</div>
                    <div className="mobile-record-subtitle">{getItemSubtitle(item)}</div>
                  </div>
                  <Badge type={item.active ? 'active' : 'default'}>{item.active ? 'Ativo' : 'Inativo'}</Badge>
                </div>

                <div className="mobile-record-grid">
                  <div className="mobile-record-field">
                    <span className="mobile-record-label">ID</span>
                    <span className="mobile-record-value">#{item.id}</span>
                  </div>
                  <div className="mobile-record-field">
                    <span className="mobile-record-label">{activeTab === 'users' ? 'Perfil' : activeTab === 'equipment' ? 'Detalhes' : 'Impeditivo'}</span>
                    <span className="mobile-record-value" title={activeTab === 'users' ? item.role : activeTab === 'equipment' ? item.description : item.is_imperative ? 'Sim' : 'Não'}>
                      {activeTab === 'users' ? item.role : activeTab === 'equipment' ? item.description || '-' : item.is_imperative ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>{renderActions(item)}</div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {modalMode && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="management-modal-title"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="modal-panel">
            <div className="modal-header">
              <div>
                <h2 id="management-modal-title" style={{ fontSize: '18px' }}>{modalTitle}</h2>
                {selectedItem && <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '4px' }}>Registro #{selectedItem.id}</p>}
              </div>
              <button type="button" className="icon-action" onClick={closeModal} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">{renderForm()}</div>

              <div className="modal-footer">
                {modalMode === 'view' ? (
                  <>
                    <Button type="button" variant="secondary" onClick={() => openEdit(selectedItem)}>Editar</Button>
                    <Button type="button" onClick={closeModal}>Fechar</Button>
                  </>
                ) : (
                  <>
                    <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
                    <Button type="submit" loading={saving}>Salvar</Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmAction && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setConfirmAction(null);
          }}
        >
          <div className="modal-panel" style={{ width: 'min(440px, 100%)' }}>
            <div className="modal-header">
              <div>
                <h2 id="confirm-modal-title" style={{ fontSize: '18px' }}>{confirmAction.title}</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '4px' }}>
                  {getItemTitle(confirmAction.item)}
                </p>
              </div>
              <button type="button" className="icon-action" onClick={() => setConfirmAction(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                {confirmAction.message}
              </p>
            </div>

            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={() => setConfirmAction(null)}>Cancelar</Button>
              <Button
                type="button"
                variant={confirmAction.type === 'toggleUser' && !confirmAction.item.active ? 'primary' : 'danger'}
                onClick={executeConfirmAction}
              >
                {confirmAction.confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementPage;
