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

async function getLastIDQuiz() {/*
    let response = await fetch(BASEURL +'/getID', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(response.ok) {
      const ID = await response.json();
      return ID;
    } 
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }*/
    return 6;
}

async function getLastIDDomande() {/*
  let response = await fetch(BASEURL +'/getID', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok) {
    const ID = await response.json();
    return ID;
  } 
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }*/
  return 6;
}

async function aggiugniDomanda() {/*
  let response = await fetch(BASEURL +'/getID', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(response.ok) {
    const ID = await response.json();
    return ID;
  } 
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }*/
  return 6;
}

  
  
  const API = {logIn, getLastIDQuiz, getQuiz, getMyQuiz};
  export default API;