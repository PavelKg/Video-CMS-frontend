import {
  required,
  minLength,
  maxLength,
  sameAs,
  email
} from 'vuelidate/lib/validators'
import {withParams} from 'vuelidate/lib/validators/common'

export default {
  data() {
    return {
      vRequired: function(val) {
        let cond
        const valType = typeof val

        if (valType === 'object') {
          const {field, fn} = val
          const fieldList = field.split('.')
          let arg = this[fieldList[0]]
          if (fieldList.length > 1) {
            for (let i = 1; i < fieldList.length; i += 1) {
              if (arg.hasOwnProperty(fieldList[i])) {
                arg = arg[fieldList[i]]
              }
            }
          }
          cond = fn(arg)
        } else if (valType === 'boolean') {
          cond = val
        }

        return cond
          ? withParams({msg: this.$t('validation.required_field')}, required)
          : ''
      },
      vRegex: function(reg) {
        return withParams(
          {msg: this.$t('validation.invalid_data_format')},
          (value) => {
            return reg.test(value)
          }
        )
      },
      vMinLength: function(length) {
        return withParams(
          {
            msg: this.$t('validation.min_length', {
              cnt: length
            })
          },
          minLength(length)
        )
      },

      vMaxLength: function(length) {
        return withParams(
          {
            msg: this.$t('validation.max_length', {
              cnt: length
            })
          },
          maxLength(length)
        )
      },
      vIsUnique: (fieldName) =>
        withParams({msg: this.$t('validation.is_not_unique')}, (val) => {
          if (val === '') return true

          if (this.$data.hasOwnProperty(fieldName)) {
            return this.$data[fieldName] === ''
          }
          return true
        }),
      vIsEmail: (val) => {
        return val ? withParams({msg: this.$t('validation.email')}, email) : ''
      },
      vConfPassword: (passField) => {
        return withParams(
          {msg: this.$t('validation.same_as_password')},
          sameAs(passField)
        )
      }
    }
  },
  validations() {
    return {
      [this.validFormName]: this.rules()
    }
  },
  methods: {
    rules() {
      const fieldsList = {}
      console.log('this.fieldsRestr=', this.fieldsRestr)
      Object.keys(this.fieldsRestr).map((field) => {
        for (const item in this.fieldsRestr[field]) {
          fieldsList[field] = {
            ...fieldsList[field],
            [item]: this.validMatch(item, this.fieldsRestr[field][item])
          }
        }
      })

      return fieldsList
    },
    validMatch(func, val) {
      console.log({func, val})
      let res
      switch (func) {
        case 'required':
          res = val ? this.vRequired(val) : false
          break
        case 'minLength':
          res = this.vMinLength(val)
          break
        case 'maxLength':
          res = this.vMaxLength(val)
          break
        case 'isUnique':
          res = this.vIsUnique(val)
          break
        case 'email':
          res = this.vIsEmail(val)
          break
        case 'sameAsPassword':
          res = this.vConfPassword(val)
          break
        case 'regex':
          res = this.vRegex(val)
      }
      return res
    },
    validateState(name) {
      const validFormName = this.validFormName

      const {$dirty, $error} = this.$v[validFormName][name]
      return $dirty ? ($error ? !$error : null) : null
    },
    validateErrorMessage(name) {
      const validFormName = this.validFormName
      const validForm = this.$v[validFormName]
      let message = ''

      const {$params} = validForm[name]

      Object.keys($params).forEach((param) => {
        if (!validForm[name][param]) {
          message += `${validForm[name].$params[param].msg}; `
        }
      })
      return message
    }
  }
}
