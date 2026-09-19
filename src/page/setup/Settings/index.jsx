// src/page/setup/Settings/index.jsx
import { useState, useEffect } from 'react';
import { Card, Tabs, Form, Switch, Input, Select, Button, Row, Col, Divider, InputNumber, Spin, Alert } from 'antd';
import { SaveOutlined, ReloadOutlined, SettingOutlined, PrinterOutlined, FileTextOutlined } from '@ant-design/icons';
import { fetchSettings, updateSettings } from '@/api/Settings';
import { fetchTaxes } from '@/api/Tax';
import { fetchSafes } from '@/api/Safe';
import { fetchStore } from '@/api/Store';
import { fetchUnits } from '@/api/unit';
import { fetchCategories } from '@/api/categorie';
import { useAuth } from '@/context/AuthContext';
import { useTranslate } from '@/hooks/useTranslate';
import notify from '@/utils/notify';
import './Settings.css';

const { TabPane } = Tabs;
const { Option } = Select;

const SettingsPage = () => {
  const { t } = useTranslate();
  const { branch, userId } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taxGroups, setTaxGroups] = useState([]);
  const [safes, setSafes] = useState([]);
  const [stores, setStores] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadSettings();
    loadDropdowns();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const result = await fetchSettings(branch?.branchId || 1);
      if (result.success && result.data) {
        form.setFieldsValue(result.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const [taxRes, safeRes, storeRes, unitRes, catRes] = await Promise.all([
        fetchTaxes(),
        fetchSafes(),
        fetchStore(),
        fetchUnits(),
        fetchCategories(),
      ]);
      setTaxGroups(Array.isArray(taxRes) ? taxRes : []);
      setSafes(Array.isArray(safeRes) ? safeRes : []);
      setStores(Array.isArray(storeRes) ? storeRes : []);
      setUnits(Array.isArray(unitRes) ? unitRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
    } catch (error) {
      console.error('Error loading dropdowns:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const values = await form.validateFields();
      const settingsData = {
        ...values,
        branch: branch?.branchId || 1,
        userID: userId || 1,
        TheUserID: userId || 1,
      };

      const result = await updateSettings(settingsData);
      if (result.success) {
        notify.success(result.message || t('settingsSaved'));
      } else {
        notify.error(result.message || t('errorSavingSettings'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      notify.error(t('errorSavingSettings'));
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    loadSettings();
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Card
        title={
          <div className=" flex items-center justify-between w-full">
            <span className="settings-title">
              <SettingOutlined /> {t('settings')}
            </span>
            <div className="settings-actions">
              
              
            </div>
          </div>
        }
      >
        <Form form={form} layout="vertical" dir="rtl">
          <Tabs defaultActiveKey="general1" className="settings-tabs" tabPosition="top">
            {/* التبويب الأول: الإعدادات العامة 1 */}
            <TabPane
              tab={<span><SettingOutlined /> {t('generalSettings1')}</span>}
              key="general1"
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Divider orientation="right">{t('rightColumn')}</Divider>
                  
                  <Form.Item name="showBranchOnlay" label={t('showBranchOnlay')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="DisplayReportBranch" label={t('DisplayReportBranch')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="Allow_addInvoiceAut" label={t('Allow_addInvoiceAut')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="searchIn_SameFormSale" label={t('searchIn_SameFormSale')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="ShowMsgAftersaveCashier" label={t('ShowMsgAftersaveCashier')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="searchForBarcode_sale" label={t('searchForBarcode_sale')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="salePrintDirect" label={t('salePrintDirect')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="UsePatientInServiceInvoice" label={t('UsePatientInServiceInvoice')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="ShowTaf" label={t('ShowTaf')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="ShowTaftxt" label={t('ShowTaftxt')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="HidPaidForm" label={t('HidPaidForm')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="DirectPrintMainSale" label={t('DirectPrintMainSale')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="DirectPrintServiceSale" label={t('DirectPrintServiceSale')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="HideBuyPriceFSer" label={t('HideBuyPriceFSer')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="AllowSaleMinusSalemain" label={t('AllowSaleMinusSalemain')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="AllowSaleMinusSale" label={t('AllowSaleMinusSale')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="RefrshSaleItemInSaleMain" label={t('RefrshSaleItemInSaleMain')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="RefrshBuyItemInBuy" label={t('RefrshBuyItemInBuy')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Divider orientation="right">{t('leftColumn')}</Divider>
                  
                  <Form.Item name="UseReferenceNumber" label={t('UseReferenceNumber')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="ShowResturantSys" label={t('ShowResturantSys')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="ShowExpaireDate" label={t('ShowExpaireDate')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="WayShowExpireDate" label={t('WayShowExpireDate')}>
                    <Select placeholder={t('selectWay')}>
                      <Option value="manual">{t('manualEntry')}</Option>
                      <Option value="auto">{t('autoEntry')}</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="ShowSaveMsgToZac" label={t('ShowSaveMsgToZac')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="ActivateOuterBackUp" label={t('ActivateOuterBackUp')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="PeriodOFBackUp" label={t('PeriodOFBackUp')}>
                    <InputNumber min={0} className="w-full" addonAfter={t('minutes')} />
                  </Form.Item>
                  <Form.Item name="SearchBarcodeInSaleMain" label={t('SearchBarcodeInSaleMain')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="AutoUpdateMiniUnitPriceFromBuys" label={t('AutoUpdateMiniUnitPriceFromBuys')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="PreventSaleIflessThanPricesale" label={t('PreventSaleIflessThanPricesale')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="RefrshSaleItemInBuy" label={t('RefrshSaleItemInBuy')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="AllowChangeDate" label={t('AllowChangeDate')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="DirectPrintBuy" label={t('DirectPrintBuy')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="AlertEndDateItem" label={t('AlertEndDateItem')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="AlertOutSaleItem" label={t('AlertOutSaleItem')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="PinsAllBRInItems" label={t('PinsAllBRInItems')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="ShowBrItemOnly" label={t('ShowBrItemOnly')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* التبويب الثاني: الإعدادات العامة 2 */}
            <TabPane
              tab={<span><SettingOutlined /> {t('generalSettings2')}</span>}
              key="general2"
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Divider orientation="right">{t('barcodeSettings')}</Divider>
                  
                  <Form.Item name="BarcodeType" label={t('barcodeType')}>
                    <Select placeholder={t('selectBarcodeType')}>
                      <Option value="Code128">Code128</Option>
                      <Option value="Code39">Code39</Option>
                      <Option value="EAN13">EAN13</Option>
                      <Option value="QR">QR</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="BarcodeH" label={t('barcodeHeight')}>
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                  <Form.Item name="BarcodeW" label={t('barcodeWidth')}>
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                  <Form.Item name="BarcodePrintDirect" label={t('barcodePrintDirect')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="QRis_big" label={t('qrBig')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>

                  <Divider orientation="right">{t('taxSettings')}</Divider>
                  
                  <Form.Item name="Tax_GroupID" label={t('taxGroup')}>
                    <Select placeholder={t('selectTaxGroup')}>
                      {taxGroups.map(tg => (
                        <Option key={tg.id} value={tg.id}>
                          {tg.nameAr} - {tg.taxPercent}%
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="SaleWithTax" label={t('saleWithTax')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="BuyWithTax" label={t('buyWithTax')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Divider orientation="right">{t('otherSettings')}</Divider>

                  <Form.Item name="RcloneName" label={t('archivePath')}>
                    <Input placeholder={t('enterArchivePath')} />
                  </Form.Item>
                  <Form.Item name="DefSafe" label={t('defaultSafe')}>
                    <Select placeholder={t('selectDefaultSafe')}>
                      {safes.map(s => (
                        <Option key={s.id} value={s.id}>{s.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="DefStore" label={t('defaultStore')}>
                    <Select placeholder={t('selectDefaultStore')}>
                      {stores.map(s => (
                        <Option key={s.id} value={s.id}>{s.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="DefUbit" label={t('defaultUnit')}>
                    <Select placeholder={t('selectDefaultUnit')}>
                      {units.map(u => (
                        <Option key={u.id} value={u.id}>{u.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="DefGroup" label={t('defaultGroup')}>
                    <Select placeholder={t('selectDefaultGroup')}>
                      {categories.map(c => (
                        <Option key={c.id} value={c.id}>{c.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="LenghtOfQtyField" label={t('qtyFieldLength')}>
                    <InputNumber min={1} max={20} className="w-full" />
                  </Form.Item>
                  <Form.Item name="LenghtOFPriceField" label={t('priceFieldLength')}>
                    <InputNumber min={1} max={20} className="w-full" />
                  </Form.Item>
                  <Form.Item name="HidePercentInCashier" label={t('hideTaxInCashier')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="ActiveRestrctionCashNetwork" label={t('accountingEntryForCustomer')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="InvestorPer" label={t('investorProfitPercent')}>
                    <InputNumber min={0} max={100} className="w-full" addonAfter="%" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="RefrshPrinterRemoteDeskTop" label={t('updateRemotePrinters')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="StopbkWnCloseForm" label={t('stopBackupOnClose')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="JoinPrinterbydevice" label={t('linkPrinterByDevice')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="HideTaxInSale" label={t('hideDebitCredit')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="HideTaxInBuy" label={t('allowTotalWithTax')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="LinkZakat" label={t('noZakatAfterSave')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* التبويب الثالث: إعدادات الطابعة */}
            <TabPane
              tab={<span><PrinterOutlined /> {t('printerSettings')}</span>}
              key="printer"
            >
              <Alert
                message={t('printerNote')}
                type="info"
                showIcon
                className="mb-4"
              />
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="Printer80CName" label={t('printer80C')}>
                    <Select
                      placeholder={t('selectPrinter')}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      options={[
                        { value: 'OneNote for Windows 10', label: 'OneNote for Windows 10' },
                        { value: 'Microsoft Print to PDF', label: 'Microsoft Print to PDF' },
                        { value: 'Fax', label: 'Fax' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="PrinterBarcodeName" label={t('printerBarcode')}>
                    <Select
                      placeholder={t('selectPrinter')}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      options={[
                        { value: 'OneNote for Windows 10', label: 'OneNote for Windows 10' },
                        { value: 'Microsoft Print to PDF', label: 'Microsoft Print to PDF' },
                        { value: 'Fax', label: 'Fax' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="PrinterA4Name" label={t('printerA4')}>
                    <Select
                      placeholder={t('selectPrinter')}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      options={[
                        { value: 'OneNote for Windows 10', label: 'OneNote for Windows 10' },
                        { value: 'Microsoft Print to PDF', label: 'Microsoft Print to PDF' },
                        { value: 'Fax', label: 'Fax' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="ActiveprinterForKitchen" label={t('activateKitchenPrinter')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                  <Form.Item name="KichenPrinter" label={t('kitchenPrinter')}>
                    <Select
                      placeholder={t('selectPrinter')}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      options={[
                        { value: 'OneNote for Windows 10', label: 'OneNote for Windows 10' },
                        { value: 'Microsoft Print to PDF', label: 'Microsoft Print to PDF' },
                        { value: 'Fax', label: 'Fax' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="StopKichenPrint" label={t('stopKitchenPrint')} valuePropName="checked">
                    <Switch checkedChildren={t('yes')} unCheckedChildren={t('no')} />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* التبويب الرابع: نماذج الطباعة */}
            <TabPane
              tab={<span><FileTextOutlined /> {t('printTemplates')}</span>}
              key="templates"
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Divider orientation="right">{t('rightColumn')}</Divider>

                  <Form.Item name="SimpleSalePrint" label={t('templateSaleSmall')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleSaleMainCashier" label={t('templateSaleBig')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleReSalePrint" label={t('templateReSaleBig')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleCashierReSalePrint" label={t('templateReSaleSmall')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleServiceSalePrint" label={t('templateServiceSaleSmall')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleServiceSaleCashierPrint" label={t('templateServiceSaleBig')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleServiceReSalePrint" label={t('templateServiceReSaleBig')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleServiceReSaleCashier" label={t('templateServiceReSaleSmall')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleOfferSale" label={t('templateOfferSale')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Divider orientation="right">{t('leftColumn')}</Divider>

                  <Form.Item name="SimpleBuyPrint" label={t('templateBuySmall')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleBuyPrintCashier" label={t('templateBuyBig')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleReBuyPrint" label={t('templateReBuyBig')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleRebuyCashier" label={t('templateReBuySmall')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleCashierSalePrint" label={t('templateCashierSaleSmall')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleCashierSale_cashierPrint" label={t('templateCashierSaleBig')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleResaleCashier" label={t('templateCashierReSaleBig')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleCashierReSaleCashier" label={t('templateCashierReSaleSmall')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                  <Form.Item name="SimpleMadinPoems" label={t('templateMadinPoems')}>
                    <Input placeholder={t('enterTemplateName')} />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          <div className="settings-footer">
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
                {t('saveAll')}
              </Button>
              </div>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;