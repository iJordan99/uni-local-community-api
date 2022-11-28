const request = require('supertest')
const app = require('../app')
const prefix = '/api/v1/login';

describe('login',() => {
  it('should return a jwt token', async () => {
    const res = await request(app.callback())
    .get(prefix)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
    expect(res.header).toHaveProperty('etag')
    expect(res.header).toHaveProperty('last-modified')
  })
})


describe('login',() => {
  it('should 401', async () => {
    const res = await request(app.callback())
    .get(prefix)
    expect(res.statusCode).toEqual(401)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})