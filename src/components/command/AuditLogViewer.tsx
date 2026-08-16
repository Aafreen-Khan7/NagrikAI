import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, History, CheckCircle2, User, FileText, Sparkles } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="bg-white rounded-xl border border-[#DCDCD6] p-4 shadow-xs flex flex-col h-full select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#DCDCD6] mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#E56B2F]" />
          <div>
            <h2 className="text-sm font-extrabold text-[#142C54] tracking-tight uppercase">
              Command Center Audit Trail
            </h2>
            <p className="text-[11px] text-[#5E625F]">
              Immutable chronological record of all operator approvals, AI proposals, and field dispatches
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E6B4A]/10 text-[#2E6B4A] border border-[#2E6B4A]/30">
          Compliance Active (ISO 27001 / Nagpur Traffic Pol)
        </span>
      </div>

      <div className="overflow-x-auto flex-1 max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DCDCD6] text-[10px] uppercase font-bold text-[#5E625F] bg-[#FAF8F4] sticky top-0">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Operator / Actor</th>
              <th className="py-2.5 px-3">Action Executed</th>
              <th className="py-2.5 px-3">Entity Reference</th>
              <th className="py-2.5 px-3">Details / Value Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDCD6]/60">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#FAF8F4] transition-colors">
                <td className="py-2.5 px-3 font-mono text-[#5E625F] whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5 font-bold text-[#142C54]">
                    <User className="w-3 h-3 text-[#E56B2F]" />
                    <span>{log.user}</span>
                  </div>
                  <span className="text-[10px] text-[#5E625F]">{log.role}</span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-[#252525]">
                  {log.action}
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#142C54]">
                  {log.entityId}
                </td>
                <td className="py-2.5 px-3 text-[#5E625F]">
                  <span className="text-[#142C54] font-medium block">{log.newValue || log.details}</span>
                  {log.oldValue && (
                    <span className="text-[10px] text-gray-400 block line-through">{log.oldValue}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
