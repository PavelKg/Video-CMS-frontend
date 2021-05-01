<template>
  <div class="section-operation">
    <template v-if="sectionNotFound">
      <div class="section-not-found">
        <span>Sorry. Section is not found!!!</span>
        <br />
        <button @click="cancel_click" class="button btn-braun">
          {{ $t('label.back') }}
        </button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t(section_title) }}</span>
      <b-form @submit.stop.prevent="onSubmit">
        <b-container class="px-0 my-3">
          <b-form-group
            id="input-section-name"
            :maxLength="fieldsRestr.title.maxLength"
            :label="`${$t('sections.title')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="section-title"
            :invalid-feedback="validateErrorMessage('title')"
            :state="validateState('title')"
          >
            <b-row>
              <b-col>
                <b-form-input
                  id="section-title"
                  :value="mnSection.title"
                  :placeholder="`${$t('course.section_title')}`"
                  :disabled="section_is_deleted"
                  :state="validateState('title')"
                  @input.native="
                    (e) => {
                      e.target.value = e.target.value.substring(
                        0,
                        fieldsRestr.title.maxLength
                      )
                      mnSection.title = e.target.value
                    }
                  "
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>

          <template>
            <b-form-group
              id="input-section-details"
              :label="`${$t('courses.section_description')}:`"
              label-cols-sm="3"
              label-cols-lg="3"
              label-for="section-description"
            >
              <b-row>
                <b-col>
                  <b-form-input
                    v-model="mnSection.description"
                    :placeholder="`${$t('label.course_section_description')}`"
                  />
                </b-col>
              </b-row>
            </b-form-group>
            <b-form-group
              id="input-section-tags"
              :label="`${$t('sections.tags')}:`"
              label-cols-sm="3"
              label-cols-lg="3"
              label-for="section-tags"
            >
              <b-row>
                <b-col>
                  <b-form-input
                    v-model="mnSection.tags"
                    :placeholder="`${$t('label.course_section_tags')}`"
                  />
                </b-col>
              </b-row>
            </b-form-group>
            <template v-if="oper === 'edit'">
              <b-list-group>
                <b-list-group-item
                  class="d-flex justify-content-between align-items-center"
                >
                  {{ $t('courses.modules') }}
                  <b-icon
                    @click="onAddModule"
                    icon="plus-circle"
                    scale="1.5"
                    variant="success"
                    style="cursor:pointer"
                  ></b-icon>
                </b-list-group-item>

                <b-list-group-item
                  v-for="(item, ind) of section_modules"
                  :key="item.modid"
                  class="flex-column align-items-start"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <b-link href="#" @click="onSelectModule(item.modid)"
                      >{{
                        item['instructor_note'].title
                          ? item['instructor_note'].title
                          : 'No module title'
                      }}
                    </b-link>
                    <div class="section-item">
                      <b-badge
                        variant="primary"
                        pill
                        :title="'Lessons count'"
                        style="cursor:default"
                        >{{ item.lessons_length }}</b-badge
                      >
                      <b-icon
                        v-if="ind < section_modules_count - 1"
                        icon="arrow-down-square"
                        scale="1"
                        style="cursor:pointer"
                        @click="operSection(item.modid, 'down')"
                      ></b-icon>
                      <b-icon
                        v-if="ind > 0"
                        icon="arrow-up-square"
                        scale="1"
                        style="cursor:pointer"
                        @click="operSection(item.modid, 'up')"
                      ></b-icon>
                      <b-icon
                        icon="x-circle"
                        scale="1"
                        variant="danger"
                        style="cursor:pointer"
                        @click="operSection(item.modid, 'del')"
                      ></b-icon>
                    </div>
                  </div>
                  <p class="mb-1 pt-2 font-size-10 section-description">
                    {{ item.description }}
                  </p>
                </b-list-group-item>
              </b-list-group>
            </template>
          </template>

          <div class="section-operation-button-zone">
            <button
              :disabled="dataNotChanged || section_is_deleted"
              type="submit"
              class="button btn-blue"
            >
              {{ `${$t('label.register')}` }}
            </button>

            <button @click.stop.prevent="cancel_click" class="button btn-braun">
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
  name: 'section-mng-form',
  mixins: [validMixin],
  components: {
    //multiselect
  },
  props: {
    oper: String
  },
  data() {
    return {
      validFormName: 'mnSection',
      titleUniqError: '',
      src: {title: '', description: '', tags: ''},
      mnSection: {
        title: '',
        description: '',
        deleted_at: '',
        tags: '',
        uuid: ''
      },
      section_modules: [],
      sectionNotFound: false
    }
  },
  watch: {
    ['mnSection.title'](newVal) {
      if (this.titleUniqError !== '') {
        this.titleUniqError = ''
      }
    }
  },
  methods: {
    onAddModule() {
      this.contentElementClick(
        `/course-module/add/?section=${this.mnSection.uuid}`
      )
    },
    async operSection(modid, act) {
      await this.$store.dispatch('MODIFY_SECTION_MODULES', {
        secid: this.mnSection.uuid,
        modid,
        act
      })
      const modules = await this.$store.dispatch('LOAD_SECTION_MODULES', {
        cid: this.cid,
        secid: this.mnSection.uuid
      })

      this.$set(this, 'section_modules', [...modules])
    },
    onSelectModule(modid) {
      this.contentElementClick(`/course-module/edit/${modid}`)
    },
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },
    cancel_click() {
      this.$router.go(-1)
    },

    async onSubmit() {
      this.$v[this.validFormName].$touch()
      if (this.$v[this.validFormName].$anyError) {
        return
      }
      try {
        const oper_type =
          this.oper === 'edit' ? 'COURSE_SECTION_UPD' : 'COURSE_SECTION_ADD'
        const uuid = await this.$store.dispatch(oper_type, this.mnSection)
        const course_name = this.$route.query.course
        if (this.oper === 'add' && course_name && uuid) {
          console.log('MODIFY_COURSE_SECTIONS', course_name)
          await this.$store.dispatch('MODIFY_COURSE_SECTIONS', {
            course_name,
            secid: uuid,
            act: 'add'
          })
        }
        this.$router.go(-1)
      } catch (err) {
        const errMess = err.message.replace('Error: ', '')
        switch (errMess) {
          case 'THIS_COURSE_SECTION_TITLE_IS_NOT_ALLOWED':
            this.titleUniqError = errMess
            break
          default:
            console.log('error=', errMess)
            break
        }
      }
    }
  },

  created() {
    const {secid = null} = this.$route.params
    const cid = this.cid

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_COURSE_SECTION_INFO', {cid, secid}).then(
        (section) => {
          console.log(section)
          this.src = {...section}
          this.mnSection = {...this.mnSection, ...section}
        },
        (error) => {
          console.log(error)
          this.sectionNotFound = true
          return
        }
      )
      this.$store.dispatch('LOAD_SECTION_MODULES', {cid, secid}).then(
        (modules) => {
          this.section_modules = [...modules]
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
      fieldsRestr: (store) => store.FieldRestr.categories.courses_section
    }),
    section_title() {
      return `sections.oper_title_${this.oper}`
    },
    dataNotChanged() {
      return (
        this.src.title === this.mnSection.title &&
        this.src.description === this.mnSection.description &&
        this.src.tags === this.mnSection.tags
      )
    },
    section_is_deleted() {
      return Boolean(this.mnSection.deleted_at)
    },
    section_modules_count() {
      return this.section_modules.length
    }
  }
}
</script>

<style lang="scss">
.multiselect {
  width: 100%;
  font-size: 0.8em;
}
.section-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }

  .section-operation-button-zone {
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
.section-not-found {
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
