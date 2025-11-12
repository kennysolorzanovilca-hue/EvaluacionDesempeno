APP.createDashboardContainer = () => {
  const appContainer = document.getElementById('app');
  const existing = document.getElementById('dashboard-container');
  if (existing) existing.remove();

  const dash = document.createElement('div');
  dash.id = 'dashboard-container';
  dash.className = 'bg-white p-6 rounded-lg shadow-md mb-6';
  dash.innerHTML = `
    <h2 class="text-xl font-bold text-gray-800 mb-4">Dashboard — Promedios de Evaluación</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div id="chart-radar" style="height:360px;"></div>
      <div id="chart-gauge" style="height:360px;"></div>
    </div>
  `;
  appContainer.appendChild(dash);
};

APP.computeAverages = () => {
  return APP.ALL_COMPETENCIES.map(s => {
    const av = parseFloat(APP.calculateAverage(s.category, s.competencies));
    return isNaN(av) ? 0 : av;
  });
};

APP.computeRatingDistribution = () => {
  const counts = [0, 0, 0, 0, 0];
  APP.ALL_COMPETENCIES.forEach(sec => {
    sec.competencies.forEach(c => {
      const r = APP.getRating(sec.category, c.id);
      if (r >= 1 && r <= 5) counts[r - 1] += 1;
    });
  });
  return counts;
};

APP.renderDashboard = () => {
  APP.createDashboardContainer();

  const sectionNames = APP.ALL_COMPETENCIES.map(s => s.title);
  const avgs = APP.computeAverages();
  const dist = APP.computeRatingDistribution();
  let overall = parseFloat(APP.calculateOverallScore()) || 0;

  const radarDom = document.getElementById('chart-radar');
  const radarChart = echarts.init(radarDom);
  const radarOption = {
    title: { text: 'Promedio por Sección', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: {},
    radar: {
      indicator: APP.ALL_COMPETENCIES.map(s => ({ name: s.title, max: 5 })),
      radius: '65%'
    },
    series: [{
      name: 'Promedios',
      type: 'radar',
      data: [{ value: avgs, name: 'Promedio (1-5)' }],
      areaStyle: { opacity: 0.15 }
    }]
  };
  radarChart.setOption(radarOption);

  const gaugeDom = document.getElementById('chart-gauge');
  const gaugeChart = echarts.init(gaugeDom);
  const perfLevel = APP.getPerformanceLevel(overall);
  const gaugeOption = {
    title: { text: 'Puntaje Global', left: 'center', textStyle: { fontSize: 14 } },
    series: [{
      type: 'gauge',
      min: 0,
      max: 5,
      progress: {
        show: true,
        width: 18,
        itemStyle: {
          color: perfLevel.color
        }
      },
      axisLine: {
        lineStyle: {
          width: 18,
          color: [[overall / 5, perfLevel.color], [1, '#e5e7eb']] // Dynamic color based on score
        }
      },
      pointer: { length: '70%', width: 6 },
      detail: { valueAnimation: true, formatter: '{value}', fontSize: 18 },
      data: [{ value: overall, name: 'Global' }]
    }]
  };
  gaugeChart.setOption(gaugeOption);

  const charts = [radarChart, gaugeChart];
  const resizeAll = () => charts.forEach(c => c && c.resize());
  window.removeEventListener('resize', resizeAll);
  window.addEventListener('resize', resizeAll);

  if (window.__dashboardInterval) clearInterval(window.__dashboardInterval);
  window.__dashboardInterval = setInterval(() => {
    const newAvgs = APP.computeAverages();
    const newOverall = parseFloat(APP.calculateOverallScore()) || 0;

    radarChart.setOption({ series: [{ data: [{ value: newAvgs, name: 'Promedio (1-5)' }] }] });
    gaugeChart.setOption({ series: [{ data: [{ value: newOverall, name: 'Global' }] }] });

    overall = newOverall;
  }, 1000);
};