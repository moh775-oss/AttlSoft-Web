// src/page/inventory/Items/index.jsx
import { useState, useEffect, useRef } from 'react';
import {
  Card, Form, Input, Select, Button, Row, Col, Space, Switch,
  Modal, InputNumber, Tag, Divider, Upload, Image, Tooltip
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, SaveOutlined, BarcodeOutlined,
  RollbackOutlined, PrinterFilled, PictureOutlined, EditOutlined,
  CalculatorOutlined, TagOutlined, DollarOutlined, PercentageOutlined,
  StarFilled, ExperimentOutlined, CalendarOutlined, AppstoreOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ReportGenerator from '@/utils/ReportGenerator';
import { fetchItems, addItem, updateItem, deleteItem } from '@/api/Items';
import { fetchCategories } from '@/api/categorie';
import { fetchUnits } from '@/api/unit';
import { fetchTaxes } from '@/api/Tax';
import { fetchBranches } from '@/api/Branch';
import { useAuth } from '@/context/AuthContext';
import { useTranslate } from '@/hooks/useTranslate';
import notify from '@/utils/notify';
import Barcode from 'react-barcode';
import './Items.css';

const { Option } = Select;

const ItemsPage = () => {
  const { t } = useTranslate();
  const { userId, branchId } = useAuth();
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [taxGroups, setTaxGroups] = useState([]);
  const [branches, setBranches] = useState([]);
  const [allBranches, setAllBranches] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [unitDetails, setUnitDetails] = useState([]);
  const [barcodeDetails, setBarcodeDetails] = useState([]);
  const [showUnits, setShowUnits] = useState(false);
  const [showBarcodes, setShowBarcodes] = useState(false);
  const [scanModal, setScanModal] = useState({ open: false, target: '', cardId: null });
  const [printModal, setPrintModal] = useState({
    open: false,
    barcode: '',
    type: '',
    name: '',
    price: '',
    copies: 1,
    labelWidth: 40,   // mm
    labelHeight: 30,  // mm
    showName: true,
    showPrice: true,
  });
  const [calcTotals, setCalcTotals] = useState({ saleTax: 0, buyTax: 0, profit: 0 });
  const [itemStatus, setItemStatus] = useState(true);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    loadDropdowns();
    loadItems();
  }, []);

  const recalcTotals = (values) => {
    const salePrice = Number(values?.salePriceWithTax) || 0;
    const buyPrice = Number(values?.buyPriceWithTax) || 0;
    const taxRate = 15;
    const saleTax = (salePrice * taxRate) / (100 + taxRate);
    const buyTax = (buyPrice * taxRate) / (100 + taxRate);
    const profit = salePrice - buyPrice;
    setCalcTotals({
      saleTax: saleTax.toFixed(2),
      buyTax: buyTax.toFixed(2),
      profit: profit.toFixed(2),
    });
  };

  const loadDropdowns = async () => {
    try {
      const [catRes, unitRes, taxRes, branchRes] = await Promise.all([
        fetchCategories(), fetchUnits(), fetchTaxes(), fetchBranches(),
      ]);
      setCategories(Array.isArray(catRes) ? catRes : []);
      setUnits(Array.isArray(unitRes) ? unitRes : []);
      setTaxGroups(Array.isArray(taxRes) ? taxRes : []);
      setBranches(Array.isArray(branchRes) ? branchRes : []);
    } catch (error) {
      console.error('Error loading dropdowns:', error);
    }
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems(branchId);
      setItems(Array.isArray(data) ? data : []);
    } catch { notify.error(t('operationFailed')); }
    finally { setLoading(false); }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setUnitDetails([]);
    setBarcodeDetails([]);
    setImagePreview(null);
    setImageFile(null);
    setShowUnits(false);
    setShowBarcodes(false);
    form.resetFields();
    form.setFieldsValue({
      isExp: false,
      isQuickItem: false,
      isFavorite: false,
      allBranch: false,
      branch: branchId || 1,
    });
    setItemStatus(true);
    setAllBranches(true);
    setCalcTotals({ saleTax: 0, buyTax: 0, profit: 0 });
  };

  const handleEdit = (record) => {
    setSelectedItem(record);
    const vals = {
      itemBarcode: record.itemBarcode,
      itemNameA: record.itemNameA,
      itemNameE: record.itemNameE,
      catId: record.catId,
      unitId: record.unitId,
      openStock: record.openStock,
      itemLimit: record.itemLimit,
      buyPriceWithTax: record.buyPriceWithTax,
      salePriceWithTax: record.salePriceWithTax,
      isExp: record.isExp,
      isQuickItem: record.isQuickItem,
      isFavorite: record.isFavorite || false,
      branch: record.branch,
      allBranch: record.allBranch,
      taxGroupId: record.taxGroupId,
      minPrice: record.minPrice,
      exemptionReason: record.exemptionReason || '',
    };
    form.setFieldsValue(vals);
    setItemStatus(record.itemStatus ?? true);
    recalcTotals(vals);
    setAllBranches(record.allBranch || true);
    setImagePreview(record.itemPic || null);
    setUnitDetails((record.detils_unit || []).map(u => ({ ...u, id: u.id || Date.now() + Math.random(), _isNew: false })));
    setBarcodeDetails((record.detils_barcode || []).map(b => ({ ...b, id: b.id || Date.now() + Math.random(), _isNew: false })));
    setShowUnits((record.detils_unit || []).length > 0);
    setShowBarcodes((record.detils_barcode || []).length > 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: t('confirmDelete'),
      content: t('confirmDeleteMessage'),
      okText: t('yesDelete'),
      cancelText: t('cancel'),
      okButtonProps: { danger: true },
      onOk: async () => {
        const result = await deleteItem(id, branchId || 1, userId || 1);
        if (result.success) { notify.success(result.message); loadItems(); handleAdd(); }
        else notify.error(result.message);
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const itemData = {
        ...values,
        itemStatus,
        userId: userId || 1,
        branch: allBranches ? null : (values.branch || branchId || 1),
        allBranch: allBranches,
        itemPic: imageFile || imagePreview,
        detils_unit: unitDetails,
        detils_barcode: barcodeDetails,
      };
      const result = selectedItem?.id ? await updateItem(selectedItem.id, itemData) : await addItem(itemData);
      if (result.success) { notify.success(result.message); loadItems(); handleAdd(); }
      else notify.error(result.message);
    } catch { notify.error(t('saveError')); }
    finally { setSaving(false); }
  };

  const handleRollback = () => selectedItem ? handleEdit(selectedItem) : handleAdd();

  const addUnitDetail = () => {
    setShowUnits(true);
    setUnitDetails(prev => [...prev, {
      id: Date.now(), unitId: null, exchangFactor: 1, barcodeUnit: '',
      priceBuyNoVat: 0, priceSellNoVat: 0, rabh: 0,
      saleTaxTotal: 0, buyTaxTotal: 0, salePriceWithTax: 0, buyPriceWithTax: 0, minPriceUnit: 0,
      _isNew: true,
    }]);
  };

  const updateUnitDetail = (id, field, value) => setUnitDetails(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  const removeUnitDetail = (id) => setUnitDetails(prev => prev.filter(u => u.id !== id));

  const addBarcodeDetail = () => {
    setShowBarcodes(true);
    setBarcodeDetails(prev => [...prev, { id: Date.now(), unitId: null, itmBarcode: '', _isNew: true }]);
  };

  const updateBarcodeDetail = (id, field, value) => setBarcodeDetails(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  const removeBarcodeDetail = (id) => setBarcodeDetails(prev => prev.filter(b => b.id !== id));

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => { setImagePreview(e.target.result); setImageFile(e.target.result); };
    reader.readAsDataURL(file);
    return false;
  };

  const startScanner = async (target, cardId = null) => {
    setScanModal({ open: true, target, cardId });
    setTimeout(async () => {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/library');
        codeReader.current = new BrowserMultiFormatReader();
        const devices = await codeReader.current.listVideoInputDevices();
        const back = devices.find(d => d.label.toLowerCase().includes('back')) || devices[0];
        if (!back) { notify.error(t('cameraNotFound')); return; }
        await codeReader.current.decodeFromVideoDevice(back.deviceId, videoRef.current, (result) => {
          if (result) {
            const value = result.getText();
            if (target === 'main') form.setFieldsValue({ itemBarcode: value });
            else if (target === 'unit') updateUnitDetail(cardId, 'barcodeUnit', value);
            else if (target === 'barcode') updateBarcodeDetail(cardId, 'itmBarcode', value);
            notify.success(t('barcodeScanned'));
            closeScanner();
          }
        });
      } catch { notify.error(t('cameraError')); closeScanner(); }
    }, 300);
  };

  const closeScanner = () => {
    if (codeReader.current) { codeReader.current.reset(); codeReader.current = null; }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setScanModal({ open: false, target: '', cardId: null });
  };

  /**
   * ✅ طباعة الملصقات — كل ملصق بصفحة منفصلة
   * يفتح نافذة جديدة فيها HTML الملصق مكرر بعدد النسخ
   * وكل نسخة في <div style="page-break-after: always">
   */
  const handlePrintLabels = () => {
    const { barcode, name, price, copies, labelWidth, labelHeight, showName, showPrice, type } = printModal;
    if (!barcode) return;

    const printWindow = window.open('', '_blank', 'width=600,height=700');
    if (!printWindow) {
      notify.error(t('popupBlocked') || 'يرجى السماح بالنوافذ المنبثقة');
      return;
    }

    // نبني صف الملصق HTML
    const labelHtml = `
      <div class="label">
        ${showName && name ? `<div class="label-name">${name}</div>` : ''}
        <svg class="barcode-svg" data-value="${barcode}"></svg>
        ${showPrice && price !== '' && price !== null ? `<div class="label-price">${Number(price).toFixed(2)}</div>` : ''}
      </div>
    `;

    // كرر الملصق بعدد النسخ — كل واحد بصفحة
    const pagesHtml = Array.from({ length: copies })
      .map(() => `<div class="page">${labelHtml}</div>`)
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>${type || 'Barcode'} - Print</title>
        <style>
          @page {
            size: ${labelWidth}mm ${labelHeight}mm;
            margin: 0;
          }
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            font-family: 'Cairo', Arial, sans-serif;
            background: #fff;
          }
          .page {
            width: ${labelWidth}mm;
            height: ${labelHeight}mm;
            display: flex;
            align-items: center;
            justify-content: center;
            page-break-after: always;
            overflow: hidden;
          }
          .page:last-child {
            page-break-after: auto;
          }
          .label {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1mm;
            text-align: center;
          }
          .label-name {
            font-size: 9pt;
            font-weight: 700;
            color: #000;
            margin-bottom: 1mm;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          .barcode-svg {
            max-width: 100%;
            height: auto;
          }
          .label-price {
            font-size: 10pt;
            font-weight: 800;
            color: #000;
            margin-top: 1mm;
          }
          @media print {
            html, body { width: ${labelWidth}mm; }
          }
        </style>
      </head>
      <body>
        ${pagesHtml}
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
        <script>
          window.onload = function() {
            try {
              var svgs = document.querySelectorAll('.barcode-svg');
              svgs.forEach(function(svg) {
                try {
                  JsBarcode(svg, svg.getAttribute('data-value'), {
                    format: 'CODE128',
                    width: 1.6,
                    height: 40,
                    fontSize: 12,
                    margin: 0,
                    displayValue: true,
                  });
                } catch (e) { console.error(e); }
              });
              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 400);
            } catch (e) { console.error(e); }
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getCategoryName = (catId) => categories.find(c => c.id === catId)?.name || '—';
  const getUnitName = (unitId) => units.find(u => u.id === unitId)?.name || '—';

  const columns = [
    { key: 'itemBarcode', label: t('barcode'), sortable: true, render: (v) => <span className="font-mono text-sm">{v || '—'}</span> },
    { key: 'itemNameA', label: t('itemNameAr'), sortable: true, render: (v) => <span className="font-medium">{v || '—'}</span> },
    { key: 'catId', label: t('category'), sortable: true, render: (v) => <Tag color="blue">{getCategoryName(v)}</Tag> },
    { key: 'unitId', label: t('unit'), sortable: true, render: (v) => <Tag color="cyan">{getUnitName(v)}</Tag> },
    { key: 'salePriceWithTax', label: t('salePrice'), sortable: true, render: (v) => <span className="text-green-600">{v || 0}</span> },
    { key: 'buyPriceWithTax', label: t('buyPrice'), sortable: true, render: (v) => <span className="text-blue-600">{v || 0}</span> },
    { key: 'rbh', label: t('profit'), sortable: true, render: (v) => <span className="text-purple-600">{v || 0}</span> },
    { key: 'itemStatus', label: t('status'), render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? t('active') : t('inactive')}</Tag> },
  ];

  return (
    <div className="items-page">
      <Card className="items-toolbar" size="small">
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>{t('new')}</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>{t('save')}</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => selectedItem && handleDelete(selectedItem.id)} disabled={!selectedItem}>{t('delete')}</Button>
          <Button icon={<RollbackOutlined />} onClick={handleRollback} disabled={!selectedItem}>{t('rollback')}</Button>
        </Space>
      </Card>

      <Row gutter={[12, 12]}>
        <Col xs={24} lg={17}>
          <Card className="items-form-card" size="small">
            <Form
              form={form}
              layout="vertical"
              size="small"
              dir="rtl"
              onValuesChange={(changed) => {
                if ('salePriceWithTax' in changed || 'buyPriceWithTax' in changed) {
                  recalcTotals(form.getFieldsValue());
                }
              }}
            >
              {/* كارد المعلومات الأساسية */}
              <Card className="info-card" size="small" title={<Space><TagOutlined /> {t('basicInfo')}</Space>}>
                <Row gutter={8}>
                  <Col xs={24} md={12}>
                    <Form.Item name="itemBarcode" label={t('barcode')} style={{ marginBottom: 8 }}>
                      <div className="input-with-actions">
                        <Input placeholder={t('enterBarcode')} className="center-text" />
                        <div className="field-actions">
                          <Tooltip title={t('scan')}>
                            <Button
                              type="text"
                              className="icon-btn scan-btn"
                              icon={<BarcodeOutlined />}
                              onClick={() => startScanner('main')}
                            />
                          </Tooltip>
                          <Tooltip title={t('print')}>
                            <Button
                              type="text"
                              className="icon-btn print-btn"
                              icon={<PrinterFilled />}
                              onClick={() =>
                                setPrintModal({
                                  ...printModal,
                                  open: true,
                                  barcode: form.getFieldValue('itemBarcode') || '',
                                  type: t('mainBarcode'),
                                  name: form.getFieldValue('itemNameA') || '',
                                  price: form.getFieldValue('salePriceWithTax') || '',
                                })
                              }
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="unitId" label={t('unit')} style={{ marginBottom: 8 }}>
                      <Select placeholder={t('selectUnit')} showSearch optionFilterProp="label">
                        {units.map(u => <Option key={u.id} value={u.id}>{u.name}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={8}>
                  <Col xs={24} md={12}>
                    <Form.Item name="itemNameA" label={t('itemNameAr')} rules={[{ required: true, message: t('required') }]} style={{ marginBottom: 8 }}>
                      <Input placeholder={t('enterItemNameAr')} className="center-text" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="itemNameE" label={t('itemNameEn')} style={{ marginBottom: 8 }}>
                      <Input placeholder={t('enterItemNameEn')} className="center-text" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={8}>
                  <Col xs={24} md={8}>
                    <Form.Item name="catId" label={t('category')} style={{ marginBottom: 8 }}>
                      <Select placeholder={t('selectCategory')} showSearch optionFilterProp="label">
                        {categories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="taxGroupId" label={t('taxGroup')} style={{ marginBottom: 8 }}>
                      <Select placeholder={t('selectTaxGroup')} showSearch optionFilterProp="label">
                        {taxGroups.map(tg => <Option key={tg.id} value={tg.id}>{tg.nameAr}</Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="exemptionReason" label={t('exemptionReason')} style={{ marginBottom: 8 }}>
                      <Input placeholder={t('enterExemptionReason')} className="center-text" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Row gutter={12} style={{ marginTop: 12 }}>
                <Col xs={24} md={12}>
                  <Card className="pricing-card" size="small" title={<Space><DollarOutlined /> {t('pricing')}</Space>}>
                    <div className="pricing-inputs">
                      <div className="price-field">
                        <span className="price-label">{t('salePrice')}</span>
                        <Form.Item name="salePriceWithTax" style={{ marginBottom: 8 }}>
                          <InputNumber className="w-full center-text" min={0} step={0.01} placeholder="0.00" />
                        </Form.Item>
                      </div>
                      <div className="price-field">
                        <span className="price-label">{t('buyPrice')}</span>
                        <Form.Item name="buyPriceWithTax" style={{ marginBottom: 8 }}>
                          <InputNumber className="w-full center-text" min={0} step={0.01} placeholder="0.00" />
                        </Form.Item>
                      </div>
                      <div className="price-field">
                        <span className="price-label">{t('minSalePrice')}</span>
                        <Form.Item name="minPrice" style={{ marginBottom: 8 }}>
                          <InputNumber className="w-full center-text" min={0} step={0.01} placeholder="0.00" />
                        </Form.Item>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card className="calc-card" size="small" title={<Space><CalculatorOutlined /> {t('calculated')}</Space>}>
                    <div className="calc-body">
                      <div className="calc-row">
                        <span className="calc-label"><PercentageOutlined /> {t('saleTax')}</span>
                        <span className="calc-value calc-green">{calcTotals.saleTax}</span>
                      </div>
                      <div className="calc-row">
                        <span className="calc-label"><PercentageOutlined /> {t('buyTax')}</span>
                        <span className="calc-value calc-blue">{calcTotals.buyTax}</span>
                      </div>
                      <div className="calc-row calc-row-highlight">
                        <span className="calc-label"><CalculatorOutlined /> {t('profit')}</span>
                        <span className="calc-value calc-purple">{calcTotals.profit}</span>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              <div className="detail-buttons">
                <Button
                  type={showUnits ? 'primary' : 'default'}
                  icon={<AppstoreOutlined />}
                  onClick={() => setShowUnits(!showUnits)}
                >
                  {t('unitDetails')}
                </Button>
                <Button
                  type={showBarcodes ? 'primary' : 'default'}
                  icon={<BarcodeOutlined />}
                  onClick={() => setShowBarcodes(!showBarcodes)}
                >
                  {t('barcodeDetails')}
                </Button>
              </div>

              {showUnits && (
                <div className="detail-section">
                  <div className="detail-header">
                    <Tag color="blue">{t('unitDetails')}</Tag>
                    <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={addUnitDetail}>
                      {t('addUnit')}
                    </Button>
                  </div>
                  <div className="unit-table-wrapper">
                    {unitDetails.length === 0 ? (
                      <div className="empty-hint">{t('noUnitDetails')}</div>
                    ) : (
                      <table className="unit-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>{t('barcode')}</th>
                            <th>{t('quantity')}</th>
                            <th>{t('unit')}</th>
                            <th>{t('salePrice')}</th>
                            <th>{t('buyPrice')}</th>
                            <th>{t('profit')}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {unitDetails.map((u, idx) => (
                            <tr key={u.id}>
                              <td>{idx + 1}</td>
                              <td>
                                <div className="input-with-actions">
                                  <Input
                                    size="small"
                                    value={u.barcodeUnit}
                                    onChange={(e) => updateUnitDetail(u.id, 'barcodeUnit', e.target.value)}
                                    className="center-text"
                                  />
                                  <div className="field-actions">
                                    <Button
                                      type="text"
                                      className="icon-btn scan-btn"
                                      icon={<BarcodeOutlined />}
                                      onClick={() => startScanner('unit', u.id)}
                                    />
                                    <Button
                                      type="text"
                                      className="icon-btn print-btn"
                                      icon={<PrinterFilled />}
                                      onClick={() =>
                                        setPrintModal({
                                          ...printModal,
                                          open: true,
                                          barcode: u.barcodeUnit || '',
                                          type: t('unitBarcode'),
                                          name: form.getFieldValue('itemNameA') || '',
                                          price: u.priceSellNoVat || '',
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </td>
                              <td><InputNumber size="small" min={1} value={u.exchangFactor} onChange={(v) => updateUnitDetail(u.id, 'exchangFactor', v)} className="w-full center-text" /></td>
                              <td>
                                <Select size="small" value={u.unitId} onChange={(v) => updateUnitDetail(u.id, 'unitId', v)} showSearch optionFilterProp="label" className="w-full">
                                  {units.map(un => <Option key={un.id} value={un.id}>{un.name}</Option>)}
                                </Select>
                              </td>
                              <td><InputNumber size="small" min={0} value={u.priceSellNoVat} onChange={(v) => updateUnitDetail(u.id, 'priceSellNoVat', v)} className="w-full center-text" /></td>
                              <td><InputNumber size="small" min={0} value={u.priceBuyNoVat} onChange={(v) => updateUnitDetail(u.id, 'priceBuyNoVat', v)} className="w-full center-text" /></td>
                              <td><InputNumber size="small" value={u.rabh} onChange={(v) => updateUnitDetail(u.id, 'rabh', v)} className="w-full center-text" /></td>
                              <td><Button danger size="small" type="text" icon={<DeleteOutlined />} onClick={() => removeUnitDetail(u.id)} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {showBarcodes && (
                <div className="detail-section">
                  <div className="detail-header">
                    <Tag color="orange">{t('barcodeDetails')}</Tag>
                    <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={addBarcodeDetail}>
                      {t('addBarcode')}
                    </Button>
                  </div>
                  <div className="barcode-details-list">
                    {barcodeDetails.length === 0 && <div className="empty-hint">{t('noBarcodeDetails')}</div>}
                    {barcodeDetails.map((b, idx) => (
                      <Card key={b.id} size="small" className="barcode-detail-card" title={<Tag color="orange">#{idx + 1} {t('barcode')}</Tag>} extra={<Button danger size="small" type="text" icon={<DeleteOutlined />} onClick={() => removeBarcodeDetail(b.id)} />}>
                        <Row gutter={[6, 6]}>
                          <Col xs={24} md={8}>
                            <div className="field-inline">
                              <span className="field-label">{t('unit')}:</span>
                              <Select size="small" value={b.unitId} className="field-input" onChange={(v) => updateBarcodeDetail(b.id, 'unitId', v)} showSearch optionFilterProp="label">
                                {units.map(un => <Option key={un.id} value={un.id}>{un.name}</Option>)}
                              </Select>
                            </div>
                          </Col>
                          <Col xs={24} md={16}>
                            <div className="field-inline">
                              <span className="field-label">{t('barcode')}:</span>
                              <div className="input-with-actions" style={{ flex: 1 }}>
                                <Input
                                  size="small"
                                  className="center-text"
                                  value={b.itmBarcode}
                                  onChange={(e) => updateBarcodeDetail(b.id, 'itmBarcode', e.target.value)}
                                />
                                <div className="field-actions">
                                  <Button
                                    type="text"
                                    className="icon-btn scan-btn"
                                    icon={<BarcodeOutlined />}
                                    onClick={() => startScanner('barcode', b.id)}
                                  />
                                  <Button
                                    type="text"
                                    className="icon-btn print-btn"
                                    icon={<PrinterFilled />}
                                    onClick={() =>
                                      setPrintModal({
                                        ...printModal,
                                        open: true,
                                        barcode: b.itmBarcode || '',
                                        type: t('barcode'),
                                        name: form.getFieldValue('itemNameA') || '',
                                        price: form.getFieldValue('salePriceWithTax') || '',
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={7}>
          <Card className="items-side-card" size="small">
            <div className="image-section">
              {imagePreview ? (
                <div className="image-box">
                  <Image src={imagePreview} alt="item" className="item-image" />
                  <div className="image-actions">
                    <Upload beforeUpload={handleImageUpload} showUploadList={false} accept="image/*">
                      <Button size="small" icon={<EditOutlined />}>{t('change')}</Button>
                    </Upload>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => { setImagePreview(null); setImageFile(null); }}>{t('delete')}</Button>
                  </div>
                </div>
              ) : (
                <Upload beforeUpload={handleImageUpload} showUploadList={false} accept="image/*">
                  <div className="image-upload-placeholder">
                    <PictureOutlined style={{ fontSize: 42, color: '#aaa' }} />
                    <p>{t('clickToUpload')}</p>
                  </div>
                </Upload>
              )}
            </div>

            <Divider className="my-2">{t('settings')}</Divider>

            <div className="side-switch-list">
              <div className="side-switch-item">
                <span className="side-switch-label"><StarFilled style={{ color: '#f7c948' }} /> {t('favorite')}</span>
                <Form.Item name="isFavorite" valuePropName="checked" noStyle><Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} /></Form.Item>
              </div>
              <div className="side-switch-item">
                <span className="side-switch-label"><CalendarOutlined style={{ color: '#13c2c2' }} /> {t('hasExpiry')}</span>
                <Form.Item name="isExp" valuePropName="checked" noStyle><Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} /></Form.Item>
              </div>
              <div className="side-switch-item">
                <span className="side-switch-label"><ExperimentOutlined style={{ color: '#eb2f96' }} /> {t('scaleItem')}</span>
                <Form.Item name="isQuickItem" valuePropName="checked" noStyle><Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} /></Form.Item>
              </div>

              <div className="side-switch-item">
                <span className="side-switch-label"><AppstoreOutlined style={{ color: '#52c41a' }} /> {t('active')}</span>
                <Switch
                  checked={itemStatus}
                  onChange={(v) => setItemStatus(v)}
                  checkedChildren={t('yes')}
                  unCheckedChildren={t('no')}
                />
              </div>

              <div className="side-switch-item">
                <span className="side-switch-label"><ShoppingCartOutlined style={{ color: '#1890ff' }} /> {t('openStock')}</span>
                <Form.Item name="openStock" noStyle><InputNumber size="small" min={0} style={{ width: 90 }} className="center-text" /></Form.Item>
              </div>
              <div className="side-switch-item">
                <span className="side-switch-label"><AppstoreOutlined style={{ color: '#faad14' }} /> {t('itemLimit')}</span>
                <Form.Item name="itemLimit" noStyle><InputNumber size="small" min={0} style={{ width: 90 }} className="center-text" /></Form.Item>
              </div>
              <div className="side-switch-item">
                <span className="side-switch-label"><AppstoreOutlined style={{ color: '#faad14' }} /> {t('allBranches')}</span>
                <Switch checked={allBranches} onChange={(v) => { setAllBranches(v); if (v) form.setFieldsValue({ branch: null }); }} checkedChildren={t('yes')} unCheckedChildren={t('no')} />
              </div>
              <div className="side-field">
                <span className="side-switch-label">{t('branch')}</span>
                <Form.Item name="branch" noStyle>
                  <Select placeholder={t('selectBranch')} disabled={allBranches} showSearch optionFilterProp="label" size="small" style={{ width: '100%' }}>
                    {branches.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="items-table-card" size="small" title={t('itemsList')} style={{ marginTop: 12 }}>
        <ReportGenerator
          columns={columns}
          data={items}
          loading={loading}
          rowKey="id"
          searchable
          searchPlaceholder={t('header.search')}
          sortable
          showPrintButtons
          printTitle={t('itemsReport')}
          printFileName="items-report"
          filters={false}
          showReload
          onReload={loadItems}
          bordered
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* مودال المسح */}
      <Modal title={t('scanBarcode')} open={scanModal.open} onCancel={closeScanner} footer={<Button onClick={closeScanner}>{t('close')}</Button>} width={500} destroyOnHidden>
        <div className="scanner-box">
          <video ref={videoRef} className="scanner-video" autoPlay playsInline />
          <p className="scanner-hint">{t('scanHint')}</p>
        </div>
      </Modal>

      {/* مودال الطباعة */}
      <Modal
        title={t('printBarcode')}
        open={printModal.open}
        onCancel={() => setPrintModal({ ...printModal, open: false })}
        width={620}
        footer={[
          <Button key="close" onClick={() => setPrintModal({ ...printModal, open: false })}>
            {t('close')}
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterFilled />}
            onClick={handlePrintLabels}
            disabled={!printModal.barcode}
          >
            {t('print')} ({printModal.copies})
          </Button>,
        ]}
      >
        <div className="print-modal-body">
          {/* إعدادات الطباعة */}
          <div className="print-controls">
            <label>{t('copies')}:</label>
            <InputNumber
              min={1}
              max={200}
              value={printModal.copies}
              onChange={(v) => setPrintModal({ ...printModal, copies: v || 1 })}
              style={{ width: 80 }}
            />
            <label>{t('labelWidth') || 'عرض الملصق (mm)'}:</label>
            <InputNumber
              min={20}
              max={120}
              value={printModal.labelWidth}
              onChange={(v) => setPrintModal({ ...printModal, labelWidth: v || 40 })}
              style={{ width: 80 }}
            />
            <label>{t('labelHeight') || 'ارتفاع الملصق (mm)'}:</label>
            <InputNumber
              min={15}
              max={120}
              value={printModal.labelHeight}
              onChange={(v) => setPrintModal({ ...printModal, labelHeight: v || 30 })}
              style={{ width: 80 }}
            />
          </div>

          <div className="print-controls">
            <label>
              <input
                type="checkbox"
                checked={printModal.showName}
                onChange={(e) => setPrintModal({ ...printModal, showName: e.target.checked })}
              />{' '}
              {t('showName') || 'إظهار الاسم'}
            </label>
            <label>
              <input
                type="checkbox"
                checked={printModal.showPrice}
                onChange={(e) => setPrintModal({ ...printModal, showPrice: e.target.checked })}
              />{' '}
              {t('showPrice') || 'إظهار السعر'}
            </label>
          </div>

          {/* معاينة الملصق */}
          {printModal.barcode && (
            <div className="print-preview label-preview-single">
              <div className="label-item">
                {printModal.showName && printModal.name && (
                  <div className="label-name">{printModal.name}</div>
                )}
                <div className="label-barcode">
                  <Barcode
                    value={printModal.barcode}
                    height={38}
                    width={1.2}
                    fontSize={10}
                    margin={0}
                  />
                </div>
                {printModal.showPrice && printModal.price !== '' && printModal.price !== null && (
                  <div className="label-price">{Number(printModal.price).toFixed(2)}</div>
                )}
              </div>
            </div>
          )}

          <div className="print-preview">
            <p className="print-type">
              {printModal.type} — {printModal.copies} × {t('copies')}
              <br />
              <small>
                {printModal.labelWidth}mm × {printModal.labelHeight}mm — {t('onePagePerLabel') || 'كل ملصق بصفحة منفصلة'}
              </small>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItemsPage;