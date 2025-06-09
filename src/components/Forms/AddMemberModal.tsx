// Fix React import for TypeScript
import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, User, Users, FileText, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { FamilyMember } from '../../types/family';
import { useFamilyStore } from '../../store/familyStore';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { RelationshipStep } from './steps/RelationshipStep';
import { DetailInfoStep } from './steps/DetailInfoStep';
import { PreviewStep } from './steps/PreviewStep';

interface RelationshipContext {
  direction: 'up' | 'down' | 'left' | 'right';
  relationship: string;
  relativeTo: FamilyMember;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember?: FamilyMember;
  preselectedParent?: FamilyMember;
  relationshipContext?: RelationshipContext;
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
  preselectedParent,
  relationshipContext
}: AddMemberModalProps) => {
  const { addMember, updateMember, members, setHasUnsavedChanges } = useFamilyStore();
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

  // Helper: Populate form data from editing member
  function getFormDataFromEditingMember(editingMember: FamilyMember): FormData {
    return {
      name: editingMember.name,
      nickname: editingMember.nickname ?? '',
      gender: editingMember.gender,
      birthDate: editingMember.birthDate,
      birthPlace: editingMember.birthPlace ?? '',
      isAlive: editingMember.isAlive,
      deathDate: editingMember.deathDate ?? '',
      onlyBirthYear: false,
      parentIds: editingMember.parentIds ?? [],
      spouseId: editingMember.spouseId ?? '',
      relationshipType: 'child',
      isAdopted: false,
      isHeadOfFamily: false,
      profession: editingMember.profession ?? '',
      education: editingMember.education ?? '',
      currentLocation: editingMember.currentLocation ?? '',
      phone: editingMember.phone ?? '',
      email: editingMember.email ?? '',
      socialMedia: '',
      notes: '',
      photoFile: null,
      photoUrl: editingMember.photoUrl ?? ''
    };
  }

  // Helper: Apply relationship context to form data
  function applyRelationshipContext(
    formData: FormData,
    relationshipContext: RelationshipContext
  ): FormData {
    const { direction, relationship, relativeTo } = relationshipContext;
    let gender = formData.gender;
    if (relationship === 'father' || relationship === 'husband') gender = 'male';
    else if (relationship === 'mother' || relationship === 'wife') gender = 'female';
    let relationshipType = formData.relationshipType;
    let parentIds = formData.parentIds;
    let spouseId = formData.spouseId;
    switch (direction) {
      case 'up':
        relationshipType = 'parent';
        break;
      case 'down':
        relationshipType = 'child';
        parentIds = [relativeTo.id];
        break;
      case 'left':
      case 'right':
        relationshipType = 'spouse';
        spouseId = relativeTo.id;
        break;
    }
    return {
      ...formData,
      gender,
      relationshipType,
      parentIds,
      spouseId
    };
  }

  // Refactored useEffect
  useEffect(() => {
    if (!isOpen) return;
    if (editingMember) {
      setFormData(getFormDataFromEditingMember(editingMember));
      setCurrentStep(1);
    } else {
      let newFormData = { ...initialFormData };
      if (preselectedParent) {
        newFormData.parentIds = [preselectedParent.id];
        newFormData.relationshipType = 'child';
      }
      if (relationshipContext) {
        newFormData = applyRelationshipContext(newFormData, relationshipContext);
      }
      setFormData(newFormData);
      setCurrentStep(1);
    }
    setErrors({});
    setIsDraft(false);
  }, [isOpen, editingMember, preselectedParent, relationshipContext]);

  // --- validateStep helpers ---
  function validateBasicInfo(formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 2) {
      errors.name = 'Nama harus diisi minimal 2 karakter';
    }
    if (!formData.birthDate) {
      errors.birthDate = 'Tanggal lahir harus diisi';
    }
    if (!formData.isAlive && formData.deathDate) {
      const birthDate = new Date(formData.birthDate);
      const deathDate = new Date(formData.deathDate);
      if (deathDate <= birthDate) {
        errors.deathDate = 'Tanggal wafat harus setelah tanggal lahir';
      }
    }
    return errors;
  }

  function validateRelationship(formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {};
    if (formData.relationshipType === 'child' && formData.parentIds.length === 0) {
      errors.parentIds = 'Pilih minimal satu orang tua';
    }
    if (formData.relationshipType === 'spouse' && !formData.spouseId) {
      errors.spouseId = 'Pilih pasangan';
    }
    return errors;
  }

  function validateDetails(formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {};
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }
    if (formData.phone && !/^\+?[0-9\-()\s]+$/.test(formData.phone)) {
      errors.phone = 'Format nomor telepon tidak valid';
    }
    return errors;
  }

  // Refactored validateStep
  const validateStep = (step: number): boolean => {
    let newErrors: Record<string, string> = {};
    if (step === 1) {
      newErrors = validateBasicInfo(formData);
    } else if (step === 2) {
      newErrors = validateRelationship(formData);
    } else if (step === 3) {
      newErrors = validateDetails(formData);
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
    setHasUnsavedChanges(true);
    // In a real app, save to localStorage or backend
    console.log('Draft saved:', formData);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      const newMember: FamilyMember = {
        id: editingMember?.id ?? Date.now().toString(),
        name: formData.name,
        nickname: formData.nickname ?? undefined,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace ?? undefined,
        currentLocation: formData.currentLocation ?? undefined,
        profession: formData.profession ?? undefined,
        education: formData.education ?? undefined,
        gender: formData.gender,
        photoUrl: formData.photoUrl ?? undefined,
        spouseId: formData.spouseId ?? undefined,
        parentIds: formData.parentIds.length > 0 ? formData.parentIds : undefined,
        childrenIds: editingMember?.childrenIds ?? [],
        siblingIds: editingMember?.siblingIds ?? [],
        email: formData.email ?? undefined,
        phone: formData.phone ?? undefined,
        isAlive: formData.isAlive,
        deathDate: formData.deathDate ?? undefined,
        generation: calculateGeneration(),
        maritalStatus: formData.spouseId ? 'married' : 'single',
        created_at: editingMember?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingMember) {
        updateMember(editingMember.id, newMember);
      } else {
        addMember(newMember);
      }

      // Show success animation
      setHasUnsavedChanges(false);
      onClose();
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateGeneration = (): number => {
    if (formData.parentIds.length > 0) {
      const parent = members.find((m: FamilyMember) => m.id === formData.parentIds[0]);
      return parent ? parent.generation + 1 : 1;
    }
    if (relationshipContext?.direction === 'up') {
      return relationshipContext.relativeTo.generation - 1;
    }
    if (relationshipContext?.direction === 'down') {
      return relationshipContext.relativeTo.generation + 1;
    }
    if (relationshipContext?.direction === 'left' || relationshipContext?.direction === 'right') {
      return relationshipContext.relativeTo.generation;
    }
    return 1;
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep - 1].component;

  // Refactor nested ternary for title
  let modalTitle = 'Tambah Anggota Keluarga';
  if (relationshipContext) {
    modalTitle = `Tambah ${getRelationshipTitle()}`;
  }

  // Before the submit button rendering in the footer:
  let submitButtonText = 'Simpan';
  if (isSubmitting) {
    submitButtonText = 'Menyimpan...';
  } else if (editingMember) {
    submitButtonText = 'Update';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingMember ? 'Edit Anggota Keluarga' : modalTitle}
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
              
              // Refactor stepper button class and text color to avoid nested ternary
              let stepperButtonClass = '';
              if (isCompleted) {
                stepperButtonClass = 'bg-green-500 border-green-500 text-white scale-110';
              } else if (isActive) {
                stepperButtonClass = 'bg-blue-500 border-blue-500 text-white scale-110';
              } else {
                stepperButtonClass = 'border-gray-300 text-gray-400';
              }
              let stepperTextColor = '';
              if (isActive) {
                stepperTextColor = 'text-blue-600';
              } else if (isCompleted) {
                stepperTextColor = 'text-green-600';
              } else {
                stepperTextColor = 'text-gray-400';
              }
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${stepperButtonClass}`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className={`text-sm font-medium transition-colors ${stepperTextColor}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 transition-colors duration-300 ${
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
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {/* For submit button text */}
                  <span>{submitButtonText}</span>
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
          <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span className="text-sm">Draft tersimpan</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function getRelationshipTitle(): string {
    if (!relationshipContext) return '';
    
    const { relationship } = relationshipContext;
    const relationshipTitles: Record<string, string> = {
      'father': 'Ayah',
      'mother': 'Ibu',
      'husband': 'Suami',
      'wife': 'Istri',
      'biological_child': 'Anak Kandung',
      'adopted_child': 'Anak Adopsi',
      'grandchild': 'Cucu'
    };
    
    return relationshipTitles[relationship] || 'Anggota Keluarga';
  }
};