const test = require ('node:test');
const assert = require ('node:assert');
const { calcularMatch } = require ('./matcher');

test ('Caso EXCELLENT_FIT', () => {
    const candidato = { skills: ["Java", "Spring", "SQL"], experiencia_anios: 5};
    const vacante = { skills_requeridas: ["Java", "Spring", "SQL"], experiencia_min: 3, tipo_contrato: "indefinido"};
    const res = calcularMatch(candidato, vacante);
    assert.strictEqual(res.categoria, "EXCELLENT_FIT");
    assert.ok(res.scoreBruto >= 85, `El score no alcanza el mínimo esperado.`)
})

test ('Caso NO_FIT', () => {
    const candidato = { skills: ["HTML"], experiencia_anios: 0};
    const vacante = { skills_requeridas: ["Java", "Spring", "SQL"], experiencia_min: 3, tipo_contrato: "prestacion_Servicios"};
    const res = calcularMatch(candidato, vacante);
    assert.strictEqual(res.categoria, "NO_FIT");
    assert.ok(res.scoreBruto < 40, `Score esperado < 40, obtenido ${res.scoreBruto}`)
})

test ('Caso GOOD_FIT', () => {
    const candidato = { skills: ["java", "spring", "sql"], experiencia_anios: 3};
    const vacante = { skills_requeridas: ["java", "spring", "kafka", "sql"], experiencia_min: 5, tipo_contrato: "obra_labor"};
    const res = calcularMatch(candidato, vacante);

    assert.strictEqual(res.categoria, "GOOD_FIT");
    assert.strictEqual(res.cobertura_skills, 0.75);
    assert.strictEqual(res.brecha_experiencia, 2)
})



test ('Caso MAYBE ', () => {
    const candidato = { skills: ["javascript"], experiencia_anios: 2};
    const vacante = { skills_requeridas: [], experiencia_min: 2, tipo_contrato: "indefinido"};
    const res = calcularMatch(candidato, vacante);

    assert.strictEqual(res.cobertura_skills, 1.0);
})

test ('Caso borde: skills_requeridas vacia', () => {
    const candidato = { skills: ["javascript"], experiencia_anios: 2};
    const vacante = { skills_requeridas: [], experiencia_min: 2, tipo_contrato: "indefinido"};
    const res = calcularMatch(candidato, vacante);

    assert.strictEqual(res.cobertura_skills, 1.0);
})

test('Caso borde: exceso de experiencia no descuenta', () => {
    const candidato = { skills: ["node"], experiencia_anios: 10};
    const vacante = { skills_requeridas: ["node"], experiencia_min: 2, tipo_contrato: "prestacion_servicios"};
    const res = calcularMatch(candidato, vacante);

    assert.strictEqual(res.brecha_experiencia, 0);
})