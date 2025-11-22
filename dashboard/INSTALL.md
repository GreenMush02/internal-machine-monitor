# Instalacja i uruchomienie - SmartFlow Dashboard

## Wymagania

- Przeglądarka internetowa (Chrome, Firefox, Safari, Edge)
- Opcjonalnie: Serwer HTTP (Python, Node.js, lub VS Code Live Server)

## Szybki start (3 minuty)

### Metoda 1: Python HTTP Server (zalecana)

```bash
# Przejdź do katalogu dashboard
cd /home/domson/hackaton/internal-machine-monitor/dashboard

# Uruchom serwer
python3 -m http.server 8000

# Otwórz w przeglądarce
# http://localhost:8000
```

### Metoda 2: VS Code Live Server

1. Otwórz VS Code
2. Zainstaluj rozszerzenie "Live Server" (jeśli jeszcze nie masz)
3. Otwórz folder `dashboard` w VS Code
4. Kliknij prawym na `index.html` → "Open with Live Server"
5. Dashboard otworzy się automatycznie w przeglądarce

### Metoda 3: Node.js (http-server)

```bash
# Zainstaluj http-server globalnie (jednorazowo)
npm install -g http-server

# Przejdź do katalogu
cd /home/domson/hackaton/internal-machine-monitor/dashboard

# Uruchom serwer
http-server -p 8000

# Otwórz http://localhost:8000
```

### Metoda 4: Bezpośrednio w przeglądarce

**Uwaga:** Niektóre funkcje mogą nie działać z powodu ograniczeń CORS.

```bash
# Linux / macOS
open index.html

# Lub po prostu przeciągnij plik index.html do przeglądarki
```

## Weryfikacja instalacji

Po otwarciu dashboardu powinieneś zobaczyć:

1. ✅ Header ze zegarem (aktualizuje się co sekundę)
2. ✅ 4 karty KPI u góry
3. ✅ Siatkę kart maszyn (12 sztuk)
4. ✅ Sekcję "Predykcja Awarii (AI)"
5. ✅ Dwa wykresy u dołu (Awarie i Wykorzystanie)

## Testowanie funkcji

### Test 1: Kliknięcie na maszynę
1. Kliknij dowolną kartę maszyny
2. Powinien otworzyć się modal ze szczegółami
3. Sprawdź czy widzisz predykcję AI

### Test 2: Responsywność
1. Zmień rozmiar okna przeglądarki
2. Dashboard powinien automatycznie się dostosować:
   - Szerokość < 640px: 1 kolumna
   - 640px - 1024px: 2 kolumny
   - > 1024px: 3-4 kolumny

### Test 3: Wykresy
1. Przewiń do sekcji wykresów
2. Wykresy powinny być widoczne i interaktywne
3. Najedź na słupki - powinieneś zobaczyć tooltips

### Test 4: Zgłoszenie awarii
1. Otwórz dowolną maszynę (kliknij kartę)
2. Kliknij przycisk "Zgłoś awarię"
3. U góry pojawi się czerwony banner
4. Status maszyny zmieni się na "krytyczny"

## Rozwiązywanie problemów

### Problem: Wykresy się nie renderują

**Rozwiązanie:**
- Sprawdź konsolę przeglądarki (F12)
- Upewnij się, że masz połączenie z internetem (Chart.js ładuje się z CDN)
- Spróbuj odświeżyć stronę (Ctrl+F5)

### Problem: Tailwind CSS nie działa

**Rozwiązanie:**
- Sprawdź połączenie internetowe (Tailwind ładuje się z CDN)
- Otwórz konsolę i sprawdź błędy
- Sprawdź czy w `<head>` jest: `<script src="https://cdn.tailwindcss.com"></script>`

### Problem: Ikony Font Awesome nie pokazują się

**Rozwiązanie:**
- Sprawdź połączenie internetowe
- Odśwież stronę
- Sprawdź czy link do Font Awesome jest poprawny

### Problem: Modal się nie otwiera

**Rozwiązanie:**
- Otwórz konsolę przeglądarki (F12)
- Sprawdź czy są błędy JavaScript
- Upewnij się, że wszystkie pliki JS są załadowane

### Problem: "Cross-Origin" errors

**Rozwiązanie:**
- **NIE** otwieraj pliku bezpośrednio (`file:///`)
- Użyj serwera HTTP (Python, Node.js, VS Code Live Server)

## Testowanie na urządzeniach mobilnych

### Opcja 1: DevTools (Chrome)

1. Otwórz dashboard w Chrome
2. Naciśnij F12 (DevTools)
3. Kliknij ikonę urządzenia mobilnego (Ctrl+Shift+M)
4. Wybierz urządzenie z listy (iPhone, iPad, etc.)

### Opcja 2: Prawdziwe urządzenie

1. Uruchom serwer na komputerze (np. `python3 -m http.server 8000`)
2. Znajdź IP swojego komputera:
   ```bash
   # Linux/macOS
   ifconfig | grep inet

   # Windows
   ipconfig
   ```
3. Na telefonie/tablecie otwórz:
   ```
   http://[IP_KOMPUTERA]:8000
   ```
   Np. `http://192.168.1.100:8000`

## Deployment (produkcja)

### Hosting statyczny

Dashboard jest aplikacją statyczną, więc możesz go hostować na:

- **Netlify** (za darmo)
  ```bash
  # Zainstaluj Netlify CLI
  npm install -g netlify-cli

  # Deploy
  cd dashboard
  netlify deploy --prod
  ```

- **Vercel** (za darmo)
  ```bash
  # Zainstaluj Vercel CLI
  npm install -g vercel

  # Deploy
  cd dashboard
  vercel --prod
  ```

- **GitHub Pages**
  1. Stwórz repo na GitHubie
  2. Pushuj kod
  3. Włącz GitHub Pages w ustawieniach repo

- **AWS S3 + CloudFront**
- **Azure Static Web Apps**
- **Firebase Hosting**

## Wydajność

Dashboard jest zoptymalizowany:
- ✅ Minimalne zależności (tylko Chart.js i Font Awesome)
- ✅ Tailwind CSS z CDN (szybkie ładowanie)
- ✅ Vanilla JavaScript (bez frameworków)
- ✅ Lazy loading wykresów
- ✅ Responsywne obrazy i layout

## Wsparcie przeglądarek

Dashboard działa na:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## Następne kroki

Po instalacji i weryfikacji:

1. Przeczytaj [README.md](README.md) - szczegóły techniczne
2. Przejrzyj [DEMO_GUIDE.md](DEMO_GUIDE.md) - przewodnik prezentacji
3. Dostosuj dane w `js/data.js` do swoich potrzeb
4. Eksperymentuj z algorytmem w `js/ml-predictor.js`

## Wsparcie

Problemy? Otwórz issue lub skontaktuj się z zespołem SmartFlow.

---

**Happy monitoring!** 🏭📊
