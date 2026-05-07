import users from './data.json'

const getLS = () => {
  const d = localStorage.getItem('user');
  if (d) return JSON.parse(d)
  if(!d)saveLS(users)
  return users
}
const saveLS = (data) => localStorage.setItem('user', JSON.stringify(data));

const getUser = (user) => {
  const userN = { ...user };
  delete userN.password

  return userN
}

export const registration = async (email, password) => {
  const users = getLS();

  const user = users.find(e => e.email === email);
  if (user) return { ok: false, text: 'user exists' };
  const userO = {
    email,
    password,
    id: Date.now(),
    token: Date.now() + 'token' + Math.random()
  }
  users.push(userO)
  return { ok: true, data: getUser (userO)}
}

export const logIn = async (email, password) => {
  const users = getLS();

  const user = users.find(e => e.email === email);
  if (!user) return { ok: false, text: 'wrong email' };
  if (user.password !== password) return { ok: false, text: 'wrong password' };
  
  return { ok: true, data: getUser (user)}
}
export const autorisation = async (token) => {
  const users = getLS();

  const user = users.find(e => e.token === token);
  if (!user) return { ok: false, text: 'token no live' };
 
  return { ok: true, data: getUser (user)}

}