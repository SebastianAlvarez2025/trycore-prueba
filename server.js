const express = require('express');
const { z } = require('zod');
const { calcularMatch } = require ('./matcher');

const app = express();
app.use(express.json());

/**
 * Esquema de validación Zod.
 * Garantizamos que los tipos de datos cumplan con el contrato especificado.
 */
const matchSchema = z.object({
    candidato: z.object({
        skills: z.array(z.string({
            invalid_type_error: "Las skills deben ser una lista de cadenas de texto."
        })),
        experiencia_anios: z.number({
            required_error: "El campo de experiencia en años es obligatorio",
            invalid_type_error: "Las experiencia en años debe ser un número entero."
        }).int().nonnegative("La experiencia no puede ser un número negativo.")
    }),
    vacante: z.object({
        skills_requeridas: z.array(z.string({
            invalid_type_error: "Las skills deben ser una lista de cadenas de texto."
        })),
        experiencia_min: z.number({
            required_error: "El campo de experiencia mínima es obligatorio",
            invalid_type_error: "Las experiencia mínima debe ser un número entero."
        }).int().nonnegative("La experiencia no puede ser un número negativo."),
        tipo_contrato: z.enum(["indefinido", "obra_labor", "prestacion_servicios"], {
            errorMap: () => ({
                message: "El tipo de contrato debe ser 'indefinido', 'obra_labor' o 'prestacion_servicios'"
            })
        })
    })
});

//Endpoint POST para petición JSON del candidato..
app.post('/match', (req, res) => {
    try{
        const data = matchSchema.parse(req.body);
        //Ejecutamos el servicio de matching.
        const resultado = calcularMatch(data.candidato, data.vacante);

        return res.status(200).json(resultado)
    }catch (error){
        return res.status(400).json({
            error: "Datos de entrada no válidos",
            detalle: error.errors || error.message
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor microservicio de match corriendo en http://localhost:${PORT}`)
})