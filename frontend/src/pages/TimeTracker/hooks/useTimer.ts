// frontend/src/pages/TimeTracker/hooks/useTimer.ts
import { useState, useEffect } from 'react';
import { TimeEntry } from '../../../types';
import { getLocalDateStr, createSplitEntries } from '../utils';

export function useTimer(currentClientId: string, onSaveEntries: (entries: TimeEntry[]) => void) {
  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem('timer_isRunning') === 'true';
  });
  
  const [startTime, setStartTime] = useState<Date | null>(() => {
    const stored = localStorage.getItem('timer_startTime');
    return stored ? new Date(stored) : null;
  });

  const [seconds, setSeconds] = useState(0); 
  const [liveNoteInput, setLiveNoteInput] = useState(() => localStorage.getItem('timer_liveInput') || '');
  const [sessionNotes, setSessionNotes] = useState<string[]>(() => {
    const stored = localStorage.getItem('timer_sessionNotes');
    return stored ? JSON.parse(stored) : [];
  });
  
  // Persist State
  useEffect(() => { localStorage.setItem('timer_isRunning', String(isRunning)); }, [isRunning]);
  useEffect(() => { 
      if (startTime) localStorage.setItem('timer_startTime', startTime.toISOString()); 
      else localStorage.removeItem('timer_startTime');
  }, [startTime]);
  useEffect(() => { localStorage.setItem('timer_liveInput', liveNoteInput); }, [liveNoteInput]);
  useEffect(() => { localStorage.setItem('timer_sessionNotes', JSON.stringify(sessionNotes)); }, [sessionNotes]);

  // FIX: Accurate Timer using Delta
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && startTime) {
      const update = () => {
        const now = Date.now();
        const diff = Math.floor((now - startTime.getTime()) / 1000);
        setSeconds(diff >= 0 ? diff : 0);
      };

      update(); // immediate update
      interval = window.setInterval(update, 1000);
    } else {
      setSeconds(0);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime]);

  const addLiveNote = () => {
    if (liveNoteInput.trim()) {
        setSessionNotes(prev => [...prev, liveNoteInput.trim()]);
        setLiveNoteInput('');
    }
  };

  const stopTimer = () => {
      const now = new Date();
      const finalNotes = liveNoteInput.trim() ? [...sessionNotes, liveNoteInput.trim()] : sessionNotes;
      const endStr = now.toLocaleTimeString('en-US', { hour12: false });
      const startStr = startTime?.toLocaleTimeString('en-US', { hour12: false }) || endStr;
      const dateStr = getLocalDateStr(startTime || now);

      const newEntries = createSplitEntries(
          currentClientId, dateStr, startStr, endStr, finalNotes.join('\n'), false
      );
      
      onSaveEntries(newEntries);
      
      setIsRunning(false);
      setStartTime(null);
      setSeconds(0);
      setLiveNoteInput('');
      setSessionNotes([]);
      
      localStorage.removeItem('timer_isRunning');
      localStorage.removeItem('timer_startTime');
      localStorage.removeItem('timer_liveInput');
      localStorage.removeItem('timer_sessionNotes');
  };

  const startTimer = () => {
      const now = new Date();
      setStartTime(now);
      setIsRunning(true);
      setSessionNotes([]);
  };

  return { isRunning, seconds, startTime, liveNoteInput, sessionNotes, setLiveNoteInput, addLiveNote, startTimer, stopTimer };
}
