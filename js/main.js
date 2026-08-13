document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            projectCards.forEach((card) => {
                card.classList.toggle('is-hidden', filter !== 'all' && !card.dataset.category.split(' ').includes(filter));
            });
        });
    });

    // A compact contribution-style heatmap that links to Shiv's GitHub profile.
    const contributionGrid = document.getElementById('contribution-grid');
    if (contributionGrid) {
        const activitySeed = [0, 0, 1, 0, 2, 1, 0, 0, 3, 1, 0, 2, 0, 1, 4, 2, 0, 1, 3, 0, 2, 1, 0, 3, 1, 4, 2, 0, 1, 3, 0, 2, 4, 1, 0, 2, 3, 0, 1, 4, 2, 0, 1, 3, 0, 2, 1, 4, 0, 2, 3, 1];
        activitySeed.forEach((level, week) => {
            for (let day = 0; day < 7; day += 1) {
                const square = document.createElement('i');
                const variation = (week * 3 + day * 5) % 7;
                const activity = variation < 2 ? 0 : Math.max(0, level - (variation % 3));
                square.dataset.level = activity;
                contributionGrid.appendChild(square);
            }
        });
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
        navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navMenu.classList.remove('open')));
    }
});
