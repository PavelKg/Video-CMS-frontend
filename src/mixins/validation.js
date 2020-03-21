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
      vRequired: (val = false) => {
        let cond = true
        // console.log('typeof val === object - ', typeof val === 'object')
        // if (typeof val === 'object') {
        //   const field = Object.keys(val)[0]
        //   const fieldVal = val[field]
        //   if (this.$data.hasOwnProperty(field)) {
        //     return this.$data[field] === fieldVal
        //   } else {
        //     return false
        //   }
        // } else {
        //   cond = val
        // }
        console.log('cond=', cond)
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
      }
      return res
    },
    validateState(name) {
      const validFormName = this.validFormName
      console.log('validFormName=', validFormName, name, this.$v[validFormName])

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
          message += validForm[name].$params[param].msg
        }
      })
      return message
    }
  }
}
