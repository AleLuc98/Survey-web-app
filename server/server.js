"use strict";

const express = require("express");
const {
  check,
  validationResult,
  expressValidator,
} = require("express-validator"); 
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; 
const session = require("express-session"); 
const userDao = require("./user-dao"); 
const quizDao = require("./quiz-dao"); 

const app = new express();
const port = 3001;

app.use(express.json());
app.use(cors());

passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated" });
};

// set up the session
app.use(
  session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret:
      "a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

//GET /api/quiz - ritorna tutti i quzi del sistema
app.get("/api/quiz", (req, res) => {
  quizDao
    .getQuiz()
    .then((response) => res.send(response))
    .catch(() => res.status(500).end());
});

//GET /api/myquiz - ritorna tutti i quiz da me creati
app.get("/api/myquiz", isLoggedIn, (req, res) => {
  quizDao
    .getMyQuiz(req.user)
    .then((response) => res.send(response))
    .catch(() => res.status(500).end());
});

//GET /api/myquiz - ritorna le domande del quiz
app.get("/api/quiz_:id", [check("id").isInt()], (req, res) => {
  quizDao
    .getQuizQuestions(req.params.id)
    .then((response) => res.send(response))
    .catch(() => res.status(500).end());
});

//GET /api/myquiz - ritorna tutti le risposte al quiz date dall'utilizzatore
app.get(
  "/api/quizAnswers_:id/:utilizzatore",
  [check("id").isInt(), check("utilizzatore").isInt()],
  (req, res) => {
    quizDao
      .getQuizAnswers(req.params.id, req.params.utilizzatore)
      .then((response) => res.send(response))
      .catch(() => res.status(500).end());
  }
);

//GET /api/myquiz - ritorna il titolo e il numero di compilazioni del quiz
app.get("/api/quizTitle_:id", [check("id").isInt()], (req, res) => {
  quizDao
    .getQuizTitle(req.params.id)
    .then((response) => res.send(response))
    .catch(() => res.status(500).end());
});

//GET /api/myquiz - ritorna le opzioni a risposta chiusa per una domanda
app.get("/api/answers_:id", [check("id").isInt()], (req, res) => {
  quizDao
    .getAnswers(req.params.id)
    .then((response) => res.send(response))
    .catch(() => res.status(500).end());
});

//GET /api/myquiz - ritorna l'ID più alto nella tabella dei quiz
app.get("/api/getIDQuiz", (req, res) => {
  quizDao
    .getIDQuiz()
    .then((response) => res.send(response))
    .catch(() => res.status(500).end());
});

//POST /api/myquiz - aggiunge un quiz
app.post(
  "/api/pubblicaQuiz",
  isLoggedIn,
  [check("title").not().isEmpty()],
  (req, res) => {
    quizDao
      .pubblicaQuiz(req.body.title, req.user)
      .then((response) => res.send(response))
      .catch(() => res.status(500).end());
  }
);

//GET /api/myquiz - aggiunge tutte le domande del quiz pubblicato
app.post(
  "/api/pubblicaDomande",
  isLoggedIn,
  [check("quiz").not().isEmpty()],
  async (req, res) => {
    let id = await quizDao.getIDQuiz();
    await quizDao.pubblicaDomanda(id, "Nome:", 1, 1, "aperta", 1, []);
    const quiz = req.body.quiz;
    for (let i = 0; i < quiz.length; i++) {
      await quizDao
        .pubblicaDomanda(
          id,
          quiz[i].testo,
          quiz[i].min,
          quiz[i].max,
          quiz[i].tipo,
          quiz[i].posizione,
          quiz[i].risposte
        )
        .catch(() => res.status(500).end());
    }
    res.send(true);
  }
);

//POST /api/myquiz - salva le risposte date da un utilizzatore
app.post(
  "/api/pubblicaRisposte",
  [check("quiz").not().isEmpty(), check("risposte").not().isEmpty()],
  async (req, res) => {
    const quiz = req.body.quiz;
    const risposte = req.body.risposte;
    let utilizzatore = await quizDao.getUtilizzatore();
    if (utilizzatore === null) utilizzatore = 0;
    for (let i = 0; i < quiz.length; i++) {
      await quizDao
        .pubblicaRisposta(
          risposte[i][1],
          utilizzatore + 1,
          quiz[i].id,
          req.body.id
        )
        .catch(() => res.status(500).end());
    }
    const n = await quizDao
      .getQuizID(req.body.id)
      .catch(() => res.status(500).end());
    quizDao
      .compilazione(req.body.id, n)
      .then((response) => res.send(response))
      .catch(() => res.status(500).end());
  }
);

/*** USER APIs ***/

// Login --> POST /sessions
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// Logout --> DELETE /sessions/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
