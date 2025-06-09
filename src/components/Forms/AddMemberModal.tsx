import React, { useState, useEffect } from 'react';
import { X, User, Users, FileText, Camera, Upload, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { FamilyMember } from '@/types/family';
import { useFamilyStore } from '@/store/familyStore';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { RelationshipStep } from './steps/RelationshipStep';
import { DetailInfoStep } from './steps/DetailInfoStep';
import { PreviewStep } from './steps/PreviewStep';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember?: FamilyMember | null;
  preselectedParent?: FamilyMember | null;
}

export interface FormData {
  // Basic Info
  name: string;
  nickname: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthPlace: string;
  isAlive: boolean;
  deathDate: string;
  onlyBirthYear: boolean;
  
  // Relationships
  parentIds: string[];
  spouseId: string;
  relationshipType: 'child' | 'parent' | 'sibling' | 'spouse' | 'other';
  isAdopted: boolean;
  isHeadOfFamily: boolean;
  
  // Details
  profession: string;
  education: string;
  currentLocation: string;
  phone: string;
  email: string;
  socialMedia: string;
  notes: string;
  photoFile: File | null;
  photoUrl: string;
}

const initialFormData: FormData = {
  name: '',
  nickname: '',
  gender: 'male',
  birthDate: '',
  birthPlace: '',
  isAlive: true,
  deathDate: '',
  onlyBirthYear: false,
  parentIds: [],
  spouseId: '',
  relationshipType: 'child',
  isAdopted: false,
  isHeadOfFamily: false,
  profession: '',
  education: '',
  currentLocation: '',
  phone: '',
  email: '',
  socialMedia: '',
  notes: '',
  photoFile: null,
  photoUrl: ''
};

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  editingMember,
  preselectedParent
}) => {
  const { addMember, updateMember, members } = useFamilyStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Data Dasar', icon: User, component: BasicInfoStep },
    { number: 2, title: 'Hubungan Keluarga', icon: Users, component: RelationshipStep },
    { number: 3, title: 'Info Detail', icon: FileText, component: DetailInfoStep },
    { number: 4, title: 'Preview', icon: Check, component: PreviewStep }
  ];

  useEffect(() => {
    if (isOpen) {
      if (editingMember) {
        // Populate form with existing member data
        setFormData({
          name: editingMember.name,
          nickname: editingMember.nickname || '',
          gender: editingMember.gender,
          birthDate: editingMember.birthDate,
          birthPlace: editingMember.birthPlace || '',
          isAlive: editingMember.isAlive,
          deathDate: editingMember.deathDate || '',
          onlyBirthYear: false,
          parentIds: editingMember.parentIds || [],
          spouseId: editingMember.spouseId || '',
          relationshipType: 'child',
          isAdopted: false,
          isHeadOfFamily: false,
          profession: editingMember.profession || '',
          education: editingMember.education || '',
          currentLocation: editingMember.currentLocation || '',
          phone: editingMember.phone || '',
          email: editingMember.email || '',
          socialMedia: '',
          notes: '',
          photoFile: null,
          photoUrl: editingMember.photoUrl || ''
        });
        setCurrentStep(1);
      } else {
        setFormData(initialFormData);
        if (preselectedParent) {
          setFormData(prev => ({
            ...prev,
            parentIds: [preselectedParent.id],
            relationshipType: 'child'
          }));
        }
        setCurrentStep(1);
      }
      setErrors({});
      setIsDraft(false);
    }
  }, [isOpen, editingMember, preselectedParent]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim() || formData.name.length < 2) {
          newErrors.name = 'Nama harus diisi minimal 2 karakter';
        }
        if (!formData.birthDate) {
          newErrors.birthDate = 'Tanggal lahir harus diisi';
        }
        if (!formData.isAlive && formData.deathDate) {
          const birthDate = new Date(formData.birthDate);
          const deathDate = new Date(formData.deathDate);
          if (deathDate <= birthDate) {
            newErrors.deathDate = 'Tanggal wafat harus setelah tanggal lahir';
          }
        }
        break;

      case 2:
        if (formData.relationshipType === 'child' && formData.parentIds.length === 0) {
          newErrors.parentIds = 'Pilih minimal satu orang tua';
        }
        if (formData.relationshipType === 'spouse' && !formData.spouseId) {
          newErrors.spouseId = 'Pilih pasangan';
        }
        break;

      case 3:
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Format email tidak valid';
        }
        if (formData.phone && !/^[\+]?[0-9\-\(\)\s]+$/.test(formData.phone)) {
          newErrors.phone = 'Format nomor telepon tidak valid';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    // In a real app, save to localStorage or backend
    console.log('Draft saved:', formData);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      const newMember: FamilyMember = {
        id: editingMember?.id || Date.now().toString(),
        name: formData.name,
        nickname: formData.nickname || undefined,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace || undefined,
        currentLocation: formData.currentLocation || undefined,
        profession: formData.profession || undefined,
        education: formData.education || undefined,
        gender: formData.gender,
        photoUrl: formData.photoUrl || undefined,
        spouseId: formData.spouseId || undefined,
        parentIds: formData.parentIds.length > 0 ? formData.parentIds : undefined,
        childrenIds: editingMember?.childrenIds || [],
        siblingIds: editingMember?.siblingIds || [],
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        isAlive: formData.isAlive,
        deathDate: formData.deathDate || undefined,
        generation: calculateGeneration(),
        maritalStatus: formData.spouseId ? 'married' : 'single',
        created_at: editingMember?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingMember) {
        updateMember(editingMember.id, newMember);
      } else {
        addMember(newMember);
      }

      onClose();
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateGeneration = (): number => {
    if (formData.parentIds.length > 0) {
      const parent = members.find(m => m.id === formData.parentIds[0]);
      return parent ? parent.generation + 1 : 1;
    }
    return 1;
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingMember ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {steps[currentStep - 1].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            members={members}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            )}
            
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Simpan Draft
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Menyimpan...' : editingMember ? 'Update' : 'Simpan'}
                </button>
                
                {!editingMember && (
                  <button
                    onClick={() => {
                      handleSubmit();
                      setFormData(initialFormData);
                      setCurrentStep(1);
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    Simpan & Tambah Lagi
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Draft Saved Notification */}
        {isDraft && (
          <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span className="text-sm">Draft tersimpan</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};