const APP = {
  init: (skipLoad = false) => {
    if (!skipLoad) {
      APP.loadState();
    }
    const appContainer = document.getElementById('app');

    const overall = APP.calculateOverallScore();
    const perf = APP.getPerformanceLevel(parseFloat(overall));

    appContainer.innerHTML = `
      <div class="bg-gradient-to-r from-blue-200 to-blue-400 p-6 sm:p-8 rounded-lg shadow-lg mb-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex flex-col  sm:items-center gap-4" style="width: 500px; margin-bottom: 2em;">
          <div> 
          <img src="IMG/RESEMIN-LOGO.png" alt="Logo Resemin" class="h-16 mx-auto sm:mx-0" />
          </div>
            <div class="text-center sm:text-left">
              <h1 class="text-3xl font-bold text-gray-800">Evaluación de Desempeño</h1>
              <p class="text-gray-600 text-lg">Sistema de Evaluación de Desempeño Anual</p>
            </div>
          </div>
          <div class="no-print flex flex-wrap justify-center sm:justify-end gap-4">
         
            <button type="button" id="print-button" class="print-button bg-white text-blue-700 px-3 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow">
              ${APP.getIconSVG('Printer', 'text-blue-700', 18)} Imprimir
            </button>
            <input id="import-input" type="file" accept="application/json" class="hidden" />
            <button type="button" id="import-button" class="bg-white/90 text-blue-700 px-3 py-2 rounded-lg font-semibold hover:bg-white transition-colors shadow flex items-center gap-2">${APP.getIconSVG('Upload', 'text-blue-700', 16)} Importar</button>
            <button type="button" id="export-json-button" class="bg-white/90 text-blue-700 px-3 py-2 rounded-lg font-semibold hover:bg-white transition-colors shadow flex items-center gap-2">${APP.getIconSVG('Download', 'text-blue-700', 16)} Exportar JSON</button>
            <button type="button" id="export-csv-button" class="bg-white/90 text-blue-700 px-3 py-2 rounded-lg font-semibold hover:bg-white transition-colors shadow flex items-center gap-2">${APP.getIconSVG('Download', 'text-blue-700', 16)} Finalizar y Descargar CSV</button>
            <button type="button" id="clear-button" class="bg-white/90 text-rose-600 px-3 py-2 rounded-lg font-semibold hover:bg-white transition-colors shadow">Limpiar</button>
         
        </div>
      </div>

      <!-- Información del Evaluado -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Información del Evaluado</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="emp-name" class="block text-sm font-semibold text-gray-600 mb-1">Nombre Completo</label>
            <input id="emp-name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ingrese nombre completo" />
          </div>
          <div>
            <label for="emp-code" class="block text-sm font-semibold text-gray-600 mb-1">DNI de Empleado</label>
            <input id="emp-code" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ej: EMP-001" />
          </div>
          <div>
            <label for="emp-area" class="block text-sm font-semibold text-gray-600 mb-1">Área/Departamento</label>
            <select id="emp-area" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="">Seleccione un área</option>
              <option value="calidad - ate">Calidad - ATE</option>
              <option value="calidad - priale">Calidad - Priale</option>
            </select>
          </div>
          <div>
            <label for="emp-specialization" class="block text-sm font-semibold text-gray-600 mb-1">Especialización</label>
            <select id="emp-specialization" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="">Seleccione una especialización</option>
              <option value="Especialista hidraulico">Especialista Hidráulico</option>
              <option value="Especialista electrico">Especialista Eléctrico</option>
              <option value="Especialista de automatizacion">Especialista de Automatización</option>
              <option value="Inspector de calidad B&V">Inspector de Calidad B&V</option>
              <option value="Inspector de calidad en bahias 1">Inspector de Calidad en Bahías 1</option>
              <option value="supervisor de area">Supervisor de Área</option>
              <option value="Desarrollador Senior Fullstack">Desarrollador Senior Fullstack</option>
              <option value="Desarrollador full stak">Desarrollador Full Stack</option>
              <option value="Arquitecto de datos">Arquitecto de Datos</option>
              <option value="Control estructural I">Control Estructural I</option>
              <option value="Control estructural II">Control Estructural II</option>
              <option value="Especialista en fabricacion">Especialista en Fabricación</option>
            </select>
          </div>
          <div>
            <label for="emp-supervisor" class="block text-sm font-semibold text-gray-600 mb-1">Jefe o Supervisor Directo</label>
            <select id="emp-supervisor" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="">Seleccione </option>
              <option value="Carlos Roman">Carlos Roman</option>
              <option value="Jonathan Albarran">Jonathan Albarran</option>
              <option value="Giomar Lopez">Giomar Lopez</option>
            </select>
          </div>
          
          <div>
            <label for="emp-date" class="block text-sm font-semibold text-gray-600 mb-1">Fecha de Evaluación</label>
            <input id="emp-date" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label for="emp-period" class="block text-sm font-semibold text-gray-600 mb-1">Inicio de periodo</label>
            <input id="emp-period" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ej: Enero 2025 - Diciembre 2025" />
          </div>
          <div>
            <label for="emp-period" class="block text-sm font-semibold text-gray-600 mb-1">Fin de periodo</label>
            <input id="emp-period" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Ej: Enero 2025 - Diciembre 2025" />
          </div>
        </div>
      </div>

      <!-- Leyenda de escala -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Escala de Evaluación</h2>
        <div class="grid grid-cols-5 gap-3">
          <div class="text-center p-3 bg-red-50 rounded-lg border border-red-200">${APP.getIconSVG('Star', 'mx-auto mb-1 fill-red-400 text-red-400', 20)}<p class="font-bold text-red-600">1</p><p class="text-xs text-gray-600">Muy por debajo</p></div>
          <div class="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">${APP.getIconSVG('Star', 'mx-auto mb-1 fill-orange-400 text-orange-400', 20)}<p class="font-bold text-orange-600">2</p><p class="text-xs text-gray-600">Por debajo</p></div>
          <div class="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">${APP.getIconSVG('Star', 'mx-auto mb-1 fill-yellow-400 text-yellow-400', 20)}<p class="font-bold text-yellow-600">3</p><p class="text-xs text-gray-600">Cumple</p></div>
          <div class="text-center p-3 bg-green-50 rounded-lg border border-green-200">${APP.getIconSVG('Star', 'mx-auto mb-1 fill-green-400 text-green-400', 20)}<p class="font-bold text-green-600">4</p><p class="text-xs text-gray-600">Supera</p></div>
          <div class="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">${APP.getIconSVG('Star', 'mx-auto mb-1 fill-purple-400 text-purple-400', 20)}<p class="font-bold text-purple-600">5</p><p class="text-xs text-gray-600">Excepcional</p></div>
        </div>
      </div>

      <!-- Secciones dinámicas de competencias -->
      <div id="competency-sections-container"></div>

      <!-- Calificación global -->
      <div class="bg-white p-8 rounded-lg shadow-xl mb-6">
        <div class="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Calificación Global</h2>
          <div id="level-container" class="px-6 py-3 rounded-lg ${perf.bg} mt-4 md:mt-0">
            <p class="text-sm font-semibold text-gray-600">Nivel de Desempeño</p>
            <p id="level-text" class="level-text text-2xl font-bold ${perf.color}">${perf.text}</p>
          </div>
        </div>
        <div class="flex items-center justify-center mb-6">
          <div class="text-center">
            <p id="overall-score-number" class="text-7xl font-extrabold text-blue-600">${overall > 0 ? overall : '-'}</p>
            <p class="text-gray-600 mt-2">de 5.00</p>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg"><p class="text-sm text-gray-600 mb-1">Competencias Técnicas</p><p id="overall-avg-technicalSkills" class="text-2xl font-bold text-blue-600">0.0</p></div>
          <div class="text-center p-4 bg-purple-50 rounded-lg"><p class="text-sm text-gray-600 mb-1">Habilidades Blandas</p><p id="overall-avg-softSkills" class="text-2xl font-bold text-purple-600">0.0</p></div>
          <div class="text-center p-4 bg-green-50 rounded-lg"><p class="text-sm text-gray-600 mb-1">Liderazgo y Colaboración</p><p id="overall-avg-leadershipCollaboration" class="text-2xl font-bold text-green-600">0.0</p></div>
          <div class="text-center p-4 bg-orange-50 rounded-lg"><p class="text-sm text-gray-600 mb-1">Orientación a Resultados</p><p id="overall-avg-resultsOrientation" class="text-2xl font-bold text-orange-600">0.0</p></div>
          <div class="text-center p-4 bg-pink-50 rounded-lg"><p class="text-sm text-gray-600 mb-1">Desarrollo Profesional</p><p id="overall-avg-professionalDevelopment" class="text-2xl font-bold text-pink-600">0.0</p></div>
        </div>
      </div>

      <!-- Áreas abiertas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 no-print-grid">
        <div class="bg-white p-6 rounded-lg shadow-md"><h2 class="text-xl font-bold text-gray-800 mb-4">Cumplimiento de Objetivos y KPIs</h2><textarea id="comment-kpis" class="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Describa el cumplimiento de objetivos específicos...\n"style= "min-height: 10rem">${APP.comments.kpis || ''}</textarea></div>
        <div class="bg-white p-6 rounded-lg shadow-md"><h2 class="text-xl font-bold text-gray-800 mb-4">Fortalezas Destacadas</h2><textarea id="comment-strengths" class="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Identifique las principales fortalezas...\n" style= "min-height: 10rem">${APP.comments.strengths || ''}</textarea></div>
        <div class="bg-white p-6 rounded-lg shadow-md"><h2 class="text-xl font-bold text-gray-800 mb-4">Áreas de Oportunidad</h2><textarea id="comment-improvement" class="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Especifique las áreas de mejora...\n"style= "min-height: 10rem">${APP.comments.improvement || ''}</textarea></div>
        <div class="bg-white p-6 rounded-lg shadow-md"><h2 class="text-xl font-bold text-gray-800 mb-4">Plan de Desarrollo</h2><textarea id="comment-development" class="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Defina objetivos, capacitaciones, proyectos o acciones específicas...\n"style= "min-height: 10rem">${APP.comments.development || ''}</textarea></div>
      </div>

      <!-- Firmas -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold text-gray-800 mb-6" style="margin-bottom:10rem;">Firmas y Validación</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="border-t-2 border-gray-300 pt-4"><p class="font-semibold text-gray-700">Evaluado</p><p class="text-sm text-gray-500 mt-1">Firma y Fecha</p></div>
          <div class="border-t-2 border-gray-300 pt-4"><p class="font-semibold text-gray-700">Supervisor Directo</p><p class="text-sm text-gray-500 mt-1">Firma y Fecha</p></div>
          <div class="border-t-2 border-gray-300 pt-4"><p class="font-semibold text-gray-700">Gerencia/RRHH</p><p class="text-sm text-gray-500 mt-1">Firma y Fecha</p></div>
        </div>
      </div>

      <div class="text-center mt-8 text-sm text-gray-500"><p>Documento confidencial - Uso exclusivo para gestión de talento humano</p></div>
    `;

    const container = document.getElementById('competency-sections-container');
    container.innerHTML = '';
    APP.ALL_COMPETENCIES.forEach(s => container.appendChild(APP.renderCompetencySection(s.title, s.iconName, s.competencies, s.category, s.color)));

    APP.bindEmpForm();
    APP.bindCommentAreas();
    APP.updateAverages();
    APP.updateOverallScoreDisplay();

    document.getElementById('print-button').addEventListener('click', () => window.print());
    document.getElementById('import-button').addEventListener('click', () => document.getElementById('import-input').click());
    document.getElementById('export-json-button').addEventListener('click', APP.exportJSON);
    document.getElementById('export-csv-button').addEventListener('click', APP.exportCSV);
    document.getElementById('clear-button').addEventListener('click', APP.clearState);

    const importInput = document.getElementById('import-input');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          APP.importJSON(e.target.files[0]);
        }
      });
    }

    APP.renderDashboard();
  },
};

window.addEventListener('DOMContentLoaded', () => {
  APP.init();
});