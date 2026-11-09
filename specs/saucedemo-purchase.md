# SauceDemo Satın Alma — Uçtan Uca Test Planı

**Uygulama:** [SauceDemo / Swag Labs](https://www.saucedemo.com)  
**Kapsam:** Giriş, fiyat sıralaması, ürünleri sepete ekleme, sepet doğrulama, checkout ve sipariş onayı  
**Test kullanıcısı:** `standard_user` / `secret_sauce` (SauceDemo demo hesabı)  
**Format:** Arrange / Act / Assert  
**Not:** Bu belge onaylanabilir senaryo planıdır; test kodu içermez.

## Locator stratejisi

Öncelikle kullanıcıya görünen roller ve erişilebilir adlar kullanılmalıdır:

- Giriş alanları: `getByRole('textbox', { name: 'Username' })`, `getByRole('textbox', { name: 'Password' })`; giriş: `getByRole('button', { name: 'Login' })`.
- Ürün sıralama: `getByRole('combobox', { name: 'Sort products' })`; `Price (low to high)` seçeneğini seçin.
- Ürün ayrıntıları: `getByRole('button', { name: 'View details for Sauce Labs Onesie' })` ve `getByRole('button', { name: 'View details for Sauce Labs Bike Light' })`; ürün adları/fiyatları için tam metin eşleşmeleri kullanın.
- Sıralanmış listede sepete ekleme: eş adlı `Add to cart` düğmeleri bulunduğundan, sıralama doğrulandıktan sonra `getByRole('button', { name: 'Add to cart' }).nth(0)` ve `.nth(1)` kullanın. Tıklama sonrasında ilgili ürünün düğmesinin `Remove` olarak değiştiğini doğrulayın.
- Sepet: dinamik erişilebilir adı `Cart` ile başlayan düğme (`getByRole('button', { name: /^Cart/ })`); ürün adları ve fiyatları tam metinle doğrulanır.
- Checkout bilgileri: `getByRole('textbox', { name: 'First Name' })`, `getByRole('textbox', { name: 'Last Name' })`, `getByRole('textbox', { name: 'Zip/Postal Code' })`; sonraki adımlar için `Continue` ve `Finish` düğmeleri.
- Geri bildirimler: görünür hata metinleri ve onay başlığı için `getByText` / `getByRole('heading', ...)` kullanın.

Kırılgan CSS/XPath locator'ları kullanmayın. Erişilebilir adlar değişirse önce arayüzün erişilebilirliğini inceleyin; gerekirse uygulamanın sağladığı `data-test` kimliklerini tercih edin.

## Senaryo matrisi

| ID | Tür | Senaryo | Arrange | Act | Assert |
|---|---|---|---|---|---|
| SDP-01 | Pozitif — uçtan uca | En ucuz ilk iki ürünü satın alma | Yeni tarayıcı bağlamı aç ve giriş sayfasına git. | `standard_user` / `secret_sauce` ile giriş yap. `Sort products` alanında `Price (low to high)` seç. İlk iki ürünü sepete ekle, sepete git, checkout bilgilerini (First Name: `Alex`, Last Name: `Doe`, Zip/Postal Code: `10001`) gir, Continue ve ardından Finish'e bas. | Giriş sonrası Products sayfası açılır. Sıralama `Sauce Labs Onesie` — `$7.99`, ardından `Sauce Labs Bike Light` — `$9.99` gösterir. Sepet rozeti `2` olur; sepette bu iki ürünün her biri miktar `1` ve doğru fiyatla görünür, başka ürün bulunmaz. Checkout Overview'da aynı ürünler doğrulanır; Item total `$17.98`, Tax `$1.44`, Total `$19.42` gösterilir. Tamamlama sayfasında `Thank you for your order!` başlığı ve gönderim onayı görünür; sepet boş olur. |
| SDP-02 | Negatif | Geçersiz kullanıcı bilgileriyle giriş | Yeni tarayıcı bağlamı aç ve giriş sayfasına git. | `standard_user` ile hatalı bir parola girip Login'e bas. | Giriş başarısız olur, kullanıcı giriş sayfasında kalır ve görünür hata mesajı gösterilir; Products sayfasına gidilmez. |
| SDP-03 | Sınır / negatif | Gerekli checkout alanları boşken devam etme | `standard_user` ile giriş yap, bir ürün ekle ve sepette Checkout'a ilerle. | First Name, Last Name ve Zip/Postal Code alanlarını boş bırakıp Continue'e bas. | Checkout bilgi formunda kalınır; gerekli alan hata mesajı görünür ve Overview/Finish adımına geçilmez. |
| SDP-04 | Sınır | Eşit fiyatlı ürünler varken artan fiyat sıralaması | Yeni bağlamda giriş yap ve ürün sayfasını aç. | `Price (low to high)` sıralamasını seç ve tüm ürünleri sırayla incele. | Fiyatlar azalmayan sıradadır: `$7.99`, `$9.99`, `$15.99`, `$15.99`, `$29.99`, `$49.99`. Eşit fiyatlı iki ürünün kendi aralarındaki sırası varsayılmaz; ilk iki ürün yine sırasıyla Sauce Labs Onesie ve Sauce Labs Bike Light'tır. |

## İzolasyon ve önkoşullar

- Her senaryo bağımsız, temiz tarayıcı bağlamında çalıştırılmalıdır; önceki sepetteki ürünler sonraki senaryolara taşınmamalıdır.
- SDP-01 SauceDemo'nun herkese açık demo hesabını kullanır; gerçek ödeme veya gerçek kişisel bilgi gerektirmez.
- Fiyat, ürün adedi ve demo checkout toplamı test anında uygulama verisiyle tutarlı olmalıdır. Uygulama katalog fiyatlarını değiştirirse beklenen değerler senaryolar çalıştırılmadan önce yeniden doğrulanmalıdır.
