// src/api/Items.js
import api from './api';

export const fetchItems = async (branchId = null) => {
  try {
    const url = branchId ? `/Item_Tbl?branch=${branchId}` : `/Item_Tbl`;
    const response = await api.get(url);
    const data = response.data?.data || response.data || [];
    if (!Array.isArray(data)) return [];

    return data.map(item => ({
      id: item.ItemID,
      code: item.ItemID,
      itemBarcode: item.ItemBarcode || '',
      itemNameA: item.ItemNameA || '',
      itemNameE: item.ItemNameE || '',
      catId: item.Cat_ID || null,
      unitId: item.Unit_ID || null,
      openStock: item.OpenStock || 0,
      itemLimit: item.ItemLimit || 0,
      isBuyTax: item.Is_Buy_Tax ?? false,
      buyTaxValue: item.Buy_Tax_Value || 0,
      buyPriceNoTax: item.BuyPrice_NoTax || 0,
      buyTaxTotal: item.Buy_TaxTotal || 0,
      buyPriceWithTax: item.BuyPrice_WithTax || 0,
      isSaleTax: item.Is_Sale_Tax ?? false,
      saleTaxValue: item.Sale_Tax_Value || 0,
      salePriceNoTax: item.SalePrice_NoTax || 0,
      saleTaxTotal: item.Sale_TaxTotal || 0,
      salePriceWithTax: item.SalePrice_WithTax || 0,
      rbh: item.Rbh || 0,
      itemPic: item.Item_Pic || null,
      itemStatus: item.Item_Status ?? true,
      isExp: item.Is_Exp ?? false,
      isQuickItem: item.Is_Quick_Item ?? false,
      branch: item.branch || null,
      userId: item.UserID || null,
      taxGroupId: item.Tax_GroupID || null,
      allBranch: item.allBranch ?? false,
      srlCode: item.srl_code || '',
      minPrice: item.MinPrice || 0,
      unitNamePos: item.UnitNamePos || '',
      itemSize: item.ItemSize || '',
      itemType: item.Item_Type || null,
      sizeId: item.Size_ID || null,
      omlaId: item.OmlaID || null,
      codeTax: item.CodeTax || '',
      codeTaxText: item.CodeTaxText || '',
      codeTaxTextEnglish: item.CodeTaxTextEnglish || '',
      // ✅ تفاصيل الوحدات
      detils_unit: Array.isArray(item.detils_unit) ? item.detils_unit.map(u => ({
        id: u.ID || u.ItemUnitID,
        itemId: u.ItemID,
        unitId: u.UniteID,
        exchangFactor: u.ExchangFactor || 1,
        priceBuyNoVat: u.PriceBuyNoVat || 0,
        priceSellNoVat: u.PriceSellNoVat || 0,
        rabh: u.Rabh || 0,
        saleTaxTotal: u.Sale_TaxTotal || 0,
        buyTaxTotal: u.Buy_TaxTotal || 0,
        salePriceWithTax: u.SalePrice_WithTax || 0,
        buyPriceWithTax: u.BuyPrice_WithTax || 0,
        barcodeUnit: u.BarcodeUnit || '',
        minPriceUnit: u.MinPriceUnit || 0,
        branch: u.branch,
        userId: u.userID,
      })) : [],
      // ✅ تفاصيل الباركود المتعدد
      detils_barcode: Array.isArray(item.detils_barcode) ? item.detils_barcode.map(b => ({
        id: b.ID || b.ItemBarcodeID,
        itemId: b.ItemID,
        unitId: b.UnitID,
        itmBarcode: b.itmBarcode || '',
        branch: b.branch,
        userId: b.userID,
      })) : [],
    }));
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const getItemById = async (id) => {
  try {
    const response = await api.get(`/Item_Tbl/${id}`);
    const item = response.data?.data || response.data || null;
    if (!item) return { success: false, data: null };

    return {
      success: true,
      data: {
        id: item.ItemID,
        itemBarcode: item.ItemBarcode || '',
        itemNameA: item.ItemNameA || '',
        itemNameE: item.ItemNameE || '',
        catId: item.Cat_ID || null,
        unitId: item.Unit_ID || null,
        openStock: item.OpenStock || 0,
        itemLimit: item.ItemLimit || 0,
        buyPriceNoTax: item.BuyPrice_NoTax || 0,
        buyPriceWithTax: item.BuyPrice_WithTax || 0,
        salePriceNoTax: item.SalePrice_NoTax || 0,
        salePriceWithTax: item.SalePrice_WithTax || 0,
        rbh: item.Rbh || 0,
        itemPic: item.Item_Pic || null,
        itemStatus: item.Item_Status ?? true,
        isExp: item.Is_Exp ?? false,
        isQuickItem: item.Is_Quick_Item ?? false,
        branch: item.branch,
        allBranch: item.allBranch ?? false,
        taxGroupId: item.Tax_GroupID,
        minPrice: item.MinPrice || 0,
        unitNamePos: item.UnitNamePos || '',
        itemSize: item.ItemSize || '',
        codeTax: item.CodeTax || '',
        codeTaxText: item.CodeTaxText || '',
        codeTaxTextEnglish: item.CodeTaxTextEnglish || '',
        detils_unit: Array.isArray(item.detils_unit) ? item.detils_unit : [],
        detils_barcode: Array.isArray(item.detils_barcode) ? item.detils_barcode : [],
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ',
      data: null,
    };
  }
};

export const addItem = async (values) => {
  try {
    const payload = {
      ItemBarcode: values.itemBarcode || '',
      ItemNameA: values.itemNameA,
      ItemNameE: values.itemNameE || '',
      Cat_ID: values.catId,
      Unit_ID: values.unitId,
      OpenStock: values.openStock ?? 0,
      ItemLimit: values.itemLimit ?? 0,
      Is_Buy_Tax: values.isBuyTax ?? false,
      Buy_Tax_Value: values.buyTaxValue ?? 0,
      BuyPrice_NoTax: values.buyPriceNoTax ?? 0,
      Buy_TaxTotal: values.buyTaxTotal ?? 0,
      BuyPrice_WithTax: values.buyPriceWithTax ?? 0,
      Is_Sale_Tax: values.isSaleTax ?? false,
      Sale_Tax_Value: values.saleTaxValue ?? 0,
      SalePrice_NoTax: values.salePriceNoTax ?? 0,
      Sale_TaxTotal: values.saleTaxTotal ?? 0,
      SalePrice_WithTax: values.salePriceWithTax ?? 0,
      Rbh: values.rbh ?? 0,
      Item_Pic: values.itemPic || null,
      Item_Status: values.itemStatus ?? true,
      Is_Exp: values.isExp ?? false,
      Is_Quick_Item: values.isQuickItem ?? false,
      branch: values.branch,
      UserID: values.userId ?? 1,
      Tax_GroupID: values.taxGroupId,
      allBranch: values.allBranch ?? false,
      MinPrice: values.minPrice ?? 0,
      UnitNamePos: values.unitNamePos || '',
      ItemSize: values.itemSize || '',
      Item_Type: values.itemType,
      Size_ID: values.sizeId,
      OmlaID: values.omlaId,
      CodeTax: values.codeTax || '',
      CodeTaxText: values.codeTaxText || '',
      CodeTaxTextEnglish: values.codeTaxTextEnglish || '',
      // ✅ إرسال الوحدات والباركود داخل الكائن
      detils_unit: Array.isArray(values.detils_unit) ? values.detils_unit.map(u => ({
        UniteID: u.unitId,
        ExchangFactor: u.exchangFactor ?? 1,
        PriceBuyNoVat: u.priceBuyNoVat ?? 0,
        PriceSellNoVat: u.priceSellNoVat ?? 0,
        Rabh: u.rabh ?? 0,
        Sale_TaxTotal: u.saleTaxTotal ?? 0,
        Buy_TaxTotal: u.buyTaxTotal ?? 0,
        SalePrice_WithTax: u.salePriceWithTax ?? 0,
        BuyPrice_WithTax: u.buyPriceWithTax ?? 0,
        BarcodeUnit: u.barcodeUnit || '',
        MinPriceUnit: u.minPriceUnit ?? 0,
        branch: values.branch,
        userID: values.userId ?? 1,
      })) : [],
      detils_barcode: Array.isArray(values.detils_barcode) ? values.detils_barcode.map(b => ({
        UnitID: b.unitId,
        itmBarcode: b.itmBarcode || '',
        branch: values.branch,
        userID: values.userId ?? 1,
      })) : [],
    };

    const response = await api.post(`/Item_Tbl`, payload);
    return {
      success: true,
      message: response.data?.message || 'تم إضافة الصنف بنجاح',
      data: response.data?.data || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء إضافة الصنف',
      data: null,
    };
  }
};

export const updateItem = async (id, values) => {
  try {
    const payload = {
      ItemBarcode: values.itemBarcode || '',
      ItemNameA: values.itemNameA,
      ItemNameE: values.itemNameE || '',
      Cat_ID: values.catId,
      Unit_ID: values.unitId,
      OpenStock: values.openStock ?? 0,
      ItemLimit: values.itemLimit ?? 0,
      Is_Buy_Tax: values.isBuyTax ?? false,
      Buy_Tax_Value: values.buyTaxValue ?? 0,
      BuyPrice_NoTax: values.buyPriceNoTax ?? 0,
      Buy_TaxTotal: values.buyTaxTotal ?? 0,
      BuyPrice_WithTax: values.buyPriceWithTax ?? 0,
      Is_Sale_Tax: values.isSaleTax ?? false,
      Sale_Tax_Value: values.saleTaxValue ?? 0,
      SalePrice_NoTax: values.salePriceNoTax ?? 0,
      Sale_TaxTotal: values.saleTaxTotal ?? 0,
      SalePrice_WithTax: values.salePriceWithTax ?? 0,
      Rbh: values.rbh ?? 0,
      Item_Pic: values.itemPic || null,
      Item_Status: values.itemStatus ?? true,
      Is_Exp: values.isExp ?? false,
      Is_Quick_Item: values.isQuickItem ?? false,
      branch: values.branch,
      UserID: values.userId ?? 1,
      Tax_GroupID: values.taxGroupId,
      allBranch: values.allBranch ?? false,
      MinPrice: values.minPrice ?? 0,
      UnitNamePos: values.unitNamePos || '',
      ItemSize: values.itemSize || '',
      Item_Type: values.itemType,
      Size_ID: values.sizeId,
      OmlaID: values.omlaId,
      CodeTax: values.codeTax || '',
      CodeTaxText: values.codeTaxText || '',
      CodeTaxTextEnglish: values.codeTaxTextEnglish || '',
      detils_unit: Array.isArray(values.detils_unit) ? values.detils_unit.map(u => ({
        ID: u.id,
        UniteID: u.unitId,
        ExchangFactor: u.exchangFactor ?? 1,
        PriceBuyNoVat: u.priceBuyNoVat ?? 0,
        PriceSellNoVat: u.priceSellNoVat ?? 0,
        Rabh: u.rabh ?? 0,
        Sale_TaxTotal: u.saleTaxTotal ?? 0,
        Buy_TaxTotal: u.buyTaxTotal ?? 0,
        SalePrice_WithTax: u.salePriceWithTax ?? 0,
        BuyPrice_WithTax: u.buyPriceWithTax ?? 0,
        BarcodeUnit: u.barcodeUnit || '',
        MinPriceUnit: u.minPriceUnit ?? 0,
        branch: values.branch,
        userID: values.userId ?? 1,
      })) : [],
      detils_barcode: Array.isArray(values.detils_barcode) ? values.detils_barcode.map(b => ({
        ID: b.id,
        UnitID: b.unitId,
        itmBarcode: b.itmBarcode || '',
        branch: values.branch,
        userID: values.userId ?? 1,
      })) : [],
    };

    const response = await api.put(`/Item_Tbl/${id}`, payload);
    return {
      success: true,
      message: response.data?.message || 'تم تعديل الصنف بنجاح',
      data: response.data?.data || null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء تعديل الصنف',
      data: null,
    };
  }
};

export const deleteItem = async (id, branchId = 1, userId = 1) => {
  try {
    const response = await api.delete(`/Item_Tbl/${id}?branch=${branchId}&userId=${userId}`);
    return {
      success: true,
      message: response.data?.message || 'تم حذف الصنف بنجاح',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء حذف الصنف',
    };
  }
};