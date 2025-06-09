import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Check, 
  TreePine, 
  Users, 
  HardDrive, 
  Download, 
  UserPlus, 
  Shield, 
  BarChart3,
  Star,
  Clock,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { useDashboardStore } from '../../store/dashboardStore';

export const UpgradePage: React.FC = () => {
  const { setPremium } = useDashboardStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'premium'>('trial');
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12
  });
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUpgrade = (planType: 'trial' | 'premium') => {
    setSelectedPlan(planType);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setPremium(true);
    setShowPaymentModal(false);
    // Redirect to dashboard with success message
    window.location.href = '/dashboard?upgraded=true';
  };

  const testimonials = [
    {
      rating: 5,
      text: "Sekarang seluruh keluarga besar bisa terdokumentasi dengan baik. Worth banget untuk $9.99/tahun!",
      author: "Ibu Sari",
      family: "Keluarga Besar Sutrisno",
      members: "350 anggota"
    },
    {
      rating: 5,
      text: "Fitur kolaborasi memungkinkan semua saudara ikut update data. Sangat membantu untuk reuni keluarga.",
      author: "Pak Budi",
      family: "Marga Simanjuntak",
      members: "180 anggota"
    },
    {
      rating: 5,
      text: "Export ke GEDCOM sangat berguna untuk backup dan sharing dengan aplikasi lain. Recommended!",
      author: "Dr. Maya",
      family: "Keluarga Handayani",
      members: "95 anggota"
    },
    {
      rating: 5,
      text: "Analytics keluarga memberikan insight menarik tentang distribusi usia dan lokasi. Keren!",
      author: "Andi Wijaya",
      family: "Keluarga Besar Wijaya",
      members: "220 anggota"
    }
  ];

  const faqs = [
    {
      question: "🔒 Apakah data saya aman?",
      answer: "Data dienkripsi bank-grade dengan standar AES-256, backup harian otomatis, dan server berlokasi di Indonesia untuk kepatuhan data lokal. Kami tidak pernah membagikan data pribadi Anda kepada pihak ketiga."
    },
    {
      question: "😞 Bagaimana jika saya tidak puas?",
      answer: "Kami menawarkan jaminan uang kembali 30 hari tanpa pertanyaan. Jika tidak puas, hubungi support dan dana akan dikembalikan 100% dalam 3-5 hari kerja."
    },
    {
      question: "⬇️ Bisakah saya downgrade ke akun gratis?",
      answer: "Ya, Anda bisa downgrade kapan saja. Data akan tetap aman, namun akses terbatas sesuai batasan akun gratis (1 family tree, 15 anggota). Fitur premium akan dinonaktifkan."
    },
    {
      question: "💳 Metode pembayaran apa saja yang diterima?",
      answer: "Kami menerima kartu kredit/debit (Visa, Mastercard), transfer bank, e-wallet (GoPay, OVO, DANA), virtual account, dan QRIS. Pembayaran diproses aman oleh Midtrans."
    },
    {
      question: "🔄 Bagaimana jika lupa perpanjang langganan?",
      answer: "Kami akan mengirim reminder 7 hari dan 1 hari sebelum expired. Jika terlewat, akun otomatis downgrade ke gratis tanpa kehilangan data. Anda bisa upgrade kembali kapan saja."
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Keluarga besar 200+ anggota",
      description: "Dokumentasikan seluruh keluarga besar tanpa batasan jumlah anggota",
      solution: "✅ Unlimited anggota keluarga"
    },
    {
      icon: UserPlus,
      title: "Ingin libatkan saudara update data",
      description: "Ajak anggota keluarga lain untuk berkontribusi menambah dan update data",
      solution: "✅ Kolaborator unlimited dengan permission control"
    },
    {
      icon: HardDrive,
      title: "Banyak foto keluarga",
      description: "Simpan ribuan foto keluarga dari berbagai acara dan momen berharga",
      solution: "✅ Storage 10GB untuk foto dan dokumen"
    },
    {
      icon: TreePine,
      title: "Keluarga suami-istri terpisah",
      description: "Kelola pohon keluarga suami dan istri dalam satu akun",
      solution: "✅ Unlimited family trees dalam satu akun"
    },
    {
      icon: BarChart3,
      title: "Ingin analisis statistik keluarga",
      description: "Lihat insights menarik tentang distribusi usia, lokasi, dan profesi keluarga",
      solution: "✅ Family Analytics & Insights dashboard"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <TreePine className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">FamilyTree</h1>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Upgrade ke Premium
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            <span>PROMO TERBATAS - HEMAT 50%</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Dokumentasikan Seluruh<br />
            <span className="text-green-600">Keluarga Besar</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upgrade ke Premium dan kelola unlimited family trees dengan unlimited anggota keluarga. 
            Hanya <span className="font-bold text-green-600">$9.99 per tahun</span> 
            <span className="text-gray-500"> (kurang dari Rp 1.000 per bulan)</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <button
              onClick={() => handleUpgrade('trial')}
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              MULAI 7 HARI GRATIS
            </button>
            <button
              onClick={() => handleUpgrade('premium')}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              LANGSUNG UPGRADE $9.99
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Tanpa kartu kredit untuk trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Jaminan 30 hari uang kembali</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-600" />
              <span>10,000+ keluarga Indonesia</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-red-800 font-medium mb-3">Promo berakhir dalam:</p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-red-500">JAM</div>
              </div>
              <div className="text-red-600">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-red-500">MENIT</div>
              </div>
              <div className="text-red-600">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-red-500">DETIK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Bandingkan Paket
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-0">
              {/* Header */}
              <div className="p-6 bg-gray-50 border-r border-gray-200">
                <h3 className="font-semibold text-gray-900">Fitur</h3>
              </div>
              <div className="p-6 bg-gray-50 border-r border-gray-200 text-center">
                <h3 className="font-semibold text-gray-900">Gratis</h3>
                <p className="text-sm text-gray-600 mt-1">$0/tahun</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-500 to-blue-500 text-center">
                <h3 className="font-semibold text-white">Premium</h3>
                <p className="text-green-100 mt-1">
                  <span className="line-through text-sm">$19.99</span> 
                  <span className="font-bold ml-2">$9.99/tahun</span>
                </p>
              </div>

              {/* Features */}
              {[
                { feature: 'Family Tree', free: '1', premium: 'Unlimited ✨' },
                { feature: 'Anggota Keluarga', free: '15', premium: 'Unlimited 👨‍👩‍👧‍👦' },
                { feature: 'Storage', free: '500MB', premium: '10GB 📁' },
                { feature: 'Export', free: 'PDF', premium: 'PDF + Excel + GEDCOM 📊' },
                { feature: 'Kolaborator', free: 'Tidak ada', premium: 'Unlimited 🤝' },
                { feature: 'Backup Otomatis', free: 'Tidak ada', premium: 'Harian 🔄' },
                { feature: 'Support', free: 'Email', premium: 'Priority Chat 💬' },
                { feature: 'Analytics', free: 'Tidak ada', premium: 'Family Insights 📈' }
              ].map((row) => (
                <React.Fragment key={row.feature}>
                  <div className="p-4 border-r border-gray-200 border-t">
                    <span className="font-medium text-gray-900">{row.feature}</span>
                  </div>
                  <div className="p-4 border-r border-gray-200 border-t text-center">
                    <span className="text-gray-600">{row.free}</span>
                  </div>
                  <div className="p-4 border-t text-center">
                    <span className="font-medium text-green-600">{row.premium}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Mengapa Keluarga Memilih Premium
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Solusi untuk kebutuhan keluarga besar Indonesia
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 font-medium text-sm">{benefit.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Apa Kata Keluarga Indonesia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.text} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={`star-${testimonial.text}-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.family}</p>
                  <p className="text-sm text-blue-600 font-medium">{testimonial.members}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Harga Spesial Terbatas</h2>
            
            <div className="mb-6">
              <div className="text-6xl font-bold mb-2">
                <span className="line-through text-3xl opacity-75">$19.99</span>
                <span className="ml-4">$9.99</span>
              </div>
              <p className="text-xl opacity-90">per tahun • HEMAT 50%</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-semibold">Rp 13.500 per bulan</p>
                <p className="opacity-75">Lebih murah dari secangkir kopi</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-semibold">Rp 450 per hari</p>
                <p className="opacity-75">Lebih murah dari parkir motor</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-semibold">Bonus Gratis</p>
                <p className="opacity-75">7 hari trial + setup assistance</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleUpgrade('trial')}
                className="w-full bg-white text-green-600 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                MULAI 7 HARI GRATIS - TANPA KARTU KREDIT
              </button>
              <button
                onClick={() => handleUpgrade('premium')}
                className="w-full bg-yellow-400 text-gray-900 py-4 px-8 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors"
              >
                LANGSUNG UPGRADE $9.99 - HEMAT 50%
              </button>
            </div>

            <p className="text-sm opacity-75 mt-4">
              Bergabung dengan 10,000+ keluarga Indonesia yang sudah mempercayai FamilyTree
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.question ? null : faq.question)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  {expandedFaq === faq.question ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === faq.question && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Siap Mendokumentasikan Keluarga Besar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Mulai sekarang dan rasakan kemudahan mengelola unlimited family trees
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <button
              onClick={() => handleUpgrade('trial')}
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors"
            >
              MULAI 7 HARI GRATIS
            </button>
            <button
              onClick={() => handleUpgrade('premium')}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              LANGSUNG UPGRADE $9.99
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Tanpa kartu kredit</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span>Batal kapan saja</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Jaminan uang kembali</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Download className="w-4 h-4 text-green-600" />
              <span>Data bisa export</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planType={selectedPlan}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};