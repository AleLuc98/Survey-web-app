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