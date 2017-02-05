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
      logout: "Logout",
      student: 'Student',
      teacher: 'Teacher',
      admin: 'Admin',
      on_moderation: "On moderation",
      editProblem: "Edit this problem",
      addProblem: "Add problem",
      problemName: "Problem name",
      problemNamePlaceholder: "Enter problem name",
      problemDescription: "Problem description",
      problemDescriptionPlaceholder: "Enter problem description",
      timeLimit: "Time limit",
      timelimitPlaceholder: "Enter time limit (ms)",
      memoryLimit: "Memory limit",
      memoryLimitPlaceholder: "Enter memory limit (Mb)",
      tests: "Tests",
      solution: "Solution",
      testId: "Test #",
      status: "Status",
      execTime: "Execution time",
      execMemory: "Execution memory"
    }
    return words

  }])