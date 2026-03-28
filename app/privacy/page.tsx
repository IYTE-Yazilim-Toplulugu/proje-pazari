export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Gizlilik Politikası</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300">
          ProjePazarı olarak kullanıcılarımızın gizliliğine önem veriyoruz.
          Kişisel verileriniz yalnızca hizmetlerimizi sunmak amacıyla kullanılmaktadır.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">Toplanan Veriler</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Ad, soyad, e-posta adresi gibi temel kimlik bilgileri ile platform kullanım verileri toplanmaktadır.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">Veri Kullanımı</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Toplanan veriler; hesap yönetimi, proje eşleştirme ve platform iyileştirme amacıyla kullanılır.
          Üçüncü taraflarla paylaşılmaz.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">İletişim</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Gizlilik ile ilgili sorularınız için bizimle iletişime geçebilirsiniz.
        </p>
      </div>
    </div>
  );
}
