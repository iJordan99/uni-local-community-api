const request = require('supertest')
const app = require('../app')

describe('Post new user',() => {
  it('should create a new user', async () => {
    const res = await request(app.callback())
    .post('/api/v1/users')
    .send({
      firstName: 'jordan',
      lastName: 'smith',
      username: 'jordan',
      email: 'jordansemail@email.com',
      password: 'password'
    })
    expect(res.statusCode).toEqual(201)
    expect(res.created).toEqual(true)
  })
})

describe('Post new user',() => {
  it('shouldnt create duplicate user', async () => {
    const res = await request(app.callback())
    .post('/api/v1/users')
    .send({
      firstName: 'jordan',
      lastName: 'smith',
      username: 'jordan',
      email: 'jordansemail@email.com',
      password: 'password'
    })
    expect(res.statusCode).toEqual(409)
    expect(res.created).toEqual(false)
  })
})

describe('Post new user',() => {
  it('should result in a schema error', async () => {
    const res = await request(app.callback())
    .post('/api/v1/users')
    .send({
      firstName: 'jordan',
      lastName: 'smith',
      username: 'jordan',
    })
    expect(res.statusCode).toEqual(400)
    expect(res.badRequest).toEqual(true)
    expect(res._body).toHaveProperty('schema', '#user')
    expect(res._body).toHaveProperty('name', 'required')
  })
})

describe('Get user details no credentials',() => {
  it('should 401', async () => {
    const res = await request(app.callback())
    .get('/api/v1/users/')
    expect(res.statusCode).toEqual(401)
  })
})

describe('Get user details with wrong credentials',() => {
  it('should 401', async () => {
    const res = await request(app.callback())
    .get('/api/v1/users/')
    .auth('jordan','passwor_wrong')
    expect(res.statusCode).toEqual(401)
  })
})

describe('Get user details with correct credentials',() => {
  it('should return user details', async () => {
    const res = await request(app.callback())
    .get('/api/v1/users/')
    .auth('jordan','password')
    expect(res.statusCode).toEqual(200)
  })
})

describe('edit user without credentials',() => {
  it('should result in a 401', async () => {
    const res = await request(app.callback())
    .put('/api/v1/users/jordan')
    .send({
      username: 'jordan22'
    })
    expect(res.statusCode).toEqual(401)
  })
})

describe('edit other user',() => {
  it('should result in a 403', async () => {
    const res = await request(app.callback())
    .put('/api/v1/users/jordan')
    .send({
      username: 'jordan22'
    })
    .auth('jordan1', 'password')
    expect(res.statusCode).toEqual(403)
  })
})

describe('edit user with correct credentials',() => {
  it('should edit user', async () => {
    const res = await request(app.callback())
    .put('/api/v1/users/jordan')
    .send({
      username: 'jordan22'
    })
    .auth('jordan','password')
    expect(res.statusCode).toEqual(200)
  })
})

describe('delete another user', () => {
  it('should ', async () => {
    const res = await request(app.callback())
    .delete('/api/v1/users/jordan22')
    .auth('jordan1','password')
    expect(403)
  })
})


describe('delete user without credentials', () => {
  it('should ', async () => {
    const res = await request(app.callback())
    .delete('/api/v1/users/jordan22')
    expect(403)
  })
})

describe('delete user with correct credentials', () => {
  it('should ', async () => {
    const res = await request(app.callback())
    .delete('/api/v1/users/jordan22')
    .auth('jordan22','password')
    expect(204)
  })
})
