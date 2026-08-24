// src/pages/setup/Company/index.jsx
import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Row, Col, Upload, Image, Space, message } from 'antd';
import { SaveOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useCompany } from '@/context/CompanyContext';
// import { useAuth } from '@/context/AuthContext';
import { useTranslate } from '@/hooks/useTranslate';
import notify from '@/utils/notify';

const CompanyPage = () => {
  const { t } = useTranslate();
  const { branch } = 1;
  const { 
    company, 
    loading, 
    logoPreview, 
    loadCompany, 
    updateCompanyData,
    handleLogoChange 
  } = useCompany();
  
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      form.setFieldsValue({
        companyName: company.companyName,
        vatNo: company.vatNo,
        address: company.address,
        phone1: company.phone1,
        phone2: company.phone2,
        country: company.country,
        city: company.city,
        companyEmail: company.companyEmail,
        footer1: company.footer1,
        footer2: company.footer2,
        footer3: company.footer3,
        commreicalRegister: company.commreicalRegister,
        street: company.street,
        areaLocation: company.areaLocation,
        buildNumber: company.buildNumber,
        postOfficeNo: company.postOfficeNo,
        schemCode: company.schemCode,
        shortAddress: company.shortAddress,
        emailPass: company.emailPass,
      });
    }
  }, [company, form]);

  const handleRefresh = async () => {
    await loadCompany(branch?.id);
    notify.success(t('companyDataRefreshed'));
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const updatedData = {
        ...company,
        ...values,
        branch: branch?.id || 1,
        userId: 1,
      };
      
      const result = await updateCompanyData(updatedData);
      
      if (result.success) {
        notify.success(t('companyDataUpdated'));
        await loadCompany(branch?.id);
      } else {
        notify.error(result.message || t('updateError'));
      }
    } catch (error) {
      notify.error(t('updateError'));
    } finally {
      setSaving(false);
    }
  };

   const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type === 'image/jpeg' || 
                      file.type === 'image/png' || 
                      file.type === 'image/svg+xml' ||
                      file.type === 'image/webp';
      
      if (!isImage) {
        notify.error(t('pleaseUploadImage'));
        return false;
      }
      
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(t('logoUploadError'));
        return false;
      }
      
      handleLogoChange(file);
      notify.success(t('logoUploadSuccess'));
      return false;
    },
    showUploadList: false,
    accept: 'image/jpeg,image/png,image/svg+xml,image/webp',
  };

  return (
    <div className="p-4">
      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-semibold">{t('companyInfo')}</span>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                
              </Button>
            </Space>
          </div>
        }
      >
        <Row gutter={24}>
          
          <Col xs={24} md={6}>
            <Card title={t('logo')} className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {logoPreview ? (
                    <Image src={logoPreview} alt="Company Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-400">{t('noLogo')}</span>
                  )}
                </div>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>{t('uploadLogo')}</Button>
                </Upload>
                <p className="text-xs text-gray-400 mt-2">{t('logoNote')}</p>
              </div>
            </Card>
          </Col>
          


          <Col xs={24} md={18}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              dir="rtl"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="companyName"
                    label={t('companyName')}
                    rules={[{ required: true, message: t('pleaseEnterCompanyName') }]}
                  >
                    <Input size="large" placeholder={t('enterCompanyName')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="vatNo" label={t('vatNumber')}>
                    <Input size="large" placeholder={t('enterVatNumber')} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="commreicalRegister" label={t('commercialRegister')}>
                    <Input size="large" placeholder={t('enterCommercialRegister')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="schemCode" label={t('schemCode')}>
                    <Input size="large" placeholder={t('enterSchemCode')} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="address" label={t('address')}>
                    <Input size="large" placeholder={t('enterAddress')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="street" label={t('street')}>
                    <Input size="large" placeholder={t('enterStreet')} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="country" label={t('country')}>
                    <Input size="large" placeholder={t('enterCountry')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="city" label={t('city')}>
                    <Input size="large" placeholder={t('enterCity')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="areaLocation" label={t('area')}>
                    <Input size="large" placeholder={t('enterArea')} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="buildNumber" label={t('buildNumber')}>
                    <Input size="large" placeholder={t('enterBuildNumber')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="postOfficeNo" label={t('postOfficeNo')}>
                    <Input size="large" placeholder={t('enterPostOfficeNo')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="shortAddress" label={t('shortAddress')}>
                    <Input size="large" placeholder={t('enterShortAddress')} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="phone1" label={t('phone1')}>
                    <Input size="large" placeholder={t('enterPhone1')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="phone2" label={t('phone2')}>
                    <Input size="large" placeholder={t('enterPhone2')} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={24}>
                  <Form.Item name="companyEmail" label={t('email')}>
                    <Input size="large" placeholder={t('enterEmail')} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="footer1" label={t('footer1')}>
                    <Input size="large" placeholder={t('enterFooter1')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="footer2" label={t('footer2')}>
                    <Input size="large" placeholder={t('enterFooter2')} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="footer3" label={t('footer3')}>
                    <Input size="large" placeholder={t('enterFooter3')} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit"  loading={saving} size="large">
                  {t('save')}
                </Button>
              </Form.Item>
            </Form>
          </Col>
          
        </Row>
      </Card>
    </div>
  );
};

export default CompanyPage;