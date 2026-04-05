import './stimulus_bootstrap.js';
import './styles/app.css';

const appRoot = document.querySelector('[data-app-root]');

if (appRoot) {
    const feedback = document.getElementById('app-feedback');
    const registerPanel = document.getElementById('register-panel');
    const loginPanel = document.getElementById('login-panel');
    const userDashboard = document.getElementById('user-dashboard');
    const adminDashboard = document.getElementById('admin-dashboard');
    const defaultPanel = document.getElementById('default-panel');
    const storageKey = 'event_reservation_jwt';

    const getToken = () => window.localStorage.getItem(storageKey);

    const saveToken = (token) => {
        if (token) {
            window.localStorage.setItem(storageKey, token);
        } else {
            window.localStorage.removeItem(storageKey);
        }
    };

    const decodeJwtPayload = (token) => {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        } catch (error) {
            return null;
        }
    };

    const showFeedback = (message, tone = 'info') => {
        if (!feedback) {
            return;
        }

        feedback.textContent = message;
        feedback.dataset.tone = tone;
        feedback.classList.add('is-visible');
    };

    const clearFeedback = () => {
        if (!feedback) {
            return;
        }

        feedback.textContent = '';
        feedback.classList.remove('is-visible');
    };

    const hideAllPanels = () => {
        [registerPanel, loginPanel, userDashboard, adminDashboard].forEach((panel) => {
            if (panel) {
                panel.classList.remove('is-visible');
            }
        });
    };

    const showDefaultPanel = () => {
        if (defaultPanel) {
            defaultPanel.style.display = 'block';
        }
    };

    const hideDefaultPanel = () => {
        if (defaultPanel) {
            defaultPanel.style.display = 'none';
        }
    };

    const openPanel = (panel) => {
        hideAllPanels();
        hideDefaultPanel();

        if (panel) {
            panel.classList.add('is-visible');
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const openDashboardFromToken = (token) => {
        const payload = decodeJwtPayload(token);
        const roles = Array.isArray(payload?.roles) ? payload.roles : [];
        const isAdmin = roles.includes('ROLE_ADMIN');

        hideAllPanels();
        hideDefaultPanel();
        clearFeedback();

        if (isAdmin) {
            adminDashboard?.classList.add('is-visible');
            adminDashboard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showFeedback('Connexion reussie. Dashboard admin charge.', 'success');
            return;
        }

        userDashboard?.classList.add('is-visible');
        userDashboard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showFeedback('Connexion reussie. Dashboard utilisateur charge.', 'success');
    };

    const apiRequest = async (url, options = {}) => {
        const token = getToken();
        const headers = new Headers(options.headers || {});

        if (!headers.has('Content-Type') && options.body) {
            headers.set('Content-Type', 'application/json');
        }

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        let payload = null;

        try {
            payload = await response.json();
        } catch (error) {
            payload = null;
        }

        if (!response.ok) {
            const message = payload?.message || payload?.error || 'Une erreur est survenue.';
            throw new Error(message);
        }

        return payload;
    };

    const submitJsonForm = (selector, handler) => {
        const form = document.querySelector(selector);

        if (!form) {
            return;
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearFeedback();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                await handler(data, form);
            } catch (error) {
                showFeedback(error.message, 'error');
            }
        });
    };

    submitJsonForm('[data-form="register"]', async (data, form) => {
        const endpoint = data.role === 'ROLE_ADMIN' ? '/api/registerAdmin' : '/api/register';

        await apiRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });

        form.reset();
        showFeedback('Inscription terminee. Vous pouvez maintenant vous connecter.', 'success');
        openPanel(loginPanel);
    });

    submitJsonForm('[data-form="login"]', async (data, form) => {
        const response = await apiRequest('/api/login_check', {
            method: 'POST',
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });

        saveToken(response.token);
        form.reset();
        openDashboardFromToken(response.token);
    });

    document.addEventListener('click', (event) => {
        const button = event.target.closest('button');

        if (!button) {
            return;
        }

        const action = button.dataset.action;

        if (action === 'show-register') {
            clearFeedback();
            openPanel(registerPanel);
        }

        if (action === 'show-login') {
            clearFeedback();
            openPanel(loginPanel);
        }

        if (action === 'logout') {
            saveToken(null);
            hideAllPanels();
            showDefaultPanel();
            showFeedback('Vous avez ete deconnecte.', 'info');
        }
    });

    const token = getToken();

    if (token) {
        openDashboardFromToken(token);
    } else {
        showDefaultPanel();
    }
}
