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
      birthdayPlaceholder: "Выберите вашу дату рождения",
      profile: "Профиль",
      save: "Сохранить",
      logout: "Выйти",
      student: 'Студент',
      teacher: 'Учитель',
      admin: 'Админ',
      on_moderation: "На подтверждении",
      editProblem: "Редактировать эту задачу",
      addProblem: "Добавить задачу",
      problemName: "Название задачи",
      problemNamePlaceholder: "Введите название задачи",
      problemDescription: "Условие задачи",
      problemDescriptionPlaceholder: "Введите условие задачи",
      timeLimit: "Лимит времени",
      timelimitPlaceholder: "Укажите лимит времети (мс)",
      memoryLimit: "Лимит памяти",
      memoryLimitPlaceholder: "Укажите лимит памяти (Мбайт)",
      tests: "Тесты",
      solution: "Решение",
      testId: "Тест №",
      status: "Статус",
      execTime: "Время выполнения",
      execMemory: "Затрачено памяти"
    }
    return words

  }])