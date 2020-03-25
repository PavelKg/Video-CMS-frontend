<template>
  <div class="role-operation">
    <template v-if="roleNotFound">
      <div class="role-not-found">
        <span>Sorry. Role is not found!!!</span><br />
        <button @click="cancel_click" class="button btn-braun">
          {{ $t('label.back') }}
        </button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t(role_title) }}</span>
      <b-form @submit.stop.prevent="onSubmit">
        <b-container class="px-0 my-3">
          <b-form-group
            id="input-role-id"
            :label="`${$t('roles.role_id')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="role-id"
            :invalid-feedback="validateErrorMessage('rid')"
            :state="validateState('rid')"
          >
            <template v-if="oper === 'edit'">
              <div class="pt-2">
                <strong>{{ mnRole.rid }}</strong>
              </div>
            </template>
            <template v-else-if="oper === 'add'">
              <b-form-input
                id="role-id"
                v-model="mnRole.rid"
                :maxLength="fieldsRestr.name.maxLength"
                :state="validateState('rid')"
              ></b-form-input>
            </template>
          </b-form-group>
          <b-row ml="0" align-v="start" align-h="around">
            <b-col>
              <b-form-group
                id="input-role-name"
                :label="`${$t('roles.role_name')}:`"
                label-cols-sm="3"
                label-cols-lg="3"
                label-for="role-name"
                :invalid-feedback="validateErrorMessage('name')"
                :state="validateState('name')"
              >
                <b-form-input
                  id="role-name"
                  v-model="mnRole.name"
                  :disabled="isDeleted"
                  :maxLength="fieldsRestr.name.maxLength"
                  :state="validateState('name')"
                ></b-form-input></b-form-group
            ></b-col>
          </b-row>

          <b-form-group
            id="input-role-isAdmin"
            :label="`${$t('roles.administrator')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="check_isAdmin"
            label-align-sm="left"
            class="mb-1"
          >
            <b-form-checkbox
              id="check_isAdmin"
              class="pt-2"
              v-model="mnRole.is_admin"
              name="check_isAdmin"
              :disabled="isDeleted"
              ><strong>{{ $t(`label.${is_admin_state}`) }}</strong>
            </b-form-checkbox>
          </b-form-group>

          <div class="role-operation-button-zone">
            <button
              type="submit"
              class="button btn-blue"
              :disabled="onDisabledSave || $v.mnRole.$anyError"
            >
              {{ $t('label.save') }}
            </button>
            <button @click="cancel_click" class="button btn-braun">
              {{ $t('label.cancel') }}
            </button>
          </div>
        </b-container>
      </b-form>
    </template>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import validMixin from '@/mixins/validation'

export default {
  name: 'role-mng-form',
  mixins: [validMixin],
  props: {
    oper: String
  },
  data() {
    return {
      validFormName: 'mnRole',
      ridUniqError: '',
      mnRole: {
        is_admin: false,
        name: '',
        rid: ''
      },
      defRole: {
        is_admin: false,
        name: ''
      },
      roleNotFound: false
    }
  },

  watch: {
    ['mnRole.rid'](newVal) {
      if (this.ridUniqError !== '') {
        this.ridUniqError = ''
      }
    }
  },
  methods: {
    cancel_click() {
      this.$emit('contentElementClick', '/hub/roles')
    },
    onSubmit() {
      this.$v[this.validFormName].$touch()
      if (this.$v[this.validFormName].$anyError) {
        return
      }

      const oper_type = this.oper === 'edit' ? 'ROLE_UPD' : 'ROLE_ADD'
      this.$store.dispatch(oper_type, this.mnRole).then(
        (res) => {
          this.$emit('contentElementClick', '/hub/roles')
        },
        (err) => {
          const errMess = err.message.replace('Error: ', '')
          switch (errMess) {
            case 'THIS_ROLE_RID_IS_NOT_ALLOWED':
              this.ridUniqError = errMess
              break
            default:
              console.log('error=', errMess)
              break
          }
        }
      )
    }
  },

  created() {
    const {rid = null} = this.$route.params
    const cid = this.cid

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_ROLE_INFO', {cid, rid}).then(
        (role) => {
          this.defRole.name = role.name
          this.defRole.is_admin = role.is_admin
          this.mnRole = {...role}
        },
        (error) => {
          this.roleNotFound = true
        }
      )
    } else {
      this.mnRole.cid = cid
    }
  },
  computed: {
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id,
      fieldsRestr: (store) => store.FieldRestr.categories.roles
    }),
    role_title() {
      return `roles.oper_title_${this.oper}`
    },
    is_admin_state() {
      return this.mnRole.is_admin ? 'yes' : 'no'
    },
    onDisabledSave() {
      if (this.oper === 'edit') {
        return (
          this.mnRole.name === this.defRole.name &&
          this.mnRole.is_admin === this.defRole.is_admin
        )
      } else {
        return false // check field
      }
    },
    isDeleted() {
      return Boolean(this.mnRole.deleted_at)
    }
  }
}
</script>

<style lang="scss">
.role-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }

  .role-operation-button-zone {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 30px;

    .button {
      margin-right: 10px;
    }
  }
}
.role-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
