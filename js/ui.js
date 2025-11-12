APP.updateChevron = (section) => {
  const iconDiv = document.getElementById(`section-${section}-chevron`);
  if (iconDiv) iconDiv.innerHTML = APP.getIconSVG(APP.expandedSections[section] ? 'ChevronUp' : 'ChevronDown', 'text-white', 24);
};

APP.toggleSection = (section) => {
  APP.expandedSections[section] = !APP.expandedSections[section];
  const contentDiv = document.getElementById(`section-${section}-content`);
  if (contentDiv) {
    contentDiv.style.display = APP.expandedSections[section] ? 'block' : 'none';
    APP.updateChevron(section);
    APP.saveState();
  }
};

APP.expandAll = () => {
  APP.ALL_COMPETENCIES.forEach(s => {
    APP.expandedSections[s.category] = true;
    const c = document.getElementById(`section-${s.category}-content`);
    if (c) c.style.display = 'block';
    APP.updateChevron(s.category);
  });
  APP.saveState();
};

APP.collapseAll = () => {
  APP.ALL_COMPETENCIES.forEach(s => {
    APP.expandedSections[s.category] = false;
    const c = document.getElementById(`section-${s.category}-content`);
    if (c) c.style.display = 'none';
    APP.updateChevron(s.category);
  });
  APP.saveState();
};

APP.updateRatingStars = (category, itemId, value) => {
  const container = document.getElementById(`stars-${category}-${itemId}`);
  if (!container) return;
  container.innerHTML = '';
  for (let star = 1; star <= 5; star++) {
    const btn = document.createElement('button');
    btn.className = 'focus:outline-none transition-transform hover:scale-110';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', `Puntuar ${star} estrellas`);
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', star <= value);
    btn.innerHTML = APP.getIconSVG('Star', star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300', 24);
    btn.onclick = () => APP.setRating(category, itemId, star);
    btn.onkeydown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        APP.setRating(category, itemId, Math.min(5, (APP.ratings[APP.keyFor(category, itemId)] || 0) + 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        APP.setRating(category, itemId, Math.max(1, (APP.ratings[APP.keyFor(category, itemId)] || 0) - 1));
      }
    };
    container.appendChild(btn);
  }
  const numberSpan = document.getElementById(`rating-number-${category}-${itemId}`);
  if (numberSpan) numberSpan.textContent = value > 0 ? value : '-';
};

APP.renderCompetencyItem = (comp, category) => {
  const current = APP.getRating(category, comp.id);
  const itemDiv = document.createElement('div');
  itemDiv.className = 'py-4 border-b border-gray-100 last:border-b-0';
  itemDiv.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-800 mb-1">${comp.name}</h4>
        <p class="text-sm text-gray-600">${comp.description}</p>
      </div>
      <div class="ml-4 flex items-center">
        <div id="stars-${category}-${comp.id}" class="flex gap-1" role="radiogroup" aria-label="Puntaje ${comp.name}"></div>
        <span id="rating-number-${category}-${comp.id}" class="ml-2 font-semibold text-lg text-gray-700">${current > 0 ? current : '-'}</span>
      </div>
    </div>`;
  setTimeout(() => APP.updateRatingStars(category, comp.id, current || 0));
  return itemDiv;
};

APP.updateSectionAverage = (category, items) => {
  const avg = APP.calculateAverage(category, items);
  const span = document.getElementById(`avg-${category}`);
  if (span) span.textContent = `Promedio: ${avg || '-'}`;
};

APP.updateAverages = () => {
  APP.ALL_COMPETENCIES.forEach(s => {
    APP.updateSectionAverage(s.category, s.competencies);
    const d = document.getElementById(`overall-avg-${s.category}`);
    if (d) d.textContent = APP.calculateAverage(s.category, s.competencies) || '-';
  });
};

APP.updateOverallScoreDisplay = () => {
  const overall = APP.calculateOverallScore();
  const num = parseFloat(overall) || 0;
  const level = APP.getPerformanceLevel(num);
  const scoreDisplay = document.getElementById('overall-score-number');
  const levelText = document.getElementById('level-text');
  const levelContainer = document.getElementById('level-container');
  if (scoreDisplay) scoreDisplay.textContent = overall > 0 ? overall : '-';
  if (levelText && levelContainer) {
    levelText.textContent = level.text;
    levelContainer.className = `px-6 py-3 rounded-lg ${level.bg}`;
    const inner = levelContainer.querySelector('.level-text');
    if (inner) inner.className = `text-2xl font-bold ${level.color}`;
  }
};

APP.bindEmpForm = () => {
  const fields = ['name', 'code', 'area', 'specialization', 'supervisor', 'period', 'date'];
  fields.forEach(f => {
    const el = document.getElementById(`emp-${f}`);
    if (!el) return;
    el.value = APP.empForm[f] || '';
    el.addEventListener('input', (e) => {
      APP.empForm[f] = e.target.value;
      APP.saveState();
    });
  });
};

APP.bindCommentAreas = () => {
  const map = [
    ['kpis', 'comment-kpis'],
    ['strengths', 'comment-strengths'],
    ['improvement', 'comment-improvement'],
    ['development', 'comment-development']
  ];
  map.forEach(([k, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = APP.comments[k] || '';
    el.addEventListener('input', (e) => {
      APP.comments[k] = e.target.value;
      APP.saveState();
    });
  });
};

APP.renderCompetencySection = (title, iconName, competencies, category, color) => {
  const isExpanded = !!APP.expandedSections[category];
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'competency-section mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm';
  sectionDiv.id = `section-${category}`;

  const headerButton = document.createElement('button');
  headerButton.type = 'button';
  headerButton.className = `w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r ${color} hover:opacity-90 transition-opacity`;
  headerButton.onclick = () => APP.toggleSection(category);
  headerButton.innerHTML = `
    <div class="flex items-center gap-3">
      ${APP.getIconSVG(iconName, 'text-white', 24)}
      <h3 class="text-lg font-bold text-white">${title}</h3>
    </div>
    <div class="flex items-center gap-4">
      <span id="avg-${category}" class="bg-white px-4 py-1 rounded-full text-sm font-bold text-gray-700">Promedio: ${APP.calculateAverage(category, competencies) || '-'}</span>
      <div id="section-${category}-chevron" class="section-toggle-icon">${APP.getIconSVG(isExpanded ? 'ChevronUp' : 'ChevronDown', 'text-white', 24)}</div>
    </div>`;
  sectionDiv.appendChild(headerButton);

  const contentDiv = document.createElement('div');
  contentDiv.id = `section-${category}-content`;
  contentDiv.className = 'competency-section-content p-6 bg-white';
  contentDiv.style.display = isExpanded ? 'block' : 'none';
  competencies.forEach(c => contentDiv.appendChild(APP.renderCompetencyItem(c, category)));
  sectionDiv.appendChild(contentDiv);
  return sectionDiv;
};