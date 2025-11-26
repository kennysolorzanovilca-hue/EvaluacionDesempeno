APP.createDashboardContainer = () => {
  const appContainer = document.getElementById('app');
  const existing = document.getElementById('dashboard-container');
  if (existing) existing.remove();

  const dash = document.createElement('div');
  dash.id = 'dashboard-container';
  dash.className = 'bg-white p-6 rounded-lg shadow-md mb-6';
  dash.innerHTML = `
    <h2 class="text-xl font-bold text-gray-800 mb-4">Dashboard — Promedios de Evaluación</h2>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div id="chart-radar" style="height:360px;"></div>
      <div id="chart-gauge" style="height:360px;"></div>
      <div id="chart-kpi-bar" style="height:360px;"></div>
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
      progress: { show: true, width: 18 },
      axisLine: { lineStyle: { width: 18 } },
      pointer: { length: '70%', width: 6 },
      detail: { valueAnimation: true, formatter: '{value}', fontSize: 18 },
      data: [{ value: overall, name: 'Global' }]
    }]
  };
  gaugeChart.setOption(gaugeOption);

  const kpiGaugeDom = document.getElementById('chart-kpi-bar'); // Reusing the div
  const kpiGaugeChart = echarts.init(kpiGaugeDom);
  const kpiGaugeOption = {
    title: { text: 'Score Ponderado KPI', left: 'center', textStyle: { fontSize: 14 } },
    series: [{
        type: 'gauge',
        min: 0,
        max: 100, // Weighted score is 0-100
        progress: { show: true, width: 18 },
        axisLine: { lineStyle: { width: 18 } },
        pointer: { length: '70%', width: 6 },
        detail: { valueAnimation: true, formatter: '{value}%', fontSize: 18 },
        data: [{ value: 0, name: 'KPI Score' }]
    }]
  };
  kpiGaugeChart.setOption(kpiGaugeOption);


  const charts = [radarChart, gaugeChart, kpiGaugeChart];
  const resizeAll = () => charts.forEach(c => c && c.resize());
  window.removeEventListener('resize', resizeAll);
  window.addEventListener('resize', resizeAll);

  APP.updateAllCharts = () => {
    const newAvgs = APP.computeAverages();
    const newOverall = parseFloat(APP.calculateOverallScore()) || 0;
    const newPerfLevel = APP.getPerformanceLevel(newOverall);
    
    radarChart.setOption({ series: [{ data: [{ value: newAvgs }] }] });
    
    gaugeChart.setOption({ 
        series: [{ 
            data: [{ value: newOverall }],
            progress: { itemStyle: { color: newPerfLevel.color } },
            axisLine: { lineStyle: { color: [[newOverall / 5, newPerfLevel.color], [1, '#e5e7eb']] } }
        }] 
    });

    // Update KPI Gauge Chart
    const kpis = APP.calculateAllKpis();
    const weightedScore = parseFloat(kpis.weightedScore) || 0;
    const kpiScoreLevel = APP.getFinalKpiScore(weightedScore);
    let kpiColor = '#d1d5db'; // Default gray
    if (kpiScoreLevel.value === '5/5') kpiColor = '#16a34a'; // green-600
    else if (kpiScoreLevel.value === '4/5') kpiColor = '#22c55e'; // green-500
    else if (kpiScoreLevel.value === '3/5') kpiColor = '#facc15'; // yellow-400
    else if (kpiScoreLevel.value === '2/5') kpiColor = '#f97316'; // orange-500
    else if (kpiScoreLevel.value === '1/5') kpiColor = '#ef4444'; // red-500

    kpiGaugeChart.setOption({
        series: [{
            data: [{ value: weightedScore }],
            progress: { itemStyle: { color: kpiColor } },
            axisLine: { lineStyle: { color: [[weightedScore / 100, kpiColor], [1, '#e5e7eb']] } }
        }]
    });
  };

  if (window.__dashboardInterval) clearInterval(window.__dashboardInterval);
  window.__dashboardInterval = setInterval(APP.updateAllCharts, 1000);
};