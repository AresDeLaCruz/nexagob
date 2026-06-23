const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // 🔐 IMPORTANTE
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const db = require("./db");
const app = express();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nexagob@gmail.com",
    pass: "cbfj qdyn gloj kaaj"
  }
});


const client = new OAuth2Client(
  "275398566455-t55t4nleuplm6pvuj5cbape9ut483jdb.apps.googleusercontent.com"
);

app.use(cors());
app.use(express.json());

/* =========================
   🔹 RUTA BASE
========================= */
app.get("/", (req, res) => {
  res.send("API NexaGob funcionando 🚀");
});

/* =========================
   🔹 USUARIOS
========================= */
app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* =========================
   🔹 EMPLEADOS
========================= */

// Obtener empleados
app.get("/empleados", (req, res) => {
  db.query("SELECT * FROM usuarios WHERE id_rol = 2", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Crear empleado 🔐 (CON BCRYPT)
app.post("/empleados", async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO usuarios (nombre, email, password, id_rol) VALUES (?, ?, ?, 2)";

    db.query(sql, [nombre, email, hash], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Empleado creado" });
    });

  } catch (error) {
    res.status(500).json({ error: "Error al encriptar contraseña" });
  }
});

// Eliminar empleado
app.delete("/empleados/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Empleado eliminado" });
  });
});

// Actualizar empleado
app.put("/empleados/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;

  const sql = "UPDATE usuarios SET nombre = ?, email = ? WHERE id_usuario = ?";

  db.query(sql, [nombre, email, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Empleado actualizado" });
  });
});

/* =========================
   🔹 LOGIN 🔐
========================= */
app.post("/login", (req, res) => {
    const generarOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
  const { email, password } = req.body;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const user = result[0];

    // 🔐 Comparar contraseña encriptada
    const match = await bcrypt.compare(password, user.password);

    if (match) {

  // 🔥 1. ADMIN ENTRA SIN OTP
  if (user.id_rol === 1) {
    return res.json({
      success: true,
      user,
      otpRequired: false
    });
  }

  // 🔐 2. USUARIOS NORMALES SÍ OTP
  const otp = generarOTP();
  const expira = new Date(Date.now() + 5 * 60 * 1000);

  db.query(
    "UPDATE usuarios SET otp_codigo=?, otp_expira=? WHERE id_usuario=?",
    [otp, expira, user.id_usuario]
  );

  await transporter.sendMail({
    from: "NexaGob OTP",
    to: user.email,
    subject: "Tu código de verificación",
    html: `
      <h2>Tu código OTP es:</h2>
      <h1>${otp}</h1>
      <p>Expira en 5 minutos</p>
    `
  });

  return res.json({
    success: true,
    otpRequired: true,
    userId: user.id_usuario,
    user
  });
}
    else {
      res.json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }
  });
});

app.post("/verify-otp", (req, res) => {

  const { userId, otp } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE id_usuario=?",
    [userId],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.json({ success: false });
      }

      const user = result[0];

      if (
        user.otp_codigo === otp &&
        new Date(user.otp_expira) > new Date()
      ) {

        return res.json({
          success: true,
          user
        });

      } else {
        return res.json({
          success: false,
          message: "Código inválido o expirado"
        });
      }

    }
  );

});


app.get("/examenes", (req, res) => {
  db.query("SELECT * FROM examenes", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/examenes", (req, res) => {
  const { titulo, id_curso } = req.body;

  const sql = "INSERT INTO examenes (titulo, id_curso) VALUES (?, ?)";

  db.query(sql, [titulo, id_curso], (err, result) => {
    if (err) {
      console.log("ERROR:", err);
      return res.status(500).json(err);
    }

    console.log("ID EXAMEN:", result.insertId); // 👈 DEBUG

    res.json({
      id_examen: result.insertId
    });
  });
});

app.post("/preguntas", (req, res) => {
  const { id_examen, pregunta } = req.body;

  const sql = "INSERT INTO preguntas (id_examen, pregunta) VALUES (?, ?)";

  db.query(sql, [id_examen, pregunta], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id_pregunta: result.insertId });
  });
});

app.post("/respuestas", (req, res) => {
  const { id_pregunta, respuestas } = req.body;

  const values = respuestas.map(r => [
    id_pregunta,
    r.texto,
    r.correcta
  ]);

  const sql = "INSERT INTO respuestas (id_pregunta, respuesta, es_correcta) VALUES ?";

  db.query(sql, [values], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Respuestas guardadas" });
  });
});

app.get("/examen/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.id_pregunta,
      p.pregunta,
      r.id_respuesta,
      r.respuesta
    FROM preguntas p
    JOIN respuestas r ON p.id_pregunta = r.id_pregunta
    WHERE p.id_examen = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/resolver", (req, res) => {
  const { id_usuario, id_examen, respuestas } = req.body;

  const ids = respuestas.map(r => r.id_respuesta);
console.log("ENTRÓ A /resolver 🔥");
  console.log("BODY:", req.body);
  const sql = `
    SELECT id_respuesta, es_correcta 
    FROM respuestas 
    WHERE id_respuesta IN (?)
  `;

  db.query(sql, [ids], (err, result) => {
    if (err) return res.status(500).json(err);

    let correctas = 0;

    result.forEach(r => {
      if (r.es_correcta) correctas++;
    });

    const calificacion = (correctas / respuestas.length) * 10;

    // 🔥 GUARDAR RESULTADO
    const insertSql = `
      INSERT INTO resultados (id_usuario, id_examen, calificacion)
      VALUES (?, ?, ?)
    `;

   db.query(insertSql, [id_usuario, id_examen, calificacion], (err2) => {
  if (err2) {
    console.log("❌ ERROR INSERT:", err2); // 🔥 CLAVE
    return res.status(500).json(err2);
  }

  console.log("✅ INSERT OK"); // 🔥 CLAVE

  res.json({
    correctas,
    total: respuestas.length,
    calificacion
  });
});
  });

});
app.get("/resultados/:id_usuario", (req, res) => {
  const { id_usuario } = req.params;

  const sql = `
    SELECT r.*, e.titulo
    FROM resultados r
    JOIN examenes e ON r.id_examen = e.id_examen
    WHERE r.id_usuario = ?
  `;

  db.query(sql, [id_usuario], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.put("/examenes/:id", (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;

  const sql = "UPDATE examenes SET titulo = ? WHERE id_examen = ?";

  db.query(sql, [titulo, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Examen actualizado" });
  });
});

app.delete("/examenes/:id", (req, res) => {
  const { id } = req.params;

  console.log("🗑 Eliminando examen:", id);

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // 1. eliminar resultados 🔥 (LO QUE TE FALTABA)
    db.query("DELETE FROM resultados WHERE id_examen = ?", [id], (err0) => {
      if (err0) {
        return db.rollback(() => res.status(500).json(err0));
      }

      // 2. eliminar respuestas
      db.query(`
        DELETE FROM respuestas 
        WHERE id_pregunta IN (
          SELECT id_pregunta FROM preguntas WHERE id_examen = ?
        )
      `, [id], (err1) => {
        if (err1) {
          return db.rollback(() => res.status(500).json(err1));
        }

        // 3. eliminar preguntas
        db.query("DELETE FROM preguntas WHERE id_examen = ?", [id], (err2) => {
          if (err2) {
            return db.rollback(() => res.status(500).json(err2));
          }

          // 4. eliminar examen
          db.query("DELETE FROM examenes WHERE id_examen = ?", [id], (err3) => {
            if (err3) {
              return db.rollback(() => res.status(500).json(err3));
            }

            db.commit((err4) => {
              if (err4) {
                return db.rollback(() => res.status(500).json(err4));
              }

              console.log("✅ EXAMEN ELIMINADO COMPLETO");
              res.json({ message: "Examen eliminado correctamente" });
            });
          });
        });
      });
    });
  });
});

app.get("/examen-completo/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.id_pregunta,
      p.pregunta,
      r.id_respuesta,
      r.respuesta,
      r.es_correcta
    FROM preguntas p
    JOIN respuestas r ON p.id_pregunta = r.id_pregunta
    WHERE p.id_examen = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.put("/examen-completo/:id", (req, res) => {
  const { id } = req.params;
  const { preguntas, titulo } = req.body;

  // 🔥 actualizar título
  db.query("UPDATE examenes SET titulo = ? WHERE id_examen = ?", [titulo, id]);

  db.query("DELETE FROM preguntas WHERE id_examen = ?", [id], (err) => {
    if (err) return res.status(500).json(err);

    // 2. insertar nuevas
    preguntas.forEach(p => {
      db.query(
        "INSERT INTO preguntas (id_examen, pregunta) VALUES (?, ?)",
        [id, p.pregunta],
        (err2, result) => {
          if (err2) return;

          const idPregunta = result.insertId;

          const values = p.respuestas.map(r => [
            idPregunta,
            r.texto,
            r.correcta
          ]);

          db.query(
            "INSERT INTO respuestas (id_pregunta, respuesta, es_correcta) VALUES ?",
            [values]
          );
        }
      );
    });

    res.json({ message: "Examen actualizado completo" });
  });
});

app.post("/google-login", async (req, res) => {

  try {

    const { credential } = req.body;

    const ticket =
      await client.verifyIdToken({
        idToken: credential,
        audience:
          "275398566455-t55t4nleuplm6pvuj5cbape9ut483jdb.apps.googleusercontent.com",
      });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const nombre = payload.name;
    const email = payload.email;

    db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
      (err, result) => {

        if (err) {
          return res.status(500).json(err);
        }

      if (result.length === 0) {
  return res.json({
    success: false,
    message:
      "Tu correo no está autorizado por un ",
  });
}

return res.json({
  success: true,
  user: result[0],
});
       

        db.query(
          sql,
          [nombre, email, googleId],
          (err2, insertResult) => {

            if (err2) {
              return res.status(500).json(err2);
            }

            db.query(
              "SELECT * FROM usuarios WHERE id_usuario = ?",
              [insertResult.insertId],
              (err3, nuevoUsuario) => {

                if (err3) {
                  return res.status(500).json(err3);
                }

                res.json({
                  success: true,
                  user: nuevoUsuario[0],
                });

              }
            );

          }
        );

      }
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error Google Login",
    });

  }

});

/* =========================
   🚀 SERVER
========================= */
app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});