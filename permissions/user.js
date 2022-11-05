const accessControl = require('role-acl');
const ac = new accessControl();

ac.grant('admin').execute('read').on('Users');
ac.grant('admin').execute('delete').on('Users');

ac.grant('user').condition({Fn: 'EQUALS', args: {'requester': '$.owner'}}).execute('update').on('Users');
ac.grant('user').condition({Fn: 'EQUALS', args: {'requester': '$.user'}}).execute('delete').on('Users');

exports.getAll = (requester) => {
  return ac
    .can(requester.role)
    .execute('read')
    .sync()
    .on('Users')
}

exports.delete = (requester, user) => {
  return ac
    .can(requester.role.role)
    .context({requester: requester.id, user: user.id})
    .execute('delete')
    .sync()
    .on('Users')
}

exports.updateUser = (requester,data) => {
  return ac
    .can(requester.role.role)
    .context({requester: requester.id, owner: data.id})
    .execute('update')
    .sync()
    .on('Users')
}