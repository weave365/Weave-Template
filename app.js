/**
 * Weave 365 — Reseller Operating Platform
 * Interactive UX & Business Tools Logic
 * Includes GSAP & ScrollTrigger Animations inspired by Relate (https://www.relate.so/)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMarginCalculator();
  initCuratedProducts();
  initWhiteLabelSimulator();
  initFaqAccordion();
  initMobileNav();
  initSearchModal();
  initActionToasts();
  initGsapAnimations();
});

/* ==========================================================================
   00. GSAP & SCROLLTRIGGER ANIMATIONS (RELATE INSPIRED)
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. HERO ENTRANCE TIMELINE (Smooth Relate-Style Stagger)
  const heroTl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  heroTl
    .from('.hero-yc-badge', {
      opacity: 0,
      y: 18,
      duration: 0.6
    })
    .from('.hero-headline', {
      opacity: 0,
      y: 28,
      duration: 0.85
    }, '-=0.4')
    .from('.hero-subtext', {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-bullets-grid', {
      opacity: 0,
      y: 16,
      duration: 0.7
    }, '-=0.6')
    .from('.hero-ctas-row', {
      opacity: 0,
      y: 18,
      duration: 0.7
    }, '-=0.6')
    .from('.hero-social-proof-bar', {
      opacity: 0,
      y: 14,
      duration: 0.6
    }, '-=0.5')
    .from('.hero-aspect-frame', {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 1.1,
      ease: 'power3.out'
    }, '-=0.85')
    .from(['.aspect-card-header', '.aspect-card-body'], {
      opacity: 0,
      y: 14,
      stagger: 0.12,
      duration: 0.6
    }, '-=0.5');

  // 3. 3D PARALLAX TILT ON HERO MEDIA CARD (RELATE STYLE)
  const heroMedia = document.querySelector('.hero-media-col');
  const heroFrame = document.querySelector('.hero-aspect-frame');

  if (heroMedia && heroFrame && window.innerWidth > 992) {
    heroMedia.addEventListener('mousemove', (e) => {
      const rect = heroMedia.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (y / (rect.height / 2)) * -6;
      const rotateY = (x / (rect.width / 2)) * 6;

      gsap.to(heroFrame, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'power1.out',
        duration: 0.4
      });
    });

    heroMedia.addEventListener('mouseleave', () => {
      gsap.to(heroFrame, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.7
      });
    });
  }

  // 4. SCROLLTRIGGER SECTION REVEALS
  if (typeof ScrollTrigger !== 'undefined') {
    // Reveal all section headers
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.75,
        ease: 'power2.out'
      });
    });

    // Reveal Grid Cards Staggered
    const animateGrid = (selector, stagger = 0.1) => {
      const containers = document.querySelectorAll(selector);
      containers.forEach(container => {
        gsap.from(container.children, {
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 28,
          opacity: 0,
          stagger: stagger,
          duration: 0.75,
          ease: 'power2.out',
          clearProps: 'opacity,visibility,transform'
        });
      });
    };

    animateGrid('.benefits-grid', 0.12);
    animateGrid('.journey-steps-grid', 0.08);
    animateGrid('#curated-products-grid', 0.1);
    animateGrid('.category-showcase-grid', 0.1);
    animateGrid('.pillars-grid', 0.12);
    animateGrid('.channels-grid', 0.1);
    animateGrid('.pipeline-grid', 0.1);
    animateGrid('.academy-grid', 0.12);
    animateGrid('.growth-ladder-grid', 0.12);
    animateGrid('.faq-list', 0.06);

    // Feature / Comparison Sections
    gsap.utils.toArray('.comparison-table-wrapper, .simulator-card, .cta-banner-box').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.85,
        ease: 'power2.out'
      });
    });
  }
}

/* ==========================================================================
   01. INTERACTIVE MARGIN & PROFIT CALCULATOR
   ========================================================================== */
function initMarginCalculator() {
  const basePriceInput = document.getElementById('calc-base-price');
  const basePriceSlider = document.getElementById('calc-base-slider');
  const marginInput = document.getElementById('calc-margin-input');
  const marginSlider = document.getElementById('calc-margin-slider');

  const displayBase = document.getElementById('disp-base-price');
  const displayMargin = document.getElementById('disp-margin-val');
  const displayCustomerPrice = document.getElementById('disp-cust-price');
  const displayProfitPct = document.getElementById('disp-profit-pct');

  const waCustPrice = document.getElementById('wa-preview-price');
  const waProfit = document.getElementById('wa-preview-profit');

  function updateCalculations() {
    const base = parseFloat(basePriceSlider ? basePriceSlider.value : 1500) || 1500;
    const margin = parseFloat(marginSlider ? marginSlider.value : 1000) || 1000;
    const customerPrice = base + margin;
    const profitPct = Math.round((margin / base) * 100);

    if (basePriceInput) basePriceInput.value = base;
    if (marginInput) marginInput.value = margin;

    const fmtBase = '₹' + base.toLocaleString('en-IN');
    const fmtMargin = '₹' + margin.toLocaleString('en-IN');
    const fmtCust = '₹' + customerPrice.toLocaleString('en-IN');

    if (displayBase) displayBase.textContent = fmtBase;
    if (displayMargin) displayMargin.textContent = fmtMargin;
    if (displayCustomerPrice) displayCustomerPrice.textContent = fmtCust;
    if (displayProfitPct) displayProfitPct.textContent = profitPct + '%';

    if (waCustPrice) waCustPrice.textContent = fmtCust;
    if (waProfit) waProfit.textContent = fmtMargin;
  }

  if (basePriceSlider && marginSlider) {
    basePriceSlider.addEventListener('input', (e) => {
      if (basePriceInput) basePriceInput.value = e.target.value;
      updateCalculations();
    });

    marginSlider.addEventListener('input', (e) => {
      if (marginInput) marginInput.value = e.target.value;
      updateCalculations();
    });

    if (basePriceInput) {
      basePriceInput.addEventListener('change', (e) => {
        basePriceSlider.value = e.target.value;
        updateCalculations();
      });
    }

    if (marginInput) {
      marginInput.addEventListener('change', (e) => {
        marginSlider.value = e.target.value;
        updateCalculations();
      });
    }

    updateCalculations();
  }
}

/* ==========================================================================
   02. "WHAT SHOULD I SELL TODAY?" CURATED SHOWCASE
   ========================================================================== */
const CURATED_PRODUCTS = [
  {
    id: 'KATAN-804',
    name: 'Pure Katan Silk Kadwa Jaal Saree',
    fabric: 'Pure Katan Silk · Antique Gold Zari',
    basePrice: 2850,
    suggestedMin: 3999,
    suggestedMax: 4499,
    category: 'festive',
    stock: 'In Stock (42 pcs)',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  },
  {
    id: 'GEORG-209',
    name: 'Banarasi Georgette Khaddi Weave',
    fabric: 'Georgette Silk · Resham Border',
    basePrice: 1950,
    suggestedMin: 2799,
    suggestedMax: 3199,
    category: 'high-margin',
    stock: 'Fast Moving',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`
  },
  {
    id: 'ORGAN-551',
    name: 'Tissue Organza Floral Meenakari',
    fabric: 'Organza Tissue · Silver Zari',
    basePrice: 1450,
    suggestedMin: 2199,
    suggestedMax: 2499,
    category: 'under1500',
    stock: 'In Stock (88 pcs)',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
  },
  {
    id: 'TANCH-912',
    name: 'Royal Tanchoi Brocade Silk Saree',
    fabric: 'Mulberry Tanchoi Silk · Satin Finish',
    basePrice: 2200,
    suggestedMin: 3199,
    suggestedMax: 3599,
    category: 'festive',
    stock: 'Ready to Ship',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`
  },
  {
    id: 'SHIKA-304',
    name: 'Heritage Shikargah Bridal Banarasi',
    fabric: 'Heavy Katan Silk · Antique Weft',
    basePrice: 3800,
    suggestedMin: 5499,
    suggestedMax: 6299,
    category: 'high-margin',
    stock: 'Exclusive Batch',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`
  }
];

function initCuratedProducts() {
  const container = document.getElementById('curated-products-grid');
  const tabButtons = document.querySelectorAll('.filter-tab-btn');

  if (!container) return;

  function renderProducts(filter = 'all') {
    container.innerHTML = '';
    const filtered = filter === 'all' 
      ? CURATED_PRODUCTS 
      : CURATED_PRODUCTS.filter(p => p.category === filter);

    filtered.forEach(prod => {
      const minMargin = prod.suggestedMin - prod.basePrice;
      const maxMargin = prod.suggestedMax - prod.basePrice;

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-img-wrapper">
          <div class="product-img-placeholder">
            <div class="placeholder-weave-icon">${prod.icon}</div>
            <div style="font-size: 13px; font-weight: 600; color: var(--color-midnight-ink);">${prod.name}</div>
            <div style="font-size: 11px; color: var(--color-ash-helper); margin-top: 4px;">Authentic Varanasi Weave</div>
          </div>
          <span class="product-stock-tag">● ${prod.stock}</span>
          <span class="product-code-tag">${prod.id}</span>
        </div>
        <div class="product-body">
          <h3 class="product-name">${prod.name}</h3>
          <div class="product-fabric-detail">${prod.fabric}</div>
          
          <div class="product-price-breakdown">
            <div class="price-row">
              <span class="price-label">Weave 365 Price:</span>
              <span class="price-val mono-num">₹${prod.basePrice.toLocaleString('en-IN')}</span>
            </div>
            <div class="price-row">
              <span class="price-label">Suggested Selling:</span>
              <span class="price-val mono-num">₹${prod.suggestedMin.toLocaleString('en-IN')} – ₹${prod.suggestedMax.toLocaleString('en-IN')}</span>
            </div>
            <div class="price-row margin-highlight-row">
              <span class="price-label">Your Gross Profit:</span>
              <span class="price-val mono-num">₹${minMargin.toLocaleString('en-IN')} – ₹${maxMargin.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="product-card-actions">
            <button class="btn btn-outline btn-sm" onclick="shareProduct('${prod.id}', '${prod.name}', ${prod.suggestedMin})">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
              Share on WhatsApp
            </button>
            <button class="btn btn-primary btn-sm" onclick="showToast('Added ${prod.id} to your selling list')">
              Sell This
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // If GSAP is active, animate the filtered cards
    if (typeof gsap !== 'undefined') {
      gsap.from(container.children, {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.getAttribute('data-filter'));
    });
  });

  renderProducts();
}

/* ==========================================================================
   03. WHITE-LABEL BRAND SIMULATOR
   ========================================================================== */
function initWhiteLabelSimulator() {
  const brandNameInput = document.getElementById('sim-brand-name');
  const cityInput = document.getElementById('sim-city-name');
  const markupInput = document.getElementById('sim-markup');

  const previewBrandDisplay = document.getElementById('preview-brand-title');
  const previewLogoText = document.getElementById('preview-logo-char');
  const previewCityDisplay = document.getElementById('preview-brand-city');
  const previewPriceDisplay = document.getElementById('preview-final-price');

  function updatePreview() {
    const brand = (brandNameInput && brandNameInput.value.trim()) || 'Aarohi Silk Studio';
    const city = (cityInput && cityInput.value.trim()) || 'Bengaluru';
    const markup = parseFloat(markupInput ? markupInput.value : 1000) || 1000;
    const base = 1850;
    const finalPrice = base + markup;

    if (previewBrandDisplay) previewBrandDisplay.textContent = brand;
    if (previewLogoText) previewLogoText.textContent = brand.charAt(0).toUpperCase();
    if (previewCityDisplay) previewCityDisplay.textContent = city;
    if (previewPriceDisplay) previewPriceDisplay.textContent = '₹' + finalPrice.toLocaleString('en-IN');
  }

  if (brandNameInput) brandNameInput.addEventListener('input', updatePreview);
  if (cityInput) cityInput.addEventListener('input', updatePreview);
  if (markupInput) markupInput.addEventListener('input', updatePreview);

  updatePreview();
}

/* ==========================================================================
   04. RESELLER FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
    });
  });
}

/* ==========================================================================
   05. MOBILE NAVIGATION TOGGLE & DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-open');
    });

    const links = navMenu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
      }
    });
  }

  // Transparent Sticky Header on Scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   06. TOAST FEEDBACK NOTIFICATIONS
   ========================================================================== */
function initActionToasts() {
  let toastEl = document.getElementById('global-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'global-toast';
    toastEl.className = 'toast-notification';
    document.body.appendChild(toastEl);
  }
}

window.showToast = function(message) {
  const toast = document.getElementById('global-toast');
  if (!toast) return;

  toast.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="flex-shrink:0;">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
};

window.shareProduct = function(code, name, price) {
  const msg = `Catalogue created for ${name} (${code}) at ₹${price.toLocaleString('en-IN')}. Ready to share with your customers!`;
  window.showToast(msg);
};

/* ==========================================================================
   07. QUICK SEARCH / COMMAND PALETTE MODAL
   ========================================================================== */
function initSearchModal() {
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  if (!searchModal) return;

  function openSearch() {
    searchModal.classList.add('open');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        filterSearch('');
      }
    }, 50);
  }

  function closeSearch() {
    searchModal.classList.remove('open');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function filterSearch(query) {
    const q = query.toLowerCase().trim();
    const items = searchResults ? searchResults.querySelectorAll('.search-result-item') : [];
    const labels = searchResults ? searchResults.querySelectorAll('.search-section-label') : [];
    let visibleCount = 0;

    items.forEach(item => {
      const title = (item.getAttribute('data-title') || '') + ' ' + (item.innerText || '');
      const matches = !q || title.toLowerCase().includes(q);
      item.style.display = matches ? 'flex' : 'none';
      if (matches) visibleCount++;
    });

    labels.forEach(label => {
      const group = label.nextElementSibling;
      if (group && group.classList.contains('search-results-group')) {
        const visibleInGroup = group.querySelectorAll('.search-result-item[style*="display: flex"], .search-result-item:not([style*="display: none"])');
        label.style.display = (visibleInGroup.length > 0) ? 'block' : 'none';
      }
    });

    let noResultsMsg = searchResults ? searchResults.querySelector('.search-no-results') : null;
    if (visibleCount === 0) {
      if (!noResultsMsg && searchResults) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'search-no-results';
        searchResults.appendChild(noResultsMsg);
      }
      if (noResultsMsg) {
        noResultsMsg.innerHTML = `No results found for "<strong>${escapeHtml(q)}</strong>". Try searching for <em>Katan Silk</em>, <em>Dropshipping</em>, or <em>Suits</em>.`;
        noResultsMsg.style.display = 'block';
      }
    } else if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
  }

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      closeSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterSearch(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      const visibleItems = Array.from(searchResults.querySelectorAll('.search-result-item')).filter(el => el.style.display !== 'none');
      const selectedIndex = visibleItems.findIndex(el => el.classList.contains('selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (selectedIndex + 1) % visibleItems.length;
        visibleItems.forEach(el => el.classList.remove('selected'));
        if (visibleItems[nextIndex]) {
          visibleItems[nextIndex].classList.add('selected');
          visibleItems[nextIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
        visibleItems.forEach(el => el.classList.remove('selected'));
        if (visibleItems[prevIndex]) {
          visibleItems[prevIndex].classList.add('selected');
          visibleItems[prevIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const targetItem = selectedIndex >= 0 ? visibleItems[selectedIndex] : visibleItems[0];
        if (targetItem) {
          targetItem.click();
          closeSearch();
        }
      }
    });
  }

  // Close on item click
  if (searchResults) {
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        closeSearch();
      });
    });
  }

  // Keyboard shortcut: Ctrl + K or Cmd + K or ESC
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape' && searchModal.classList.contains('open')) {
      closeSearch();
    }
  });
}

