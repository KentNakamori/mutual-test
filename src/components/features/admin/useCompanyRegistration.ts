import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, CompanyInput } from "../../../lib/companySchema";
import { useRouter } from 'next/navigation';
import { registerCompany } from "../../../lib/api/admin";

export const useCompanyRegistration = () => {
  const router = useRouter();
  
  const form = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
  });

  const [flash, setFlash] = useState<string | null>(null);
  const [businessDescriptionCount, setBusinessDescriptionCount] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [formData, setFormData] = useState<CompanyInput | null>(null);
  const [showLogoModal, setShowLogoModal] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // businessDescriptionの値を監視してカウントを更新
  const businessDescription = form.watch("businessDescription");
  
  useEffect(() => {
    setBusinessDescriptionCount(businessDescription?.length || 0);
  }, [businessDescription]);

  // ロゴファイル選択処理
  const handleLogoFileSelect = (file: File) => {
    setLogoFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 企業登録処理
  const submitCompany = async (data: CompanyInput) => {
    if (!showConfirmation) {
      const dataWithLogo = {
        ...data,
        logoUrl: logoPreview || data.logoUrl || ""
      };
      setFormData(dataWithLogo);
      setShowConfirmation(true);
      return;
    }

    setFlash(null);
    
    try {
      const submitFormData = new FormData();
      
      if (formData) {
        submitFormData.append('companyName', formData.companyName);
        if (formData.industry) {
          submitFormData.append('industry', formData.industry);
        }
        if (formData.securitiesCode) submitFormData.append('securitiesCode', formData.securitiesCode);
        if (formData.marketSegment) submitFormData.append('marketSegment', formData.marketSegment);
        if (formData.establishedDate) submitFormData.append('establishedDate', formData.establishedDate);
        if (formData.ceo) submitFormData.append('ceo', formData.ceo);
        if (formData.phone) submitFormData.append('phone', formData.phone);
        if (formData.employeeCount) submitFormData.append('employeeCount', formData.employeeCount.toString());
        if (formData.capital) submitFormData.append('capital', formData.capital);
        if (formData.address) submitFormData.append('address', formData.address);
        if (formData.businessDescription) submitFormData.append('businessDescription', formData.businessDescription);
        if (formData.websiteUrl) submitFormData.append('websiteUrl', formData.websiteUrl);
        if (formData.contactEmail) submitFormData.append('contactEmail', formData.contactEmail);
      }
      
      if (logoFile) {
        submitFormData.append('logo', logoFile);
      }
      
      console.log("[企業登録API] リクエスト送信");
      const result = await registerCompany(submitFormData);
      console.log("[企業登録API] 成功:", result);
      
      setFlash("✅ 企業登録が完了しました");
      form.reset();
      setShowConfirmation(false);
      setFormData(null);
      setLogoFile(null);
      setLogoPreview("");
    } catch (err: any) {
      console.error("[企業登録API] エラー:", err);
      setFlash(`❌ ${err.message}`);
    }
  };

  const handleConfirmSubmit = async () => {
    if (formData) {
      await submitCompany(formData);
    }
  };

  const handleBackToEdit = () => {
    setShowConfirmation(false);
    setFlash(null);
  };

  const navigateBack = () => {
    router.push('/admin');
  };

  return {
    form,
    flash,
    businessDescriptionCount,
    showConfirmation,
    formData,
    showLogoModal,
    setShowLogoModal,
    logoFile,
    logoPreview,
    handleLogoFileSelect,
    submitCompany,
    handleConfirmSubmit,
    handleBackToEdit,
    navigateBack,
  };
}; 