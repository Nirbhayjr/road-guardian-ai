import React, { createContext, useContext, useState, useCallback } from 'react';
import { PotholeReport, ReportStatus } from '@/types';
import { mockReports } from '@/data/mockReports';

interface ReportsContextType {
  reports: PotholeReport[];
  addReport: (report: PotholeReport) => void;
  updateStatus: (id: string, status: ReportStatus) => void;
  getReportsByUser: (userId: string) => PotholeReport[];
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<PotholeReport[]>(mockReports);

  const addReport = useCallback((report: PotholeReport) => {
    setReports(prev => [report, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: ReportStatus) => {
    setReports(prev =>
      prev.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r)
    );
  }, []);

  const getReportsByUser = useCallback((userId: string) => {
    return reports.filter(r => r.userId === userId);
  }, [reports]);

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateStatus, getReportsByUser }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
};
