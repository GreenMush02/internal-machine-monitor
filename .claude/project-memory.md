# SmartFlow Dashboard - Project Memory

## Instrukcje dla AI

### ⚠️WAŻNE ZASADY:
1. **NIE TWÓRZ** plików .md bez wyraźnej prośby użytkownika
2. Dokumentację wrzucaj do tego pliku `.claude/project-memory.md`
3. Jeśli użytkownik poprosi o dokumentację - wtedy dopiero twórz plik .md
4. Skupiaj się na kodzie, nie na dokumentacji

---

## Przegląd Projektu

**SmartFlow Dashboard** - System monitorowania maszyn przemysłowych z przewidywaniem awarii (AI/ML)

### Stack:
- HTML5 + Tailwind CSS 3.x
- Vanilla JavaScript (ES6+)
- Chart.js 4.4.0
- Font Awesome 6.4.0

### Lokalizacja:
```
/home/domson/hackaton/internal-machine-monitor/dashboard/
```

---

## Struktura Plików

```
dashboard/
├── index.html              # Główny plik
├── js/
│   ├── data.js            # Dane maszyn (12 sztuk)
│   ├── analytics-data.js  # Historia awarii, procesy, specs
│   ├── ml-predictor.js    # Algorytm Random Forest (symulacja)
│   ├── charts.js          # Chart.js setup
│   ├── analytics.js       # Filtry, metryki zarządcze
│   └── app.js             # Główna logika
├── css/
│   └── styles.css         # (nieużywane - mamy Tailwind)
├── start.sh               # Quick start script
└── package.json           # NPM config
```

---

## Kluczowe Funkcje

### 1. Monitoring Real-time
- 12 maszyn z różnymi statusami
- Auto-update co 5 sekund
- Progress bars, temperatury, wibracje

filtry sekcji: 
```javascript
currentFilters = {
    timeRange: 30,        // 7/30/90/180 dni
    machineType: 'all',   // all/CNC/Press/Welder
    status: 'all',        // all/operational/warning/critical/offline
    viewMode: 'operator'  // operator/manager/executive
}


### 4. Dashboard Zarządu (viewMode: 'executive')

**Metryki:**
- Całkowite straty z awarii
- Średni MTBF (Mean Time Between Failures)
- Średni MTTR (Mean Time To Repair)
- Koszt zalecanych wymian

**Analiza procesów:**
- Top 5 problematycznych procesów
- Liczba dotkniętych maszyn → identyfikacja: maszyna czy proces?
- Całkowity przestój i koszty

**Korelacja:**
- Wykres: Typ maszyny vs Typ awarii
- 4 typy: Mechanical/Electrical/Hydraulic/Software

---

## Dane

### Maszyny (machinesData)
12 maszyn:
- CNC-01, CNC-02, CNC-03 (Milling/Lathe)
- Press-A, Press-B
- Laser-01
- Weld-01, Weld-02
- Drill-01, Grinder-01, Paint-01, Assembly-01

### Historia Awarii (failureHistory)
24 awarie z ostatnich 6 miesięcy:
- machineId, date, process, type, downtime, cost, description

### Procesy (processes)
13 procesów produkcyjnych:
- id, name, category, avgDuration, complexity, riskFactor

### Specyfikacje (machineSpecs)
Dla każdej maszyny:
- purchaseDate, purchasePrice, expectedLifetime
- maintenanceCostPerYear, replacementCost, utilizationTarget

---

## Algorytmy Kluczowe

### calculateMTBF (Mean Time Between Failures)
```javascript
MTBF = (Całkowity czas pracy - Czas napraw) / Liczba awarii
```

### calculateMTTR (Mean Time To Repair)
```javascript
MTTR = Σ (czas przestoju) / Liczba awarii
```

### calculateReplacementScore
```javascript
Składniki (każdy 0-100):
1. ageScore = (wiek / expectedLifetime) × 100
2. failureScore = min(100, failuresPerMonth × 20)
3. costScore = min(100, (failureCost / replacementCost) × 100)
4. reliabilityScore = mtbf < 720 ? 100 : max(0, 100 - (mtbf/720)×100)

totalScore = ageScore×0.25 + failureScore×0.35 + costScore×0.25 + reliabilityScore×0.15
```

### getMostProblematicProcesses
```javascript
Grupuje awarie po procesach:
- count, totalDowntime, totalCost, affectedMachines

Insight:
- affectedMachines === 1 → problem MASZYNY
- affectedMachines > 1 → problem PROCESU
```

### analyzeTypeCorrelation
```javascript
Grupuje: machineType + failureType
Dla każdej kombinacji: count, avgDowntime, totalCost
```

---

## Event Handlers

### Filtry
```javascript
document.getElementById('timeRangeFilter').addEventListener('change', ...)
document.getElementById('machineTypeFilter').addEventListener('change', ...)
document.getElementById('statusFilter').addEventListener('change', ...)
document.getElementById('viewMode').addEventListener('change', ...)
```

### View Mode Switch
```javascript
switchViewMode('executive') {
    - pokazuje executiveDashboard
    - wywołuje updateExecutiveDashboard()
    - renderuje wszystkie metryki
}
```

---

## Chart.js Setup

### failuresChart (Bar)
- Awarie z ostatnich 7 dni
- Czerwone słupki
- Tooltips z liczbą awarii

### utilizationChart (Horizontal Bar)
- Wykorzystanie maszyn w %
- Kolory: zielony/żółty/czerwony/szary
- Tooltips z %

### correlationChart (Bar)
- Korelacja Typ Maszyny - Typ Awarii
- Kolory per typ awarii
- Tooltips: awarie, przestój, koszt

---

## Uruchomienie

```bash
cd /home/domson/hackaton/internal-machine-monitor/dashboard
python3 -m http.server 8000
# http://localhost:8000
```

lub:
```bash
./start.sh
```

lub:
```bash
npm start
```

---

## Quick Demo Flow

### Dla Operatora:
1. Otwórz dashboard
2. Zobacz kartę maszyn
3. Kliknij maszynę → modal ze szczegółami
4. Zobacz predykcję AI

### Dla Zarządu:
1. Filtry → Widok → Zarząd
2. Zobacz 4 KPI (straty, MTBF, MTTR, koszty wymian)
3. Scroll → Rekomendacje Wymian (CNC-03: score 78 → WYMIENIAĆ!)
4. Scroll → Problematyczne Procesy (spawanie ram: 4 awarie, 1 maszyna → problem maszyny)
5. Scroll → Wykres korelacji (CNC + Mechanical częste)

---

## Najczęstsze Modyfikacje

### Dodaj nową maszynę:
`js/data.js` → dodaj do `machinesData`

### Dodaj awarię:
`js/analytics-data.js` → dodaj do `failureHistory`

### Zmień wagi ML:
`js/ml-predictor.js` → `this.featureWeights`

### Zmień wagi replacement score:
`js/analytics-data.js` → `calculateReplacementScore()` → wartości 0.25, 0.35, etc.

### Dodaj nowy filtr:
1. `index.html` → dodaj select w sekcji filtrów
2. `js/analytics.js` → dodaj event listener + logikę

---

## TODOs (Post-Hackathon)

- [ ] Backend API (Flask/FastAPI)
- [ ] WebSocket dla real-time
- [ ] Database (PostgreSQL)
- [ ] Prawdziwy model ML (scikit-learn)
- [ ] Export raportów PDF
- [ ] Email notifications
- [ ] Integracja ERP/MES

---

## Bugs Known

1. ~~Correlation chart nie renderuje się od razu~~ (fixed - lazy load)
2. Filtry czasowe nie aktualizują wykresów (TODO)
3. Mobile view - executive dashboard szeroki (minor CSS fix)

---

## Performance

- Initial load: <1s
- Bundle size: ~250KB (with CDN)
- 60 FPS animations
- Auto-update: 5s interval

---

## Kontekst Biznesowy

**Problem:**
- Fabryki tracą 150-300k zł/rok na nieplanowane awarie
- Brak danych do podejmowania decyzji o wymianach
- Nie wiadomo czy problem w maszynie czy procesie

**Rozwiązanie:**
- Predykcja awarii 24-48h wcześniej
- Data-driven rekomendacje wymian z ROI
- Identyfikacja root cause (maszyna vs proces)
- Oszczędności: zwrot w 1-3 lata

**ROI Example:**
```
CNC-03:
- Koszty awarii: 300k zł/rok
- Koszt wymiany: 500k zł
- ROI: 1.7 roku
- Oszczędności 5 lat: 1M zł
```

---

## Prezentacja dla Zarządu (3 min)

1. [0:00-0:30] Problem: 156k zł strat w miesiąc
2. [0:30-1:30] Dashboard zarządu → 4 KPI
3. [1:30-2:00] Rekomendacje: CNC-03 score 78 → wymieniać!
4. [2:00-2:30] Procesy: spawanie = maszyna, frezowanie = proces
5. [2:30-3:00] Korelacja + podsumowanie

**Key messages:**
- MTBF 580h < norma 720h → trzeba poprawić
- CNC-03: 5 awarii/mc → 300k/rok → wymiana ROI 1.7y
- Spawanie ram: 1 maszyna = problem Weld-01
- Frezowanie felg: 2 maszyny = problem procesu

---

---

## PLANOWANIE FEATURE'ÓW - Role-Based Dashboard

### 🎯 Struktura Sekcji

#### SEKCJA 1: DASHBOARD (Operator, Kierownik, Właściciel)
**Status:** ✅ Gotowe - pozostaje bez zmian

**Zawartość:**
- 4 KPI Cards:
  - Operacyjne maszyny (X / 12)
  - Ryzyko awarii (liczba maszyn)
  - Aktywne awarie
  - Efektywność OEE (%)
- Grid maszyn (12 maszyn)
  - Status: operational/warning/critical/offline
  - Progress bar wykorzystania
  - Temperatura, wibracje
  - Predykcja AI (%)
  - Modal ze szczegółami maszyny

**Kod:**
- `index.html` - sekcja `section-dashboard`
- `js/data.js` - dane maszyn
- `js/ml-predictor.js` - predykcja AI
- `js/app.js` - renderMachines(), updateKPIs()

---

#### SEKCJA 2: ANALYTICS (Kierownik, Właściciel)
**Status:** 🚧 Do zaprojektowania

**Możliwe feature'y:**

1. **Wykresy czasowe**
   - Awarie w czasie (7/30/90 dni)
   - Wykorzystanie maszyn w czasie
   - Trend predykcji awarii
   - Chart.js line/bar charts

2. **Analiza porównawcza**
   - Top 5 najgorszych maszyn
   - Top 5 najlepszych maszyn
   - Porównanie typów maszyn (CNC vs Press vs Welder)

3. **Predykcje ML - szczegóły**
   - Jakie maszyny są zagrożone w najbliższych 24h/48h/7 dni
   - Breakdown feature importance (dlaczego model przewiduje awarię)
   - Confidence score

4. **Filtry i raporty**
   - Przedział czasowy (7/30/90/180 dni)
   - Typ maszyny
   - Status
   - Export do CSV/PDF

5. **Heatmapa**
   - Godziny szczytu awarii
   - Dni tygodnia z największymi problemami
   - Kalendarz awarii

**Pytania do ustalenia:**
- Co jest najważniejsze dla Kierownika?
- Jakie decyzje ma podejmować na podstawie tej sekcji?
- Czy potrzebne są alerty/powiadomienia?

---

#### SEKCJA 3: MANAGEMENT (Tylko Właściciel)
**Status:** 🚧 Do zaprojektowania

**Możliwe feature'y:**

1. **Dashboard Zarządu - metryki finansowe**
   - Całkowite straty z awarii (zł/miesiąc)
   - Średni MTBF (Mean Time Between Failures)
   - Średni MTTR (Mean Time To Repair)
   - Koszt zalecanych wymian
   - ROI z inwestycji w konserwację

2. **Rekomendacje wymian maszyn**
   - Algorytm scoringowy (0-100):
     - Wiek × 25%
     - Awarie × 35%
     - Koszt × 25%
     - Niezawodność × 15%
   - Priorytety: WYMIENIAĆ / Rozważ / Monitoruj / OK
   - Koszt wymiany vs oszczędności

3. **Analiza procesów produkcyjnych**
   - Top 5 problematycznych procesów
   - Insight: 1 maszyna = problem maszyny, >1 = problem procesu
   - Całkowity przestój i koszty per proces

4. **Korelacja Maszyna-Awaria**
   - Wykres: Typ maszyny vs Typ awarii
   - 4 typy: Mechanical/Electrical/Hydraulic/Software
   - Liczba awarii, średni czas naprawy, koszt

5. **Planowanie budżetu**
   - Przewidywane koszty konserwacji na 6/12 miesięcy
   - Zalecenia inwestycyjne
   - Priorytetyzacja wydatków

**Pytania do ustalenia:**
- Które metryki są kluczowe dla właściciela?
- Czy potrzebne są scenariusze "co jeśli"?
- Jak często właściciel będzie korzystał z tego dashboardu?

---

### 📊 Dostępne Dane (do wykorzystania)

**W `js/data.js`:**
- 12 maszyn z parametrami:
  - id, name, type, status
  - utilization, temperature, vibration
  - hoursWorked, maintenanceHours, cycles, defects

**W `js/analytics-data.js`:**
- 24 awarie z ostatnich 6 miesięcy
  - machineId, date, process, type, downtime, cost, description
- 13 procesów produkcyjnych
  - id, name, category, avgDuration, complexity, riskFactor
- Specyfikacje maszyn
  - purchaseDate, purchasePrice, expectedLifetime
  - maintenanceCostPerYear, replacementCost, utilizationTarget
- 30 dni danych produkcyjnych
  - dailyUtilization, dailyCycles, dailyDefects

**Dostępne funkcje analityczne:**
- `calculateMTBF()` - czas między awariami
- `calculateMTTR()` - czas naprawy
- `calculateReplacementScore()` - scoring wymian
- `getMostProblematicProcesses()` - top problematyczne procesy
- `analyzeTypeCorrelation()` - korelacja typ-awaria

---

### 🎨 Komponenty UI do wykorzystania

**Gotowe w projekcie:**
- Card KPI (4 warianty kolorów: green/yellow/red/blue)
- Machine Card (grid 12 maszyn)
- Modal (szczegóły maszyny)
- Chart.js (bar, line, horizontal bar, pie)
- Alert Banner
- Progress bars
- Status badges (operational/warning/critical/offline)

**Do dodania w razie potrzeby:**
- Table z sortowaniem
- Date picker dla filtrów
- Export buttons (CSV/PDF)
- Tabs wewnątrz sekcji
- Accordion dla dłuższych list
- Tooltip z dodatkowymi info

---

### 🚀 Propozycja Podziału (do akceptacji)

**DASHBOARD (wszyscy):**
- Real-time monitoring
- Status maszyn
- Podstawowe KPI
- Predykcje AI

**ANALYTICS (Kierownik + Właściciel):**
- Wykresy czasowe (awarie, wykorzystanie)
- Top 5 najgorszych maszyn
- Predykcje 24h/48h/7 dni
- Breakdown feature importance ML
- Filtry czasowe i eksport

**MANAGEMENT (tylko Właściciel):**
- Dashboard zarządu (MTBF, MTTR, straty)
- Rekomendacje wymian z ROI
- Analiza procesów (maszyna vs proces)
- Korelacja typ-awaria
- Planowanie budżetu

---

### ❓ Pytania do Ustalenia

1. **Analytics - priorytet:**
   - Wykresy czasowe?
   - Predykcje szczegółowe?
   - Porównania maszyn?
   - Heatmapy?

2. **Management - priorytet:**
   - Finansowe KPI?
   - Rekomendacje wymian?
   - Analiza procesów?
   - Wszystkie powyższe?

3. **Interakcje:**
   - Czy klikając maszynę w Dashboard można przejść do jej analizy w Analytics?
   - Czy w Management można kliknąć proces i zobaczyć szczegóły?

4. **Export i raporty:**
   - Czy potrzebny CSV/PDF export?
   - Czy email z raportami?

5. **Filtry:**
   - Czy globalne filtry (góra strony) mają wpływać na wszystkie sekcje?
   - Czy każda sekcja ma własne filtry?

---

## Pamiętaj

✅ Kod > Dokumentacja
✅ Nie twórz .md bez prośby
✅ Działający prototyp > perfekcja
✅ Demo-ready > production-ready
✅ Focus na business value

---

*Last updated: 2025-01-22*
*Project: SmartFlow Dashboard v2.0*
*Location: /home/domson/hackaton/internal-machine-monitor*
