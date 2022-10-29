const accessControl = require('role-acl');
const ac = new accessControl();

ac.grant('admin').execute('read').on('Issues');
ac.grant('user').execute('create').on('Issues');

ac.grant('user').condition({Fn: 'EQUALS', args: {'requester': '$.owner'}}).execute('read').on('Issues');

//allow users to edit/delete their own issues
//only admins to be able to update status

exports.getById = (userRole) => {
  return ac
    .can(userRole.role)
    .execute('read')
    .sync()
    .on('Issues')
}

exports.getByStatus = (userRole) => {
  return ac
    .can(userRole.role)
    .execute('read')
    .sync()
    .on('Issues');
}

exports.createIssue = (userRole) => {
  return ac
    .can(userRole.role)
    .execute('create')
    .sync()
    .on('Issues');
}

exports.getByUser = (requesterID,requester, data) => {
  return ac
    .can(requester.role)
    .context({requester: requesterID, owner: data.userID})
    .execute('read')
    .sync()
    .on('Issues')
}