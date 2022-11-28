const request = require('supertest')
const app = require('../app')
const prefix = '/api/v1/issues';

describe('Post new issue without correct credentials',() => {
  it('should 401', async () => {
    const res = await request(app.callback())
    .post(prefix)
    .send({
      issueName: 'test issue',
      description: 'random test description',
      location: {
        longitude: 52.40496,
        latitude: -2.01683
      }
    })
    expect(res.statusCode).toEqual(401)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('Post new issue',() => {
  it('should 201', async () => {
    const res = await request(app.callback())
    .post(prefix)
    .send({
      issueName: 'test issue',
      description: 'random test description',
      location: {
        longitude: 52.40496,
        latitude: -2.01683
      }
    })
    .auth('jordan1', 'password')
    expect(res.statusCode).toEqual(201)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
  })
})


describe('Post new issue with out of range long and lat',() => {
  it('should 400', async () => {
    const res = await request(app.callback())
    .post(prefix)
    .send({
      issueName: 'test issue 1',
      description: 'random test description',
      location: {
        longitude: 444444,
        latitude: 44444
      }
    })
    .auth('jordan1', 'password')
    expect(res.statusCode).toEqual(400)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('Post duplicate issue',() => {
  it('should 409', async () => {
    const res = await request(app.callback())
    .post(prefix)
    .send({
      issueName: 'test issue',
      description: 'random test description',
      location: {
        longitude: 52.40496,
        latitude: -2.01683
      }
    })
    .auth('jordan1', 'password')
    expect(res.statusCode).toEqual(409)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('Post issue with missing values',() => {
  it('should 400', async () => {
    const res = await request(app.callback())
    .post(prefix)
    .send({
      issueName: 'test issue 2',
      description: 'random test description',
    })
    .auth('jordan1', 'password')
    expect(res.statusCode).toEqual(400)
    expect(res.badRequest).toEqual(true)
    expect(res._body).toHaveProperty('schema', '#issue')
    expect(res._body).toHaveProperty('name', 'required')
  })
})

describe('list issues',() => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(prefix)
    .auth('jordan1', 'password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
    expect(res.header).toHaveProperty('etag')
  })
})

describe('list issues without credentials',() => {
  it('should 401', async () => {
    const res = await request(app.callback())
    .get(prefix)
    expect(res.statusCode).toEqual(401)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('list issues with status fixed', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(`${prefix}?status=fixed`)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('etag')
  })
})

describe('list issues with status fixed wihtout auth', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(`${prefix}?status=fixed`)
    expect(res.statusCode).toEqual(401)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('list issues with status fixed and limit to 1', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(`${prefix}?status=fixed&limit=1`)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('etag')
    expect(res.header).toHaveProperty('content-length', '258')
  })
})


describe('list issues with status fixed and limit to 1 without auth', () => {
  it('should 401', async () => {
    const res = await request(app.callback())
    .get(`${prefix}?status=fixed&limit=1`)
    expect(res.statusCode).toEqual(401)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})


describe('view another users issue without admin role', () => {
  it('should 403', async () => {
    const res = await request(app.callback())
    .get(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('jordan3','password')
    expect(res.statusCode).toEqual(403)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('view another users issue with admin role', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('admin','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
  })
})

describe('view own issue by uuid', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('etag')
    expect(res.header).toHaveProperty('last-modified')
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
  })
})

describe('user update status to fixed', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .put(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('jordan1','password')
    .send({
      status: "fixed"
    })
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
  })
})

describe('user update status to flagged', () => {
  it('should 403', async () => {
    const res = await request(app.callback())
    .put(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('jordan1','password')
    .send({
      status: "flagged"
    })
    expect(res.statusCode).toEqual(403)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('user update status to addressed', () => {
  it('should 403', async () => {
    const res = await request(app.callback())
    .put(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('jordan1','password')
    .send({
      status: "addressed"
    })
    expect(res.statusCode).toEqual(403)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('user update status to new', () => {
  it('should 403', async () => {
    const res = await request(app.callback())
    .put(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('jordan1','password')
    .send({
      status: "new"
    })
    expect(res.statusCode).toEqual(403)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('user update status for unknown issue', () => {
  it('should 404', async () => {
    const res = await request(app.callback())
    .put(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17A`)
    .auth('jordan1','password')
    .send({
      status: "fixed"
    })
    expect(res.statusCode).toEqual(404)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('admin update status to flagged', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .put(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('admin','password')
    .send({
      status: "flagged"
    })
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
  })
})

describe('delete another users issue ', () => {
  it('should 403', async () => {
    const res = await request(app.callback())
    .delete(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('jordan3','password')
    expect(res.statusCode).toEqual(403)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('delete an unknown  issue ', () => {
  it('should 404', async () => {
    const res = await request(app.callback())
    .delete(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17a`)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(404)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('delete an issue ', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .delete(`${prefix}/4ac798a4-2d30-4db8-a28e-3990ad26ef17`)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('location filter issues', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(`${prefix}/near/location?longitude=52.40496&latitude=-3.01683`)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
    expect(res.header).toHaveProperty('etag')
  })
})

describe('location filter issues without credentials', () => {
  it('should 401', async () => {
    const res = await request(app.callback())
    .get(`${prefix}/near/location?longitude=52.40496&latitude=-3.01683`)
    expect(res.statusCode).toEqual(401)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('location filter issues with credentials and filer by status', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(`${prefix}/near/location?longitude=52.40496&latitude=-3.01683&status=fixed`)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
    expect(res.header).toHaveProperty('etag')
  })
})

describe('location filter issues without credentials and filer by status', () => {
  it('should 401', async () => {
    const res = await request(app.callback())
    .get(`${prefix}/near/location?longitude=52.40496&latitude=-3.01683&status=fixed`)
    expect(res.statusCode).toEqual(401)
    expect(res.header).toHaveProperty('content-type', 'text/plain; charset=utf-8')
  })
})

describe('location filter issues with credentials and filer by status & limit to 4', () => {
  it('should 200', async () => {
    const res = await request(app.callback())
    .get(`${prefix}/near/location?longitude=52.40496&latitude=-3.01683&status=fixed&limit=4`)
    .auth('jordan1','password')
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('content-type', 'application/json; charset=utf-8')
    expect(res.header).toHaveProperty('etag')
  })
})