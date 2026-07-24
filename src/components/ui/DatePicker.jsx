'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

/**
 * Convierte una cadena de fecha con formato AAAA-MM-DD a un objeto Date local.
 */
function parseYYYYMMDD(str) {
  if (!str || typeof str !== 'string') return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]) - 1;
  const d = Number(parts[2]);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(y, m, d);
}

/**
 * Formatea un objeto Date local a una cadena con formato AAAA-MM-DD.
 */
function formatYYYYMMDD(date) {
  if (!date || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Convierte una cadena AAAA-MM-DD a formato de visualización DD/MM/AAAA.
 */
function formatDisplayDate(str) {
  if (!str) return '';
  const parts = str.split('-');
  if (parts.length !== 3) return str;
  return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
}

export default function DatePicker({
  value = '',
  onChange,
  placeholder = 'dd/mm/aaaa',
  className = '',
  disabled = false,
  ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const popoverId = useId();

  const selectedDate = parseYYYYMMDD(value);
  const today = new Date();

  // Estado de navegación del calendario para controlar el mes y el año visibles.
  const [navDate, setNavDate] = useState(() => selectedDate || new Date());

  // Mantiene sincronizada la fecha de navegación cuando cambia el valor o se abre el selector.
  useEffect(() => {
    if (isOpen) {
      setNavDate(parseYYYYMMDD(value) || new Date());
    }
  }, [isOpen, value]);

  // Manejador para cerrar el desplegable del calendario al hacer clic fuera o presionar la tecla Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = event => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const navYear = navDate.getFullYear();
  const navMonth = navDate.getMonth();

  const handlePrevMonth = () => {
    setNavDate(new Date(navYear, navMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setNavDate(new Date(navYear, navMonth + 1, 1));
  };

  const handleSelectDay = dayDate => {
    const formatted = formatYYYYMMDD(dayDate);
    onChange(formatted);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleToday = () => {
    const formatted = formatYYYYMMDD(new Date());
    onChange(formatted);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Construye el arreglo de días del calendario para la cuadrícula de 7 columnas (lunes a domingo).
  const firstDayOfMonth = new Date(navYear, navMonth, 1);
  let dayOfWeek = firstDayOfMonth.getDay() - 1;
  if (dayOfWeek < 0) dayOfWeek = 6;

  const daysInMonth = new Date(navYear, navMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(navYear, navMonth, 0).getDate();

  const calendarDays = [];

  // Agrega los días finales pertenecientes al mes anterior.
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    const date = new Date(navYear, navMonth - 1, daysInPrevMonth - i);
    calendarDays.push({ date, currentMonth: false });
  }

  // Agrega los días pertenecientes al mes actual.
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(navYear, navMonth, d);
    calendarDays.push({ date, currentMonth: true });
  }

  // Agrega los días iniciales del mes siguiente para completar las filas de la semana.
  const remaining = 7 - (calendarDays.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(navYear, navMonth + 1, d);
      calendarDays.push({ date, currentMonth: false });
    }
  }

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const displayString = value ? formatDisplayDate(value) : '';

  return (
    <div
      ref={wrapperRef}
      className={`relative min-w-0 ${isOpen ? 'z-40' : 'z-10'}`}
    >
      <div
        ref={triggerRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel || 'Seleccionar fecha'}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={() => {
          if (!disabled) setIsOpen(prev => !prev);
        }}
        onKeyDown={event => {
          if (disabled) return;
          if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className={`group flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border bg-black px-3 py-2 text-xs transition-all duration-150 ${
          isOpen
            ? 'border-brand ring-1 ring-brand/50 shadow-[0_0_12px_rgba(157,0,255,0.25)] text-white'
            : 'border-line-strong hover:border-brand hover:text-white focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/50'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      >
        <span className={displayString ? 'text-white font-mono' : 'text-gray-500'}>
          {displayString || placeholder}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {value && !disabled && (
            <button
              type="button"
              aria-label="Limpiar fecha"
              onClick={e => {
                e.stopPropagation();
                handleClear();
              }}
              className="rounded p-0.5 text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <CalendarIcon
            className={`h-4 w-4 transition-colors ${
              isOpen ? 'text-brand' : 'text-gray-400 group-hover:text-brand'
            }`}
            aria-hidden="true"
          />
        </div>
      </div>

      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-label="Calendario"
          className="absolute left-0 top-[calc(100%+0.4rem)] z-50 w-72 rounded-xl border border-brand/30 bg-[#090909] p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(157,0,255,0.18)] animate-pop-in select-none"
        >
          {/* Navegación superior para cambiar de mes y año. */}
  <div className="mb-3 flex items-center justify-between">
    <div className="flex items-center gap-1.5 text-xs font-bold text-white capitalize">
      <span>{MONTH_NAMES[navMonth]}</span>
      <span className="text-gray-400 font-normal">{navYear}</span>
    </div>

    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handlePrevMonth}
        aria-label="Mes anterior"
        className="rounded-lg p-1 text-gray-400 hover:bg-brand/20 hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleNextMonth}
        aria-label="Mes siguiente"
        className="rounded-lg p-1 text-gray-400 hover:bg-brand/20 hover:text-white transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>

  {/* Encabezados con las iniciales de los días de la semana. */}
  <div className="mb-2 grid grid-cols-7 text-center">
    {WEEKDAYS.map(day => (
      <span key={day} className="text-[11px] font-bold text-gray-400">
        {day}
      </span>
    ))}
  </div>

  {/* Cuadrícula interactiva con los días del mes. */}
  <div className="grid grid-cols-7 gap-1 text-center">
    {calendarDays.map(({ date, currentMonth }, idx) => {
      const selected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);

      return (
        <button
          key={idx}
          type="button"
          onClick={() => handleSelectDay(date)}
          className={`flex h-8 w-full items-center justify-center rounded-lg text-xs transition-all ${
            selected
              ? 'bg-brand font-bold text-white shadow-[0_0_10px_rgba(157,0,255,0.7)]'
              : isToday
              ? 'border border-brand/60 font-semibold text-brand hover:bg-brand/20'
              : currentMonth
              ? 'text-gray-200 hover:bg-brand/15 hover:text-white'
              : 'text-gray-600 hover:bg-white/5 hover:text-gray-400'
          }`}
        >
          {date.getDate()}
        </button>
      );
    })}
  </div>

  {/* Acciones rápidas del pie de página del calendario. */}
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 px-1">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-gray-400 hover:text-red-400 transition-colors"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-xs font-medium text-brand hover:text-white transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
