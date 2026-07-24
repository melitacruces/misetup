'use client';

import {
  ArrowUpDown,
  Layers3,
  ListFilter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import CustomSelect from '@/components/ui/CustomSelect';

const controlClass =
  'group min-h-11 rounded-lg border border-line bg-black text-xs text-gray-300 outline-none transition-all duration-150 hover:border-brand hover:text-white focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/50';

const statusOptions = [
  { value: 'all', label: 'todos', selectedLabel: 'estado' },
  { value: 'active', label: 'activos' },
  { value: 'wishlist', label: 'wishlist' },
];

const kindOptions = [
  { value: 'all', label: 'todas', selectedLabel: 'clase' },
  { value: 'hardware', label: 'hardware' },
  { value: 'software', label: 'software' },
  { value: 'service', label: 'servicios' },
];

const sortOptions = [
  { value: 'position', label: 'orden manual' },
  { value: 'name', label: 'nombre' },
  { value: 'price', label: 'precio' },
  { value: 'date', label: 'fecha' },
];

function FilterSelect({ label, value, onChange, options, icon: Icon }) {
  return (
    <CustomSelect
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      icon={Icon}
      showMenuHeader={true}
      className="border-line text-gray-300 px-2.5 sm:px-3"
    />
  );
}

export default function InventoryToolbar({
  query,
  setQuery,
  status,
  setStatus,
  kind,
  setKind,
  sort,
  setSort,
  resultCount,
  totalCount,
}) {
  const hasFilters = query || status !== 'all' || kind !== 'all' || sort !== 'position';

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setKind('all');
    setSort('position');
  };

  return (
    <section
      aria-label="Buscar y filtrar inventario"
      className="rounded-lg border border-line bg-panel/80 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.18)]"
    >
      <div className="grid gap-2.5 2xl:grid-cols-[minmax(18rem,1fr)_auto]">
        <label className={`${controlClass} relative flex min-w-0 items-center focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/50`}>
          <span className="sr-only">Buscar en el inventario</span>
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400 transition-colors group-hover:text-brand group-focus-within:text-brand" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="buscar por tipo, marca, modelo o tag"
            className="h-full min-h-11 w-full bg-transparent py-2 pl-10 pr-10 text-xs text-gray-200 outline-none placeholder:text-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-brand/15 hover:text-brand"
              aria-label="Borrar búsqueda"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>

        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 2xl:grid-cols-[12rem_12rem_12rem_8.5rem]">
          <FilterSelect
            label="filtrar por estado"
            value={status}
            onChange={setStatus}
            options={statusOptions}
            icon={ListFilter}
          />
          <FilterSelect
            label="filtrar por clase"
            value={kind}
            onChange={setKind}
            options={kindOptions}
            icon={Layers3}
          />
          <FilterSelect
            label="ordenar inventario"
            value={sort}
            onChange={setSort}
            options={sortOptions}
            icon={ArrowUpDown}
          />
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className={`${controlClass} flex items-center justify-center gap-2 px-3 hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-gray-300 disabled:hover:bg-black`}
          >
            {hasFilters ? <X className="h-3.5 w-3.5 text-brand" /> : <SlidersHorizontal className="h-3.5 w-3.5 transition-colors group-hover:text-brand" />}
            limpiar
          </button>
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-2 border-t border-line/70 px-0.5 pt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(157,0,255,0.8)]" />
        <p className="text-xs uppercase tracking-[0.12em] text-gray-400">
          mostrando <span className="text-gray-200">{resultCount}</span> de {totalCount}
        </p>
      </div>
    </section>
  );
}
