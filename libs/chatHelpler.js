/** @format */

function chatHelper(loggedUser, users) {
  if (users[0]._id.toString() === loggedUser) {
    return users[1];
  } else {
    return users[0];
  }
}

export default chatHelper;
