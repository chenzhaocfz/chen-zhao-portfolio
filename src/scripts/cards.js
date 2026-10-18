function toggleCard(card) {
  const isOpen = card.classList.contains('is-open');

  if (!isOpen) {
    // 1. Lazy-load any iframes inside this card ONLY when opened
    card.querySelectorAll('iframe[data-src]').forEach((iframe) => {
      if (!iframe.getAttribute('src') || iframe.getAttribute('src') === 'about:blank') {
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
      }
    });

    // 2. Expand card
    if (card.hasAttribute('data-grid-span')) {
      card.classList.add('md:col-span-2');
    }
    card.classList.add('is-open');
  } else {
    // 1. Fold card back to compact state
    const rect = card.getBoundingClientRect();
    card.classList.remove('is-open');
    if (card.hasAttribute('data-grid-span')) {
      card.classList.remove('md:col-span-2');
    }

    // 2. Keep card header in view if user clicked bottom Fold button
    if (rect.top < 80) {
      window.scrollTo({
        top: window.scrollY + rect.top - 92,
        behavior: 'smooth'
      });
    }

    // 3. Unload iframes after fold animation finishes (stops YouTube audio & frees GPU canvas memory)
    setTimeout(() => {
      if (!card.classList.contains('is-open')) {
        card.querySelectorAll('iframe[data-src]').forEach((iframe) => {
          iframe.setAttribute('src', 'about:blank');
        });
      }
    }, 500);
  }
}

// Attach Expand/Fold listeners
document.querySelectorAll('[data-expand-btn]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.expandable-card');
    if (card) toggleCard(card);
  });
});

// Attach YAML Spec Tab listeners
const specTabs = ['layout', 'elements', 'states'];
specTabs.forEach((tab) => {
  const btn = document.getElementById(`tab-btn-${tab}`);
  if (btn) {
    btn.addEventListener('click', () => {
      specTabs.forEach((t) => {
        const content = document.getElementById(`spec-content-${t}`);
        const tabBtn = document.getElementById(`tab-btn-${t}`);
        if (!content || !tabBtn) return;

        if (t === tab) {
          content.classList.remove('hidden');
          tabBtn.classList.add('text-amber-400', 'border-amber-500', 'bg-slate-800/50');
          tabBtn.classList.remove('text-slate-400', 'border-transparent');
        } else {
          content.classList.add('hidden');
          tabBtn.classList.remove('text-amber-400', 'border-amber-500', 'bg-slate-800/50');
          tabBtn.classList.add('text-slate-400', 'border-transparent');
        }
      });
    });
  }
});