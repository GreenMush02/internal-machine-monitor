// Component Loader System
// Dynamiczne ładowanie komponentów HTML

/**
 * Ładuje komponent HTML i wstawia go do wskazanego elementu
 * @param {string} componentPath - Ścieżka do pliku HTML komponentu
 * @param {string} targetSelector - Selektor CSS elementu docelowego
 * @returns {Promise<void>}
 */
async function loadComponent(componentPath, targetSelector) {
    try {
        const response = await fetch(componentPath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const targetElement = document.querySelector(targetSelector);

        if (!targetElement) {
            throw new Error(`Target element not found: ${targetSelector}`);
        }

        targetElement.innerHTML = html;
        console.log(`✓ Załadowano komponent: ${componentPath}`);

    } catch (error) {
        console.error(`✗ Błąd ładowania komponentu ${componentPath}:`, error);
        throw error;
    }
}

/**
 * Ładuje wszystkie komponenty aplikacji
 * @returns {Promise<void>}
 */
async function loadAllComponents() {
    console.log('Ładowanie komponentów...');

    try {
        // Ładuj komponenty równolegle dla lepszej wydajności
        await Promise.all([
            loadComponent('components/header/header.html', '#app-header'),
            loadComponent('components/modals/alert-banner.html', '#alert-container'),
            loadComponent('components/sections/dashboard.html', '#section-dashboard-container'),
            loadComponent('components/sections/analytics.html', '#section-analytics-container'),
            loadComponent('components/sections/management.html', '#section-management-container'),
            loadComponent('components/modals/machine-modal.html', '#modal-container')
        ]);

        console.log('✓ Wszystkie komponenty załadowane');

        // Wywołaj event że komponenty są gotowe
        document.dispatchEvent(new Event('componentsLoaded'));

    } catch (error) {
        console.error('✗ Błąd ładowania komponentów:', error);
        // Pokaż użytkownikowi informację o błędzie
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0f172a; color: #fff; font-family: system-ui;">
                <div style="text-align: center;">
                    <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Błąd ładowania aplikacji</h1>
                    <p style="color: #94a3b8;">Sprawdź konsolę przeglądarki aby zobaczyć szczegóły.</p>
                    <button onclick="location.reload()" style="margin-top: 2rem; padding: 0.75rem 1.5rem; background: #2563eb; border: none; border-radius: 0.5rem; color: white; cursor: pointer;">
                        Odśwież stronę
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Inicjalizuje ładowanie komponentów po załadowaniu DOM
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllComponents();
});
