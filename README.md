# Mit főzzek? – iPhone / GitHub Pages
Levitől az Anyuknak ❤️

A 3.1-es Android-alkalmazás webes, iPhone-on és iPaden is főképernyőre telepíthető változata. 6 554 receptötlet (261 egyedileg szerkesztett recept, 6 293 jelölt variáció), 188 sütemény (115 édes és 73 sós), 25 konyha, 25 MI készítette kategóriakép. A receptek nem egyenként kipróbáltak.
 
## 1. Levinek: ingyenes feltöltés GitHub Pagesre

1. Csomagold ki a ZIP-fájlt.
2. Jelentkezz be saját GitHub-fiókodba: https://github.com/
3. Hozz létre egy új **Public** repositoryt, például `mit-fozzek` névvel: https://github.com/new
4. A kicsomagolt mappa **tartalmát** töltsd fel a repository gyökérkönyvtárába. Az `index.html`, `sw.js`, `manifest.webmanifest`, `recipes.js`, `photos/`, `icons/` és `ocr/` közvetlenül a gyökérben legyenek. A `.nojekyll` fájl is szükséges.
   - Egyszerű módszer: GitHub Desktop (https://desktop.github.com/). Klónozd az üres repositoryt, másold be a fájlokat és mappákat, **Commit to main**, majd **Push origin**.
   - Parancssorból, ha a Git telepítve van: a kicsomagolt mappában futtasd:
     ```
     git init
     git add .
     git commit -m "Mit főzzek? iPhone 3.1"
     git branch -M main
     git remote add origin https://github.com/SAJAT-FELHASZNALONEV/mit-fozzek.git
     git push -u origin main
     ```
     A SAJAT-FELHASZNALONEV helyére a valódi GitHub-felhasználóneved kerüljön. Ha a távoli repository nem üres, inkább klónozd előbb.
5. GitHubon nyisd meg a repository **Settings → Pages** oldalát.
6. **Build and deployment → Source: Deploy from a branch**. Branch: **main**, mappa: **/(root)**, majd **Save**.
7. Várd meg a sikeres közzétételt. A Pages oldal tetején megjelenik az oldal tényleges címe, például:
   `https://SAJAT-FELHASZNALONEV.github.io/mit-fozzek/`
8. Nyisd meg a linket, ellenőrizd, hogy az oldal működik és HTTPS az aktív kapcsolat. Majd küldd el anyukádnak Messengerben vagy SMS-ben.

A GitHub Pages ingyenes csomagban nyilvános repositoryhoz használható. A weboldal és a receptek nyilvánosak lesznek, beleértve a személyes indítófeliratot. **A saját kamrát, mentéseket, kedvenceket és jegyzeteket soha ne töltsd fel a GitHubra.** Az app ezeket csak helyben tárolja. Nem használ külső OCR API-t és nincs fizetős API.

Hivatalos útmutató: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 2. Anyukának: az iPhone-on való telepítés

1. Nyisd meg a Levitől kapott linket a **Safari** böngészőben. Ha a link Messengerben vagy más appban nyílt meg, válaszd a Safariban való megnyitást, vagy másold be a címet Safariba.
2. Nyomd meg a **Megosztás** ikont (kis négyzet, felfelé mutató nyíllal).
3. Görgess le a listában, és válaszd a **Főképernyőhöz adás** lehetőséget. Ha nem látszik, a műveletek listáját szerkesztve keresd meg.
4. Ha a telefon felajánlja, kapcsold be a „Megnyitás webappként” lehetőséget. Nyomd meg a **Hozzáadás** gombot.
5. Menj vissza az iPhone főképernyőjére. Keresd a zöld, főzőedényes **Mit főzzek?** ikont. Ezentúl innen indíthatod, mint a többi alkalmazást.
6. Az ikonról az első alkalommal még internet mellett nyisd meg, és várd meg az **Offline használatra kész** jelzést. Utána internet nélkül is használható, amíg a készülék az offline fájlokat megőrzi.

### Hogyan használjam?
- **Főoldal**: koppints a sorsolásra, ha nem tudod, mit főzz.
- **Receptek**: keress ételre, hozzávalóra, húsfajtára vagy konyhára. A „Sütemények” gyűjteményben édes/sós szűrés is van.
- **Kedvencek**: a receptek mellett nyomd meg a szívecskét; a Mentések fülön találod őket.
- **Menü és Lista**: tervezz heti menüt, készíts bevásárlólistát.
- **Kamra**: a fejléc doboz ikonjával írd be az otthoni alapanyagokat, mennyiséget és lejárati időt. A dátum kameráról vagy képről felismerhető; mindig ellenőrizd, mielőtt elmented.
- **Biztonsági mentés**: Beállítások → Biztonsági mentés. Válaszd a Fájlokba mentést. Androidról korábban exportált JSON-fájl a Mentés visszaállítása pontból beolvasható.

Az iPhone-főképernyős webapp és a Safari adatai különbözhetnek; a fontos adatokat mindig az ikonról megnyitott appban rögzítsd. A böngésző törölheti a helyi tárolót, ezért időnként exportálj JSON-mentést. Nincs fiók, felhőszinkron vagy App Store-os telepítés.

Apple hivatalos útmutató: https://support.apple.com/guide/iphone/iphea86e5236/ios

## 3. Saját szerver / teszt

A teljes mappa kiszolgálható bármilyen statikus HTTPS szerverről, például Caddyvel. Ha a Jellyfin mellett fut, külön hostnévvel vagy alkönyvtárral és megfelelő HTTPS tanúsítvánnyal szolgáld ki a statikus fájlokat. Ne irányítsd át a meglévő Jellyfin útvonalait. Egyszerű helyi PC-s teszt:

```
python -m http.server 8000
```
Az asztali gépen nyisd meg a `http://localhost:8000/` címet. A sima HTTP-s LAN IP-cím nem ad megbízható iPhone-os offline telepítést; éles használathoz HTTPS kell.

## Verzió és ellenőrzés

A 3.1-es funkciókat megtartja, a vonalkódkereső nincs benne. A böngészőben helyben futó Tesseract.js OCR az elmosódott vagy hiányos dátumot esetleg nem ismeri fel. Kézi választás és ellenőrzés szükséges. Ha a fotó nem olvasható, használd a kézi dátummezőt. Az időzítő háttérbe küldött vagy lezárt képernyőn nem garantált. Az offline webalkalmazás böngészős teszten ellenőrizhető; fizikai iPhone-készüléken való tesztelés még szükséges. 
