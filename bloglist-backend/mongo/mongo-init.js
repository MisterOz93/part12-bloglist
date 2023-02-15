/* eslint-disable no-undef */

db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
})

db.createCollection('blogs')
db.createCollection('users')

db.users.insert({
  username: 'foo',
  name: 'Dock Kerr',
  password: 'password'
})



