import express from "express";
import analyzeRouter from "./routes/analyze.route";

const app = express();
const PORT = 4000; // Cambiamos el puerto para evitar conflictos

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());
app.use(express.text());  // Asegúrate de que esta línea esté presente
app.use(express.urlencoded({ extended: true }));

// Ruta principal para mostrar el editor del pensum
app.get('/pensum', (req, res) => {
    res.render('pages/index', { tokens: [], errors: [], input: '' });
});

// Usamos el router con un prefijo para todas las rutas relacionadas con el pensum
app.use('/pensum', analyzeRouter);

app.listen(PORT, () => {
    console.log(`El servidor del Pensum está corriendo en http://localhost:${PORT}/pensum`);
});