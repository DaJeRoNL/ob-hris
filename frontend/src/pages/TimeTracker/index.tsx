import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLocalDateStr } from './utils';

// Hooks
import { useTimer } from './hooks/useTimer';
import { useTimeEntries } from './hooks/useTimeEntries';
import { useLeaveRequest } from './hooks/useLeaveRequest';

// Components
import CalendarWidget from './components/CalendarWidget';
import EntryList from './components/EntryList';
import LiveTrackerCard from './components/LiveTrackerCard';
import StatsSidebar from './components/StatsSidebar';
import UpcomingLeavesWidget from './components/UpcomingLeavesWidget';
import TimelineModal from './components/TimelineModal';
import LeaveModal from './components/LeaveModal';
import { StatusModals } from './components/StatusModals';
import TimezoneDisplay from './components/TimezoneDisplay';

export default function TimeTracker() {
  const { currentClientId } = useAuth();
  
  const timeEntries = useTimeEntries(currentClientId);
  const timer = useTimer(currentClientId, timeEntries.addEntryDirectly);
  const leave = useLeaveRequest();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTimeline, setShowTimeline] = useState(false);
  const [calendarCondensed, setCalendarCondensed] = useState(false);

  const handleToggleTimer = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const sel = new Date(selectedDate);
    sel.setHours(0,0,0,0);
    
    if (sel > today && !timer.isRunning) return alert("Cannot start live tracker for a future date.");

    if (leave.activeSickLeave) {
        leave.setShowEndSickModal(true);
        return;
    }

    if (timer.isRunning) {
      timer.stopTimer();
    } else {
      timer.startTimer();
      setSelectedDate(new Date()); 
    }
  };

  const isSelectedDateFuture = getLocalDateStr(selectedDate) > getLocalDateStr(new Date());

  return (
    // CONTAINER: 'min-h-screen' ensures it fills the view but can grow. 
    // 'flex-col' stacks header and grid.
    <div className="p-4 md:p-8 animate-fade-in text-[var(--text-main)] relative min-h-screen flex flex-col">
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
            <h1 className="text-2xl font-bold font-['Montserrat']">Time & Monitoring</h1>
            <p className="text-sm opacity-70">Track your work hours and leave</p>
        </div>
        <TimezoneDisplay />
      </header>
      
      {/* GRID: 
          - 'items-start' is CRITICAL. It prevents the columns from forcing each other to be the same height.
            This allows the Sticky behavior to work because the container is taller than the sticky element.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start flex-1">
        
        {/* LEFT COLUMN: 
            - No height restrictions. It grows as EntryList grows.
        */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full transition-all duration-500">
            <div className="shrink-0">
                <CalendarWidget 
                    selectedDate={selectedDate} 
                    onDateSelect={setSelectedDate}
                    entries={timeEntries.entries}
                    leaveRequests={leave.requests}
                    currentClientId={currentClientId}
                    isRunning={timer.isRunning}
                    isCondensed={calendarCondensed}
                />
            </div>

            <div className="flex-1">
                <EntryList 
                    selectedDate={selectedDate}
                    entries={timeEntries.entries}
                    leaveRequests={leave.requests}
                    currentClientId={currentClientId}
                    onManualAdd={() => timeEntries.addManual(selectedDate, leave.requests)}
                    onUpdate={(id, field, val) => timeEntries.updateEntryTime(id, field, val, leave.requests)}
                    onNoteUpdate={timeEntries.updateEntryNoteLine}
                    onAddNote={timeEntries.addNote}
                    onDelete={timeEntries.deleteEntry}
                    onShowTimeline={() => setShowTimeline(true)}
                    isRunning={timer.isRunning}
                    startTime={timer.startTime}
                    seconds={timer.seconds}
                    onExpandedChange={setCalendarCondensed}
                />
            </div>
        </div>

        {/* RIGHT COLUMN: 
            - 'h-fit': Ensures the div is only as tall as its content (doesn't stretch).
            - 'lg:sticky': Only applies on Desktop.
            - 'lg:bottom-6': This is the magic. It sticks to the BOTTOM of the viewport (with 1.5rem padding).
              This means if the column is tall, you scroll down until the bottom is visible, and THEN it sticks.
        */}
        <div className="space-y-4 lg:col-span-1 w-full h-fit lg:sticky lg:bottom-6">
            <StatsSidebar 
                entries={timeEntries.entries} 
                currentClientId={currentClientId}
                selectedDate={selectedDate}
                onOpenLeavePopup={() => leave.setShowLeavePopup(true)}
            />
            
            <LiveTrackerCard 
                timer={timer} 
                handleToggleTimer={handleToggleTimer}
                isSickLeaveActive={!!leave.activeSickLeave}
                isSelectedDateFuture={isSelectedDateFuture}
            />

            <UpcomingLeavesWidget 
                upcomingLeaves={leave.upcoming}
                onDeleteLeave={leave.cancel}
            />
        </div>
      </div>

      {/* MODALS */}
      {showTimeline && <TimelineModal date={selectedDate} entries={timeEntries.entries} leaveRequests={leave.requests} currentClientId={currentClientId} onClose={() => setShowTimeline(false)} />}
      {leave.showLeavePopup && <LeaveModal form={leave.form} setForm={leave.setForm} onSubmit={() => leave.submit(timer.isRunning ? timer.stopTimer : undefined)} onClose={() => leave.setShowLeavePopup(false)} />}
      <StatusModals states={leave} />
    </div>
  );
}