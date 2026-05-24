import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = '-- Vyberte --',
  searchable = false,
  searchPlaceholder = 'Hledat...',
  emptyLabel = 'Žádné výsledky',
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', escHandler);
    };
  }, [open]);

  const filtered =
    searchable && search.trim()
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.trim().toLowerCase())
        )
      : options;

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full pl-4 pr-12 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-left
          hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100
          transition-all duration-200 outline-none flex items-center"
      >
        <span
          className={`truncate ${selected ? 'text-dark-800' : 'text-dark-400'}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={20}
          strokeWidth={1.75}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-80 flex flex-col overflow-hidden animate-fade-in">
          {searchable && (
            <div className="p-3 border-b border-gray-100 flex items-center gap-2">
              <Search
                size={16}
                strokeWidth={1.75}
                className="text-dark-400 flex-shrink-0"
              />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 outline-none text-sm bg-transparent placeholder:text-dark-400"
              />
            </div>
          )}
          <div className="overflow-y-auto flex-1" role="listbox">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-dark-400 text-sm">
                {emptyLabel}
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-4 py-2.5 transition-colors text-dark-700 ${
                    option.value === value
                      ? 'bg-primary-50 font-semibold text-primary-700'
                      : 'hover:bg-primary-50/60'
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
