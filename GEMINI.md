# EVALUACION DE DESEMPEÑO
Sistema para evaluar el desempeño de empleados mediante formularios y reportes visuales.
## TECNOLOGIAS
usa html, js, css puro sin ningun framework. Se utiliza Tailwind CSS para la estructura responsive y estilos, y ECharts para la visualización de datos.
## OBJETIVOS 
Estandarizar la evaluación de desempeño para todos los roles del área de calidad
Combinar evaluación de habilidades técnicas específicas y habilidades blandas transversales
Generar un promedio automático por categoría y promedio general
Permitir visualización clara del desempeño mediante sistema de estrellas
Facilitar la identificación de fortalezas y áreas de mejora por colaborador
## FUNCIONALIDADES PRINCIPALES
1.COMPETENCIAS TÉCNICAS
-Dominio de conocimientos técnicos específicos del puesto
-Aplicación de metodologías y estándares de calidad
-Uso de herramientas y equipos especializados
-Capacidad de resolución de problemas técnicos
-Documentación y registro de actividades técnicas
-Cumplimiento de normativas y procedimientos de seguridad
-Actualización en tendencias y tecnologías del área
 
2.HABILIDADES BLANDAS
-Comunicación efectiva (oral y escrita)
-Trabajo en equipo y colaboración
-Adaptabilidad y gestión del cambio
-Gestión del tiempo y organización
-Proactividad e iniciativa
-Actitud positiva y compromiso
-Empatía y relaciones interpersonales
-Manejo de conflictos y negociación

3.LIDERAZGO Y COLABORACIÓN
-Capacidad de liderar proyectos o equipos (cuando aplique)
-Mentoría y apoyo a compañeros
-Coordinación efectiva con otras áreas
-Comunicación técnica en inglés (cuando aplique)
-Capacidad de influir positivamente en el equipo
-Delegación y seguimiento de tareas

4.ORIENTACIÓN A RESULTADOS
-Cumplimiento de metas y objetivos establecidos
-Calidad en la entrega de trabajos
-Eficiencia y optimización de procesos
-Identificación de oportunidades de mejora
-Compromiso con los plazos establecidos

5.DESARROLLO PROFESIONAL
-Participación en capacitaciones y entrenamientos
-Aplicación de nuevos conocimientos en el trabajo
-Interés en el crecimiento profesional
-Contribución a la innovación del área

## REQUISITOS ESPECÍFICOS

-Sistema de calificación de 1 a 5 estrellas (visual e interactivo)
-Cálculo automático de promedio por categoría
-Cálculo de promedio general de toda la evaluación
-Sección para datos del colaborador (nombre, puesto, fecha, evaluador)
-Sección de comentarios generales al final
-Diseño responsive (móvil, tablet, desktop)
-Colores alineados con identidad corporativa de Resemin
-Impresión/exportación limpia sin elementos innecesarios

## DISEÑO UI/UX

Estilo: Corporativo, profesional, moderno, limpio
Responsive: Sí (mobile-first)
Colores:

Primario: #2563eb (azul corporativo)
Secundario: #1e40af (azul oscuro)
Acento: #fbbf24 (amarillo/dorado para estrellas)
Fondo: #f8fafc (gris claro)
Texto: #1e293b (gris oscuro)


Componentes:

Header con logo y título: RESEMIN 
Cards por categoría de competencias
Sistema de estrellas interactivo (hover y click)
Badges para mostrar promedios
Botones de acción (Guardar, Imprimir, Limpiar)
Footer con promedio general destacado



## NOTAS PARA LA IA

Usar clases de Tailwind CSS para estructura responsive (en lugar de Bootstrap 5, ya que Tailwind CSS está implementado).
Implementar sistema de estrellas con iconos (★ ☆)
Código JavaScript bien comentado en español
Funciones modulares y reutilizables
Validar que todos los campos estén calificados antes de calcular promedio
localStorage para guardar evaluaciones en progreso (opcional)
Animaciones suaves en las interacciones
Accesibilidad: labels claros, contraste adecuado, navegación por teclado

## FLUJO DE USUARIO

-Ingresa datos del evaluado 
 Nombre Completo
 Dni de empleado
 Area: que se desplegue 2 opciones ( calidad - ate, calidad - priale)
 Especializacion: que se pueda desplegar opciones como para poder escojer lo siguientes (Especialista hidraulico, especialista electrico, especialista de automatizacion, especialista , Inspector de calidad B&V, Inspector de calidad en bahias 1, supervisor de area, Desarrollador Senior Fullstack, Desarrollador full stak, Arquitecto de datos, Control estructural I, Control estructural II, Especialista en fabricacion)
 Jefe directo: que se desplique Carlos Roman
 Periodo de evaluacion: en esete caso que se pueda deplegar un pequeño calendario debajo para poder ingresar desde que fehca hasata que fecha se esta evaluando
 Fecha de evaluacion: del mismo modo que se despliegue un pequeño calendario par aponer la fecha.
-Recorre cada categoría calificando cada ítem con estrellas
-Observa el promedio de cada categoría actualizarse automáticamente
-Ve el promedio general al finalizar
-Agrega comentarios generales (opcional)
-Firmas y validacion
-Dashboard de radar de acuerdo al promedio de su evlauacion
-Guarda o imprime la evaluación y un velocimetro del promedio general donde debe estar por color deacuerdo a su promedio representando bueno malo regular o bueno.


ESCALA DE CALIFICACIÓN

⭐ (1 estrella): Necesita Mejora Significativa
⭐⭐ (2 estrellas): Por Debajo de las Expectativas
⭐⭐⭐ (3 estrellas): Cumple las Expectativas
⭐⭐⭐⭐ (4 estrellas): Supera las Expectativas
⭐⭐⭐⭐⭐ (5 estrellas): Desempeño Excepcional