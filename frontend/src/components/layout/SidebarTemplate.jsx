import React, { useState, useEffect } from 'react';

const SidebarTemplate  = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children,
  headerContent,
  showArrow = false,
  onArrowToggle,
  isDetailPanelOpen = false,
  onCloseDetailPanel
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      // Tambahkan delay yang lebih konsisten untuk animasi slide in
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);
  
  // Handle swipe down to close on mobile with improved flexibility
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragOffset(0);
    
    const touch = e.touches ? e.touches[0] : e;
    const startY = touch.clientY;
    const startTime = Date.now();
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      const currentTouch = e.touches ? e.touches[0] : e;
      const currentY = currentTouch.clientY;
      const deltaY = currentY - startY;
      
      if (deltaY > 0) {
        setDragOffset(deltaY);
      }
    };
    
    const handleTouchEnd = (e) => {
      const currentTouch = e.changedTouches ? e.changedTouches[0] : e;
      const currentY = currentTouch.clientY;
      const deltaY = currentY - startY;
      const deltaTime = Date.now() - startTime;
      const velocity = deltaY / deltaTime;
      
      const shouldClose = 
        deltaY > 120 || 
        (velocity > 0.5 && deltaY > 60) || 
        (velocity > 1 && deltaY > 30);
      
      if (shouldClose) {
        handleClose();
      }
      
      setIsDragging(false);
      setDragOffset(0);
      cleanup();
    };
    
    const cleanup = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousemove', handleTouchMove);
      document.removeEventListener('mouseup', handleTouchEnd);
    };
    
    if (e.type === 'touchstart') {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.addEventListener('mousemove', handleTouchMove);
      document.addEventListener('mouseup', handleTouchEnd);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (isDetailPanelOpen && onCloseDetailPanel) {
      onCloseDetailPanel();
    }
    // Tambahkan delay yang lebih konsisten untuk animasi keluar
    setTimeout(onClose, 300);
  };

  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isMobile, isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop dihapus sesuai permintaan */}

      {/* Panel */}
      <div 
        className={`fixed bg-white shadow-2xl z-[60] transform flex flex-col ${
          isMobile 
            ? `bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl transition-all duration-300 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`
            : `top-20 left-0 h-[calc(100vh-5rem)] w-96 transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`
        }`}
        style={{ 
          willChange: "transform, opacity",
          transform: isMobile 
            ? isDragging 
              ? `translateY(${dragOffset}px)` 
              : isVisible 
                ? "translateY(0)" 
                : "translateY(100%)"
            : undefined,
          transition: isMobile && !isDragging 
            ? "transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 300ms ease-out" 
            : undefined
        }}
      >
      <div 
        className={`bg-white p-4 flex-shrink-0 transition-colors ${
          isMobile ? 'rounded-t-2xl cursor-grab active:cursor-grabbing' : ''
        } ${
          isMobile && isDragging ? 'bg-gray-100' : ''
        }`}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onMouseDown={isMobile ? handleTouchStart : undefined}
      >
        {/* Mobile drag handle */}
        {isMobile && (
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1.5 rounded-full transition-all duration-200 ${
            isDragging 
              ? 'bg-gray-600 w-12' 
              : 'bg-gray-400 hover:bg-gray-500'
          }`}></div>
        )}
        
        <div className="flex items-center space-x-3">
          {/* Desktop close button */}
          {!isMobile && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start mt-1"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex-1">
            {headerContent || (
              <>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                
                {/* --- PERUBAHAN UTAMA DI SINI --- */}
                {showArrow && !isDetailPanelOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={onArrowToggle}
                      className="group w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 ease-in-out"
                      title="Buka Detail Panel"
                    >
                      {/* Konten teks di sebelah kiri */}
                      <div className="text-left">
                        <span className="font-semibold text-slate-800 group-hover:text-blue-800 transition-colors">
                          Detail Informasi
                        </span>
                        <p className="text-sm text-slate-500 group-hover:text-blue-600 transition-colors">
                          Lihat data lengkap stasiun
                        </p>
                      </div>

                      {/* Ikon panah di sebelah kanan */}
                      <div className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${
          isMobile ? 'pb-6' : ''
        }`}>
          {children}
        </div>
      </div>
    </>
  );
};

export default SidebarTemplate;