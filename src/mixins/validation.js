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
      vRequired: () => {
        return withParams({msg: this.$t('validation.required_field')}, required)
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
      vIsUnique: (param) =>
        withParams({msg: this.$t('validation.is_not_unique')}, (val) => {
          if (val === '') return true
          return param === ''
        }),
      vIsEmail: () => {
        return withParams({msg: this.$t('validation.email')}, email)
      },
      vConfPassword: (passField) => {
        return withParams(
          {msg: this.$t('validation.same_as_password')},
          sameAs(passField)
        )
      }
    }
  }
}
