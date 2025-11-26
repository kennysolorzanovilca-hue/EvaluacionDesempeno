
// js/kpi.js

APP.kpiTasks = [
    { id: 'evaluacion_tecnica', name: '1.1 Evaluación técnica de historial de casos de fallo de equipos' },
    { id: 'estudio_requerimientos', name: '1.2 Estudio de requerimientos de equipamiento físico de monitoreo' },
    { id: 'pruebas_planta', name: '1.3 Pruebas en planta de desempeño de sensores críticos (Flow Keyence, Chino, Presión, Vibración y Velocímetro)' },
    { id: 'analisis_datos', name: '1.4 Analisis de datos en sensores críticos' },
    { id: 'pruebas_campo', name: '1.5 Pruebas en campo de funcionamiento de sensores críticos' },
    { id: 'desarrollo_arquitectura', name: '1.6 Desarrollo de arquitectura del sistema general' },
    { id: 'estructuracion_data', name: '1.7 Estructuración de la data a recabar' },
    { id: 'cotizacion_requerimientos', name: '1.8 Cotización de los requerimientos de equipamiento físico' },
    { id: 'licencias_software', name: '1.9 Licencias de software' },
    { id: 'diseno_arquitectura_apps', name: '1.10 Diseño de arquitectura de aplicativos web y móvil del sistema' },
    { id: 'creacion_repositorios', name: '1.11 Creación de estructura de repositorios de codigo fuente' },
    { id: 'despliegue_cloud', name: '1.12 Despliegue de proyecto base en cloud' },
    { id: 'desarrollo_beta_gateway', name: '1.12 Desarrollo Beta 01 - Gateway IoT RESEMIN' },
    { id: 'evaluacion_servicios_nube', name: '1.13 Evaluación de los requerimientos en servicios en la nube(Copilot, chatGPT)' },
    { id: 'desarrollo_chatbot', name: '1.14 Desarrollo de ChatBot (Copilot)' },
    { id: 'diseno_interfaces', name: '1.15 Diseño de interfaces de usuario de aplicativos' },
    { id: 'adquisicion_instrumentacion', name: '1.16 Adquisición de instrumentación y componentes adjuntos de monitoreo' },
    { id: 'adquisicion_networking', name: '1.17 Adquisición de equipamiento de networking' },
    { id: 'adquisicion_recursos_nube', name: '1.18 Adquisición y despliegue de recursos informáticos en la nube' },
    { id: 'desarrollo_apps', name: '1.19 Desarrollo de aplicativos web y móvil' },
    { id: 'instalacion_networking', name: '1.20 Instalacion y configuración de equipos de networking' },
    { id: 'configuracion_instrumentacion', name: '1.21 Configuración de instrumentación de monitoreo' },
    { id: 'pruebas_networking', name: '1.22 Pruebas de networking y almacenamiento de datos de instrumentación en la nube' },
    { id: 'adecuacion_equipos', name: '1.23 Adecuación de los equipos de instrumentación para su instalación' },
    { id: 'pruebas_calibracion', name: '1.24 Pruebas de calibración de equipos de instrumentación' },
    { id: 'pruebas_funcionalidades_apps', name: '1.25 Pruebas de funcionalidades en aplicativos movil y web' },
    { id: 'pruebas_integracion', name: '1.26 Pruebas de integración y monitoreo de funcionamiento del sistema' },
    { id: 'acompanamiento_resultados', name: '1.27 Acompañamiento de resultados en la Etapa 1' },
    { id: 'monitoreo_avance', name: '1.28 Monitoreo de avance de actividades en la Etapa 1' }
];

APP.kpiState = {}; // { taskId: { criticality: 'Normal', plannedDate: '', actualDate: '' } }

APP.initKpiState = () => {
    APP.kpiTasks.forEach(task => {
        if (!APP.kpiState[task.id]) {
            APP.kpiState[task.id] = {
                criticality: 'Normal',
                plannedDate: '',
                actualDate: '',
                justification: ''
            };
        }
    });
};

// --- Calculation Logic ---

APP.getKpiStatus = (plannedStr, actualStr) => {
    if (!plannedStr || !actualStr) {
        return { diff: null, diffText: '-', status: 'Pendiente', score: 0 };
    }
    const plannedDate = new Date(plannedStr);
    const actualDate = new Date(actualStr);
    const diffTime = actualDate.getTime() - plannedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let diffText, status, score;
    if (diffDays < 0) {
        diffText = `Adelantado por ${-diffDays} día(s)`;
        status = 'Adelantado';
        score = 110;
    } else if (diffDays === 0) {
        diffText = 'A tiempo';
        status = 'Completado';
        score = 100;
    } else {
        diffText = `Retraso de ${diffDays} día(s)`;
        status = 'Retrasado';
        if (diffDays <= 3) score = 80;
        else if (diffDays <= 7) score = 60;
        else score = 40;
    }
    return { diff: diffDays, diffText, status, score };
};

APP.getCriticalityWeight = (criticality) => {
    const weights = { 'Critica': 3, 'Importante': 2, 'Normal': 1 };
    return weights[criticality] || 1;
};

APP.calculateAllKpis = () => {
    const totalTasks = APP.kpiTasks.length;
    let completedOnTime = 0;
    let criticalTasks = 0;
    let criticalCompletedOnTime = 0;
    let totalWeightedScore = 0;
    let maxWeightedScore = 0;
    let delaySum = 0;
    let delayedTasksCount = 0;

    APP.kpiTasks.forEach(task => {
        const state = APP.kpiState[task.id] || {};
        const { diff, status, score } = APP.getKpiStatus(state.plannedDate, state.actualDate);
        const weight = APP.getCriticalityWeight(state.criticality);

        const isCompleted = status === 'Completado' || status === 'Adelantado';

        if (state.actualDate && state.plannedDate) {
             if (isCompleted) {
                completedOnTime++;
            }
        }

        if (state.criticality === 'Critica') {
            criticalTasks++;
            if (isCompleted) {
                criticalCompletedOnTime++;
            }
        }
        
        if (state.plannedDate) { // Only count tasks that have a plan
            totalWeightedScore += (score * weight);
            maxWeightedScore += (100 * weight);
        }

        if (status === 'Retrasado') {
            delaySum += diff;
            delayedTasksCount++;
        }
    });

    const compliance = totalTasks > 0 ? (completedOnTime / totalTasks) * 100 : 0;
    const weightedScore = maxWeightedScore > 0 ? (totalWeightedScore / maxWeightedScore) * 100 : 0;
    const criticalCompliance = criticalTasks > 0 ? (criticalCompletedOnTime / criticalTasks) * 100 : 0;
    const avgDelay = delayedTasksCount > 0 ? (delaySum / delayedTasksCount) : 0;

    return {
        compliance: compliance.toFixed(1),
        weightedScore: weightedScore.toFixed(1),
        criticalCompliance: criticalCompliance.toFixed(1),
        avgDelay: avgDelay.toFixed(1)
    };
};

APP.getFinalKpiScore = (weightedScore) => {
    if (weightedScore >= 90) return { text: 'Excelente', value: '5/5' };
    if (weightedScore >= 75) return { text: 'Bueno', value: '4/5' };
    if (weightedScore >= 60) return { text: 'Aceptable', value: '3/5' };
    if (weightedScore >= 40) return { text: 'Necesita Mejora', value: '2/5' };
    return { text: 'Insuficiente', value: '1/5' };
};


// --- Rendering Logic ---

APP.renderKpiSummary = () => {
    const kpis = APP.calculateAllKpis();
    const finalScore = APP.getFinalKpiScore(kpis.weightedScore);

    return `
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Etapa 1 KPI - Promedio</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
                <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-600">Cumplimiento General</h4>
                    <p class="text-3xl font-bold text-blue-600">${kpis.compliance}%</p>
                    <p class="text-xs text-gray-500">Tareas a tiempo / totales</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-600">Score Ponderado</h4>
                    <p class="text-3xl font-bold text-purple-600">${kpis.weightedScore}%</p>
                    <p class="text-xs text-gray-500">Puntaje por importancia</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-600">Tareas Críticas</h4>
                    <p class="text-3xl font-bold text-red-600">${kpis.criticalCompliance}%</p>
                    <p class="text-xs text-gray-500">Cumplimiento en hitos clave</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-600">Promedio de Retraso</h4>
                    <p class="text-3xl font-bold text-orange-600">${kpis.avgDelay} días</p>
                    <p class="text-xs text-gray-500">Demora media en tareas</p>
                </div>
                 <div class="p-4 bg-green-100 rounded-lg border border-green-300">
                    <h4 class="text-sm font-semibold text-gray-600">Evaluación Final KPI</h4>
                    <p class="text-3xl font-bold text-green-700">${finalScore.value}</p>
                    <p class="text-xs text-gray-500 font-semibold">${finalScore.text}</p>
                </div>
            </div>
        </div>
    `;
};


APP.renderKpiTable = () => {
    const category = 'kpiTasks';
    const isExpanded = !!APP.expandedSections[category];

    const tableRows = APP.kpiTasks.map(task => {
        const state = APP.kpiState[task.id] || { criticality: 'Normal', plannedDate: '', actualDate: '', justification: '' };
        const { diffText, status } = APP.getKpiStatus(state.plannedDate, state.actualDate);
        return `
            <tr class="border-b border-gray-200">
                <td class="py-2 px-4 text-sm text-gray-700 w-1/5">${task.name}</td>
                <td class="py-2 px-4">
                    <select data-task-id="${task.id}" data-field="criticality" class="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm">
                        <option value="Normal" ${state.criticality === 'Normal' ? 'selected' : ''}>Normal</option>
                        <option value="Importante" ${state.criticality === 'Importante' ? 'selected' : ''}>Importante</option>
                        <option value="Critica" ${state.criticality === 'Critica' ? 'selected' : ''}>Crítica</option>
                    </select>
                </td>
                <td class="py-2 px-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-500 w-14">Planeada:</label>
                        <input type="date" data-task-id="${task.id}" data-field="plannedDate" value="${state.plannedDate}" class="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm">
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <label class="text-sm text-gray-500 w-14">Real:</label>
                        <input type="date" data-task-id="${task.id}" data-field="actualDate" value="${state.actualDate}" class="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm">
                    </div>
                </td>
                <td class="py-2 px-4 text-sm text-center" id="diff-${task.id}">${diffText}</td>
                <td class="py-2 px-4 text-sm text-center" id="status-${task.id}">${status}</td>
                <td class="py-2 px-4 w-1/4">
                    <div id="justification-wrapper-${task.id}" class="${status !== 'Retrasado' ? 'hidden' : ''}">
                        <textarea data-task-id="${task.id}" data-field="justification" class="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm" placeholder="Sustento...">${state.justification || ''}</textarea>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'bg-white rounded-lg shadow-md mb-6';

    const headerButton = document.createElement('button');
    headerButton.type = 'button';
    headerButton.className = 'w-full flex items-center justify-between p-6 text-xl font-bold text-gray-800';
    headerButton.onclick = () => APP.toggleSection(category);
    headerButton.innerHTML = `
        <span>Tareas a evaluar</span>
        <div id="section-${category}-chevron">${APP.getIconSVG(isExpanded ? 'ChevronUp' : 'ChevronDown', 'text-gray-600', 24)}</div>
    `;
    
    const tableContainer = document.createElement('div');
    tableContainer.id = `section-${category}-content`;
    tableContainer.style.display = isExpanded ? 'block' : 'none';
    tableContainer.className = "overflow-x-auto p-6";
    tableContainer.innerHTML = `
        <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
                <tr>
                    <th class="py-2 px-4 text-center text-sm font-semibold text-gray-600 w-4/12">Tarea</th>
                    <th class="py-2 px-4 text-center text-sm font-semibold text-gray-600 w-1/12">Criticidad</th>
                    <th class="py-2 px-4 text-center text-sm font-semibold text-gray-600 w-1/12">Fechas</th>
                    <th class="py-2 px-4 text-center text-sm font-semibold text-gray-600 w-1/12">Diferencia</th>
                    <th class="py-2 px-4 text-center text-sm font-semibold text-gray-600 w-1/12">Estado</th>
                    <th class="py-2 px-4 text-center text-sm font-semibold text-gray-600 w-4/12">Sustento de Retraso</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;

    sectionDiv.appendChild(headerButton);
    sectionDiv.appendChild(tableContainer);
    
    return sectionDiv;
};


APP.updateKpiRow = (taskId) => {
    const state = APP.kpiState[taskId] || {};
    const { diffText, status } = APP.getKpiStatus(state.plannedDate, state.actualDate);
    document.getElementById(`diff-${taskId}`).textContent = diffText;
    document.getElementById(`status-${taskId}`).textContent = status;

    const justificationWrapper = document.getElementById(`justification-wrapper-${taskId}`);
    if (justificationWrapper) {
        if (status === 'Retrasado') {
            justificationWrapper.classList.remove('hidden');
        } else {
            justificationWrapper.classList.add('hidden');
        }
    }
};

APP.refreshKpiSummary = () => {
    const summaryContainer = document.getElementById('kpi-summary-container');
    if (summaryContainer) {
        summaryContainer.innerHTML = APP.renderKpiSummary();
    }
}

APP.bindKpiEvents = () => {
    const section = document.getElementById('kpi-section-container');
    if (!section) return;

    // Listener for date/select changes
    section.addEventListener('change', (e) => {
        const target = e.target;
        if (target.dataset.taskId && (target.nodeName === 'SELECT' || target.nodeName === 'INPUT' && target.type === 'date')) {
            const { taskId, field } = target.dataset;
            APP.kpiState[taskId][field] = target.value;
            
            APP.updateKpiRow(taskId);
            APP.refreshKpiSummary();
            if (APP.updateAllCharts) {
                APP.updateAllCharts();
            }
            APP.saveState();
        }
    });

    // Listener for textarea input
    section.addEventListener('input', (e) => {
        const target = e.target;
        if (target.dataset.taskId && target.nodeName === 'TEXTAREA') {
            const { taskId, field } = target.dataset;
            APP.kpiState[taskId][field] = target.value;
            APP.saveState(); // Just save, no need to re-render everything
        }
    });
};

APP.initKpiSection = () => {
    APP.initKpiState();
    const container = document.getElementById('kpi-section-container');
    if (!container) return;

    container.innerHTML = ''; // Clear previous content

    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'kpi-summary-container';
    summaryContainer.innerHTML = APP.renderKpiSummary();
    
    const tableElement = APP.renderKpiTable(); // renderKpiTable now returns a DOM element

    container.appendChild(summaryContainer);
    container.appendChild(tableElement);

    APP.bindKpiEvents();
};
