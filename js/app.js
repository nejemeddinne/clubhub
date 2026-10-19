const events = [
    {
        title: 'Atelier Arduino pour débutants',
        club: 'Club Robotique',
        date: '2026-10-14T14:00',
        dateLabel: '14 octobre à 14 h',
        place: 'Salle B204',
        places: 20
    },
    {
        title: 'Sortie photo en ville',
        club: 'Club Photo',
        date: '2026-10-17T09:00',
        dateLabel: '17 octobre à 9 h',
        place: 'Entrée principale',
        places: 15
    },
    {
        title: "Conférence : l'IA dans l'industrie",
        club: 'Club IA',
        date: '2026-10-21T10:00',
        dateLabel: '21 octobre à 10 h',
        place: 'Amphithéâtre A',
        places: 120
    },
    {
        title: 'Tournoi blitz inter promo',
        club: 'Club Échecs',
        date: '2026-10-24T15:00',
        dateLabel: '24 octobre à 15 h',
        place: 'Foyer des étudiants',
        places: 32
    },
    {
        title: 'Hackathon impact social',
        club: 'Club Entrepreneuriat',
        date: '2026-10-31T09:00',
        dateLabel: '31 octobre à 9 h',
        place: 'Salle C101',
        places: 40
    }
];

const normalize = (value) => value
    .toLocaleLowerCase('fr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

function setupTheme() {
    const toggle = document.querySelector('.theme-toggle');
    const setTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('clubhub-theme', theme);
        if (toggle) toggle.textContent = theme === 'dark' ? 'Mode clair' : 'Mode sombre';
    };

    if (toggle) {
        setTheme(document.documentElement.dataset.theme || localStorage.getItem('clubhub-theme') || 'light');
        toggle.addEventListener('click', () => {
            setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
        });
    }
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('clubhub-favorites') || '[]');
}

function renderEvents() {
    const list = document.querySelector('#events-list');
    if (!list) return;

    const search = document.querySelector('#search');
    const clubFilter = document.querySelector('#club-filter');
    const favoritesOnly = document.querySelector('#favorites-only');
    const sort = document.querySelector('#sort');
    const count = document.querySelector('.results-count');
    const emptyMessage = document.querySelector('.empty-message');
    const clubs = [...new Set(events.map((event) => event.club))].sort((a, b) => a.localeCompare(b, 'fr'));

    if (clubFilter.options.length === 1) {
        clubs.forEach((club) => {
            const option = document.createElement('option');
            option.value = club;
            option.textContent = club;
            clubFilter.append(option);
        });
    }

    const makeCard = (event) => {
        const article = document.createElement('article');
        const favoriteButton = document.createElement('button');
        const isFavorite = getFavorites().includes(event.title);
        article.dataset.date = event.date;
        article.dataset.places = event.places;
        favoriteButton.className = 'favorite-toggle';
        favoriteButton.type = 'button';
        favoriteButton.textContent = isFavorite ? '★' : '☆';
        favoriteButton.title = isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
        favoriteButton.setAttribute('aria-label', favoriteButton.title);
        favoriteButton.setAttribute('aria-pressed', String(isFavorite));
        favoriteButton.addEventListener('click', () => {
            const favorites = getFavorites();
            const index = favorites.indexOf(event.title);
            if (index === -1) favorites.push(event.title);
            else favorites.splice(index, 1);
            localStorage.setItem('clubhub-favorites', JSON.stringify(favorites));
            renderEvents();
        });
        article.append(favoriteButton);

        const title = document.createElement('h3');
        title.textContent = event.title;
        article.append(title);
        article.insertAdjacentHTML('beforeend',
            `<p>Club : ${event.club}</p>
            <p>Date : <time datetime="${event.date}">${event.dateLabel}</time></p>
            <p>Lieu : ${event.place}</p>
            <p>Places : ${event.places}</p>
            <a href="evenement.html">Voir le détail</a>`);
        return article;
    };

    const update = () => {
        const query = normalize(search.value.trim());
        const favorites = getFavorites();
        const filtered = events.filter((event) => {
            const matchesSearch = normalize(`${event.title} ${event.club} ${event.place}`).includes(query);
            const matchesClub = !clubFilter.value || event.club === clubFilter.value;
            const matchesFavorites = !favoritesOnly.checked || favorites.includes(event.title);
            return matchesSearch && matchesClub && matchesFavorites;
        }).sort((a, b) => sort.value === 'places'
            ? b.places - a.places
            : new Date(a.date) - new Date(b.date));

        list.replaceChildren(...filtered.map(makeCard));
        const resultLabel = filtered.length === 1 ? 'événement affiché' : 'événements affichés';
        count.textContent = `${filtered.length} ${resultLabel}`;
        emptyMessage.hidden = filtered.length !== 0;
    };

    search.addEventListener('input', update);
    clubFilter.addEventListener('change', update);
    favoritesOnly.addEventListener('change', update);
    sort.addEventListener('change', update);
    update();
}

function setupRegistrationForm() {
    const form = document.querySelector('#inscription-form');
    if (!form) return;

    const fields = {
        nom: {
            element: form.querySelector('#nom-complet'),
            error: form.querySelector('#nom-error'),
            validate: (field) => field.value.trim().length >= 3,
            message: 'Le nom doit contenir au moins 3 caractères.'
        },
        email: {
            element: form.querySelector('#email'),
            error: form.querySelector('#email-error'),
            validate: (field) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()),
            message: 'Veuillez saisir une adresse e-mail valide.'
        },
        niveau: {
            element: form.querySelector('#niveau'),
            error: form.querySelector('#niveau-error'),
            validate: (field) => field.value !== '',
            message: 'Veuillez choisir un niveau d’études.'
        },
        reglement: {
            element: form.querySelector('#reglement'),
            error: form.querySelector('#reglement-error'),
            validate: (field) => field.checked,
            message: 'Vous devez accepter le règlement du club.'
        }
    };

    const showValidation = (field) => {
        const valid = field.validate(field.element);
        field.element.classList.toggle('is-invalid', !valid);
        field.element.setAttribute('aria-invalid', String(!valid));
        field.error.textContent = valid ? '' : field.message;
        return valid;
    };

    Object.values(fields).forEach((field) => {
        field.element.addEventListener('input', () => showValidation(field));
        field.element.addEventListener('change', () => showValidation(field));
    });

    const motivation = form.querySelector('#motivation');
    const motivationCount = form.querySelector('#motivation-count');
    const updateMotivationCount = () => {
        motivationCount.textContent = `${motivation.value.length} / 300`;
        motivationCount.classList.toggle('is-near-limit', motivation.value.length >= 270);
    };
    motivation.addEventListener('input', updateMotivationCount);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const validationResults = Object.values(fields).map(showValidation);
        if (validationResults.every(Boolean)) {
            form.querySelector('.form-success').hidden = false;
        } else {
            form.querySelector('.form-success').hidden = true;
            Object.values(fields).find((field, index) => !validationResults[index]).element.focus();
        }
    });
}

setupTheme();
renderEvents();
setupRegistrationForm();
