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

    // Live contribution data from the public GitHub contribution feed.
    const contributionGrid = document.getElementById('contribution-grid');
    const contributionStatus = document.getElementById('contribution-status');
    const contributionMonths = document.getElementById('contribution-months');

    function renderContributions(contributions) {
        const days = contributions.slice(-371);
        const paddedDays = [...Array(Math.max(0, 371 - days.length)).fill({ count: 0, date: '' }), ...days];
        const highestCount = Math.max(1, ...paddedDays.map((day) => day.count ?? day.contributionCount ?? 0));
        contributionGrid.innerHTML = '';

        paddedDays.forEach((day) => {
            const square = document.createElement('i');
            const count = day.count ?? day.contributionCount ?? 0;
            const level = count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((count / highestCount) * 4)));
            square.dataset.level = level;
            square.title = day.date ? `${count} contribution${count === 1 ? '' : 's'} on ${day.date}` : '';
            contributionGrid.appendChild(square);
        });

        if (contributionMonths && days.length) {
            const startDate = new Date(`${days[0].date}T00:00:00`);
            contributionMonths.innerHTML = '';
            for (let monthOffset = 0; monthOffset < 13; monthOffset += 1) {
                const month = new Date(startDate.getFullYear(), startDate.getMonth() + monthOffset, 1);
                const label = document.createElement('span');
                label.textContent = month.toLocaleString('en-US', { month: 'short' });
                contributionMonths.appendChild(label);
            }
        }
    }

    if (contributionGrid) {
        fetch('https://github-contributions-api.jogruber.de/v4/So-coder-ai?y=last')
            .then((response) => {
                if (!response.ok) throw new Error('Contribution feed unavailable');
                return response.json();
            })
            .then((data) => {
                if (!Array.isArray(data.contributions) || !data.contributions.length) throw new Error('No contribution data received');
                renderContributions(data.contributions);
                const total = data.total?.lastYear ?? data.contributions.reduce((sum, day) => sum + (day.count ?? day.contributionCount ?? 0), 0);
                contributionStatus.textContent = `${total} contributions in the last year`;
            })
            .catch(() => {
                contributionGrid.innerHTML = '';
                contributionStatus.textContent = 'Live GitHub activity is temporarily unavailable';
            });
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
        navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navMenu.classList.remove('open')));
    }
});
