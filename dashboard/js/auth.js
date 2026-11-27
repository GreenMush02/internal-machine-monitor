// Authentication & Authorization Module
// Role-based access control

const USER_ROLES = {
    OPERATOR: 'operator',
    MANAGER: 'manager',
    OWNER: 'owner'
};

const PERMISSIONS = {
    // Dashboard - wszyscy
    VIEW_DASHBOARD: ['operator', 'manager', 'owner'],
    VIEW_MACHINES: ['operator', 'manager', 'owner'],
    REPORT_FAILURE: ['operator', 'manager', 'owner'],

    // Analytics - kierownik i właściciel
    VIEW_ANALYTICS: ['manager', 'owner'],
    VIEW_PREDICTIONS: ['manager', 'owner'],
    VIEW_CHARTS: ['manager', 'owner'],

    // Management - tylko właściciel
    VIEW_MANAGEMENT: ['owner'],
    VIEW_FINANCIALS: ['owner'],
    VIEW_REPLACEMENTS: ['owner'],
    APPROVE_PURCHASES: ['owner']
};

class AuthManager {
    constructor() {
        // Demo: symulacja zalogowanego użytkownika
        // W produkcji: pobierz z localStorage lub API
        this.currentUser = this.loadUser();
    }

    loadUser() {
        try {
            const savedUser = localStorage.getItem('smartflow_user');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                if (user && typeof user.name === 'string' &&
                    Object.values(USER_ROLES).includes(user.role)) {
                    return user;
                }
            }
        } catch (error) {
            if (!(error instanceof SyntaxError) && !(error instanceof DOMException)) throw error;
        }

        // Domyślnie: operator
        return {
            id: 1,
            name: 'Jan Kowalski',
            role: USER_ROLES.OPERATOR,
            email: 'jan.kowalski@example.com',
            avatar: null
        };
    }

    saveUser(user) {
        try {
            localStorage.setItem('smartflow_user', JSON.stringify(user));
        } catch (error) {
            if (!(error instanceof DOMException)) throw error;
            return false;
        }
        this.currentUser = user;
        return true;
    }

    login(role, name = null) {
        const users = {
            operator: {
                id: 1,
                name: name || 'Jan Kowalski',
                role: USER_ROLES.OPERATOR,
                email: 'operator@example.com'
            },
            manager: {
                id: 2,
                name: name || 'Anna Nowak',
                role: USER_ROLES.MANAGER,
                email: 'manager@example.com'
            },
            owner: {
                id: 3,
                name: name || 'Piotr Wiśniewski',
                role: USER_ROLES.OWNER,
                email: 'owner@example.com'
            }
        };

        if (Object.hasOwn(users, role) && this.saveUser(users[role])) {
            window.location.reload();
        }
    }

    logout() {
        try {
            localStorage.removeItem('smartflow_user');
        } catch (error) {
            if (!(error instanceof DOMException)) throw error;
            return;
        }
        this.currentUser = this.loadUser();
        window.location.reload();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getCurrentRole() {
        return this.currentUser.role;
    }

    hasPermission(permission) {
        const allowedRoles = PERMISSIONS[permission];
        if (!allowedRoles) return false;
        return allowedRoles.includes(this.currentUser.role);
    }

    canAccessSection(sectionId) {
        const sectionPermissions = {
            'dashboard': 'VIEW_DASHBOARD',
            'analytics': 'VIEW_ANALYTICS',
            'management': 'VIEW_MANAGEMENT'
        };

        const permission = sectionPermissions[sectionId];
        return permission ? this.hasPermission(permission) : false;
    }

    getAvailableSections() {
        const sections = [
            {
                id: 'dashboard',
                name: 'Dashboard',
                icon: 'fa-tachometer-alt',
                permission: 'VIEW_DASHBOARD'
            },
            {
                id: 'analytics',
                name: 'Analityka',
                icon: 'fa-chart-line',
                permission: 'VIEW_ANALYTICS'
            },
            {
                id: 'management',
                name: 'Zarządzanie',
                icon: 'fa-briefcase',
                permission: 'VIEW_MANAGEMENT'
            }
        ];

        return sections.filter(section =>
            this.hasPermission(section.permission)
        );
    }

    getRoleName(role = null) {
        const roleNames = {
            operator: 'Operator',
            manager: 'Kierownik',
            owner: 'Właściciel'
        };
        return roleNames[role || this.currentUser.role];
    }

    getRoleColor(role = null) {
        const roleColors = {
            operator: 'bg-blue-500',
            manager: 'bg-green-500',
            owner: 'bg-purple-500'
        };
        return roleColors[role || this.currentUser.role];
    }
}

// Global instance
const authManager = new AuthManager();
