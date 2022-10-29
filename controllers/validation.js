const { Validator, ValidationError } = require('jsonschema');

const issueSchema = require('../schemas/issue.json').definitions.issue;
const userSchema = require('../schemas/user.json').definitions.user;
const userUpdateSchema = require('../schemas/user.json').definitions.userUpdate;
const validateIssueStatus = require('../schemas/issue.json').definitions.statusUpdate;


const validator = (schema, resource) => {
  const validator = new Validator();

  const options = {
    throwError: true,
    propertyName: resource
  };

  const handler = async (ctx, next) => {

    try{
      validator.validate(ctx.request.body, schema, options);
      await next();
    } catch (error) {
      if(error instanceof ValidationError){
        console.error(error);
        ctx.status = 400;
        ctx.body = error;
      } else {
        throw error;
      }
    }
  }
  return handler;
}


exports.validateIssue = validator(issueSchema, 'issue');
exports.validateUser = validator(userSchema, 'user');
exports.validateUserUpdate = validator(userUpdateSchema, 'userUpdate');
exports.validateIssueStatus = validator(validateIssueStatus, 'statusUpdate');

