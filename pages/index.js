import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Dashboard() {
  const [stores, setStores] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    const { data } = await supabase.from('stores').select('*');
    if (data) setStores(data);
  }

  async function createStore(e) {
    e.preventDefault();
    if (!storeName) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('stores')
      .insert([{ name: storeName }])
      .select();
    
    if (!error) {
      setStoreName('');
      fetchStores();
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#111827', marginBottom: '8px' }}>AI E-Commerce Operating System</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Automated Dropshipping, Sourcing & Net Profit Engine</p>

        <form onSubmit={createStore} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Enter new store name..."
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Creating...' : 'Create AI Store'}
          </button>
        </form>

        <h2 style={{ fontSize: '20px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>Active Stores</h2>
        {stores.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No stores connected yet. Create one above to get started.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {stores.map((store) => (
              <li key={store.id} style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '18px', color: '#1f2937' }}>{store.name}</strong>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>ID: {store.id}</div>
                </div>
                <span style={{ padding: '4px 12px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  Connected to Supabase
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
