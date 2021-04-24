<template>
  <div class="course-operation">
    <template v-if="courseNotFound">
      <div class="course-not-found">
        <span>Sorry. Course is not found!!!</span>
        <br />
        <button @click="cancel_click" class="button btn-braun">
          {{ $t('label.back') }}
        </button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t(course_title) }}</span>
      <b-form @submit.stop.prevent="onSubmit">
        <b-container class="px-0 my-3">
          <template v-if="oper === 'edit'">
            <b-form-group id="input-course-id">
              <b-row ml="0" align-v="start" align-h="around">
                <b-col>
                  <span
                    >{{ $t('courses.id') }}: {{ `CR-${mnCourse.crid}` }}</span
                  >
                </b-col>
              </b-row>
            </b-form-group>
          </template>

          <b-form-group
            id="input-course-name"
            :maxLength="fieldsRestr.name.maxLength"
            :label="`${$t('courses.name')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="course-name"
            :invalid-feedback="validateErrorMessage('name')"
            :state="validateState('name')"
          >
            <b-row>
              <b-col>
                <b-form-input
                  id="course-name"
                  :value="mnCourse.name"
                  :placeholder="`${$t('courses.course_name')}`"
                  :disabled="course_is_deleted"
                  :state="validateState('name')"
                  @input.native="
                    (e) => {
                      e.target.value = e.target.value.substring(
                        0,
                        fieldsRestr.name.maxLength
                      )
                      mnCourse.name = e.target.value
                    }
                  "
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>

          <template v-if="oper === 'edit'">
            <b-form-group
              id="input-course-details"
              :label="`${$t('courses.details')}:`"
              label-cols-sm="3"
              label-cols-lg="3"
              label-for="course-details"
            >
              <b-row>
                <b-col>
                  <b-form-input
                    v-model="mnCourse.details"
                    :placeholder="`${$t('label.course_details')}`"
                  />
                </b-col>
              </b-row>
            </b-form-group>
            <b-form-group
              id="input-course-tags"
              :label="`${$t('courses.tags')}:`"
              label-cols-sm="3"
              label-cols-lg="3"
              label-for="course-tags"
            >
              <b-row>
                <b-col>
                  <b-form-input
                    v-model="mnCourse.tags"
                    :placeholder="`${$t('label.course_tags')}`"
                  />
                </b-col>
              </b-row>
            </b-form-group>
            <b-form-group
              id="input-course-published"
              :label="`${$t('courses.is_published')}:`"
              label-cols-sm="3"
              label-cols-lg="3"
              label-for="course-published"
            >
              <b-row>
                <b-col class="pt-2" cols="auto">
                  <b-form-checkbox
                    v-model="mnCourse.is_published"
                    name="checkbox-is-published"
                    :value="true"
                    :unchecked-value="false"
                  >
                  </b-form-checkbox>
                </b-col>
              </b-row>
            </b-form-group>
            <b-list-group>
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
              >
                {{ $t('courses.sections') }}
                <b-icon
                  @click="onAddSection"
                  icon="plus-circle"
                  scale="1.5"
                  variant="success"
                  style="cursor:pointer"
                ></b-icon>
              </b-list-group-item>
              <b-list-group-item
                v-for="(item, ind) of course_sections"
                :key="item.uuid"
                class="flex-column align-items-start"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <b-link href="#" @click="onSelectSection(item.uuid)"
                    >{{ item.title }}
                  </b-link>
                  <div class="section-item">
                    <b-badge variant="primary" pill>{{
                      item.modules_length
                    }}</b-badge>
                    <b-icon
                      v-if="ind < course_sections_count - 1"
                      icon="arrow-down-square"
                      scale="1"
                      @click="operSection(item.uuid, 'down')"
                      style="cursor:pointer"
                    ></b-icon>
                    <b-icon
                      v-if="ind > 0"
                      icon="arrow-up-square"
                      scale="1"
                      @click="operSection(item.uuid, 'up')"
                      style="cursor:pointer"
                    ></b-icon>
                    <b-icon
                      icon="x-circle"
                      scale="1"
                      variant="danger"
                      @click="operSection(item.uuid, 'del')"
                      style="cursor:pointer"
                    ></b-icon>
                  </div>
                </div>
                <p class="mb-1 pt-2 font-size-10 section-description">
                  {{ item.description }}
                </p>
              </b-list-group-item>
            </b-list-group>
          </template>

          <div class="course-operation-button-zone">
            <button
              :disabled="dataNotChanged || course_is_deleted"
              type="submit"
              class="button btn-blue"
            >
              {{ `${$t('label.register')}` }}
            </button>

            <button @click="cancel_click" class="button btn-braun">
              {{ `${$t('label.cancel')}` }}
            </button>
          </div>
        </b-container>
      </b-form>
    </template>
  </div>
</template>

<script>
import {mapState} from 'vuex'
//import multiselect from '@/components/elements/multiselect'
import validMixin from '@/mixins/validation'

export default {
  name: 'course-mng-form',
  mixins: [validMixin],
  components: {
    //multiselect
  },
  props: {
    oper: String
  },
  data() {
    return {
      validFormName: 'mnCourse',
      nameUniqError: '',
      src: {name: '', details: '', is_published: false, tags: ''},
      mnCourse: {
        name: '',
        crid: null,
        details: '',
        is_published: false,
        deleted_at: '',
        tags: ''
      },
      course_sections: [],
      courseNotFound: false
    }
  },
  watch: {
    ['mnCourse.name'](newVal) {
      if (this.nameUniqError !== '') {
        this.nameUniqError = ''
      }
    }
  },
  methods: {
    async operSection(uuid, act) {
      await this.$store.dispatch('MODIFY_COURSE_SECTIONS', {
        crid: this.mnCourse.crid,
        secid: uuid,
        act
      })
      const sections = await this.$store.dispatch('LOAD_COURSE_SECTIONS', {
        cid: this.cid,
        crid: this.mnCourse.crid
      })

      this.$set(this, 'course_sections', [...sections])
    },

    onSelectSection(uuid) {
      this.contentElementClick(`/course-section/edit/${uuid}`)
    },
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },
    cancel_click() {
      this.contentElementClick('/courses')
    },
    onAddSection() {
      this.contentElementClick(
        `/course-section/add/?course=${this.mnCourse.crid}`
      )
    },
    onSubmit() {
      this.$v[this.validFormName].$touch()
      if (this.$v[this.validFormName].$anyError) {
        return
      }

      const oper_type = this.oper === 'edit' ? 'COURSE_UPD' : 'COURSE_ADD'
      this.$store.dispatch(oper_type, this.mnCourse).then(
        (res) => {
          this.contentElementClick('/courses')
        },
        (err) => {
          const errMess = err.message.replace('Error: ', '')
          switch (errMess) {
            case 'THIS_COURSE_NAME_IS_NOT_ALLOWED':
              this.nameUniqError = errMess
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
    const {crid = null} = this.$route.params

    this.mnCourse.crid = crid
    const cid = this.cid

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_COURSE_INFO', {cid, crid}).then(
        (course) => {
          this.src = {...course}
          this.mnCourse = {...this.mnCourse, ...course}
        },
        (error) => {
          this.courseNotFound = true
          return
        }
      )
      this.$store.dispatch('LOAD_COURSE_SECTIONS', {cid, crid}).then(
        (sections) => {
          this.course_sections = [...sections]
        },
        (error) => {
          return
        }
      )
    }
  },
  computed: {
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id,
      fieldsRestr: (store) => store.FieldRestr.categories.courses
    }),
    course_title() {
      return `courses.oper_title_${this.oper}`
    },
    course_sections_count() {
      return this.course_sections.length
    },
    dataNotChanged() {
      return (
        this.src.name === this.mnCourse.name &&
        this.src.details === this.mnCourse.details &&
        this.src.is_published === this.mnCourse.is_published &&
        this.src.tags === this.mnCourse.tags
      )
    },
    course_is_deleted() {
      return Boolean(this.mnCourse.deleted_at)
    }
  }
}
</script>

<style lang="scss">
.multiselect {
  width: 100%;
  font-size: 0.8em;
}
.course-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }

  .course-operation-button-zone {
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
.course-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}

.section-item {
  > * {
    margin-left: 10px;
  }
}
.section-description {
  font-size: 0.8rem;
}
</style>
