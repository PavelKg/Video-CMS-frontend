<template>
  <div class="test-operation">
    <template v-if="testNotFound">
      <div class="test-not-found">
        <span>Sorry. Test is not found!!!</span>
        <br />
        <button @click="cancel_click" class="button btn-braun">
          {{ $t('label.back') }}
        </button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t(test_title) }}</span>
      <b-form @submit.stop.prevent="onSubmit">
        <b-container class="px-0 my-3">
          <b-row ml="0" align-v="start" align-h="around">
            <b-col>
              <b-form-group
                id="input-test-title"
                :label="`${$t('tests.test_title')}:`"
                label-cols-sm="3"
                label-cols-lg="3"
                label-for="test-title"
                :invalid-feedback="validateErrorMessage('title')"
                :state="validateState('title')"
              >
                <b-form-input
                  id="test-title"
                  v-model="mnTest.title"
                  :disabled="isDeleted"
                  :maxLength="fieldsRestr.title.maxLength"
                  :state="validateState('title')"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row ml="0" align-v="start" align-h="around">
            <b-col>
              <b-form-group
                id="input-test-description"
                :label="`${$t('tests.test_description')}:`"
                label-cols-sm="3"
                label-cols-lg="3"
                label-for="test-description"
                :invalid-feedback="validateErrorMessage('description')"
                :state="validateState('description')"
              >
                <b-form-input
                  id="test-description"
                  v-model="mnTest.description"
                  :disabled="isDeleted"
                  :state="validateState('description')"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>

          <b-form-group
            id="input-test-isPublic"
            :label="`${$t('tests.is_public')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="check_isPublic"
            label-align-sm="left"
            class="mb-1"
          >
            <b-form-checkbox
              id="check_isPublic"
              class="pt-2"
              v-model="mnTest.is_public"
              name="check_isPublic"
              :disabled="isDeleted"
            >
              <strong>{{ $t(`label.${is_public_state}`) }}</strong>
            </b-form-checkbox>
          </b-form-group>
          <b-row ml="0"  align-v="start" align-h="around" class="pt-3">
            <b-col>
              <b-link href="#" @click="edit_content">{{
                $t('tests.edit_content')
              }}</b-link>
            </b-col></b-row
          >
          <div class="test-operation-button-zone">
            <button
              type="submit"
              class="button btn-blue"
              :disabled="onDisabledSave || $v.mnTest.$anyError"
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
  name: 'test-mng-form',
  mixins: [validMixin],
  props: {
    oper: String
  },

  data() {
    return {
      validFormName: 'mnTest',
      ridUniqError: '',
      mnTest: {
        is_public: false,
        title: '',
        uuid: '',
        description: ''
      },
      defTest: {
        is_public: false,
        title: '',
        description: ''
      },
      testNotFound: false
    }
  },

  watch: {},
  methods: {
    edit_content() {
      const {uuid = null} = this.$route.params
      this.$router.push({name: 'test_content', params: {uuid}})
    },
    cancel_click() {
      this.$emit('contentElementClick', '/tests')
    },
    onSubmit() {
      this.$v[this.validFormName].$touch()
      if (this.$v[this.validFormName].$anyError) {
        return
      }

      const oper_type = this.oper === 'edit' ? 'TEST_UPD' : 'TEST_ADD'
      this.$store.dispatch(oper_type, this.mnTest).then(
        (res) => {
          this.$emit('contentElementClick', '/tests')
        },
        (err) => {
          const errMess = err.message.replace('Error: ', '')
          switch (errMess) {
            default:
              console.log('error=', errMess)
              break
          }
        }
      )
    }
  },

  created() {
    const {uuid = null} = this.$route.params

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_TEST_INFO', {uuid}).then(
        (test) => {
          
          this.defTest = {...test}
          this.mnTest = {...test}
        },
        (error) => {
          this.roleNotFound = true
        }
      )
    } else {
    }
  },
  computed: {
    ...mapState({
      fieldsRestr: (store) => store.FieldRestr.categories.tests
    }),

    test_title() {
      return `tests.oper_title_${this.oper}`
    },
    is_public_state() {
      return this.mnTest.is_public ? 'yes' : 'no'
    },
    onDisabledSave() {
      if (this.oper === 'edit') {
        return Object.keys(this.mnTest).reduce((accum, curr) => {
          accum + this.mnTest[curr] === this.defTest[curr]
        }, true)
        // this.mnRole.name === this.defRole.name &&
        // this.mnRole.is_admin === this.defRole.is_admin &&
        // !this.isPermitsChanged
        //this.deepEqual(this.permits, this.defRole.permits)
      } else {
        return false // check field
      }
    },

    isDeleted() {
      return Boolean(this.mnTest.deleted_at)
    }
  }
}
</script>

<style lang="scss">
.test-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }

  .test-operation-button-zone {
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
.test-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
