import React, { useState, useMemo } from 'react';
import { Table, Input, Select, Button, Tooltip, Pagination, Dropdown, Space, DatePicker } from 'antd';
import { 
  SearchOutlined, 
  PrinterOutlined, 
  FileExcelOutlined, 
  ReloadOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import * as XLSX from "xlsx";
import { green, red } from '@ant-design/colors';
import dayjs from 'dayjs';
import { useTranslate } from '@/hooks/useTranslate';
import { createStyles } from 'antd-style';

const { RangePicker } = DatePicker;

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
          }
        }
      }
    `,
  };
});

const companyInfo = {
  nameAr: "شركة اتل سوفت لتقنية المعلومات",
  nameEn: "Attlsoft IT Solutions Co.",
  addressAr: "الرياض - السعودية",
  addressEn: "Riyadh - Saudi Arabia",
  phone: "+966 555713183",
  taxNumber: "300123456789",
  commercialRegister: "1010234567",
  website: "www.attlsoft.com",
};

const ReportGenerator = ({ 
  columns = [], 
  data = [],
  loading = false,
  rowKey = 'id',
  title,
  searchable = true,
  searchPlaceholder = 'بحث...',
  searchFields,
  onSearch,
  filters,
  filterValues = {},
  onFilterChange,
  sortable = true,
  onSortChange,
  defaultSort,
  showPrintButtons = true,
  printTitle = 'تقرير',
  printFileName = 'report',
  onPrint,
  onExportExcel,
  disablePrint = false,
  pagination = { pageSize: 10 },
  showPagination = true,
  className = '',
  size = 'middle',
  bordered = true,
  onRowClick,
  rowClassName,
  emptyText = 'لا توجد بيانات',
  toolbarClassName = '',
  showReload = false,
  onReload, 
  extraActions,
  selection,
  showDateFilter = false,
  onDateFilterChange,
  fixedColumns = null,
}) => {
  const { styles } = useStyle();
  const [searchText, setSearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(filterValues || {});
  const [sortField, setSortField] = useState(defaultSort?.field || null);
  const [sortDirection, setSortDirection] = useState(defaultSort?.direction || null);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState(null);

  const { t } = useTranslate();

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchText && searchable) {
      const searchLower = searchText.toLowerCase();
      result = result.filter((row) => {
        if (searchFields && searchFields.length > 0) {
          return searchFields.some((field) => {
            const value = row[field];
            return value && String(value).toLowerCase().includes(searchLower);
          });
        }
        return Object.values(row).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    if (filters && Object.keys(selectedFilters).length > 0) {
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          result = result.filter((row) => {
            const rowValue = row[key];
            if (Array.isArray(value)) {
              return value.includes(rowValue);
            }
            return rowValue === value;
          });
        }
      });
    }

    if (dateRange && onDateFilterChange) {
      const [start, end] = dateRange;
      result = result.filter((row) => {
        const date = row.createdAt || row.date || row.created_date;
        if (!date) return true;
        const d = dayjs(date);
        return d.isAfter(start) && d.isBefore(end);
      });
    }

    if (sortField && sortDirection && sortable) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        return sortDirection === 'asc'
          ? aStr.localeCompare(bStr, 'ar')
          : bStr.localeCompare(aStr, 'ar');
      });
    }

    return result;
  }, [data, searchText, selectedFilters, sortField, sortDirection, filters, searchFields, searchable, sortable, dateRange, onDateFilterChange]);

  const getReportData = () => filteredData.length > 0 ? filteredData : data;

  const showAlert = (text) => {
    alert(text);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (onDateFilterChange) {
      onDateFilterChange(dates);
    }
  };

    const handlePrint = () => {
    if (disablePrint) return;
    if (onPrint) { onPrint(); return; }
    
    const reportData = getReportData();
    if (reportData.length === 0) {
      showAlert('لا توجد بيانات للطباعة');
      return;
    }

    // ✅ إزالة عمود الإجراءات من الطباعة
    const printColumns = columns.filter(col => col.key !== 'actions' && col.label !== 'الإجراءات');

    const numColumns = printColumns.length;
    const isLandscape = numColumns > 6;
    
    let fontSize = '10px';
    let headerFontSize = '12px';
    if (numColumns <= 5) { fontSize = '12px'; headerFontSize = '14px'; }
    else if (numColumns <= 8) { fontSize = '10px'; headerFontSize = '12px'; }
    else if (numColumns <= 12) { fontSize = '8px'; headerFontSize = '10px'; }
    else { fontSize = '7px'; headerFontSize = '9px'; }

    const dateRangeText = dateRange 
      ? `من ${dateRange[0].format('YYYY/MM/DD')} إلى ${dateRange[1].format('YYYY/MM/DD')}`
      : '';

    const tableRows = reportData.map((row) => {
      const cells = printColumns.map((col) => {
        let value = row[col.key];
        if (col.formatter) value = col.formatter(value, row);
        return `<td>${value || '-'}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>${printTitle || title}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: ${isLandscape ? 'landscape' : 'portrait'};
            margin: 6mm;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Cairo', 'Tajawal', sans-serif; 
            padding: 0; 
            direction: rtl; 
            background: white; 
            font-size: ${fontSize};
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            padding: 4px 8px; 
            border: 1.5px solid #197fdd; 
            border-radius: 4px; 
            margin-bottom: 4px; 
          }
          .header-right { text-align: right; flex: 1; }
          .header-center { text-align: center; flex: 1; }
          .header-left { text-align: left; direction: ltr; flex: 1; }
          .company-name-ar { font-size: ${parseInt(fontSize) + 4}px; font-weight: bold; color: #2c3e50; }
          .company-name-en { font-size: ${parseInt(fontSize) + 4}px; font-weight: bold; color: #2c3e50; }
          .info-text { font-size: ${parseInt(fontSize) - 1}px; margin-top: 1px; color: #495057; }
          .title-box { 
            text-align: center; 
            background: #f8f9fa; 
            border: 1.5px solid #197fdd; 
            border-radius: 4px; 
            padding: 4px; 
            font-size: ${parseInt(fontSize) + 8}px; 
            font-weight: bold; 
            margin: 4px 0; 
          }
          .date-range {
            text-align: center;
            font-size: ${parseInt(fontSize) + 1}px;
            color: #495057;
            margin: 2px 0 4px 0;
            font-weight: bold;
          }
          .table-wrapper {
            width: 100%;
            overflow: visible;
          }
          .report-table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: ${fontSize};
            table-layout: auto;
          }
          .report-table th, .report-table td { 
            border: 1px solid #c5ccd1; 
            padding: 3px 5px; 
            text-align: center; 
            white-space: nowrap;
          }
          .report-table th { 
            background: #197fdd; 
            color: white; 
            font-weight: bold; 
            font-size: ${headerFontSize};
            padding: 4px 6px;
          }
          .report-table tr:nth-child(even) { background: #f8f9fa; }
          .report-table tr:hover { background: #e3f2fd; }
          
          .footer { 
            text-align: center; 
            font-size: ${parseInt(fontSize) - 1}px; 
            color: #6c757d; 
            border-top: 1px solid #c5ccd1; 
            padding-top: 4px; 
            margin-top: 6px;
          }
          
          @media print {
            body { padding: 0; margin: 0; }
            .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .title-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .report-table th { background: #197fdd !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .report-table { page-break-inside: auto; }
            .report-table tr { page-break-inside: avoid; }
            .report-table th, .report-table td { padding: 2px 4px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-right">
            <div class="company-name-ar">${companyInfo.nameAr}</div>
            <div class="info-text">${companyInfo.addressAr}</div>
            <div class="info-text">الرقم الضريبي: ${companyInfo.taxNumber}</div>
            <div class="info-text">السجل التجاري: ${companyInfo.commercialRegister}</div>
            <div class="info-text">الهاتف: ${companyInfo.phone}</div>
          </div>
          <div class="header-center">
            <div class="info-text">${companyInfo.website}</div>
          </div>
          <div class="header-left">
            <div class="company-name-en">${companyInfo.nameEn}</div>
            <div class="info-text">${companyInfo.addressEn}</div>
            <div class="info-text">Tax Number: ${companyInfo.taxNumber}</div>
            <div class="info-text">Phone: ${companyInfo.phone}</div>
          </div>
        </div>
        <div class="title-box">${printTitle || title}</div>
        ${dateRangeText ? `<div class="date-range">${dateRangeText}</div>` : ''}
        <div class="table-wrapper">
          <table class="report-table">
            <thead>
              <tr>${printColumns.map(col => `<th>${col.label}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        <div class="footer">
          <div>تاريخ الطباعة: ${new Date().toLocaleDateString("ar-SA")}</div>
          <div>تم الإنشاء بواسطة نظام Attlsoft ERP</div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) {
      const blob = new Blob([printContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          setTimeout(() => {
            newWindow.print();
            setTimeout(() => newWindow.close(), 500);
          }, 300);
        };
      }
      return;
    }
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleExcel = () => {
    if (disablePrint) return;
    if (onExportExcel) { onExportExcel(); return; }
    
    const reportData = getReportData();
    if (reportData.length === 0) {
      showAlert('لا توجد بيانات للتصدير');
      return;
    }

    // ✅ إزالة عمود الإجراءات من الإكسل
    const excelColumns = columns.filter(col => col.key !== 'actions' && col.label !== 'الإجراءات');

    const excelData = [];
    excelData.push(["", companyInfo.nameAr, printTitle || title, companyInfo.nameEn, ""]);
    excelData.push([]);
    excelData.push(excelColumns.map(c => c.label));
    reportData.forEach(row => {
      const rowData = excelColumns.map(col => {
        let value = row[col.key];
        if (col.formatter) value = col.formatter(value, row);
        return value || "-";
      });
      excelData.push(rowData);
    });
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    ws['!cols'] = excelColumns.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "تقرير");
    XLSX.writeFile(wb, `${printFileName || printTitle || title}.xlsx`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (onSearch) onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    if (onFilterChange) onFilterChange({});
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const antColumns = useMemo(() => {
    const totalColumns = columns.length;
    const shouldFix = fixedColumns !== null ? fixedColumns : totalColumns > 6;
    
    return columns.map((col, index) => {
      const isActionsColumn = col.key === 'actions' || col.label === 'الإجراءات' || col.label === 'Actions';
      const isFirst = index === 0;
      const isSecond = index === 1;
      const isLast = index === totalColumns - 1;
      
      let fixed = undefined;
      
      if (shouldFix) {
        if (isFirst || isSecond) {
          fixed = 'start';
        } else if (isLast || isActionsColumn) {
          fixed = 'end';
        }
      }
      
      return {
        title: col.label,
        dataIndex: col.key,
        key: col.key,
        align: col.align || 'center',
        width: col.width || 150,
        fixed: fixed,
        render: (value, record, index) => {
          if (col.render) return col.render(value, record, index);
          if (col.formatter) return col.formatter(value, record);
          return value ?? '-';
        },
        sorter: col.sortable && sortable && !isActionsColumn
          ? (a, b) => {
              const aVal = a[col.key];
              const bVal = b[col.key];
              if (typeof aVal === 'number' && typeof bVal === 'number') {
                return aVal - bVal;
              }
              if (aVal instanceof Date && bVal instanceof Date) {
                return aVal.getTime() - bVal.getTime();
              }
              return String(aVal || '').localeCompare(String(bVal || ''), 'ar');
            }
          : undefined,
        sortDirections: isActionsColumn ? [] : ['ascend', 'descend'],
      };
    });
  }, [columns, sortable, fixedColumns]);

  const renderToolbar = () => {
    const hasSearch = searchable && !disablePrint;
    const hasFilters = filters && Object.keys(filters).length > 0 && !disablePrint;
    const hasPrint = showPrintButtons && !disablePrint;
    const hasActions = extraActions || showReload || hasSearch || hasFilters || hasPrint || showDateFilter;

    if (!hasActions && !title) return null;

    const printButtons = [
      {
        key: 'print',
        label: t('print'),
        icon: <PrinterOutlined style={{color:red[6]}} />,
        onClick: handlePrint,
      },
      {
        key: 'excel',
        label: t('excel'),
        icon: <FileExcelOutlined style={{color: green[6]}} />,
        onClick: handleExcel,
      },
    ];

    const mainButtons = (
      <div className="flex items-center gap-2 flex-wrap">
        {extraActions}
        {showReload && (
          <Tooltip title={t('reload')}>
            <Button icon={<ReloadOutlined style={{color: red[6]}} />} onClick={onReload} loading={loading} />
          </Tooltip>
        )}
        {hasPrint && (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <Tooltip title={t('print')}>
                <Button icon={<PrinterOutlined style={{color:red[6]}} />} onClick={handlePrint}>{t('print')}</Button>
              </Tooltip>
              <Tooltip title={t('excel')}>
                <Button icon={<FileExcelOutlined style={{color: green[6]}} />} onClick={handleExcel}>{t('excel')}</Button>
              </Tooltip>
            </div>
            <div className="sm:hidden">
              <Dropdown
                menu={{
                  items: printButtons.map((item) => ({
                    key: item.key,
                    label: (
                      <Space>
                        {item.icon}
                        {item.label}
                      </Space>
                    ),
                    onClick: item.onClick,
                  })),
                }}
                placement="bottomRight"
              >
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </div>
          </>
        )}
      </div>
    );

    return (
      <div className={`flex flex-wrap items-center justify-between gap-3 mb-4 ${toolbarClassName}`}>
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[180px]">
          {title && <h3 className="text-lg font-bold text-gray-800 ml-4 whitespace-nowrap">{title}</h3>}

          {showDateFilter && (
            <RangePicker
              onChange={handleDateChange}
              placeholder={['من تاريخ', 'إلى تاريخ']}
              className="w-56"
              size="middle"
              format="YYYY/MM/DD"
            />
          )}

          {hasSearch && (
            <Input
              placeholder={searchPlaceholder}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-60 sm:w-50"
              allowClear
              size="middle"
            />
          )}

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(filters).map(([key, options]) => (
                <Select
                  key={key}
                  placeholder={key}
                  allowClear
                  className="w-36 sm:w-48"
                  size="middle"
                  onChange={(value) => handleFilterChange(key, value)}
                  value={selectedFilters[key]}
                >
                  {options.map((opt) => (
                    <Select.Option key={String(opt.value)} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              ))}
              {Object.keys(selectedFilters).some(k => selectedFilters[k] !== undefined && selectedFilters[k] !== null && selectedFilters[k] !== '') && (
                <Button size="middle" onClick={handleClearFilters}>
                  {t('clear_filters')}
                </Button>
              )}
            </div>
          )}
        </div>

        {mainButtons}
      </div>
    );
  };

  const renderPageSizeSelector = () => {
    if (!showPagination) return null;
    
    return (
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="text-sm text-gray-600 whitespace-nowrap">{t('rowsPerPage')} :</span>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="w-24"
          size="small"
        >
          <Select.Option value={10}>10</Select.Option>
          <Select.Option value={20}>20</Select.Option>
          <Select.Option value={50}>50</Select.Option>
          <Select.Option value={100}>100</Select.Option>
          <Select.Option value={999999}>{t('all')}</Select.Option>
        </Select>
        <span className="text-sm text-gray-400 whitespace-nowrap">
          ({t('total')}: <span className="font-bold text-gray-600">{filteredData.length}</span>)
        </span>
      </div>
    );
  };

  const renderPagination = () => {
    if (!showPagination) return null;
    
    const total = filteredData.length;
    const totalPages = Math.ceil(total / pageSize);
    
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper={false}
          showTotal={false}
          className="rtl-pagination"
          locale={{
            items_per_page: '',
            jump_to: '',
            page: '',
          }}
        />
      </div>
    );
  };

  const paginatedData = useMemo(() => {
    if (!showPagination || pageSize === 999999) {
      return filteredData;
    }
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize, showPagination]);

  return (
    <div className={`generic-table ${className}`} dir="rtl">
      {renderToolbar()}
      {renderPageSizeSelector()}

      <Table
        className={styles.customTable}
        columns={antColumns}
        dataSource={paginatedData}
        loading={loading}
        rowKey={rowKey}
        size={size}
        bordered={bordered}
        pagination={false}
        onChange={(pagination, filters, sorter) => {
          if (sorter && 'field' in sorter && sorter.order) {
            const direction = sorter.order === 'ascend' ? 'asc' : 'desc';
            setSortField(sorter.field);
            setSortDirection(direction);
            if (onSortChange) onSortChange(sorter.field, direction);
          }
        }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          className: rowClassName?.(record, filteredData.indexOf(record)) || '',
        })}
        locale={{ emptyText }}
        rowSelection={selection ? {
          selectedRowKeys: selection.selectedRowKeys,
          onChange: selection.onChange,
          type: selection.type || 'checkbox',
        } : undefined}
        scroll={{ x: 'max-content', y: 55 * 5 }}
      />

      {renderPagination()}
    </div>
  );
};

export default ReportGenerator;