angular.module("notifyapp")
  .factory('$translateRu', [() => {
    var words = {
      name: "Имя",
      logIn: "Войти",
      namePlaceholder: "Введите ваше имя",
      email: "Электронный адрес",
      password: "Пароль",
      phone: "Номер телефона",
      birthday: "Дата рождения",
      homePage: "Главная",
      register: "Регистрация",
      emailPlaceholder: "Введите ваш электронный адрес",
      passwordPlaceholder: "Введите ваш пароль",
      phonePlaceholder: "Введите ваш номер телефона",
      birthdayPlaceholder: "Выберите вашу дату рождения"
    }
    return words

  }])