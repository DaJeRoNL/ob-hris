import { useState, useRef } from 'react';
import { Plus, X, Gear, HouseLine, AppWindow, CheckCircle, DotsSixVertical } from '@phosphor-icons/react';
import { useDashboardData } from './hooks/useDashboardData';
import { WIDGET_REGISTRY, WidgetDefinition } from '../../utils/widgetRegistry';
import { saveUserLayout } from '../../utils/dashboardConfig';

export default function Dashboard() {
  // Destructure all data and the critical 'permissions' array from our hook
  const {
    layoutConfig,
    metrics,
    pipeline,
    activityFeed,
    financialTrends,
    countryStats,
    teamStatus,
    pendingTasks,
    myTasks,
    teamWorkload,
    hrMetrics,
    payrollData,
    announcements,
    upcomingEvents,
    clientName,
    permissions // <--- Used for the Widget Store
  } = useDashboardData();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [localLayout, setLocalLayout] = useState<string[]>(layoutConfig);
  
  // Drag & Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync state if the underlying config changes (e.g. switching roles in Admin panel)
  // We only sync if NOT in edit mode to prevent overwriting user's active changes
  if (JSON.stringify(layoutConfig) !== JSON.stringify(localLayout) && !isEditMode) {
      setLocalLayout(layoutConfig);
  }

  // Bundle data props to pass to widgets
  const dashboardData = { 
      metrics, pipeline, activityFeed, financialTrends, countryStats, teamStatus, 
      pendingTasks, myTasks, teamWorkload, hrMetrics, payrollData, announcements, upcomingEvents 
  };

  // --- LAYOUT ACTIONS ---

  const handleAddWidget = (id: string) => {
    const newLayout = [...localLayout, id];
    setLocalLayout(newLayout);
    saveUserLayout(newLayout); // Auto-save on add
  };

  const handleRemoveWidget = (id: string) => {
    const newLayout = localLayout.filter((w: string) => w !== id);
    setLocalLayout(newLayout);
    saveUserLayout(newLayout); // Auto-save on remove
  };

  const handleSaveLayout = () => {
      saveUserLayout(localLayout);
      setIsEditMode(false);
  };

  // --- DRAG HANDLERS ---

  const handleDragStart = (e: React.DragEvent, index: number) => {
      dragItem.current = index;
      e.dataTransfer.effectAllowed = "move";
      // Optional: Set a custom drag image here if desired
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
      dragOverItem.current = index;
  };

  const handleDragEnd = () => {
      const startIdx = dragItem.current;
      const endIdx = dragOverItem.current;

      if (startIdx !== null && endIdx !== null && startIdx !== endIdx) {
          const newLayout = [...localLayout];
          const item = newLayout.splice(startIdx, 1)[0];
          newLayout.splice(endIdx, 0, item);
          setLocalLayout(newLayout);
      }

      // Reset refs
      dragItem.current = null;
      dragOverItem.current = null;
  };

  // Necessary to allow dropping
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); 
  };

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-8 animate-fade-in text-[var(--color-text)] min-h-full flex flex-col relative overflow-x-hidden">
      
      {/* -- HEADER -- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 shrink-0">
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-bold opacity-50 uppercase tracking-widest mb-2 text-[var(--color-text-muted)]">
            <HouseLine weight="fill" className="text-[var(--color-primary)]" /> {clientName} HQ
          </div>
          <h1 className="text-4xl font-black font-['Montserrat'] flex items-center gap-3 tracking-tight text-[var(--color-text)]">
            Dashboard
            {isEditMode && (
              <span className="text-xs bg-[var(--color-warning)] text-[var(--color-bg)] px-2 py-1 rounded font-bold uppercase tracking-wide animate-pulse">
                Editing Layout
              </span>
            )}
          </h1>
          <p className="text-sm opacity-60 mt-1 font-medium text-[var(--color-text-muted)]">{currentDate}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => isEditMode ? handleSaveLayout() : setIsEditMode(true)}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-sm ${
              isEditMode
                ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-text)]'
            }`}
          >
            <Gear weight={isEditMode ? 'fill' : 'bold'} /> {isEditMode ? 'Save Layout' : 'Customize'}
          </button>
        </div>
      </header>

      {/* -- WIDGET GRID -- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
        {localLayout.map((widgetId: string, index: number) => {
          const def: WidgetDefinition | undefined = WIDGET_REGISTRY[widgetId];
          // Skip if widget ID is invalid/removed
          if (!def) return null;

          const WidgetComponent = def.component;

          return (
            <div
              key={widgetId}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              className={`relative group h-full flex flex-col transition-all duration-200 ${
                isEditMode 
                    ? 'ring-2 ring-dashed ring-[var(--color-border)] hover:ring-[var(--color-primary)] rounded-2xl cursor-grab bg-[var(--color-surface)] shadow-lg active:cursor-grabbing' 
                    : ''
              }`}
              style={{
                gridColumn: `span ${def.minW}`,
                gridRow: `span ${def.minH}`,
                minHeight: def.minH === 1 ? '150px' : '350px'
              }}
            >
              {/* Drag Handle (Visual Only) */}
              {isEditMode && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 rounded-full border border-[var(--color-border)] shadow-sm pointer-events-none">
                    <DotsSixVertical size={24} weight="bold" />
                </div>
              )}

              {/* Remove Button */}
              {isEditMode && (
                <button
                  onClick={() => handleRemoveWidget(widgetId)}
                  className="absolute -top-3 -right-3 z-50 bg-[var(--color-danger)] text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition animate-pop-in"
                >
                  <X weight="bold" size={14} />
                </button>
              )}

              {/* Widget Content (Disabled pointer events in edit mode to prevent interactions while dragging) */}
              <div className={`h-full w-full ${isEditMode ? 'pointer-events-none opacity-60 scale-95 transition-transform' : ''}`}>
                <WidgetComponent {...dashboardData} />
              </div>
            </div>
          );
        })}

        {/* Add Widget Button (Only visible in Edit Mode) */}
        {isEditMode && (
          <div
            onClick={() => setShowStore(true)}
            className="col-span-1 md:col-span-2 min-h-[200px] border-2 border-dashed border-[var(--color-border)] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition gap-4 group bg-[var(--color-bg)]/30 animate-fade-in"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] shadow-sm flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:scale-110 transition-all border border-[var(--color-border)]">
              <Plus weight="bold" size={32} />
            </div>
            <span className="font-bold text-sm text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] uppercase tracking-wider">
              Open Widget Store
            </span>
          </div>
        )}
      </div>

      {/* -- WIDGET STORE MODAL -- */}
      {showStore && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowStore(false)}
        >
          <div
            className="bg-[var(--color-surface)] w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[var(--color-border)] text-[var(--color-text)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg)]/50">
              <div>
                <h2 className="text-2xl font-black font-['Montserrat'] flex items-center gap-3">
                  <AppWindow size={32} className="text-[var(--color-primary)]" weight="duotone" />
                  Widget Library
                </h2>
                <p className="text-sm opacity-60 mt-1">Select components to add to your dashboard.</p>
              </div>
              <button onClick={() => setShowStore(false)} className="p-2 hover:bg-[var(--color-bg)] rounded-full transition">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-[var(--color-bg)]/30 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(WIDGET_REGISTRY).map((widget: WidgetDefinition) => {
                  const isAdded = localLayout.includes(widget.id);
                  
                  // PERMISSION CHECK:
                  // 1. If widget has NO requirement, it's allowed.
                  // 2. If it HAS a requirement, check if 'permissions' array includes it.
                  const hasPermission = !widget.permissionReq || (permissions || []).includes(widget.permissionReq);

                  return (
                    <div
                      key={widget.id}
                      className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col gap-4
                        ${
                          !hasPermission
                            ? 'opacity-50 grayscale cursor-not-allowed bg-[var(--color-bg)] border-[var(--color-border)]'
                            : isAdded
                            ? 'border-[var(--color-success)] bg-[var(--color-success)]/5 ring-1 ring-[var(--color-success)]/20'
                            : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg hover:-translate-y-1'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl ${isAdded ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-bg)] text-[var(--color-primary)]'}`}>
                          <AppWindow size={24} weight="duotone" />
                        </div>
                        {isAdded && <CheckCircle size={24} weight="fill" className="text-[var(--color-success)]" />}
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-1">{widget.title}</h3>
                        <p className="text-xs opacity-60 leading-relaxed min-h-[40px]">{widget.description}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 bg-[var(--color-bg)] px-2 py-1 rounded border border-[var(--color-border)]">
                          Size: {widget.minW}x{widget.minH}
                        </span>
                        {widget.permissionReq && (
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                              hasPermission
                                ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20'
                                : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20'
                            }`}
                          >
                            {hasPermission ? 'Unlocked' : 'Restricted'}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => hasPermission && !isAdded && handleAddWidget(widget.id)}
                        disabled={isAdded || !hasPermission}
                        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-sm ${
                          isAdded
                            ? 'bg-[var(--color-success)] text-white cursor-default'
                            : !hasPermission
                            ? 'bg-[var(--color-bg)] text-[var(--color-text-muted)] cursor-not-allowed'
                            : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
                        }`}
                      >
                        {isAdded ? 'Added' : !hasPermission ? 'Locked by Admin' : 'Add to Dashboard'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}