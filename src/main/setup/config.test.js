const request = require('supertest')
const app = require('./app')

describe('App Setup', () => {
  test('Should disabled x-powered-by header', async () => {
    app.get('/test_x_powered_by', (_, res) => {
      res.send('')
    })

    const response = await request(app).get('/test-cors')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })

  test('Should parser Body as JSON', async () => {
    app.post('/test_json_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_json_parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  })

  test('Should return JSON content type as default', async () => {
    app.get('/test_content_type', (_, res) => {
      res.json({ name: 'any_name' })
    })

    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  test('Should return XML content type is defined', async () => {
    app.get('/test_content_type_xml', (_, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
