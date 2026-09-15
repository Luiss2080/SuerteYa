import { useState } from 'react';
import { Plus, Trash2, GripVertical, List } from 'lucide-react';

const PREDEFINED_LISTS = {
  comida: ['Pizza', 'Sushi', 'Hamburguesa', 'Ensalada', 'Tacos', 'Pasta'],
  peliculas: ['Acción', 'Comedia', 'Terror', 'Ciencia Ficción', 'Drama', 'Animación'],
  quien_paga: ['Yo', 'Tú', 'A medias', 'El que pierda a piedra papel o tijera']
};

const OptionsManager = ({ options, setOptions, isSpinning }) => {
  const [newOption, setNewOption] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setNewOption('');
    }
  };

  const handleRemove = (index) => {
    const newOpts = [...options];
    newOpts.splice(index, 1);
    setOptions(newOpts);
  };

  const clearAll = () => {
    if(confirm('¿Seguro que quieres borrar todas las opciones?')) {
      setOptions([]);
    }
  };

  const loadPredefined = (key) => {
    setOptions(PREDEFINED_LISTS[key]);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '600px' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Opciones ({options.length})
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select 
            onChange={(e) => { if(e.target.value) loadPredefined(e.target.value); e.target.value = ""; }}
            className="input-field"
            style={{ padding: '4px 8px', width: 'auto', fontSize: '0.9rem' }}
            disabled={isSpinning}
          >
            <option value="">+ Plantillas</option>
            <option value="comida">¿Qué comemos?</option>
            <option value="peliculas">Género de Película</option>
            <option value="quien_paga">¿Quién paga?</option>
          </select>
          {options.length > 0 && (
            <button onClick={clearAll} className="btn btn-icon" title="Borrar todo" disabled={isSpinning}>
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </h2>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Añade una opción..." 
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          disabled={isSpinning}
        />
        <button type="submit" className="btn btn-secondary" disabled={!newOption.trim() || isSpinning}>
          <Plus size={20} />
        </button>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {options.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
            No hay opciones. Añade al menos 2 para jugar.
          </p>
        ) : (
          options.map((opt, i) => (
            <div 
              key={`${opt}-${i}`} 
              className="fade-in"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <GripVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {opt}
              </span>
              <button 
                className="btn btn-icon" 
                onClick={() => handleRemove(i)}
                disabled={isSpinning}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OptionsManager;
