//Importando paquetes
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//Importadno y configurando dotenv
require("dotenv").config();

//Ejecutar express y guardar una instancia en app
const app = express();

//Agregando middlewares a traves del metodo use() de express
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

try {
  mongoose.connect(mongoUri);
  console.log("Conectado a MongoDB");
} catch (error) {
  console.error("Error de conexión", error);
}

//Crea un modelo de los datos

const libroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
});

const Libro = mongoose.model("Libro", libroSchema);

//Endpoint (Rutas)
//Crear un libro
app.post("/libros", async (req, res) => {
  const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
  });

  try {
    await libro.save();
    res.json(libro);
  } catch (error) {
    res.status(500).send("Error al guardar el libro");
  }
});

//Obtener un libro por su id
app.get("/libros/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const libro = await Libro.findById(id);

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al buscar el libro");
  }
});

//Obtener todos los libros
app.get("/libros", async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).send("Error al obtener los libros");
  }
});

//Eliminar un libro por su id
app.delete("/libros/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const libro = await Libro.findByIdAndDelete(id);

    if (libro) {
      res.json({ mensaje: "Libro eliminado correctamente" });
    } else {
      res.status(404).send("Id de libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al buscar el id");
  }
});

//Actualizar un libro por su id
app.put("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        titulo: req.body.titulo,
        autor: req.body.autor,
      },
      { new: true }
    );

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al actualizar el libro");
  }
});

app.get("/", (req, res) => {
  res.send("Bienvenido a la tienda de libros");
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
