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
    const userReservationsSection = document.getElementById('user-reservations-section');
    const userEventsSection = document.getElementById('user-events-section');
    const userReservationList = document.getElementById('user-reservation-list');
    const userEventList = document.getElementById('user-event-list');
    const adminCreateForm = document.getElementById('admin-create-form');
    const adminEventList = document.getElementById('admin-event-list');
    const adminReservationList = document.getElementById('admin-reservation-list');
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

    const hideUserSections = () => {
        [userReservationsSection, userEventsSection].forEach((section) => section?.classList.remove('is-visible'));
    };

    const openPanel = (panel) => {
        hideAllPanels();
        hideDefaultPanel();
        hideUserSections();
        adminCreateForm?.classList.remove('is-visible');

        if (panel) {
            panel.classList.add('is-visible');
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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

    const renderUserReservations = (reservations) => {
        if (!userReservationList) {
            return;
        }

        if (!reservations.length) {
            userReservationList.innerHTML = '<div class="reservation-item"><p class="meta-text">Aucune reservation enregistree.</p></div>';
            return;
        }

        userReservationList.innerHTML = reservations.map((reservation) => `
            <article class="reservation-item">
                <h4>${reservation.event}</h4>
                <p class="meta-text">Reserve le ${reservation.date_reserved}</p>
                <div class="admin-card-actions mt-3">
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        data-action="delete-my-reservation"
                        data-reservation-id="${reservation.id}"
                    >
                        Supprimer
                    </button>
                </div>
            </article>
        `).join('');
    };

    const renderUserEvents = (events) => {
        if (!userEventList) {
            return;
        }

        if (!events.length) {
            userEventList.innerHTML = '<div class="event-item"><p class="meta-text">Aucun evenement disponible.</p></div>';
            return;
        }

        userEventList.innerHTML = events.map((event) => `
            <article class="event-item">
                <h4>${event.name}</h4>
                <p class="meta-text">${event.description}</p>
                <p class="meta-text">${event.date} | ${event.location}</p>
                <div class="admin-card-actions mt-3">
                    <button
                        type="button"
                        class="btn btn-sm btn-primary"
                        data-action="reserve-event"
                        data-event-id="${event.id}"
                    >
                        Reserver
                    </button>
                </div>
            </article>
        `).join('');
    };

    const renderAdminEvents = (events) => {
        if (!adminEventList) {
            return;
        }

        if (!events.length) {
            adminEventList.innerHTML = '<div class="admin-event-card"><p class="meta-text">Aucun evenement disponible.</p></div>';
            return;
        }

        adminEventList.innerHTML = events.map((event) => `
            <article class="admin-event-card">
                <h4>${event.name}</h4>
                <p class="meta-text">${event.description}</p>
                <p class="meta-text">${event.date} | ${event.location}</p>
                <div class="admin-card-actions">
                    <button type="button" class="btn btn-sm btn-primary" data-action="edit-event" data-event-id="${event.id}" data-name="${event.name}" data-description="${event.description}" data-date="${event.date}" data-location="${event.location}">Modifier</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete-event" data-event-id="${event.id}">Supprimer</button>
                </div>
            </article>
        `).join('');
    };

    const renderAdminReservations = (reservations) => {
        if (!adminReservationList) {
            return;
        }

        if (!reservations.length) {
            adminReservationList.innerHTML = '<div class="admin-reservation-card"><p class="meta-text">Aucune reservation disponible.</p></div>';
            return;
        }

        adminReservationList.innerHTML = reservations.map((reservation) => `
            <article class="admin-reservation-card">
                <h4>${reservation.event}</h4>
                <p class="meta-text">Utilisateur #${reservation.user_id}</p>
                <p class="meta-text">${reservation.date_reserved}</p>
            </article>
        `).join('');
    };

    const loadUserData = async () => {
        const [reservations, events] = await Promise.all([
            apiRequest('/api/reservations/my'),
            apiRequest('/api/events'),
        ]);

        renderUserReservations(reservations);
        renderUserEvents(events);
    };

    const loadAdminData = async () => {
        const [events, reservations] = await Promise.all([
            apiRequest('/api/events'),
            apiRequest('/api/reservations'),
        ]);

        renderAdminEvents(events);
        renderAdminReservations(reservations);
    };

    const openDashboardFromToken = async (token) => {
        const payload = decodeJwtPayload(token);
        const roles = Array.isArray(payload?.roles) ? payload.roles : [];
        const isAdmin = roles.includes('ROLE_ADMIN');

        hideAllPanels();
        hideDefaultPanel();
        hideUserSections();
        clearFeedback();

        if (isAdmin) {
            adminDashboard?.classList.add('is-visible');
            await loadAdminData();
            showFeedback('Connexion reussie. Dashboard admin charge.', 'success');
            return;
        }

        userDashboard?.classList.add('is-visible');
        await loadUserData();
        showFeedback('Connexion reussie. Dashboard utilisateur charge.', 'success');
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
        await openDashboardFromToken(response.token);
    });

    if (adminCreateForm) {
        adminCreateForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearFeedback();
            const formData = new FormData(adminCreateForm);
            const data = Object.fromEntries(formData.entries());
            const editId = adminCreateForm.dataset.editId;

            try {
                await apiRequest(editId ? `/api/events/${editId}` : '/api/events', {
                    method: editId ? 'PUT' : 'POST',
                    body: JSON.stringify(data),
                });

                adminCreateForm.reset();
                delete adminCreateForm.dataset.editId;
                adminCreateForm.classList.remove('is-visible');
                await loadAdminData();
                showFeedback(editId ? 'Evenement modifie avec succes.' : 'Evenement ajoute avec succes.', 'success');
            } catch (error) {
                showFeedback(error.message, 'error');
            }
        });
    }

    document.addEventListener('click', async (event) => {
        const button = event.target.closest('button');

        if (!button) {
            return;
        }

        const action = button.dataset.action;
        const eventId = button.dataset.eventId;
        const reservationId = button.dataset.reservationId;

        try {
            if (action === 'show-register') {
                clearFeedback();
                openPanel(registerPanel);
            }

            if (action === 'show-login') {
                clearFeedback();
                openPanel(loginPanel);
            }

            if (action === 'show-my-reservations') {
                userReservationsSection?.classList.add('is-visible');
                userEventsSection?.classList.remove('is-visible');
                await loadUserData();
            }

            if (action === 'show-events') {
                userEventsSection?.classList.add('is-visible');
                userReservationsSection?.classList.remove('is-visible');
                await loadUserData();
            }

            if (action === 'reserve-event' && eventId) {
                await apiRequest('/api/reservations', {
                    method: 'POST',
                    body: JSON.stringify({
                        event_id: Number(eventId),
                    }),
                });
                await loadUserData();
                userReservationsSection?.classList.add('is-visible');
                userEventsSection?.classList.remove('is-visible');
                showFeedback('Reservation ajoutee a votre espace avec succes.', 'success');
            }

            if (action === 'delete-my-reservation' && reservationId) {
                await apiRequest(`/api/reservations/my/${reservationId}`, {
                    method: 'DELETE',
                });
                await loadUserData();
                userReservationsSection?.classList.add('is-visible');
                userEventsSection?.classList.remove('is-visible');
                showFeedback('Reservation supprimee avec succes.', 'success');
            }

            if (action === 'show-admin-create') {
                adminCreateForm?.classList.add('is-visible');
                adminCreateForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (action === 'load-admin-data') {
                await loadAdminData();
                showFeedback('Donnees admin rechargees.', 'success');
            }

            if (action === 'edit-event' && adminCreateForm) {
                adminCreateForm.classList.add('is-visible');
                adminCreateForm.dataset.editId = eventId;
                adminCreateForm.querySelector('[name="name"]').value = button.dataset.name || '';
                adminCreateForm.querySelector('[name="description"]').value = button.dataset.description || '';
                adminCreateForm.querySelector('[name="location"]').value = button.dataset.location || '';
                adminCreateForm.querySelector('[name="date"]').value = (button.dataset.date || '').replace(' ', 'T');
                adminCreateForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (action === 'delete-event' && eventId) {
                await apiRequest(`/api/events/${eventId}`, {
                    method: 'DELETE',
                });
                await loadAdminData();
                showFeedback('Evenement supprime avec succes.', 'success');
            }

            if (action === 'logout') {
                saveToken(null);
                hideAllPanels();
                hideUserSections();
                adminCreateForm?.classList.remove('is-visible');
                showDefaultPanel();
                showFeedback('Vous avez ete deconnecte.', 'info');
            }
        } catch (error) {
            showFeedback(error.message, 'error');
        }
    });

    const token = getToken();

    if (token) {
        openDashboardFromToken(token).catch((error) => {
            saveToken(null);
            showDefaultPanel();
            showFeedback(error.message, 'error');
        });
    } else {
        showDefaultPanel();
    }
}
