import axios from 'axios';
import { API_URL } from '@/config/api';


export const fetchCustomers=async()=>{
try{
const {data}=await axios.get(`${API_URL}/Customer`);

return data.data.map(cust=>({
id:cust.customerId,
code:cust.customerId,
name :cust.cusName,
vatNo:cust.vatNo,

accoNo:cust.accoNo,
address:cust.address,
phone:cust.phone,
depitLimit:cust.depitLimit,
balance:cust.balance,
branch:cust.branch,
userId:cust.userId,
srlCode:cust.srlCode,
address2:cust.address2,
bussnsNo:cust.bussnsNo,
country:cust.country,
city:cust.city,
street:cust.street,
arealocation:cust.arealocation,
buildNumber:cust.buildNumber,
theCode:cust.theCode,
schemCode:cust.schemCode,
paidType:cust.paidType,
both:cust.both
}));
console.log("تم جلب البيانات");
}catch(error){

    console.log(error);
}
};
//add custome
export const addCustomer=async(customerData)=>{
 try {


        const response = await axios.post(
            `${API_URL}/Customer`,
            {
                 cus_Name: customerData.name,
  vatNo: customerData.vatNo,
  address: customerData.address,
  phone: customerData.phone,
  depitLimit: customerData.depitLimit,
  balance: customerData.balance || 0,
  branch: customerData.branch || 1,
  userId: customerData.userId || 1,
  address2: customerData.address2,
  bussns_no: customerData.bussnsNo,
  country: customerData.country,
  city: customerData.city,
  street: customerData.street,
  areaLocation: customerData.areaLocation,
  buildNumber: customerData.buildNumber,
  theCode: customerData.theCode,
  paid_type: customerData.paidType || "نقدي",
  schemCode: customerData.schemCode,
  both: customerData.both
            }
        );
        console.log(response.data.message,);

        return {
            success: response.data.success ?? false,
            message: response.data.message,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء إضافة العميل",
            error: error.response?.data || error.message,
        };
    }
};
//update customer
export const updateCustomer=async(id,customerData)=>{
 try {
    
        const response = await axios.put(
            `${API_URL}/Customer`,
            {
                  cus_Name: customerData.name,
  vatNo: customerData.vatNo,
  address: customerData.address,
  phone: customerData.phone,
  depitLimit: customerData.depitLimit,
  balance: customerData.balance || 0,

  userId: customerData.userId || 1,
  address2: customerData.address2,
  bussns_no: customerData.bussnsNo,
  country: customerData.country,
  city: customerData.city,
  street: customerData.street,
  areaLocation: customerData.areaLocation,
  buildNumber: customerData.buildNumber,
  theCode: customerData.theCode,
  paid_type: customerData.paidType || "نقدي",
  schemCode: customerData.schemCode,
  both: customerData.both
            },{

                params:{
id:id,
branch:1

                }
            }
        );
 console.log(response.data.message,);
        return {
            success: response.data.success ?? false,
            message: response.data.message,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء تعديل العميل",
            error: error.response?.data || error.message,
        };
    }
};
//api/deleteCustomer
export const deleteCustomer=async(id,BranchId=2,UserId=2)=>{
 try {
        const response = await axios.delete(
            `${API_URL}/Customer?id=${id}&BranchId=${BranchId}&UserId=${UserId}`
        );

        return {
            success: response.data.success ?? false,
            message: response.data.message,
            data: response.data.data ?? null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "حدث خطأ أثناء حذف العميل",
            error: error.response?.data || error.message,
        };
    }
};
