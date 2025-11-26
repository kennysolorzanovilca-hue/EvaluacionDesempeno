// server.js

// --- Imports ---
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

// --- Configuration ---
const app = express();
const port = 3000;

// Database connection string provided by the user
const dbConfig = {
    server: '10.0.47.94',
    database: 'DEV_Quality',
    user: 'sa',
    password: 'P@ssw0rd',
    options: {
        trustServerCertificate: true // As specified in the connection string
    }
};

// --- Middleware ---
// Enable CORS for all routes to allow the frontend to connect
app.use(cors());
// Enable parsing of JSON bodies in POST requests
app.use(express.json());


// --- Routes ---
app.get('/', (req, res) => {
    res.send('Backend para Evaluación de Desempeño está funcionando.');
});

// The endpoint to save an evaluation
app.post('/api/save-evaluation', async (req, res) => {
    console.log('Recibida solicitud para guardar evaluación...');

    // Get the evaluation data from the request body
    const evaluationData = req.body;

    // Basic validation
    if (!evaluationData || !evaluationData.employeeInfo || !evaluationData.employeeInfo.name) {
        console.error('Error: Datos de evaluación inválidos o incompletos.');
        return res.status(400).json({ success: false, message: 'Datos de evaluación inválidos o incompletos.' });
    }

    try {
        console.log('Conectando a la base de datos...');
        await sql.connect(dbConfig);
        console.log('Conexión exitosa.');

        const request = new sql.Request();

        // Prepare the data for insertion
        const employeeName = evaluationData.employeeInfo.name;
        const evaluationDate = evaluationData.employeeInfo.date ? new Date(evaluationData.employeeInfo.date) : new Date();
        const evaluationJson = JSON.stringify(evaluationData);

        // Define the SQL query with parameters to prevent SQL injection
        const query = `
            INSERT INTO Evaluations (EmployeeName, EvaluationDate, EvaluationData)
            VALUES (@EmployeeName, @EvaluationDate, @EvaluationData)
        `;

        // Bind the parameters
        request.input('EmployeeName', sql.NVarChar(255), employeeName);
        request.input('EvaluationDate', sql.Date, evaluationDate);
        request.input('EvaluationData', sql.NVarChar(sql.MAX), evaluationJson);

        console.log('Ejecutando la consulta SQL...');
        const result = await request.query(query);
        console.log('Consulta ejecutada con éxito. Filas afectadas:', result.rowsAffected);

        res.status(200).json({ success: true, message: 'Evaluación guardada con éxito.' });

    } catch (err) {
        console.error('Error al conectar o guardar en la base de datos:', err);
        res.status(500).json({ success: false, message: 'Error del servidor al guardar la evaluación.', error: err.message });
    } finally {
        // Close the connection
        await sql.close();
        console.log('Conexión a la base de datos cerrada.');
    }
});


// --- Server Start ---
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
