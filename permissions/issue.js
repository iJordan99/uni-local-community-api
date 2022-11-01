const accessControl = require('role-acl');
const ac = new accessControl();

ac.grant('admin')
  .execute('read')
  .on('Issues');

ac.grant('admin')
  .execute('update')
  .on('Issues');

ac.grant('admin')
  .execute('delete')
  .on('Issues');

ac.grant('user')
  .condition({Fn: 'EQUALS', args: {'requester': '$.owner'}})
  .execute('read').on('Issues');

ac.grant('user')
  .condition({Fn: 'EQUALS', args: {'requester': '$.owner'}})
  .execute('delete').on('Issues');

ac.grant('user')
  .condition({Fn: 'EQUALS', args: {'data': '$.status'}})
  // .condition({Fn: 'EQUALS', args: {'requester': '$.owner'}})
  .execute('update').on('Issues');

exports.updateStatus = (requester,data) => {
  return ac
    .can(requester.role)
    .context({data: data.status, status: 'fixed'})
    .execute('update')
    .sync()
    .on('Issues')
}

exports.getById = (requester,data) => {
  return ac
    .can(requester.role)
    .context({requester: requester.id, owner: data.UserId})
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

exports.getByUser = (requester,data) => {
  return ac
    .can(requester.role)
    .context({requester: requester.id, owner: data.id})
    .execute('read')
    .sync()
    .on('Issues')
};

exports.deleteIssue = (requester,data) => {
  return ac
  .can(requester.role)
  .context({requester: requester.id, owner: data.UserId})
  .execute('delete')
  .sync()
  .on('Issues')
}