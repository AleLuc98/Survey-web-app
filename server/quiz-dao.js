'use strict';
/* Data Access Object (DAO) module for accessing users */

const db = require('./db');

exports.getQuiz = () => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM questionario"
        db.all(sql, (err, rows) => {
            if(err)
                reject(err)
            else{
                const quiz = rows.map((q)=>({id:q.ID,titolo: q.Titolo, compilazioni: q.NumeroCompilazioni}));
                resolve(quiz)
            }
        })
    })
}

exports.getMyQuiz = (user) => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM questionario WHERE IDUser=?"
        db.all(sql, user.id, (err, rows) => {
            if(err)
                reject(err)
            else{
                const quiz = rows.map((q)=>({id:q.ID,titolo: q.Titolo, compilazioni: q.NumeroCompilazioni}));
                resolve(quiz)
            }
        })
    })
}

exports.getQuizQuestions = (id) => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM domanda WHERE IDQuestionario=?"
        db.all(sql, id, (err, rows) => {
            if(err)
                reject(err)
            else{
                const questions = rows.map((q)=>({id:q.ID,testo: q.Testo, min: q.Min, max: q.Max, tipo:q.Tipo}));
                resolve(questions)
            }
        })
    })
}

exports.getQuizTitle = (id) => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM questionario WHERE ID=?"
        db.get(sql, id, (err, row) => {
            if(err)
                reject(err)
            else if(row)
                resolve(row.Titolo)
            else 
                resolve(null)    
            })
        })
}

exports.getAnswers = (id) => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM risposte_chiuse WHERE IDDomanda=?"
        db.all(sql, id, (err, rows) => {
            if(err)
                reject(err)
            else{
                const answers = rows.map((q)=>({id:q.ID,testo: q.Testo}));
                resolve(answers)
            }
        })
    })
}

exports.getIDQuiz = () => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT max(ID) FROM questionario"
        db.get(sql, (err, row) => {
            if(err)
                reject(err)
            else{
                resolve(row["max(ID)"])
            }
        })
    })
}

exports.pubblicaQuiz = (title,user) => {
    let statement = "INSERT INTO questionario (Titolo,NumeroCompilazioni,IDUser) VALUES (?,?,?)"
    let params = [title,0,user.id]
    return new Promise((resolve, reject)=> {
        db.run(statement, params, (err, result) => {
            if(err)
                reject(err)
            else{
                resolve(exports.getIDQuiz())
            }
        })
    })
}