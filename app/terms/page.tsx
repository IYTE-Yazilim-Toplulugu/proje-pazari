export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Kullanım Şartları</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300">
          ProjePazarı platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">Kullanıcı Sorumlulukları</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Kullanıcılar, platforma yükledikleri içeriklerin doğruluğundan ve yasallığından sorumludur.
          Yanıltıcı bilgi paylaşmak yasaktır.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">Proje Kuralları</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Projeler gerçek ve uygulanabilir olmalıdır. Uygunsuz içerik barındıran projeler kaldırılacaktır.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">Değişiklikler</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Bu şartlar önceden bildirim yapılmaksızın güncellenebilir. Güncel versiyonu takip etmeniz önerilir.
        </p>
      </div>
    </div>
  );
}
