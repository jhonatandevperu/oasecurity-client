const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const hbs = require("handlebars");
const dotenv = require("dotenv");
dotenv.config();
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const jsonWebTokenConfig = require("./config/jsonWebTokenConfig");
const cookieParser = require("cookie-parser");

//Configuraciones
app.set("port", process.env.PORT);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./config/handlebarsConfig"),
    handlebars: allowInsecurePrototypeAccess(hbs),
  })
);
app.set("view engine", ".hbs");

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("app_1"));

const cookieOptions = {
  maxAge: 24 * 3600000, //expira en 24 horas
  httpOnly: true,
  secure: process.env.ENTORNO === "produccion" ? true : false,
  signed: true,
};

//Rutas
app.get("/", async (req, res) => {
  res.send("Bienvido a la aplicación").end();
});

app.get("/privado", (req, res) => {
  try {
    const { userCookie } = req.signedCookies;
    if (userCookie) {
      return res.render("index", {
        usuario: userCookie,
      });
    } else {
      const bearerHeader = req.headers["authorization"];
      if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        let usuario = jsonWebTokenConfig.verify(bearerToken);
        res.cookie("userCookie", usuario, cookieOptions);
        return res.status(200).end();
      }
      return res.render("error");
    }
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
});

app.get("/logout", async (req, res) => {
  res.clearCookie("userCookie").redirect(process.env.OASECURITY_ADMIN);
});

//Iniciando el servidor
app.listen(app.get("port"), () => {
  console.log(`Servidor ejecutándose por el puerto ${app.get("port")}`);
});
