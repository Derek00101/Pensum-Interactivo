import express from "express";
import path from "path";
import appRouter from "./routes/application.route";

const app = express();
const PORT = 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static('public'));
app.use(express.text());

app.use(appRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



