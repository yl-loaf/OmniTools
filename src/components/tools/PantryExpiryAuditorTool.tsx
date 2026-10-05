import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { playSuccessSound } from '../../services/soundEffects';

interface PantryItem {
  id: string;
  name: string;
  expiryDate: string;
  category: string;
}

export function PantryExpiryAuditorTool() {
  const [items, setItems] = useState<PantryItem[]>([
    { id: '1', name: 'Organic Whole Milk', expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], category: 'Dairy' },
    { id: '2', name: 'Sourdough Bread', expiryDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], category: 'Bakery' },
    { id: '3', name: 'Avocados', expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], category: 'Produce' },
  ]);
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('Produce');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !expiryDate) return;
    const newItem: PantryItem = {
      id: `pantry-${Date.now()}`,
      name: name.trim(),
      expiryDate,
      category,
    };
    setItems([newItem, ...items]);
    setName('');
    setExpiryDate('');
    playSuccessSound();
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-emerald-400" />
          Smart Pantry Expiry & Grocery Waste Auditor
        </h2>
        <p className="text-sm text-slate-400">
          Track food item expiration dates and minimize household food waste with consumption analytics.
        </p>
      </div>

      <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="sm:col-span-1.5 space-y-1">
          <label className="text-xs font-semibold text-slate-400">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Greek Yogurt"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
          >
            <option value="Produce">Produce</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Meat">Meat</option>
            <option value="Pantry">Pantry</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => {
          const diffDays = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const isExpiringSoon = diffDays <= 2;

          return (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isExpiringSoon ? 'bg-rose-950/80 text-rose-400 border border-rose-800' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'}`}>
                  {isExpiringSoon ? <AlertCircle className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">{item.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Category: {item.category}</span>
                    <span>•</span>
                    <span className={diffDays <= 2 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      Expires in {diffDays} {diffDays === 1 ? 'day' : 'days'} ({item.expiryDate})
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-slate-500 hover:text-rose-400 transition"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
