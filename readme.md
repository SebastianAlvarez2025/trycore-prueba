# Trycore Micro-Service (node.js)

Microservicio desarrollado en Node.js con Express y ZOD para evaluar el nivel de compatibilidad entre un candidato y una vacante laboral.

Decisiones de diseño y casos borde: 
1. Skills requeridas vacías ([]): 
— Si la vacante no especifica las habilidades requeridas, se asume automaticamente la cobertura al 100%, dado que la vacante no exige restricciones técnicas.
2. Exceso de experiencia (experiencia_anios > experiencia_min):
La brecha se calcula mediante max(0, experiencia_min - experiencia_anios). Si el candidato supera la experiencia mínima. La brecha es 0, esto evita restar puntos o aplicar "penalizaciones".
3. Conversión a minúsculas y eliminación de los espacios finales o iniciales.

Dependencias y como correr el servicio.
Tener instado node en su versión 24.21.0 (https://nodejs.org/es)
- Instalacion de dependencias: npm i 
- Correr el microservicio: npm start.
- Correr las pruebas unitarias: npm test.