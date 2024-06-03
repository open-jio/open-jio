const useValidate = () => {
    var userAuthorised = null;
    if (
        localStorage.getItem("isloggedin") === "true"
      ) {
        userAuthorised = true;
      } else {
        userAuthorised = false;
      }
      return userAuthorised;
}   
 
export default useValidate;