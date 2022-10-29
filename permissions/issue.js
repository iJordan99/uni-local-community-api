const accessControl = require('role-acl');
const ac = new accessControl();

ac.grant('admin').execute('read').on('Issues');
ac.grant('admin').execute('update').on('Issues');

ac.grant('user').condition({Fn: 'EQUALS', args: {'requester': '$.owner'}}).execute('read').on('Issues');

//allow users to edit/delete their own issues
//only admins to be able to update status

exports.updateStatus = (requester) => {
  return ac
    .can(requester.role)
    .execute('update')
    .sync()
    .on('Issues')
}

exports.getById = (requester) => {
  return ac
    .can(requester.role)
    .execute('read')
    .sync()
    .on('Issues')
};

exports.getByStatus = (requester) => {
  return ac
    .can(requester.role)
    .execute('read')
    .sync()
    .on('Issues');
};


//admin has permission?
exports.getByUser = (requesterID,requester, data) => {
  return ac
    .can(requester.role)
    .context({requester: requesterID, owner: data.userID})
    .execute('read')
    .sync()
    .on('Issues')
};