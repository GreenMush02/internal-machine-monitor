# Przewodnik Funkcji Analitycznych - SmartFlow Dashboard

## Przegląd

Dashboard SmartFlow oferuje zaawansowane funkcje analityczne dla trzech poziomów użytkowników:
- **Operator** - monitoring maszyn w czasie rzeczywistym
- **Kierownik** - analiza wykorzystania i planowanie konserwacji
- **Zarząd** - metryki biznesowe i decyzje inwestycyjne

---

## Filtry i Analiza

### Lokalizacja
Sekcja "Filtry i Analiza" znajduje się na górze dashboardu, zaraz po KPI.

### Dostępne filtry:

#### 1. Przedział czasowy
```
- Ostatnie 7 dni
- Ostatnie 30 dni (domyślnie)
- Ostatnie 90 dni
- Ostatnie 6 miesięcy
```

**Zastosowanie:**
- Filtruje dane historyczne awarii
- Wpływa na obliczenia MTBF i MTTR
- Aktualizuje wykresy i statystyki

#### 2. Typ maszyny
```
- Wszystkie typy
- CNC Milling
- CNC Lathe
- Prasy (Hydraulic Press)
- Spawarki (Robotic Welder)
- Inne
```

**Zastosowanie:**
- Filtruje widok maszyn
- Umożliwia analizę konkretnej kategorii
- Przydatne do porównań wydajności

#### 3. Status
```
- Wszystkie statusy
- Operacyjne (zielone)
- Ostrzeżenie (żółte)
- Krytyczne (czerwone)
- Offline (szare)
```

**Zastosowanie:**
- Szybkie znalezienie problematycznych maszyn
- Planowanie interwencji
- Analiza dostępności

#### 4. Widok
```
- Operator - monitoring podstawowy
- Kierownik - rozszerzona analiza
- Zarząd - metryki biznesowe
```

---

## Widok Zarządu (Executive Dashboard)

### Jak włączyć?
W filtrach wybierz: **Widok → Zarząd**

### Zawiera:

---

## 1. Metryki Zarządcze (KPI)

### Całkowite straty
**Definicja:** Suma kosztów wszystkich awarii w wybranym okresie

**Wzór:**
```
Całkowite straty = Σ (koszt awarii)
```

**Interpretacja:**
- Wysoka wartość → konieczność inwestycji w konserwację
- Trend rosnący → pogarszająca się niezawodność
- Porównanie rok do roku → ROI inwestycji

**Przykład:**
```
Ostatnie 30 dni: 156 000 zł
- CNC-03: 44 000 zł (3 awarie)
- Weld-01: 38 000 zł (1 awaria)
- Press-B: 35 000 zł (1 awaria)
```

---

### Średni MTBF (Mean Time Between Failures)
**Definicja:** Średni czas między awariami (w godzinach)

**Wzór:**
```
MTBF = (Całkowity czas pracy - Czas napraw) / Liczba awarii
```

**Interpretacja:**
- Wysoki MTBF (>1000h) → niezawodna maszyna
- Niski MTBF (<500h) → częste awarie, rozważ wymianę
- Benchmark przemysłowy: 720h (30 dni)

**Przykład:**
```
CNC-01: MTBF = 850h (dobry)
CNC-03: MTBF = 320h (ZŁY - częste awarie!)
Weld-01: MTBF = 420h (średni)
```

---

### Średni MTTR (Mean Time To Repair)
**Definicja:** Średni czas naprawy (w minutach)

**Wzór:**
```
MTTR = Σ (czas przestoju) / Liczba awarii
```

**Interpretacja:**
- Niski MTTR (<120 min) → sprawna konserwacja
- Wysoki MTTR (>360 min) → złożone awarie lub braki zasobów
- Cel: minimalizacja MTTR poprzez lepsze przygotowanie

**Przykład:**
```
Średni MTTR: 245 min
- Mechanical: 180 min
- Electrical: 340 min (wymaga specjalistów)
- Hydraulic: 220 min
```

---

### Koszt wymian
**Definicja:** Suma kosztów wymian zalecanych maszyn

**Jak obliczane:**
Maszyny z wysokim priorytetem wymiany (score >70)

**Interpretacja:**
- Planowanie budżetu inwestycyjnego
- Priorytetyzacja wymian
- Analiza ROI: koszt wymiany vs koszt awarii

**Przykład:**
```
Zalecane wymiany:
- CNC-03: 500 000 zł (score: 78)
- Weld-01: 620 000 zł (score: 72)
Razem: 1 120 000 zł
```

---

## 2. Rekomendacje Wymian Maszyn

### Algorytm oceny (Replacement Score)

**Składniki oceny (0-100 każdy):**

1. **Wiek maszyny (25%)**
   ```
   Wiek Score = (Wiek / Oczekiwana żywotność) × 100

   Przykład:
   CNC-03: 8 lat / 10 lat = 80/100
   ```

2. **Częstotliwość awarii (35%)**
   ```
   Awarie Score = min(100, Awarie/miesiąc × 20)

   5 awarii/miesiąc = 100/100
   2 awarie/miesiąc = 40/100
   ```

3. **Koszty awarii (25%)**
   ```
   Koszt Score = min(100, (Koszt awarii / Koszt wymiany) × 100)

   Przykład:
   Awarie: 150 000 zł
   Wymiana: 500 000 zł
   Score: 30/100
   ```

4. **Niezawodność - MTBF (15%)**
   ```
   Niezawodność Score = MTBF < 720h ? 100 : max(0, 100 - (MTBF/720) × 100)

   MTBF 320h = 100/100 (zła niezawodność)
   MTBF 850h = 0/100 (dobra niezawodność)
   ```

**Całkowity Score:**
```
Score = Wiek×0.25 + Awarie×0.35 + Koszt×0.25 + Niezawodność×0.15
```

### Rekomendacje:

| Score | Rekomendacja | Działanie |
|-------|-------------|-----------|
| 70-100 | **Zalecana wymiana** | Zaplanuj wymianę w ciągu 3-6 miesięcy |
| 50-69 | **Rozważ wymianę** | Monitoruj i planuj budżet |
| 30-49 | **Monitoruj stan** | Kontynuuj rutynową konserwację |
| 0-29 | **W dobrym stanie** | Brak działań |

### Przykład analizy:

```
CNC-03 - Score: 78/100
├─ Wiek: 80/100 (8 lat / 10 lat oczekiwanych)
├─ Awarie: 100/100 (5 awarii/miesiąc - KRYTYCZNE!)
├─ Koszt: 30/100 (150k awarie vs 500k wymiana)
└─ Niezawodność: 100/100 (MTBF 320h << 720h)

REKOMENDACJA: Zalecana wymiana
UZASADNIENIE: Bardzo częste awarie (5/miesiąc), niska niezawodność
KOSZT WYMIANY: 500 000 zł
POTENCJALNE OSZCZĘDNOŚCI: 180 000 zł/rok (uniknięte awarie)
ROI: ~2.8 lat
```

---

## 3. Najbardziej Problematyczne Procesy

### Co pokazuje?
Top 5 procesów produkcyjnych, które powodują najwięcej awarii.

### Metryki dla każdego procesu:

1. **Liczba awarii**
   - Ile razy proces spowodował awarię
   - Im więcej, tym bardziej ryzykowny proces

2. **Liczba dotkniętych maszyn**
   - Na ilu maszynach proces powoduje problemy
   - Jeśli >1, problem może być w procesie, nie maszynie

3. **Całkowity przestój (godziny)**
   - Suma czasu napraw dla tego procesu
   - Wpływ na produktywność

4. **Całkowity koszt**
   - Suma kosztów awarii
   - Bezpośredni wpływ na budżet

### Analiza i działania:

**Przykład:**
```
#1 Spawanie ram
├─ Awarie: 4
├─ Maszyny: 1 (Weld-01)
├─ Przestój: 20h
└─ Koszt: 64 000 zł

DIAGNOZA: Problem z konkretną maszyną (Weld-01)
DZIAŁANIE: Wymiana Weld-01 lub zmiana procesu
```

vs

```
#2 Frezowanie felg
├─ Awarie: 3
├─ Maszyny: 2 (CNC-01, CNC-03)
├─ Przestój: 8h
└─ Koszt: 43 000 zł

DIAGNOZA: Problem z procesem (dotyka 2 maszyny)
DZIAŁANIE:
- Optymalizacja parametrów frezowania
- Lepsze narzędzia skrawające
- Szkolenie operatorów
```

### Optymalizacja procesów:

1. **Proces dotyka 1 maszynę** → problem maszyny
   - Konserwacja/wymiana maszyny
   - Kalibracja

2. **Proces dotyka >1 maszyny** → problem procesu
   - Optymalizacja parametrów
   - Lepsze materiały/narzędzia
   - Szkolenie operatorów
   - Redesign procesu

---

## 4. Korelacja Typ Maszyny - Typ Awarii

### Co pokazuje?
Wykres pokazujący, jakie typy awarii występują najczęściej na jakich typach maszyn.

### Typy awarii:

1. **Mechanical** (mechaniczne)
   - Zużycie łożysk, pęknięcia, awarie przekładni
   - Typowe dla: CNC, prasy
   - Zapobieganie: regularna konserwacja, wymiana części

2. **Electrical** (elektryczne)
   - Przepalenia, awarie sterowników, problemy z silnikami
   - Typowe dla: spawarki, lasery
   - Zapobieganie: monitoring napięcia, termografia

3. **Hydraulic** (hydrauliczne)
   - Wycieki, awarie pomp, problemy z ciśnieniem
   - Typowe dla: prasy
   - Zapobieganie: wymiana uszczelnień, kontrola czystości oleju

4. **Software** (programowe)
   - Błędy programów, problemy z NC
   - Typowe dla: CNC, roboty
   - Zapobieganie: aktualizacje, backup programów

### Przykładowa analiza:

```
CNC Lathe + Mechanical: 5 awarii
├─ Średni przestój: 280 min
├─ Koszt: 89 000 zł
└─ WNIOSEK: CNC Lathe szczególnie podatne na awarie mechaniczne

DZIAŁANIE:
- Zwiększona częstotliwość konserwacji
- Monitoring wibracji
- Proaktywna wymiana łożysk

Robotic Welder + Electrical: 3 awarie
├─ Średni przestój: 360 min
├─ Koszt: 74 000 zł
└─ WNIOSEK: Spawarki mają problemy z elektroniką

DZIAŁANIE:
- UPS dla stabilizacji napięcia
- Monitoring temperatury inwerterów
- Umowy serwisowe z elektronikami
```

### Wykorzystanie danych:

1. **Planowanie konserwacji**
   - Dostosuj typ konserwacji do typowych awarii
   - Przygotuj odpowiednie części zamienne

2. **Szkolenia**
   - Przeszkol operatorów w rozpoznawaniu symptomów
   - CNC → wibracje, spawarki → elektryka

3. **Zakupy**
   - Wybieraj maszyny z lepsza niezawodnością w problemowych obszarach
   - Np. CNC z wzmocnionymi łożyskami

---

## Przykładowe Scenariusze Użycia

### Scenariusz 1: Planowanie budżetu rocznego

**Pytanie:** Ile przeznaczyć na wymianę maszyn w 2026?

**Działania:**
1. Ustaw widok: **Zarząd**
2. Ustaw przedział: **Ostatnie 6 miesięcy**
3. Zobacz sekcję "Rekomendacje Wymian"
4. Zsumuj koszty wymianelement z priority "high" i "medium"

**Wynik:**
```
High priority: 1 120 000 zł (2 maszyny)
Medium priority: 670 000 zł (2 maszyny)
Rezerwa bezpieczeństwa: +15% = 206 000 zł
───────────────────────────────────────
BUDŻET 2026: ~2 000 000 zł
```

---

### Scenariusz 2: Optymalizacja procesu produkcyjnego

**Pytanie:** Dlaczego "Spawanie ram" powoduje tyle problemów?

**Działania:**
1. Widok: **Zarząd**
2. Sprawdź "Najbardziej Problematyczne Procesy"
3. Zobacz "Spawanie ram" na liście
4. Przejdź do "Korelacja Typ Maszyny - Typ Awarii"
5. Znajdź "Robotic Welder + Electrical"

**Analiza:**
```
Spawanie ram:
- 4 awarie na Weld-01
- Wszystkie typu "Electrical"
- Średni MTTR: 360 min (długie naprawy!)
- Koszt: 64 000 zł

DIAGNOZA:
Problem z elektroniką w Weld-01 podczas spawania ram
(spawanie ram = wysokie obciążenie → przegrzewanie inwertera)

DZIAŁANIA:
1. Krótkoterminowe:
   - Monitoring temperatury podczas spawania ram
   - Częstsze przerwy dla ochłodzenia

2. Średnioterminowe:
   - Upgrade systemu chłodzenia Weld-01
   - Transfer procesu na Weld-02 (nowszą maszynę)

3. Długoterminowe:
   - Wymiana Weld-01 (score: 72/100)
   - Nowa spawarka z lepszym inverterem
```

**ROI:**
```
Koszt upgrade chłodzenia: 50 000 zł
Uniknięte awarie (szacunek): 2/rok × 16 000 zł = 32 000 zł/rok
ROI: ~1.6 lat

vs

Koszt wymiany: 620 000 zł
Uniknięte awarie: 4/rok × 16 000 zł = 64 000 zł/rok
+ Oszczędności konserwacji: 20 000 zł/rok
ROI: ~7.4 lat

DECYZJA: Upgrade chłodzenia (lepszy ROI)
```

---

### Scenariusz 3: Uzasadnienie inwestycji dla zarządu

**Pytanie:** Czy opłaca się wymienić CNC-03?

**Działania:**
1. Widok: **Zarząd**
2. Znajdź CNC-03 w "Rekomendacje Wymian"
3. Sprawdź wskaźniki

**Analiza:**
```
CNC-03 - Replacement Score: 78/100

Składniki:
├─ Wiek: 80/100 (8 lat, blisko końca żywotności)
├─ Awarie: 100/100 (5 awarii/miesiąc - EKSTREMALNE!)
├─ Koszt: 30/100 (ale ~150k zł w 6 miesięcy)
└─ Niezawodność: 100/100 (MTBF 320h << norma 720h)

Koszty awarii (6 miesięcy): 150 000 zł
Projekcja roczna: 300 000 zł
Koszt wymiany: 500 000 zł

ANALIZA ROI:
Rok 1: -500 000 zł (inwestycja) + 300 000 zł (oszczędności) = -200 000 zł
Rok 2: +300 000 zł
Rok 3: +300 000 zł
───────────────────────────────────────
Zwrot inwestycji: 1.7 roku
Oszczędności 5 lat: 1 000 000 zł

DODATKOWE KORZYŚCI:
+ Lepsza jakość produkcji (mniej defektów)
+ Wyższa produktywność (nowa maszyna szybsza)
+ Mniej stresu dla operatorów

REKOMENDACJA: WYMIENIAĆ NATYCHMIAST!
```

---

## Najlepsze Praktyki

### Dla Kierowników Produkcji:

1. **Codziennie:**
   - Sprawdź status maszyn (widok Operator/Kierownik)
   - Reaguj na alerty wysokiego ryzyka

2. **Co tydzień:**
   - Przejrzyj predykcje AI
   - Zaplanuj konserwację prewencyjną

3. **Co miesiąc:**
   - Analiza MTBF/MTTR (widok Zarząd)
   - Identyfikacja trendów
   - Raport dla kierownictwa

### Dla Zarządu:

1. **Co kwartał:**
   - Review rekomendacji wymian
   - Analiza problematycznych procesów
   - Planowanie budżetu

2. **Co rok:**
   - Strategia inwestycji w maszyny
   - Analiza ROI poprzednich wymian
   - Optymalizacja portfela maszyn

---

## FAQ

**Q: Dlaczego moja maszyna ma wysokie score wymiany mimo niskich kosztów awarii?**
A: Score uwzględnia też wiek i MTBF. Stara maszyna z niskim MTBF może mieć wysokie score, nawet jeśli dotychczasowe koszty są niskie - ryzyko katastrofalnej awarii rośnie.

**Q: Co zrobić gdy proces ma wysoką częstotliwość awarii na wielu maszynach?**
A: To wskazuje na problem z procesem, nie maszynami. Optymalizuj parametry procesu, sprawdź narzędzia/materiały, przeszkol operatorów.

**Q: Czy mogę zmienić wagi w algorytmie replacement score?**
A: Tak - edytuj plik `js/analytics-data.js`, funkcja `calculateReplacementScore()`.

**Q: Jak często aktualizują się dane?**
A: Dashboard aktualizuje się co 5 sekund. Dane historyczne są statyczne (demo).

---

**Dashboard gotowy do użycia! Powodzenia w optymalizacji produkcji! 🏭📊**
