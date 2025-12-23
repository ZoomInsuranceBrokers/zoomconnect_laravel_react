import React, { useState, useEffect, useRef } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function UsersIndex({ users = [], roles = [] }) {
  const { darkMode } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ full_name: '', email: '', role_id: '', mobile: '', is_active: true });
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState(null);
  const dropdownRef = useRef(null);
  // local state mirror so UI updates immediately without full page reload
  const [usersState, setUsersState] = useState(users || []);
  const [rolesState, setRolesState] = useState(roles || []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredUsers = usersState.filter(u => {
    const matchesSearch = [u.full_name, u.email, u.mobile, (u.role && u.role.role_name) || '']
      .join(' ').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'active' && u.is_active) || (filter === 'inactive' && !u.is_active);
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => setCurrentPage(1), [search, filter]);

  // keep local mirrors in sync when server props change
  useEffect(() => setUsersState(users || []), [users]);
  useEffect(() => setRolesState(roles || []), [roles]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCreateModal = () => {
    setModalData({ full_name: '', email: '', role_id: '', mobile: '', is_active: true });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (u) => {
    // normalize role id to string so select control matches option values
    const roleId = u.user_id ? (u.role_id ? String(u.role_id) : (u.role ? String(u.role.role_id) : '')) : '';
    setModalData({ user_id: u.user_id, full_name: u.full_name, email: u.email, role_id: roleId, mobile: u.mobile, is_active: u.is_active });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await router.put(route('superadmin.admin.users.update', modalData.user_id), modalData);
        // update local users state
        setUsersState(prev => prev.map(u => u.user_id === modalData.user_id ? { ...u, full_name: modalData.full_name, email: modalData.email, role_id: modalData.role_id, mobile: modalData.mobile, is_active: modalData.is_active } : u));
        setMessage({ type: 'success', text: 'User updated successfully' });
      } else {
        await router.post(route('superadmin.admin.users.store'), modalData);
        // reload to fetch new record
        router.reload();
        setMessage({ type: 'success', text: 'User created successfully' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    }
    setIsModalOpen(false);
  };

  const closeMessage = () => setMessage(null);

  const toggleStatus = async (u) => {
    try {
      // call dedicated toggle-active route if available
      await router.put(route('superadmin.admin.users.toggle-active', u.user_id), { is_active: !u.is_active });
      // optimistically update local state
      setUsersState(prev => prev.map(p => p.user_id === u.user_id ? { ...p, is_active: !p.is_active } : p));
      setMessage({ type: 'success', text: `User ${u.is_active ? 'deactivated' : 'activated'} successfully` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  return (
    <SuperAdminLayout>
      <Head title="Admin Users" />
      <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isModalOpen ? 'blur-sm' : ''}`}>
        <div className="flex justify-between items-center mb-3">
          <h1 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Users</h1>
          <button onClick={openCreateModal} className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1 rounded-lg text-[16px] md:text-sm transition-colors duration-200">
            <span className="hidden md:inline">+ Create User</span>
            <span className="md:hidden">+</span>
          </button>
        </div>

        <div className={`rounded-lg p-3 mb-4 text-[10px] md:text-xs flex items-center ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Manage admin users — create, edit and toggle active status.</span>
        </div>

        <div className="flex flex-row md:justify-between md:items-center gap-3 mb-5">
          <div className="relative flex items-center w-1/2">
            <svg className={`absolute left-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{ top: '50%', transform: 'translateY(-50%)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21L16.65 16.65" />
            </svg>
            <input type="text" placeholder="Search Records" value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2 h-10 border rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm placeholder:text-xs md:placeholder:text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`flex items-center gap-2 px-3 h-10 border rounded-lg text-xs md:text-sm font-medium shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#934790] ${darkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'}`}>
              <span className="whitespace-nowrap">Filter By: <span className="font-semibold">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span></span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-20 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                  <button onClick={() => { setFilter('all'); setIsDropdownOpen(false); }} className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="text-xs font-semibold">All</span>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white text-xs">{usersState.length}</span>
                  </button>
                  <button onClick={() => { setFilter('active'); setIsDropdownOpen(false); }} className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="text-xs font-semibold text-green-600">Active</span>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">{usersState.filter(u => u.is_active).length}</span>
                  </button>
                  <button onClick={() => { setFilter('inactive'); setIsDropdownOpen(false); }} className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="text-xs font-semibold text-red-600">Inactive</span>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">{usersState.filter(u => !u.is_active).length}</span>
                  </button>
                </div>
            )}
          </div>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Actions</th>
                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Active</th>
                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Name</th>
                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Email</th>
                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Role</th>
                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Mobile</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {currentItems.map(u => (
                <tr key={u.user_id} className={darkMode ? 'hover:bg-gray-700 even:bg-gray-800/50' : 'hover:bg-gray-50 even:bg-gray-50/50'}>
                  <td className="px-6 py-3 whitespace-nowrap text-xs font-medium">
                    <button onClick={() => openEditModal(u)} className="text-[#934790] hover:text-[#6A0066] transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={u.is_active} onChange={() => toggleStatus(u)} className="sr-only" />
                      <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${u.is_active ? 'bg-[#934790]' : 'bg-gray-300'} flex items-center`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${u.is_active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  </td>
                  <td className={`px-6 py-3 whitespace-nowrap text-[11px] md:text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{u.full_name}</td>
                  <td className={`px-6 py-3 text-[11px] md:text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{u.email}</td>
                  <td className={`px-6 py-3 text-[11px] md:text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{u.role ? u.role.role_name : '-'}</td>
                  <td className={`px-6 py-3 text-[11px] md:text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{u.mobile || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className={`text-center py-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No users found.</div>
          )}
        </div>

        <div className="block sm:hidden">
          {currentItems.length === 0 ? (
            <div className={`text-center py-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No users found.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {currentItems.map(u => (
                <div key={u.user_id} className={`rounded-xl shadow border px-4 py-3 flex flex-row items-center gap-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={u.is_active} onChange={() => toggleStatus(u)} className="sr-only" />
                      <div className={`w-7 h-4 rounded-full transition-colors duration-200 ${u.is_active ? 'bg-[#934790]' : 'bg-gray-300'} flex items-center`}>
                        <div className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-200 ${u.is_active ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className={`text-[12px] font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{u.full_name}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{u.email}</div>
                  </div>
                  <div className="flex items-center justify-end ml-auto">
                    <button onClick={() => openEditModal(u)} className="text-[#934790] hover:text-[#6A0066] transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Rows per page:</span>
                <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="p-1 border rounded text-xs">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-xs text-gray-500">{Math.min(filteredUsers.length, indexOfFirstItem + 1)} - {Math.min(filteredUsers.length, indexOfLastItem)} of {filteredUsers.length}</span>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
                  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                  return (
                    <>
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded text-xs">Prev</button>
                      {pages.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map(p => (
                        <button key={p} onClick={() => setCurrentPage(p)} className={`px-2 py-1 border rounded text-xs ${p === currentPage ? 'bg-[#934790] text-white' : ''}`}>{p}</button>
                      ))}
                      <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredUsers.length / itemsPerPage), p + 1))} disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)} className="px-2 py-1 border rounded text-xs">Next</button>
                    </>
                  );
                })()}
              </div>
            </div>

        {/* Modal and Message are rendered outside this wrapper to avoid blur effect on modal */}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-lg w-full mx-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h3 className="text-lg font-semibold mb-4">{isEditMode ? 'Edit User' : 'Create User'}</h3>
            <form onSubmit={handleModalSubmit} className="space-y-3">
              <div>
                <label className="text-xs">Full name</label>
                <input type="text" value={modalData.full_name} onChange={e => setModalData({...modalData, full_name: e.target.value})} className="w-full p-2 border rounded mt-1" required />
              </div>
              <div>
                <label className="text-xs">Email</label>
                <input type="email" value={modalData.email} onChange={e => setModalData({...modalData, email: e.target.value})} className="w-full p-2 border rounded mt-1" required />
              </div>
              <div>
                <label className="text-xs">Role</label>
                <select value={modalData.role_id} onChange={e => setModalData({...modalData, role_id: e.target.value})} className="w-full p-2 border rounded mt-1" required>
                  <option value="">Select role</option>
                  {rolesState.map(r => (<option key={r.role_id} value={String(r.role_id)}>{r.role_name}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs">Mobile</label>
                <input type="text" value={modalData.mobile} onChange={e => setModalData({...modalData, mobile: e.target.value})} className="w-full p-2 border rounded mt-1" />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#934790] text-white rounded">{isEditMode ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {message && (
        <div className={`fixed bottom-6 right-6 p-3 rounded shadow ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          <div className="flex items-center gap-3">
            <div className="text-sm">{message.text}</div>
            <button onClick={closeMessage} className="text-white opacity-80">✕</button>
          </div>
        </div>
      )}

    </SuperAdminLayout>
  );
}

