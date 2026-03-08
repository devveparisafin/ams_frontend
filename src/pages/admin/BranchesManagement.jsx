import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';

const BranchesManagement = () => {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', latitude: '', longitude: '', radius: 100 });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data } = await api.get('/branches');
      setBranches(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (branch) => {
    setIsEditing(true);
    setEditId(branch._id);
    setFormData({
        name: branch.name,
        latitude: branch.latitude,
        longitude: branch.longitude,
        radius: branch.radius
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', latitude: '', longitude: '', radius: 100 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      if (isEditing) {
        await api.put(`/branches/${editId}`, formData);
      } else {
        await api.post('/branches', formData);
      }
      handleCloseModal();
      fetchBranches();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} branch`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await api.delete(`/branches/${deleteId}`);
      fetchBranches();
      setDeleteId(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete branch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div>
           <h1 className="text-lg font-bold text-gray-900 tracking-tight">Branches Management</h1>
           <p className="text-sm text-gray-500 mt-1">Manage office locations and allowed check-in perimeters.</p>
        </div>
        <button 
          onClick={() => {
              setIsEditing(false);
              setEditId(null);
              setFormData({ name: '', latitude: '', longitude: '', radius: 100 });
              setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={16} />
          <span>Add Branch</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3">Branch Name</th>
                <th className="px-6 py-3">Coordinates</th>
                <th className="px-6 py-3">Allowed Radius</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {branches.map(branch => (
                <tr key={branch._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-gray-900 font-medium flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200 text-sm">
                        {branch.name.charAt(0)}
                    </div>
                    <span className="text-sm">{branch.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                      <div className="flex gap-4">
                          <span>Lat: {branch.latitude}</span>
                          <span>Lng: {branch.longitude}</span>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {branch.radius}m
                      </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEditClick(branch)} className="text-gray-400 hover:text-primary-600 p-1.5 hover:bg-primary-50 rounded-md transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteId(branch._id)} className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {branches.length === 0 && <div className="p-16 text-center text-gray-500 flex flex-col items-center border-t border-gray-200 bg-gray-50 flex-1">
              <MapPin size={32} className="text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-900">No branches added yet</p>
              <p className="text-xs mt-1">Get started by creating a new branch.</p>
          </div>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-card animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center space-x-2">
                <MapPin size={20} className="text-gray-400" />
                <span>{isEditing ? 'Edit Branch' : 'Add New Branch'}</span>
            </h2>
            
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                    {errorMessage}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm" placeholder="e.g. Downtown Office" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input required type="number" step="any" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm font-mono" placeholder="23.0225" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input required type="number" step="any" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm font-mono" placeholder="72.5714" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
                <input required type="number" value={formData.radius} onChange={e => setFormData({...formData, radius: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm font-mono" />
                <p className="text-xs text-gray-500 mt-1.5">Maximum distance allowed from branch coordinates.</p>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => { handleCloseModal(); setErrorMessage(''); }} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-colors shadow-sm">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-sm">{loading ? 'Saving...' : (isEditing ? 'Update Branch' : 'Save Branch')}</button>
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
            <h2 className="text-lg font-bold mb-2 text-gray-900">Delete Branch?</h2>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this branch? This action cannot be undone.</p>
            
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
    </div>
  );
};

export default BranchesManagement;
