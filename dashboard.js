const dashboardTabs = document.querySelectorAll('.dashboard-tab');
const dashboardSections = document.querySelectorAll('.dashboard-summary, .dashboard-panel');

function selectDashboardTab(tab, shouldScroll = true) {
    const targetId = tab.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);

    if (!target) {
        return;
    }

    dashboardTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle('active', isActive);
        if (isActive) {
            item.setAttribute('aria-current', 'page');
        } else {
            item.removeAttribute('aria-current');
        }
    });

    if (shouldScroll) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${targetId}`);
    }
}

dashboardTabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
        event.preventDefault();
        selectDashboardTab(tab);
    });
});

const initialTarget = window.location.hash
    ? document.querySelector(`.dashboard-tab[href="${window.location.hash}"]`)
    : dashboardTabs[0];

if (initialTarget) {
    selectDashboardTab(initialTarget, false);
}

const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (!visibleSection) {
        return;
    }

    const matchingTab = document.querySelector(`.dashboard-tab[href="#${visibleSection.target.id}"]`);
    if (matchingTab) {
        selectDashboardTab(matchingTab, false);
    }
}, { rootMargin: '-18% 0px -65% 0px', threshold: [0.1, 0.35, 0.6] });

dashboardSections.forEach((section) => sectionObserver.observe(section));
