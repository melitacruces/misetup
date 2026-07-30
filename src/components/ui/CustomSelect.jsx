'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function CustomSelect({
  options = [],
  value,
  onChange,
  label,
  ariaLabel,
  placeholder = 'Seleccionar...',
  icon: Icon,
  showMenuHeader = false,
  className = '',
  containerClassName = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const shouldFocusOptionRef = useRef(false);

  const selectedIndex = options.findIndex(
    option => String(option.value) === String(value)
  );
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = event => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = event => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && shouldFocusOptionRef.current && selectedIndex >= 0) {
      optionRefs.current[selectedIndex]?.focus();
    }
  }, [isOpen, selectedIndex]);

  const handleOptionKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === 'ArrowDown') nextIndex = (index + 1) % options.length;
    if (event.key === 'ArrowUp') nextIndex = (index - 1 + options.length) % options.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = options.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      optionRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative min-w-0 ${isOpen ? 'z-40' : 'z-10'} ${containerClassName}`}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => {
          if (disabled) return;
          shouldFocusOptionRef.current = false;
          setIsOpen(previous => !previous);
        }}
        onKeyDown={event => {
          if (disabled) return;
          if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
            shouldFocusOptionRef.current = true;
            setIsOpen(true);
          }
        }}
        className={`group flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border bg-black px-3 py-2 text-xs text-white outline-none transition-all duration-150 ${
          isOpen
            ? 'border-brand ring-1 ring-brand/50 shadow-[0_0_12px_rgba(157,0,255,0.25)]'
            : 'border-line-strong hover:border-brand hover:text-white focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/50'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {Icon && (
            <Icon
              className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                isOpen ? 'text-brand' : 'text-gray-400 group-hover:text-brand'
              }`}
              aria-hidden="true"
            />
          )}
          <span className="truncate">
            {selectedOption
              ? selectedOption.selectedLabel || selectedOption.label
              : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-all duration-200 ${
            isOpen ? 'rotate-180 text-brand' : 'text-gray-400 group-hover:text-brand'
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={menuId}
        role="listbox"
        aria-label={ariaLabel || label}
        aria-hidden={!isOpen}
        className={`absolute left-0 top-[calc(100%+0.4rem)] z-50 max-h-60 w-full min-w-[11rem] overflow-y-auto rounded-lg border border-brand/30 bg-[#090909] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(157,0,255,0.15)] [contain:paint] transition-all duration-150 ${
          isOpen
            ? 'visible opacity-100 pointer-events-auto scale-100'
            : 'invisible opacity-0 pointer-events-none scale-95'
        }`}
      >
        {showMenuHeader && label && (
          <div className="px-2.5 pb-1.5 pt-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
            {label}
          </div>
        )}
        {options.map((option, index) => {
          const isSelected = String(option.value) === String(value);

          return (
            <button
              key={String(option.value)}
              ref={element => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={isSelected}
              onKeyDown={event => handleOptionKeyDown(event, index)}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                isSelected
                  ? 'bg-brand/15 text-white font-medium'
                  : 'text-gray-400 hover:bg-brand/10 hover:text-white'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  isSelected
                    ? 'bg-brand shadow-[0_0_6px_rgba(157,0,255,0.8)]'
                    : 'bg-gray-700'
                }`}
                aria-hidden="true"
              />
              <span className="flex-1 truncate">{option.label}</span>
              {isSelected && (
                <Check className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
