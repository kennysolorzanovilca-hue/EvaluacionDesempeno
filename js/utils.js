APP.getIconSVG = (name, classes = 'text-white', size = 24) => {
  const icons = {
    Star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.25 5.82 22l1.81-7.86-5-4.87L8.91 8.26 12 2z"/>',
    TrendingUp: '<path d="M22 6L13.5 14.5L10 11L2 19"/><path d="M17 6H22V11"/>',
    Target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    Lightbulb: '<path d="M15 14c.2-1 .5-2 1-3 1.2-2.12 3-3 3-3 1 1 2 2 3 3-1 1-1 2-1 3"/><path d="M9 18c-2.4 0-4.75-.41-6-1.5 1-4 3-8 9-8s8 4 9 8c-1.25 1.09-3.6 1.5-6 1.5-2.12 0-3.95-.53-5-1.5 1.05-1 2.88-1.5 5-1.5s3.95.53 5 1.5c-1.25 1.09-3.6 1.5-6 1.5z"/><path d="M12 21.5V18"/><path d="M12 21.5h-1"/><path d="M12 21.5h1"/>',
    Award: '<circle cx="12" cy="8" r="7"/><path d="M15.4 12.5l-3.2 4.6l-3.2-4.6"/>',
    ChevronDown: '<path d="M6 9l6 6 6-6"/>',
    ChevronUp: '<path d="M18 15l-6-6-6 6"/>',
    Printer: '<path d="M6 9V2H18V9"/><path d="M6 18H18V12H6V18"/><path d="M6 12V9H18V12"/>',
    Download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M20 21H4"/>',
    Upload: '<path d="M12 21V9"/><path d="M7 14l5-5 5 5"/><path d="M20 21H4"/>',
    Save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>'
  };
  const path = icons[name] || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${classes}">${path}</svg>`;
};

APP.keyFor = (category, id) => `${category}-${id}`;

APP.getRating = (category, item) => APP.ratings[APP.keyFor(category, item)] || 0;

APP.setRating = (category, itemId, value) => {
  APP.ratings[APP.keyFor(category, itemId)] = value;
  APP.updateRatingStars(category, itemId, value);
  APP.updateAverages();
  APP.updateOverallScoreDisplay();
  APP.saveState();
};

APP.calculateAverage = (category, items) => {
  const vals = items.map(i => APP.getRating(category, i.id)).filter(v => v > 0);
  if (!vals.length) return '0.0';
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return avg.toFixed(1);
};

APP.calculateOverallScore = () => {
  const all = [...APP.technicalSkills, ...APP.softSkills, ...APP.leadershipCollaboration, ...APP.resultsOrientation, ...APP.professionalDevelopment];
  const vals = all.map(i => APP.getRating(i.category || 'default', i.id)).filter(v => v > 0);
  if (!vals.length) return 0;
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
};

APP.getPerformanceLevel = (score) => {
  if (score >= 4.5) return { text: 'Excepcional', color: 'text-purple-600', bg: 'bg-purple-50' };
  if (score >= 4.0) return { text: 'Sobresaliente', color: 'text-green-600', bg: 'bg-green-50' };
  if (score >= 3.5) return { text: 'Alto Desempeño', color: 'text-blue-600', bg: 'bg-blue-50' };
  if (score >= 3.0) return { text: 'Cumple Expectativas', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  if (score >= 2.0) return { text: 'Necesita Mejorar', color: 'text-orange-600', bg: 'bg-orange-50' };
  return { text: 'Bajo Desempeño', color: 'text-red-600', bg: 'bg-red-50' };
};

APP.csvEscape = (v) => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  const needQuote = /[",\r\n]/.test(s);
  const esc = s.replace(/"/g, '""');
  return needQuote ? `"${esc}"` : esc;
};

APP.validateAllRatings = () => {
  let allRated = true;
  let unratedCategories = [];

  APP.ALL_COMPETENCIES.forEach(sec => {
    let categoryRated = true;
    sec.competencies.forEach(c => {
      if (APP.getRating(c.category, c.id) === 0) {
        allRated = false;
        categoryRated = false;
      }
    });
    if (!categoryRated) {
      unratedCategories.push(sec.title);
    }
  });

  if (!allRated) {
    alert(`Por favor, califique todas las competencias antes de exportar. Faltan calificaciones en las siguientes secciones: 
- ${unratedCategories.join('\n- ')}`);
    return false;
  }
  return true;
};

APP.exportCSV = () => {
  if (!APP.validateAllRatings()) {
    return;
  }
  APP.saveState();
  const lines = [];
  lines.push(['Generado', new Date().toISOString()]);
  lines.push([]);
  lines.push(['Empleado', 'Campo', 'Valor']);
  lines.push(['Empleado', 'Nombre', APP.empForm.name || '']);
  lines.push(['Empleado', 'Código/DNI', APP.empForm.code || '']);
  lines.push(['Empleado', 'Área', APP.empForm.area || '']);
  lines.push(['Empleado', 'Especialización', APP.empForm.specialization || '']);
  lines.push(['Empleado', 'Supervisor', APP.empForm.supervisor || '']);
  lines.push(['Empleado', 'Periodo', APP.empForm.period || '']);
  lines.push(['Empleado', 'Fecha Evaluación', APP.empForm.date || '']);
  lines.push([]);
  const overall = APP.calculateOverallScore();
  const level = APP.getPerformanceLevel(parseFloat(overall) || 0);
  lines.push(['Global', 'Puntaje Global', overall]);
  lines.push(['Global', 'Nivel', level.text]);
  lines.push([]);
  lines.push(['Categoria', 'ID', 'Nombre', 'Descripción', 'Puntaje']);
  APP.ALL_COMPETENCIES.forEach(sec => {
    sec.competencies.forEach(c => {
      lines.push([sec.title, c.id, c.name, c.description, APP.getRating(c.category, c.id) || '']);
    });
  });
  lines.push([]);
  lines.push(['Promedios por Sección', 'Sección', 'Promedio']);
  APP.ALL_COMPETENCIES.forEach(s => {
    lines.push(['Promedio', s.title, APP.calculateAverage(s.category, s.competencies)]);
  });
  lines.push([]);
  lines.push(['Comentarios', 'Tipo', 'Texto']);
  lines.push(['Comentario', 'Cumplimiento KPIs', APP.comments.kpis || '']);
  lines.push(['Comentario', 'Fortalezas', APP.comments.strengths || '']);
  lines.push(['Comentario', 'Áreas de Oportunidad', APP.comments.improvement || '']);
  lines.push(['Comentario', 'Plan de Desarrollo', APP.comments.development || '']);

  const csv = lines.map(row => {
    if (!row || row.length === 0) return '';
    return row.map(APP.csvEscape).join(',');
  }).join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = APP.empForm?.name?.trim() ? `evaluacion_${APP.empForm.name.replace(/\s+/g, '_').toLowerCase()}.csv` : `evaluacion_${new Date().toISOString().slice(0, 10)}.csv`;
  a.href = url;
  a.download = safeName;
  a.click();
  URL.revokeObjectURL(url);
};

APP.exportJSON = () => {
  if (!APP.validateAllRatings()) {
    return;
  }
  const blob = new Blob([JSON.stringify({ ratings: APP.ratings, comments: APP.comments, expandedSections: APP.expandedSections, empForm: APP.empForm }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = APP.empForm?.name?.trim() ? `evaluacion_${APP.empForm.name.replace(/\s+/g, '_').toLowerCase()}.json` : 'evaluacion.json';
  a.href = url;
  a.download = safeName;
  a.click();
  URL.revokeObjectURL(url);
};

APP.importJSON = (file) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      APP.ratings = data.ratings || {};
      APP.comments = data.comments || {};
      APP.expandedSections = data.expandedSections || {};
      APP.empForm = data.empForm || {};
      APP.saveState();
      APP.init(true);
    } catch (err) {
      alert('Archivo inválido.');
    }
  };
  reader.readAsText(file);
};

APP.saveEvaluation = () => {
  // 1. Gather all data into a single object
  const evaluationData = {
    employeeInfo: APP.empForm,
    competencyRatings: APP.ratings,
    kpiData: APP.kpiState,
    generalComments: APP.comments,
    calculated: {
      overallScore: APP.calculateOverallScore(),
      performanceLevel: APP.getPerformanceLevel(parseFloat(APP.calculateOverallScore())),
      kpiMetrics: APP.calculateAllKpis()
    },
    savedAt: new Date().toISOString()
  };

  // 2. Log the data to the console for now
  console.log("--- EVALUATION DATA TO BE SAVED ---");
  console.log(JSON.stringify(evaluationData, null, 2));
  console.log("------------------------------------");

  // 3. Send the data to the backend API
  fetch('http://localhost:3000/api/save-evaluation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evaluationData),
  })
  .then(response => {
    if (!response.ok) {
      // If the server response is not OK, throw an error to be caught by the .catch block
      return response.json().then(err => { throw new Error(err.message || 'Error del servidor') });
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Evaluación guardada con éxito en el servidor.');
  })
  .catch((error) => {
    console.error('Error:', error);
    alert(`Error al guardar la evaluación: ${error.message}`);
  });
  
  // 4. Show a confirmation to the user
  // alert('Evaluación preparada para ser guardada. Revisa la consola del navegador (F12) para ver los datos.');
};