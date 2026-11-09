# Todo Listesi Yönetimi — Test Senaryoları

**Uygulama:** [TodoMVC demo](https://demo.playwright.dev/todomvc)  
**Kapsam:** Todo ekleme, tamamlama/yeniden etkinleştirme ve durum filtreleri  
**Format:** Arrange / Act / Assert  
**Not:** Bu belge senaryo planıdır; test kodu içermez.

## Locator stratejisi

Öncelikle kullanıcıya görünen erişilebilir arayüzü hedefleyin:

- Yeni todo alanı: `getByRole('textbox', { name: 'What needs to be done?' })` veya `getByPlaceholder('What needs to be done?')`.
- Todo satırı: `getByRole('listitem').filter({ hasText: todoMetni })`.
- Bir todo'nun tamamlama kutusu: ilgili satır içinde `getByRole('checkbox')`.
- Filtreler: `getByRole('link', { name: 'All' })`, `getByRole('link', { name: 'Active' })` ve `getByRole('link', { name: 'Completed' })`.

Erişilebilir adlar veya roller uygulama güncellemesiyle değişirse önce kullanıcıya görünen metin/erişilebilirlik incelenmeli; gerekirse `getByTestId` tercih edilmelidir. Kırılgan CSS ve XPath locator'ları kullanılmamalıdır.

## Senaryo matrisi

| ID | Tür | Senaryo | Arrange | Act | Assert |
|---|---|---|---|---|---|
| TLM-01 | Pozitif | Todo ekleme | Uygulamayı boş listeyle aç. | Todo alanına `Alışveriş yap` yazıp Enter'a bas. | Todo listede bir kez görünür ve giriş alanı temizlenir. |
| TLM-02 | Sınır | Baştaki ve sondaki boşluklarla todo ekleme | Uygulamayı boş listeyle aç. | Todo alanına `  Raporu gönder  ` yazıp Enter'a bas. | Boş olmayan todo eklenir; başlıkta baştaki/sondaki boşluklar bulunmaz. |
| TLM-03 | Negatif | Boş veya yalnızca boşluk içeren todo'yu eklememe | Uygulamayı boş listeyle aç. | Alan boşken Enter'a bas; sonra yalnızca boşluk girip tekrar Enter'a bas. | Todo eklenmez ve liste boş kalır. |
| TLM-04 | Pozitif | Todo'yu tamamlama ve yeniden etkinleştirme | `Kitap oku` başlıklı bir todo ekle. | Todo satırındaki checkbox'ı işaretle, sonra işaretini kaldır. | İlk işlem todo'yu tamamlar; ikinci işlem yeniden aktif yapar. Her iki durumda da todo listede kalır. |
| TLM-05 | Pozitif | All filtresinde aktif ve tamamlanmış todoları görme | `E-posta yanıtla` ve `Sunum hazırla` todolarını ekle; ilkini tamamla. | `All` filtresini seç. | Her iki todo görünür ve tamamlanma durumları doğru gösterilir. |
| TLM-06 | Pozitif | Active filtresinde yalnızca aktif todoları görme | TLM-05'teki karışık durumlu listeyi hazırla. | `Active` filtresini seç. | Yalnızca `Sunum hazırla` görünür; tamamlanan todo görünmez. |
| TLM-07 | Pozitif | Completed filtresinde yalnızca tamamlanan todoları görme | TLM-05'teki karışık durumlu listeyi hazırla. | `Completed` filtresini seç. | Yalnızca `E-posta yanıtla` görünür; aktif todo görünmez. |
| TLM-08 | Sınır | Eşleşen todo olmayan filtreyi kullanma | En az bir aktif todo ekle ve hiçbirini tamamlama. | `Completed` filtresini seç; ardından `Active` filtresine geç. | Completed görünümünde todo listelenmez; Active görünümünde eklenen todo görünür. Uygulama hata vermez. |
| TLM-09 | Sınır | Birden fazla todo ile filtreler arasında geçiş | Birbirinden farklı üç todo ekle ve bunlardan birini tamamla. | Sırayla `Active`, `Completed` ve `All` filtrelerini seç. | Her filtre yalnızca kendisine uygun durumdaki todoları gösterir; `All` görünümünde üç todo da görünür ve liste geçişler sırasında değişmez. |

## İzolasyon ve önkoşullar

- Senaryolar birbirinden bağımsız çalıştırılmalı; her senaryoya temiz listeyle başlanmalıdır (yeni tarayıcı bağlamı veya uygulama durumunun temizlenmesi).
- TLM-06 ve TLM-07, TLM-05'te tarif edilen düzeni kendi Arrange adımlarında kurmalıdır; senaryoların çalıştırılma sırasına bağımlı olmamalıdır.
- Bu kapsamda uygulama tarafından tanımlanmış bir maksimum başlık uzunluğu varsayılmadığından, keyfi bir uzunluk limiti test edilmez.
