APP.STORAGE_KEY = 'evaluacion_desempeno_v2';

APP.expandedSections = {}; // {category: boolean}
APP.ratings = {};           // {'category-id': number}
APP.comments = { kpis: '', strengths: '', improvement: '', development: '' };
APP.empForm = { name: '', code: '', area: '', specialization: '', supervisor: '', period: '', date: '' };

APP.saveState = () => {
  const payload = { ratings: APP.ratings, comments: APP.comments, expandedSections: APP.expandedSections, empForm: APP.empForm, version: 2 };
  try {
    localStorage.setItem(APP.STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {
    console.error("Failed to save state to localStorage.");
  }
};

APP.loadState = () => {
  try {
    const raw = localStorage.getItem(APP.STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    APP.ratings = data.ratings || APP.ratings;
    APP.comments = data.comments || APP.comments;
    APP.expandedSections = data.expandedSections || APP.expandedSections;
    APP.empForm = data.empForm || APP.empForm;
  } catch (_) {
    console.error("Failed to load state from localStorage.");
  }
};

APP.clearState = () => {
  localStorage.removeItem(APP.STORAGE_KEY);
  APP.ratings = {};
  APP.comments = { kpis: '', strengths: '', improvement: '', development: '' };
  APP.expandedSections = {};
  APP.empForm = { name: '', code: '', area: '', specialization: '', supervisor: '', period: '', date: '' };
  APP.init(true);
};
