import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import useAuthStore from '../../store/useAuthStore';
import { Plus, Users, MapPin, Edit2, Trash2, Smartphone } from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STAFF', branchId: '' });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [resetId, setResetId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStaff();
    if (user?.role === 'SUPER_ADMIN') {
      fetchBranches();
    }
  }, [user]);

  const fetchStaff = async () => {
    try {
      const { data } = await api.get('/users');
      setStaff(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data } = await api.get('/branches');
      setBranches(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (member) => {
    setIsEditing(true);
    setEditId(member._id);
    setFormData({
        name: member.name,
        email: member.email,
        password: '', // Don't populate password
        role: member.role,
        branchId: member.branchId?._id || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', email: '', password: '', role: 'STAFF', branchId: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const payload = { ...formData };
      if (isEditing && !payload.password) {
          delete payload.password; // Don't send empty password on update
      }

      if (isEditing) {
        await api.put(`/users/${editId}`, payload);
      } else {
        await api.post('/users', payload);
      }
      handleCloseModal();
      fetchStaff();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} staff`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await api.delete(`/users/${deleteId}`);
      fetchStaff();
      setDeleteId(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete staff member');
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async () => {
      if (!resetId) return;
      setLoading(true);
      try {
          await api.put(`/users/${resetId}`, { resetDevice: true });
          fetchStaff();
          setResetId(null);
      } catch (error) {
          setErrorMessage(error.response?.data?.message || 'Failed to reset device.');
      } finally {
          setLoading(false);
      }
  };

  const filteredStaff = filterBranch 
    ? staff.filter(member => member.branchId?._id === filterBranch)
    : staff;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 gap-4">
        <div>
           <h1 className="text-lg font-bold text-gray-900 tracking-tight">Staff Management</h1>
           <p className="text-sm text-gray-500 mt-1">Manage personnel, roles, and branch assignments.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          {user?.role === 'SUPER_ADMIN' && (
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all shadow-sm">
                 <MapPin size={16} className="text-gray-400" />
                 <select 
                   value={filterBranch}
                   onChange={(e) => setFilterBranch(e.target.value)}
                   className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 w-full min-w-[140px]"
                 >
                     <option value="">All Branches</option>
                     {branches.map(b => (
                         <option key={b._id} value={b._id}>{b.name}</option>
                     ))}
                 </select>
              </div>
          )}
          
          <button 
            onClick={() => {
                setIsEditing(false);
                setEditId(null);
                setFormData({ name: '', email: '', password: '', role: 'STAFF', branchId: '' });
                setShowModal(true);
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primary-700 transition-colors shadow-sm font-medium text-sm w-full sm:w-auto"
          >
            <Plus size={16} />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Branch</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map(member => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-gray-900 font-medium flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs border border-gray-200">{member.name.charAt(0)}</div>
                    <span className="text-sm">{member.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                        member.role === 'SUPER_ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                        member.role === 'BRANCH_ADMIN' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                        {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium tracking-tight">
                      {member.branchId?.name ? (
                          <div className="flex items-center text-gray-700 text-sm">
                              <MapPin size={14} className="mr-1.5 text-gray-400" />
                              <span>{member.branchId.name}</span>
                          </div>
                      ) : (
                          <span className="text-gray-400 italic text-sm">N/A</span>
                      )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* Don't allow editing/deleting own self or Super Admin unless you're SUPER_ADMIN */}
                    {(user.role === 'SUPER_ADMIN' || (member.role !== 'SUPER_ADMIN' && member._id !== user._id)) && (
                        <>
                           {member.role === 'STAFF' && (
                               <button onClick={() => setResetId(member._id)} title="Reset Device Login" className="text-gray-400 hover:text-amber-600 p-1.5 hover:bg-amber-50 rounded-md transition-colors"><Smartphone size={16} /></button>
                           )}
                           <button onClick={() => handleEditClick(member)} title="Edit Staff" className="text-gray-400 hover:text-primary-600 p-1.5 hover:bg-primary-50 rounded-md transition-colors"><Edit2 size={16} /></button>
                           <button onClick={() => setDeleteId(member._id)} title="Delete Staff" className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                        </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStaff.length === 0 && <div className="p-16 text-center text-gray-500 flex flex-col items-center border-t border-gray-200 bg-gray-50">
                <Users size={32} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-900">No personnel found</p>
                <p className="text-xs mt-1">Get started by creating a new staff member or change filters.</p>
          </div>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-card animate-in zoom-in-95 duration-200">
             <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center space-x-2">
                <Users size={20} className="text-gray-400" />
                <span>{isEditing ? 'Edit Staff' : 'Add New Staff'}</span>
            </h2>
            
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                    {errorMessage}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 shadow-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 shadow-sm" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {isEditing && <span className="text-xs text-gray-400 font-normal ml-2">(Leave blank to keep current)</span>}</label>
                <input required={!isEditing} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 shadow-sm font-mono tracking-widest" placeholder="••••••••" />
              </div>
              
              {user?.role === 'SUPER_ADMIN' && (
                <>
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 shadow-sm">
                        <option value="STAFF">Staff Member</option>
                        <option value="BRANCH_ADMIN">Branch Administrator</option>
                        <option value="SUPER_ADMIN">Super Administrator</option>
                    </select>
                  </div>
                  {formData.role !== 'SUPER_ADMIN' && (
                    <div className="pt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assign Branch <span className="text-red-500">*</span></label>
                      <select required value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 shadow-sm">
                        <option value="">Select a branch location...</option>
                        {branches.map(b => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => { handleCloseModal(); setErrorMessage(''); }} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium shadow-sm transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-sm">{loading ? 'Saving...' : (isEditing ? 'Update Staff' : 'Save Staff')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-card animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
               <Trash2 className="text-red-600" size={24} />
            </div>
            <h2 className="text-lg font-bold mb-2 text-gray-900">Delete Staff?</h2>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this staff member? This action cannot be undone.</p>
            
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium text-left">
                    {errorMessage}
                </div>
            )}
            
            <div className="flex justify-center space-x-3">
              <button type="button" onClick={() => { setDeleteId(null); setErrorMessage(''); }} className="px-4 py-2 w-full text-sm text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-colors shadow-sm">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={loading} className="px-4 py-2 w-full text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm">{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {resetId && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-card animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
               <Smartphone className="text-amber-600" size={24} />
            </div>
            <h2 className="text-lg font-bold mb-2 text-gray-900">Reset Device Login?</h2>
            <p className="text-sm text-gray-500 mb-6">This will allow the staff member to log in from a new device. Their current device will be unlinked.</p>
            
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium text-left">
                    {errorMessage}
                </div>
            )}
            
            <div className="flex justify-center space-x-3">
              <button type="button" onClick={() => { setResetId(null); setErrorMessage(''); }} className="px-4 py-2 w-full text-sm text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-colors shadow-sm">Cancel</button>
              <button type="button" onClick={confirmReset} disabled={loading} className="px-4 py-2 w-full text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors shadow-sm">{loading ? 'Resetting...' : 'Reset Device'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
