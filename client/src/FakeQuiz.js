let quiz = [
    {id:1,titolo:"quiz1",compilazioni:0},
    {id:2,titolo:"quiz2",compilazioni:0},
    {id:3,titolo:"quiz3",compilazioni:0}
];

let domande = [
    {id:0,id_quiz:1,testo:"Nome:",min:1,max:1,tipo:"aperta"},
    {id:1,id_quiz:1,testo:"Colore preferito?",min:1,max:1,tipo:"chiusa"},
    {id:2,id_quiz:2,testo:"Nome:",min:1,max:1,tipo:"aperta"},
    {id:3,id_quiz:2,testo:"Macchine possedute?",min:0,max:2,tipo:"chiusa"},
    {id:4,id_quiz:3,testo:"Nome:",min:1,max:1,tipo:"aperta"},
];

let risposte_chiuse = [
    {id:0,id_dom:1,testo:"Rosso"},
    {id:1,id_dom:1,testo:"Blu"},
    {id:2,id_dom:1,testo:"Verde"},
    {id:3,id_dom:3,testo:"BMW"},
    {id:4,id_dom:3,testo:"Ferrari"},
    {id:5,id_dom:3,testo:"Alfa"},
    {id:6,id_dom:3,testo:"Mercedes"},
]

let risposte = [
]


export {quiz, domande, risposte_chiuse, risposte};