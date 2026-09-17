import { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // Move focus into the dialog so keyboard/screen-reader users land
      // somewhere meaningful, and restore focus to whatever triggered it
      // (e.g. the navbar button) once the modal closes.
      previouslyFocusedRef.current = document.activeElement;
      closeButtonRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      if (isOpen) {
        previouslyFocusedRef.current?.focus?.();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay fade-in"
      onClick={onClose}
    >
      <div
        className="modal-content glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button ref={closeButtonRef} className="btn-icon" onClick={onClose} aria-label="Cerrar modal">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
