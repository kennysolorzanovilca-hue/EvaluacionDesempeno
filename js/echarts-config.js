APP.createDashboardContainer = () => {
  const appContainer = document.getElementById('app');
  const existing = document.getElementById('dashboard-container');
  if (existing) existing.remove();

  const dash = document.createElement('div');
  dash.id = 'dashboard-container';
  dash.className = 'bg-white p-6 rounded-lg shadow-md mb-6';
  dash.innerHTML = `
    <h2 class="text-xl font-bold text-gray-800 mb-4">Dashboard — Promedios de Evaluación</h2>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4" style="display: flex; flex-direction: column; padding-bottom:2rem;">
      <div id="chart-radar" style="height:400px;"></div>
      <div id="chart-gauge" style="height:400px;"></div>
      <div id="chart-kpi-bar" style="height:400px;"></div>
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
    title: { text: 'Puntaje Global', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold' } },
    series: [{
      type: 'gauge',
      min: 0,
      max: 5,
      splitNumber: 5,
      radius: '90%',
      progress: { show: true, width: 20 },
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.2, '#ef4444'], // 1
            [0.4, '#f97316'], // 2
            [0.6, '#facc15'], // 3
            [0.8, '#22c55e'], // 4
            [1, '#16a34a']    // 5
          ]
        }
      },
      axisTick: { show: false },
      splitLine: { distance: -20, length: 20, lineStyle: { color: '#fff', width: 2 } },
      axisLabel: { distance: 35, color: '#999', fontSize: 14 },
      anchor: { show: true, showAbove: true, size: 20, itemStyle: { borderWidth: 10 } },
      pointer: { length: '80%', width: 8, itemStyle: { color: 'auto' } },
      detail: { valueAnimation: true, formatter: '{value}', fontSize: 30, offsetCenter: [0, '70%'], color: 'auto' },
      data: [{ value: overall, name: 'Promedio' }]
    }]
  };
  gaugeChart.setOption(gaugeOption);

  const kpiGaugeDom = document.getElementById('chart-kpi-bar');
  const kpiGaugeChart = echarts.init(kpiGaugeDom);
  const kpiGaugeOption = {
    title: { text: 'KPI Task Score', left: 'center', textStyle: { fontSize: 16, fontWeight: 'bold' } },
    series: [{
      type: 'gauge',
      min: 0,
      max: 100,
      radius: '90%',
      progress: { show: true, width: 20 },
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.2, '#ef4444'],
            [0.4, '#f97316'],
            [0.6, '#facc15'],
            [0.8, '#22c55e'],
            [1, '#16a34a']
          ]
        }
      },
      axisTick: { show: false },
      splitLine: { distance: -20, length: 20, lineStyle: { color: '#fff', width: 2 } },
      axisLabel: { distance: 35, color: '#999', fontSize: 12 },
      detail: { valueAnimation: true, formatter: '{value}%', fontSize: 30, offsetCenter: [0, '70%'], color: 'auto' },
      data: [{ value: 0, name: 'KPI %' }]
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

    radarChart.setOption({ series: [{ data: [{ value: newAvgs }] }] });
    gaugeChart.setOption({ series: [{ data: [{ value: newOverall }] }] });

    const kpiAvg = parseFloat(APP.calculateKpiAverage()) || 0;
    const kpiPercent = (kpiAvg / 5) * 100;

    kpiGaugeChart.setOption({
      series: [{
        data: [{ value: kpiPercent.toFixed(1) }]
      }]
    });
  };

  if (window.__dashboardInterval) clearInterval(window.__dashboardInterval);
  window.__dashboardInterval = setInterval(APP.updateAllCharts, 1000);
};