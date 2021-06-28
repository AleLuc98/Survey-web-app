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
                const questions = rows.map((q)=>({id:q.ID,testo: q.Testo, min: q.Min, max: q.Max, tipo:q.Tipo, posizione: q.Posizione}));
                resolve(questions)
            }
        })
    })
}

exports.getIDUtilizzatore = (id_quiz) =>{
    return new Promise((resolve, reject)=> {
        const sql = "SELECT min(IDUtilizzatore) FROM risposte WHERE IDQuestionario=? "
        db.all(sql, id_quiz, (err, row) => {
            if(err)
                reject(err)
            else{
                resolve(row[0]["min(IDUtilizzatore)"])
            }
        })
    })
}

exports.getQuizAnswers = async (id_quiz,id_utilizzatore) => {
    const min_utilizzatore = await exports.getIDUtilizzatore(id_quiz)
    if(min_utilizzatore===undefined) min_utilizzatore=1
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM risposte WHERE IDQuestionario=? AND IDUtilizzatore=?"
        db.all(sql, [id_quiz,(min_utilizzatore-1+parseInt(id_utilizzatore))], (err, rows) => {
            if(err)
                reject(err)
            else{
                const answers = rows.map((a)=>({id:a.ID,testo: a.Testo}));
                resolve(answers)
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
            else if(row){
                const quiz = ({titolo: row.Titolo, n: row.NumeroCompilazioni})
                resolve(quiz)
            }
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
                resolve(true)
            }
        })
    })
}

exports.getIDDomanda = () => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT max(ID) FROM domanda"
        db.get(sql, (err, row) => {
            if(err)
                reject(err)
            else{
                resolve(row["max(ID)"])
            }
        })
    })
}


exports.pubblicaDomanda = (id,testo,min,max,tipo,pos,risposte) => {
    let statement = "INSERT INTO domanda (Testo,Min,Max,Tipo,IDQuestionario,Posizione) VALUES (?,?,?,?,?,?)"
    let params = [testo,min,max,tipo,id,pos]
    return new Promise((resolve, reject)=> {
        db.run(statement, params, (err, result) => {
            if(err)
                reject(err)
            else{
                if (tipo == "chiusa")
                {
                    exports.getIDDomanda().then(idR=>{
                        for (let i=0;i<risposte.length;i++)
                            exports.pubblicaRispostaChiusa(risposte[i].testo,idR).catch((err)=>reject(err))
                    })
                    resolve(true)
                }
                else
                    resolve (true)
            }
        })
    })
}

exports.pubblicaRispostaChiusa = (testo,id) => {
    let statement = "INSERT INTO risposte_chiuse (Testo,IDDomanda) VALUES (?,?)"
        let params = [testo,id]
        return new Promise((resolve, reject)=> {
            db.run(statement, params, (err, result) => {
                if(err)
                    reject(err)
                else{
                    resolve(true)
                }
            })
        })
}

exports.pubblicaRisposta = (testo,id_utilizzatore,id_domanda,id_quiz) => {
    let statement = "INSERT INTO risposte (Testo,IDUtilizzatore,IDDomanda,IDQuestionario) VALUES (?,?,?,?)"
    let params = [testo,id_utilizzatore,id_domanda,id_quiz]
    return new Promise((resolve, reject)=> {
        db.run(statement, params, (err, result) => {
            if(err)
                reject(err)
            else{
                resolve (true)
            }
        })
    })
}

exports.compilazione = (id,n) => {
    let statement = "UPDATE questionario SET NumeroCompilazioni = ? WHERE ID =?"
    let params = [n+1,id]
    return new Promise((resolve, reject)=> {
        db.get(statement, params, (err, row) => {
            if(err)
                reject(err)
            else{
                resolve(true)
            }
        })
    })
}

exports.getQuizID = (id) => {
    let statement = "SELECT NumeroCompilazioni FROM questionario WHERE ID=?"
    let params = [id]
    return new Promise((resolve, reject)=> {
        db.get(statement, params, (err, row) => {
            if(err)
                reject(err)
            else{
                resolve(row["NumeroCompilazioni"])                
            }
        })
    })
}

exports.getUtilizzatore = () => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT max(IDUtilizzatore) FROM risposte"
        db.get(sql, (err, row) => {
            if(err)
                reject(err)
            else{
                resolve(row["max(IDUtilizzatore)"])
            }
        })
    })
}