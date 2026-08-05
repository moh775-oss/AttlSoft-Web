// F:\مشروع ويب\AttlSoft_web\src\utils\useReportExport.js
import { useState, useCallback } from "react";
import ReportGenerator from "./ReportGenerator.jsx";

export const useReportExport = () => {
  const [exportTrigger, setExportTrigger] = useState(null);

  const handleExport = useCallback((type, title, data, columns, filename) => {
    // تنظيف أي تصدير سابق
    setExportTrigger(null);
    
    // تعيين التصدير الجديد
    setExportTrigger({
      type,
      title,
      data: [...data], // نسخة جديدة
      columns: [...columns],
      filename: filename || title
    });
    

    setTimeout(() => {
      setExportTrigger(null);
    }, 1000);
  }, []);

  const ExportComponent = useCallback(() => {
    if (!exportTrigger) return null;
    
    return (
      <ReportGenerator
        type={exportTrigger.type}
        title={exportTrigger.title}
        data={exportTrigger.data}
        columns={exportTrigger.columns}
        filename={exportTrigger.filename}
      />
    );
  }, [exportTrigger]);

  return { handleExport, ExportComponent };
};