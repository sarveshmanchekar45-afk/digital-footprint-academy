const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    document.querySelectorAll('a[href]').forEach((link) => {
        const destination = new URL(link.href, window.location.href);
        const isInternalPage = destination.origin === window.location.origin
            && destination.pathname !== window.location.pathname
            && !link.hasAttribute('download')
            && link.target !== '_blank';

        if (!isInternalPage) {
            return;
        }

        link.addEventListener('click', (event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            event.preventDefault();
            document.body.classList.add('page-leaving');
            window.setTimeout(() => {
                window.location.href = link.href;
            }, 220);
        });
    });
}
