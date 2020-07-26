export default {
  middleware: ['admin-auth'],
  data() {
    return {
      changePassword: false,
      loading: false,
      roles: [
        { role: 'admin', label: 'Администратор' },
        { role: 'declarant', label: 'Исполнитель' },
        { role: 'manager', label: 'Веб Менеджер' },
      ],
      departments: [
        { value: 'ved', label: 'Отдел ВЭД' },
        { value: 'decor', label: 'Спец. По там. Оформлению' },
        { value: 'logistic', label: 'Отдел логистики' },
        { value: 'contract', label: 'Отдел контракта' },
        { value: 'expertise', label: 'Отдел Акт экспертизы' },
      ],
      employerForm: {
        name: '',
        login: '',
        password: '',
        comment: '',
        role: 'declarant',
        departments: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        login: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        role: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
        departments: [
          {
            required: true,
            message: 'Пожалуйста, введите название деятельности',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  validate({ store, error }) {
    const { role = null } = store.getters['auth/user']
    if (role == 'admin') {
      return true
    }
    return false
  },
}
