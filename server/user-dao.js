'use strict';
/* Data Access Object (DAO) module for accessing users */

const db = require('./db');
const bcrypt = require('bcrypt');

exports.getUserById = (id) => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM user WHERE id = ?"
        db.get(sql, [id], (err, row) => {
            if(err)
                reject(err)
            else if (row === undefined)
                resolve({error: "User Not Found"})
            else{
                const user =  {
                    id: row.ID,
                    username: row.email,
                }
                resolve(user)
            }
        })
    })
}


exports.getUser = (email, password) => {
    return new Promise((resolve, reject)=> {
        const sql = "SELECT * FROM user WHERE email = ?"
        db.get(sql, [email], (err, row) => {
            if(err)
                reject(err)
            else if (row === undefined)
                resolve(false)
            else {
               const user =  {
                        id: row.ID,
                        username: row.email,
                    }
                //verify whether the password is correct or not
                bcrypt.compare(password, row.password).then( result => { 
                    if(result)
                        resolve(user)
                    else 
                        resolve(false)
                })
            }
            
        })
    })
}