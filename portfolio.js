document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const sectionHeaders = document.querySelectorAll('.portfolio-section-header');
    const paginationContainer = document.getElementById('pagination');
    const itemsPerPage = 6;
    let currentCategory = 'all';
    let currentPage = 1;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        observer.observe(item);
    });

    const style = document.createElement('style');
    style.textContent = `
        .portfolio-item { transition: opacity 0.3s ease, transform 0.3s ease; }
        .fade-in { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(style);

    function itemMatchesCategory(item, category) {
        if (category === 'all') return true;
        const categories = (item.dataset.category || '').split(' ');
        return categories.includes(category);
    }

    function getVisibleItems() {
        return Array.from(portfolioItems).filter(item => itemMatchesCategory(item, currentCategory));
    }

    function renderPagination(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `pagination-btn w-10 h-10 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                i === currentPage ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                showPage();
            });
            paginationContainer.appendChild(btn);
        }
    }

    function showPage() {
        const visibleItems = getVisibleItems();
        const totalPages = Math.ceil(visibleItems.length / itemsPerPage) || 1;

        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        portfolioItems.forEach(item => {
            const index = visibleItems.indexOf(item);
            const isVisible = index >= 0 && index >= start && index < end;

            if (itemMatchesCategory(item, currentCategory) && isVisible) {
                item.style.display = 'block';
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.display = 'none';
            }
        });

        renderPagination(totalPages);

        sectionHeaders.forEach(header => {
            const headerCategories = (header.dataset.category || 'fivem tiktok').split(' ');
            const showHeader = currentCategory === 'all' || headerCategories.includes(currentCategory);
            header.style.display = showHeader ? 'block' : 'none';
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-100', 'hover:bg-gray-200');
            });
            button.classList.remove('bg-gray-100', 'hover:bg-gray-200');
            button.classList.add('bg-primary', 'text-white');

            currentCategory = button.dataset.category;
            currentPage = 1;
            showPage();
        });
    });

    showPage();
});

// Premium reveal-on-scroll motion
window.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.portfolio-item, .contact-card, .portfolio-header h1, .portfolio-header p');
    targets.forEach((el, index) => {
        el.classList.add('reveal-premium');
        el.style.transitionDelay = `${Math.min((index % 3) * 70, 140)}ms`;
    });
    const observerPremium = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observerPremium.unobserve(entry.target);
            }
        });
    }, { threshold: .08 });
    targets.forEach(el => observerPremium.observe(el));
});
