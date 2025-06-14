const UserProfile = (function() {
  let full_name: string = "";

  const getName = function() {
    return full_name;    // Or pull this from cookie/localStorage
  };

  const setName = function(name: string) {
    full_name = name;     
    // Also set this in cookie/localStorage
  };

  return {
    getName: getName,
    setName: setName
  }

})();

export default UserProfile;