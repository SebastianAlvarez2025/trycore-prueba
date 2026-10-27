function calcularMatch (candidato, vacante){
    // Conversión a minúsculas y eliminación de los espacios finales o iniciales.
    const skillsCandidato = (candidato.skills || []).map(s => s.toLowerCase().trim());
    const experienciaAnios = candidato.experiencia_anios || 0;

    const skillsRequeridas = (vacante.skills_requeridas || []).map(s => s.toLowerCase().trim());
    const experienciaMin = vacante.experiencia_min || 0;
    const tipoContrato = vacante.tipo_contrato || "prestacion_servicios";

    
    const totalReq = skillsRequeridas.length;
    let coberturaSkills = 1.0; 
    let coberturaPorcentaje = 100;
    let contadorMatch = 0; 

    // Si la vacante no especifica las skills requeridas, la cobertura se asume al 100%.
    if(totalReq > 0){
        const matches = skillsRequeridas.filter(s => skillsCandidato.includes(s));
        contadorMatch = matches.length;
        coberturaSkills = contadorMatch / totalReq;
        coberturaPorcentaje = Math.round(coberturaSkills * 100);
    }

    // Si los años superan los requeridos, brechaExperiencia es 0
    const brechaExperiencia = Math.max(0, experienciaMin - experienciaAnios);

    let bonusContrato = 0;
    let textoContrato = "Prestación de servicios no suma puntos."

    // Cambiamos bonus y texto dependiendo el tipo de contrato.
    if(tipoContrato === "indefinido"){
        bonusContrato = 10;
        textoContrato = "Contrato por término indefinido suma 10 puntos."
    } else if (tipoContrato === "obra_labor"){
        bonusContrato = 5;
        textoContrato = "Contrato por obra labor suma 5 puntos."
    }

    const scoreBruto = (
        (coberturaSkills * 70) + (Math.max(0, 1 - (brechaExperiencia / 5)) * 20) + bonusContrato
    )

    //Tipos de categoría dependiendo el score obtenido.
    let categoria = "NO_FIT";
    if(scoreBruto >= 85){
        categoria = "EXCELLENT_FIT";
    }else if (scoreBruto >= 65){
        categoria = "GOOD_FIT";
    }else if (scoreBruto >= 40){
        categoria = "MAYBE";
    }

    // Razones explicativas.
    const razones = [];

    // No se requirieron skilles para la vacante o cobertura de skills dependiendo las habilidades obtenidas por el candidato..
    if(totalReq === 0){
        razones.push("No se requirieron skills especificadas (cobertura 100%)");
    } else { 
        razones.push(`Cobertura de skills ${contadorMatch}/${totalReq} (${coberturaPorcentaje}%)`)
    }

    // Brecha de experiencia si tiene mas experiencia de la requerida, o si no.
    if(brechaExperiencia > 0){
        razones.push(`Brecha de experiencia: ${brechaExperiencia} años (penalización aplicada)`)
    } else {
        razones.push("Experiencia cumple o supera el mínimo requerido.")
    }

    // Impacto del tipo de contrato.
    razones.push(textoContrato);

    //Información de la puntuación botenida.
    return {
        scoreBruto,
        categoria,
        cobertura_skills: Number(coberturaSkills.toFixed(2)),
        brecha_experiencia: brechaExperiencia,
        razones: razones.slice(0, 3)
    };
}

module.exports = { calcularMatch };