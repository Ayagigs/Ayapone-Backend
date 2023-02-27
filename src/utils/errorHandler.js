export const handleErrors = (err) => {
  let errors = {};
  console.log(err.message, err.code);

  if (err.message.includes('email')) {
    errors.email = 'Duplicate Email';
  }

  if (err.message === 'invalid credentials') {
    return (errors.message = 'Invalid User Credentials.');
  }

  if (err.message === 'user not found') {
    return (errors.message = 'User not found.');
  }

  if (err.message === 'invalid verification token') {
    return (errors.message = 'Invalid Verification Token!');
  }

  if (err.message === 'invalid recovery token') {
    return (errors.message = 'Recovery Link expired!');
  }

  if (err.message === 'invalid query') {
    return 'Invalid Query Parameter.';
  }

  if (err.message === 'invalid old password') {
    return (errors.message = 'The old password provided do not match the current password.');
  }

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
