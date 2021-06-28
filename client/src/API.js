const BASEURL = '/api';

async function logIn(credentials) {
    let response = await fetch(BASEURL +'/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    } 
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
}

const getQuiz = async () => {
  let response = await fetch(BASEURL +'/quiz', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok) {
    const quiz = await response.json();
    return quiz
  } 
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

async function getMyQuiz(id) {
  let response = await fetch(BASEURL +'/myquiz', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok) {
    const quiz = await response.json();
    return quiz
  } 
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}


const getQuizQuestions = async (id) => {
  let response = await fetch(BASEURL +'/quiz_'+id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok) {
    const questions = await response.json();
    return questions
  } 
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

const getQuizAnswers = async (id,utilizzatore) => {
  let response = await fetch(BASEURL +'/quizAnswers_'+id+'/'+utilizzatore, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok) {
    const answers = await response.json();
    return answers
  } 
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

const getQuizTitle = async (id) => {
  let response = await fetch(BASEURL +'/quizTitle_'+id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok) {
    const quiz = await response.json();
    return quiz
  } 
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

const getAnswers = async (id) => {
  let response = await fetch(BASEURL +'/answers_'+id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok) {
    const answers = await response.json();
    return answers
  } 
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

const pubblicaQuiz = async (title, quiz) => {
  let response = await fetch(BASEURL + '/pubblicaQuiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({title: title}),
  });
  if (response.ok) {
    let response2 = await fetch(BASEURL + '/pubblicaDomande', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quiz),
    });
    if (response2.ok) {
      return true;
    } else {
      try {
        const errDetail = await response2.json();
        throw errDetail.message;
      } catch (err) {
        throw err;
      }
    }
  } else {
    try {
      const errDetail = await response.json();     
      throw errDetail.message;
    } catch (err) {
      throw err;
    }
  }
};

const pubblicaRisposte = async (quiz,risposte,id) => {
  let response = await fetch(BASEURL + '/pubblicaRisposte', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: id, quiz: quiz, risposte: Array.from(risposte)}),
  });
  if (response.ok) {
    return true
  } else {
    try {
      const errDetail = await response.json();     
      throw errDetail.message;
    } catch (err) {
      throw err;
    }
  }
};
  
  
const API = {logIn, getQuiz, getQuizTitle, getMyQuiz, getQuizQuestions, getQuizAnswers, getAnswers, pubblicaQuiz, pubblicaRisposte};
  export default API;