xit('Tests to see if jest works', () => {
  expect(1).toBe(2)
})

test("Jest should use the test db", () => {
  expect(process.env.DB_DATABASE).toBe('test_db')
}) 