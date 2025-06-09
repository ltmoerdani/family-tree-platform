import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  Smartphone, 
  QrCode,
  Shield,
  Check,
  Crown,
  Clock
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'trial' | 'premium';
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  planType,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!isOpen) return null;

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Kartu Kredit/Debit',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB',
      popular: true
    },
    {
      id: 'bank-transfer',
      name: 'Transfer Bank',
      icon: Building2,
      description: 'BCA, Mandiri, BNI, BRI'
    },
    {
      id: 'e-wallet',
      name: 'E-Wallet',
      icon: Smartphone,
      description: 'GoPay, OVO, DANA, ShopeePay'
    },
    {
      id: 'virtual-account',
      name: 'Virtual Account',
      icon: Building2,
      description: 'Semua bank'
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: QrCode,
      description: 'Scan QR code'
    }
  ];

  const handlePayment = async () => {
    if (!selectedPayment || !agreedToTerms) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCurrentStep(3); // Success step
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const planDetails = {
    trial: {
      title: '7 Hari Gratis',
      price: '$0.00',
      description: 'Coba semua fitur premium gratis selama 7 hari',
      features: [
        'Unlimited family trees',
        'Unlimited anggota',
        '10GB storage',
        'Export PDF + Excel + GEDCOM',
        'Kolaborator unlimited',
        'Priority support'
      ]
    },
    premium: {
      title: 'Premium Plan',
      price: '$9.99',
      description: 'Akses penuh ke semua fitur premium',
      features: [
        'Unlimited family trees',
        'Unlimited anggota',
        '10GB storage',
        'Export PDF + Excel + GEDCOM',
        'Kolaborator unlimited',
        'Family analytics',
        'Priority support',
        'Backup harian otomatis'
      ]
    }
  };

  const currentPlan = planDetails[planType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Upgrade ke Premium</h2>
              <p className="text-sm text-gray-600">Step {currentStep} dari 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Plan Confirmation */}
        {currentStep === 1 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Konfirmasi Paket</h3>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900">{currentPlan.title}</h4>
                <div className="text-right">
                  {planType === 'premium' && (
                    <div className="text-sm text-gray-500 line-through">$19.99</div>
                  )}
                  <div className="text-2xl font-bold text-green-600">{currentPlan.price}</div>
                  <div className="text-sm text-gray-600">
                    {planType === 'trial' ? 'kemudian $9.99/tahun' : 'per tahun'}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{currentPlan.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {planType === 'premium' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Promo Terbatas</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Hemat 50% dari harga normal $19.99. Promo berakhir dalam 23:45:12
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Harga normal:</span>
                <span className="text-gray-500 line-through">
                  {planType === 'trial' ? '$0.00' : '$19.99'}
                </span>
              </div>
              {planType === 'premium' && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Diskon 50%:</span>
                  <span className="text-green-600">-$10.00</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">{currentPlan.price}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {currentStep === 2 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pilih Metode Pembayaran</h3>
            
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors relative ${
                    selectedPayment === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <method.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </div>
                  {method.popular && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Populer
                    </div>
                  )}
                  {selectedPayment === method.id && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </label>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Pembayaran Aman</span>
              </div>
              <p className="text-sm text-blue-700">
                Diproses oleh Midtrans dengan enkripsi SSL 256-bit. Data kartu kredit tidak disimpan di server kami.
              </p>
            </div>

            <label className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">
                Saya setuju dengan{' '}
                <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a>
                {' '}dan{' '}
                <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a>
              </span>
            </label>

            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={handlePayment}
                disabled={!selectedPayment || !agreedToTerms || isProcessing}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Bayar {currentPlan.price}</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Selamat! Akun Anda Sudah Premium
            </h3>
            
            <p className="text-gray-600 mb-6">
              {planType === 'trial' 
                ? 'Trial 7 hari dimulai sekarang. Nikmati semua fitur premium!'
                : 'Pembayaran berhasil. Akun premium aktif hingga 15 Januari 2025.'
              }
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">Yang Anda Dapatkan:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ Unlimited family trees</li>
                <li>✅ Unlimited anggota keluarga</li>
                <li>✅ 10GB storage untuk foto</li>
                <li>✅ Export ke PDF, Excel, GEDCOM</li>
                <li>✅ Kolaborator unlimited</li>
                <li>✅ Priority support</li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Email konfirmasi telah dikirim ke akun Anda
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Buat Family Tree Baru
                </button>
                <button className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Upload Foto Keluarga
                </button>
                <button className="bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                  Undang Anggota Keluarga
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Butuh bantuan? <a href="#" className="text-blue-600 hover:underline">Chat dengan Success Team</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};