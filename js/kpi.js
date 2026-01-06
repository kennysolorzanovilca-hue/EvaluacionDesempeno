// js/kpi.js

APP.kpiTasks = [
    { id: 'validacion_tecnica_sensores', name: 'VALIDACIÓN TÉCNICA DE SENSORES Y EQUIPAMIENTO', description: 'Completar evaluación de historial de fallos, estudio de requerimientos, pruebas en planta y campo de sensores críticos con análisis de datos que determine viabilidad técnica y especificaciones finales.' },
    { id: 'validacion_diseño_arquitectura', name: 'VALIDACION DEL DISEÑO DE ARQUITECTURA TÉCNICA DEL SISTEMA', description: 'Estructuracion de datos, arquitectura de aplicativos web, repositorios de código fuente y evaluación de servicios clouD con documentación técnica completa.' },
    { id: 'gestion_adquisiciones_presupuesto', name: 'GESTIÓN DE ADQUISICIONES Y PRESUPUESTO', description: 'Completar cotizaciones, adquisiciones de instrumentación, equipos de networking, licencias de software y recursos cloud dentro del presupuesto aprobado.' },
    { id: 'desarrollo_componentes_software', name: 'DESARROLLO DE COMPONENTES DE SOFTWARE', description: 'Completar desarrollo y despliegue de Gateway IoT Beta 01, aplicativos web, proyecto base en cloud y diseño de interfaces según especificaciones técnicas.' },
    { id: 'implementacion_integracion_marcha', name: 'IMPLEMENTACIÓN, INTEGRACIÓN Y PUESTA EN MARCHA', description: 'Completar instalación/configuración de networking, instrumentación, calibración de equipos, pruebas de integración, almacenamiento en cloud y entrega de sistema funcional end-to-end.' },
    { id: 'desarrollo_automatizacion_ventas', name: 'DESARROLLO, AUTOMATIZACIÓN Y SOPORTE DE ATENCION DE VENTAS DE REPUESTOS PARA EL AREA DE PLANEAMIENTO', description: 'Implementar sistema automatizado usando Power Automate, Microsoft Forms y Planner con metodología Kanban operativa.' },
    { id: 'propuestas_mejora_limpiador', name: 'PROPUESTAS TÉCNICAS DE MEJORA DE COMPONENTE LIMPIADOR B99', description: 'Propuesta de ingeniería y selección de materiales para mejora de base de limpiador de base de giro con análisis técnico y justificación.' },
    { id: 'desarrollo_sistema_web_calidad', name: 'DESARROLLO DE SISTEMA WEB PARA ÁREA DE CALIDAD', description: 'Desarrollar e implementar sistema web funcional para procesos internos de Calidad con funcionalidades operativas según requerimientos del área.' }
];

APP.kpiRatings = {}; // { taskId: rating }

// --- Calculation Logic ---

APP.calculateKpiAverage = () => {
    const ratings = Object.values(APP.kpiRatings);
    if (ratings.length === 0) return '0.0';
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    const avg = sum / APP.kpiTasks.length; // Calculate average based on total tasks, not just rated ones
    return avg.toFixed(1);
};


// --- Rendering Logic ---

APP.renderKpiSummary = () => {
    const average = APP.calculateKpiAverage();
    const numAverage = parseFloat(average);
    const performance = APP.getPerformanceLevel(numAverage);

    return `
        <div class="bg-white p-8 rounded-lg shadow-xl mb-6">
            <div class="flex flex-col md:flex-row items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Evaluación de Tareas</h2>
                <div id="kpi-level-container" class="px-6 py-3 rounded-lg ${performance.bg} mt-4 md:mt-0">
                    <p class="text-sm font-semibold text-gray-600">Nivel de Desempeño</p>
                    <p id="kpi-level-text" class="level-text text-2xl font-bold ${performance.color}">${performance.text}</p>
                </div>
            </div>
            <div class="flex items-center justify-center">
                <div class="text-center">
                    <p id="kpi-score-number" class="text-7xl font-extrabold text-blue-600">${numAverage > 0 ? average : '-'}</p>
                    <p class="text-gray-600 mt-2">de 5.0</p>
                </div>
            </div>
        </div>
    `;
};

APP.renderKpiItem = (task) => {
    const currentRating = APP.kpiRatings[task.id] || 0;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'py-4 border-b border-gray-100 last:border-b-0';
    itemDiv.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-800 mb-1">${task.name}</h4>
        <p class="text-sm text-gray-600">${task.description}</p>
      </div>
      <div class="ml-4 flex items-center">
        <div id="stars-kpi-${task.id}" class="flex gap-1" role="radiogroup" aria-label="Puntaje ${task.name}"></div>
        <span id="rating-number-kpi-${task.id}" class="ml-2 font-semibold text-lg text-gray-700 w-6 text-center">${currentRating > 0 ? currentRating : '-'}</span>
      </div>
    </div>`;

    setTimeout(() => {
        const starContainer = itemDiv.querySelector(`#stars-kpi-${task.id}`);
        if (starContainer) {
             for (let star = 1; star <= 5; star++) {
                const btn = document.createElement('button');
                btn.className = 'focus:outline-none transition-transform hover:scale-110';
                btn.setAttribute('type', 'button');
                btn.setAttribute('aria-label', `Puntuar ${star} estrellas`);
                btn.innerHTML = APP.getIconSVG('Star', star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300', 24);
                btn.onclick = () => APP.setKpiRating(task.id, star);
                starContainer.appendChild(btn);
            }
        }
    });

    return itemDiv;
};


APP.renderKpiSectionContent = () => {
    const category = 'kpiTasks';
    const isExpanded = APP.expandedSections[category] !== false; // Default to expanded

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'competency-section mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm';
    sectionDiv.id = `section-${category}`;

    const headerButton = document.createElement('button');
    headerButton.type = 'button';
    headerButton.className = 'w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-700 to-gray-800 hover:opacity-90 transition-opacity';
    headerButton.onclick = () => APP.toggleSection(category);
    headerButton.innerHTML = `
        <div class="flex items-center gap-3">
          ${APP.getIconSVG('ClipboardCheck', 'text-white', 24)}
          <h3 class="text-lg font-bold text-white">Tareas a Evaluar</h3>
        </div>
        <div class="flex items-center gap-4">
          <span id="avg-${category}" class="bg-white px-4 py-1 rounded-full text-sm font-bold text-gray-700">Promedio: ${APP.calculateKpiAverage() || '-'}</span>
          <div id="section-${category}-chevron" class="section-toggle-icon">${APP.getIconSVG(isExpanded ? 'ChevronUp' : 'ChevronDown', 'text-white', 24)}</div>
        </div>`;
    sectionDiv.appendChild(headerButton);

    const contentDiv = document.createElement('div');
    contentDiv.id = `section-${category}-content`;
    contentDiv.className = 'competency-section-content p-6 bg-white';
    contentDiv.style.display = isExpanded ? 'block' : 'none';
    APP.kpiTasks.forEach(task => contentDiv.appendChild(APP.renderKpiItem(task)));
    sectionDiv.appendChild(contentDiv);

    return sectionDiv;
};

APP.setKpiRating = (taskId, rating) => {
    // If the same star is clicked again, reset the rating
    if (APP.kpiRatings[taskId] === rating) {
        delete APP.kpiRatings[taskId];
    } else {
        APP.kpiRatings[taskId] = rating;
    }
    APP.saveState();
    APP.refreshKpiUi();
};


APP.refreshKpiUi = () => {
    // Update stars for all KPI items
    APP.kpiTasks.forEach(task => {
        const currentRating = APP.kpiRatings[task.id] || 0;
        const starContainer = document.getElementById(`stars-kpi-${task.id}`);
        if (starContainer) {
            const buttons = starContainer.querySelectorAll('button');
            buttons.forEach((btn, index) => {
                const star = index + 1;
                btn.innerHTML = APP.getIconSVG('Star', star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300', 24);
            });
        }
        const numberSpan = document.getElementById(`rating-number-kpi-${task.id}`);
        if (numberSpan) {
            numberSpan.textContent = currentRating > 0 ? currentRating : '-';
        }
    });

    // Update average in the header
    const avgSpan = document.getElementById('avg-kpiTasks');
    if (avgSpan) {
        avgSpan.textContent = `Promedio: ${APP.calculateKpiAverage() || '-'}`;
    }

    // Update summary section
    const summaryContainer = document.getElementById('kpi-summary-container');
    if (summaryContainer) {
        summaryContainer.innerHTML = APP.renderKpiSummary();
    }
     if (APP.updateAllCharts) {
        APP.updateAllCharts();
    }
};


APP.initKpiSection = () => {
    const container = document.getElementById('kpi-section-container');
    if (!container) return;

    container.innerHTML = ''; // Clear previous content

    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'kpi-summary-container';
    summaryContainer.innerHTML = APP.renderKpiSummary();

    const sectionElement = APP.renderKpiSectionContent();

    container.appendChild(summaryContainer);
    container.appendChild(sectionElement);
    
    // No specific event binding needed here as clicks are set during rendering
};
