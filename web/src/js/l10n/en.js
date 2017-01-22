angular.module("notifyapp")
  .factory('$translateEn', [() => {
    var words = {
      name: "Name",
      logIn: "Login",
      namePlaceholder: "Enter your name",
      email: "Email",
      password: "Password",
      phone: "Phone number",
      birthday: "Birthday",
      homePage: "Home",
      register: "Register",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      phonePlaceholder: "Enter your phone number",
      birthdayPlaceholder: "Enter your birthday",
      profile: "Profile",
      save: "Save",
      logout: "Logout"
    }
    return words

  }])