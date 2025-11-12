APP.technicalSkills = [
  { id: 'dominio_conocimientos', name: 'Domina y aplica correctamente metodologías ágiles como Kanban y Scrum para la planificación efectiva de sprints y seguimiento de entregables', description: '', category: 'technicalSkills' },
  { id: 'aplicacion_metodologias', name: 'Gestiona eficientemente proyectos de transformación digital cumpliendo con cronogramas y resolviendo impedimentos técnicos del equipo', description: '', category: 'technicalSkills' },
  { id: 'uso_herramientas', name: 'Utiliza de manera avanzada herramientas digitales especializadas como SAP, Planner, Power Automate y plataforma CONCYTEC', description: '', category: 'technicalSkills' },
  { id: 'resolucion_problemas_tecnicos', name: 'Implementa herramientas de mejora continua y generando resultados medibles', description: '', category: 'technicalSkills' },
  { id: 'documentacion_registro', name: 'Desarrolla prototipos de materiales y componentes ejecutando pruebas comparativas para validar mejoras', description: '', category: 'technicalSkills' },
  { id: 'cumplimiento_normativas', name: 'Elabora reportes técnicos, dashboards y presentaciones con análisis de desviaciones y propuestas de acciones correctivas', description: '', category: 'technicalSkills' },
  { id: 'actualizacion_tendencias', name: 'Controla el presupuesto del proyecto y gestiona correctamente SOLPEDS en SAP clasificando adecuadamente gastos y activos', description: '', category: 'technicalSkills' }
];

APP.softSkills = [
  { id: 'comunicacion_efectiva', name: 'Comunicación efectiva (oral y escrita)', description: '', category: 'softSkills' },
  { id: 'trabajo_equipo', name: 'Trabajo en equipo y colaboración', description: '', category: 'softSkills' },
  { id: 'adaptabilidad_cambio', name: 'Adaptabilidad y gestión del cambio', description: '', category: 'softSkills' },
  { id: 'gestion_tiempo', name: 'Gestión del tiempo y organización', description: '', category: 'softSkills' },
  { id: 'proactividad_iniciativa', name: 'Proactividad e iniciativa', description: '', category: 'softSkills' },
  { id: 'actitud_compromiso', name: 'Actitud positiva y compromiso', description: '', category: 'softSkills' },
  { id: 'empatia_interpersonales', name: 'Empatía y relaciones interpersonales', description: '', category: 'softSkills' },
  { id: 'manejo_conflictos', name: 'Manejo de conflictos y negociación', description: '', category: 'softSkills' }
];

APP.leadershipCollaboration = [
  { id: 'liderar_proyectos', name: 'Capacidad de liderar proyectos o equipos (cuando aplique)', description: '', category: 'leadershipCollaboration' },
  { id: 'mentoria_apoyo', name: 'Mentoría y apoyo a compañeros', description: '', category: 'leadershipCollaboration' },
  { id: 'coordinacion_areas', name: 'Coordinación efectiva con otras áreas', description: '', category: 'leadershipCollaboration' },
  { id: 'comunicacion_ingles', name: 'Comunicación técnica en inglés (cuando aplique)', description: '', category: 'leadershipCollaboration' },
  { id: 'influir_positivamente', name: 'Capacidad de influir positivamente en el equipo', description: '', category: 'leadershipCollaboration' },
  { id: 'delegacion_seguimiento', name: 'Delegación y seguimiento de tareas', description: '', category: 'leadershipCollaboration' }
];

APP.resultsOrientation = [
  { id: 'cumplimiento_metas', name: 'Cumplimiento de metas y objetivos establecidos', description: '', category: 'resultsOrientation' },
  { id: 'calidad_entregas', name: 'Calidad en la entrega de trabajos', description: '', category: 'resultsOrientation' },
  { id: 'eficiencia_optimizacion', name: 'Eficiencia y optimización de procesos', description: '', category: 'resultsOrientation' },
  { id: 'identificacion_oportunidades', name: 'Identificación de oportunidades de mejora', description: '', category: 'resultsOrientation' },
  { id: 'compromiso_plazos', name: 'Compromiso con los plazos establecidos', description: '', category: 'resultsOrientation' }
];

APP.professionalDevelopment = [
  { id: 'participacion_capacitaciones', name: 'Participación en capacitaciones y entrenamientos', description: '', category: 'professionalDevelopment' },
  { id: 'aplicacion_conocimientos', name: 'Aplicación de nuevos conocimientos en el trabajo', description: '', category: 'professionalDevelopment' },
  { id: 'interes_crecimiento', name: 'Interés en el crecimiento profesional', description: '', category: 'professionalDevelopment' },
  { id: 'contribucion_innovacion', name: 'Contribución a la innovación del área', description: '', category: 'professionalDevelopment' }
];

APP.ALL_COMPETENCIES = [
  { title: 'Competencias Técnicas', iconName: 'TrendingUp', competencies: APP.technicalSkills, category: 'technicalSkills', color: 'from-blue-800 to-blue-900' },
  { title: 'Habilidades Blandas', iconName: 'Award', competencies: APP.softSkills, category: 'softSkills', color: 'from-purple-500 to-purple-600' },
  { title: 'Liderazgo y Colaboración', iconName: 'Users', competencies: APP.leadershipCollaboration, category: 'leadershipCollaboration', color: 'from-green-500 to-green-600' },
  { title: 'Orientación a Resultados', iconName: 'Target', competencies: APP.resultsOrientation, category: 'resultsOrientation', color: 'from-orange-500 to-orange-600' },
  { title: 'Desarrollo Profesional', iconName: 'Lightbulb', competencies: APP.professionalDevelopment, category: 'professionalDevelopment', color: 'from-pink-500 to-pink-600' }
];