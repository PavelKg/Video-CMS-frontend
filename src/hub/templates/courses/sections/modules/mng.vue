<template>
  <div class="module-operation">
    <template v-if="moduleNotFound">
      <div class="module-not-found">
        <span>Sorry. Module is not found!!!</span>
        <br />
        <button @click="cancel_click" class="button btn-braun">
          {{ $t('label.back') }}
        </button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t(module_title) }}</span>
      <b-form @submit.stop.prevent="onSubmit">
        <b-container class="px-0 my-3">
          <b-form-group
            id="input-module-note"
            :label="`${$t('modules.instructor_note')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="module-instructor-note"
          >
            <b-row>
              <b-col>
                <b-form-input
                  id="module-instructor-note"
                  :value="mnModule.instructor_note.title"
                  :placeholder="`${$t('course.module-instructor-note')}`"
                  :disabled="module_is_deleted"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>

          <template>
            <template v-if="oper === 'edit'">
              <b-list-group>
                <b-list-group-item
                  class="d-flex justify-content-between align-items-center"
                >
                  {{ $t('modules.lessons') }}
                  <b-icon
                    icon="plus-circle"
                    scale="1.5"
                    variant="success"
                    @click="onOperLesson({type: 'add', subject: 'lessons'})"
                    style="cursor:pointer"
                  ></b-icon>
                </b-list-group-item>

                <b-list-group-item
                  v-for="(item, ind) of module_lessons"
                  :key="ind"
                  class="flex-column align-items-start"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <b-link
                      @click="
                        onOperLesson({type: 'upd', ind, subject: 'lessons'})
                      "
                      >{{ item.title }}
                    </b-link>
                    <div class="module-item">
                      <b-icon
                        icon="plus-circle"
                        scale="1"
                        variant="success"
                        @click="
                          onOperLesson({
                            type: 'add',
                            parent_ind: ind,
                            subject: 'tasks'
                          })
                        "
                        style="cursor:pointer"
                      ></b-icon>
                      <b-icon
                        v-if="ind < module_lessons.length - 1"
                        @click="
                          onOperLesson({type: 'down', ind, subject: 'lessons'})
                        "
                        style="cursor:pointer"
                        icon="arrow-down-square"
                        scale="1"
                      ></b-icon>
                      <b-icon
                        v-if="ind > 0"
                        @click="
                          onOperLesson({type: 'up', ind, subject: 'lessons'})
                        "
                        style="cursor:pointer"
                        icon="arrow-up-square"
                        scale="1"
                      ></b-icon>
                      <b-icon
                        icon="x-circle"
                        scale="1"
                        variant="danger"
                        @click="
                          onOperLesson({type: 'del', ind, subject: 'lessons'})
                        "
                        style="cursor:pointer"
                      ></b-icon>
                    </div>
                  </div>
                  <p class="mb-1 pt-2 font-size-10 module-description">
                    {{ item.description }}
                  </p>

                  <b-list-group>
                    <b-list-group-item
                      v-for="(task, tind) of item.tasks"
                      :key="tind"
                      class="flex-column align-items-start"
                    >
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <b-link
                          @click="
                            onOperLesson({
                              type: 'upd',
                              parent_ind: ind,
                              ind: tind,
                              subject: 'tasks'
                            })
                          "
                          style="cursor:pointer"
                          ><b>{{ task.type | capitalize }}</b
                          >: {{ task.name }}
                        </b-link>
                        <div class="module-item">
                          <b-badge variant="primary" pill>{{
                            item.lessons_length
                          }}</b-badge>
                          <b-icon
                            v-if="tind < item.tasks.length - 1"
                            @click="
                              onOperLesson({
                                type: 'down',
                                parent_ind: ind,
                                ind: tind,
                                subject: 'tasks'
                              })
                            "
                            style="cursor:pointer"
                            icon="arrow-down-square"
                            scale="1"
                          ></b-icon>
                          <b-icon
                            v-if="tind > 0"
                            @click="
                              onOperLesson({
                                type: 'up',
                                parent_ind: ind,
                                ind: tind,
                                subject: 'tasks'
                              })
                            "
                            style="cursor:pointer"
                            icon="arrow-up-square"
                            scale="1"
                          ></b-icon>
                          <b-icon
                            icon="x-circle"
                            scale="1"
                            variant="danger"
                            style="cursor:pointer"
                            @click="
                              onOperLesson({
                                type: 'del',
                                parent_ind: ind,
                                ind: tind,
                                subject: 'tasks'
                              })
                            "
                          ></b-icon>
                        </div>
                      </div>
                    </b-list-group-item>
                  </b-list-group>
                </b-list-group-item>
              </b-list-group>
            </template>
          </template>

          <div class="module-operation-button-zone">
            <button
              :disabled="dataNotChanged || module_is_deleted"
              type="submit"
              class="button btn-blue"
            >
              {{ `${$t('label.register')}` }}
            </button>

            <button @click.stop.prevent="cancel_click" class="button btn-braun">
              {{ `${$t('label.back')}` }}
            </button>
          </div>
        </b-container>
      </b-form>
    </template>
    <b-modal id="modal-win" v-model="modalShow" @ok="handleOk">
      <form ref="form" @submit.stop.prevent="handleModalSubmit">
        <b-form-group
          v-for="(item, ind) in editFields.fields"
          :key="item.title"
          :label="item.title | capitalize"
          :label-for="`${item.title}-input`"
          :invalid-feedback="`${item.title} is required`"
        >
          <template v-if="item.view === 'input'">
            <b-form-input
              :id="`${item.title}-input`"
              v-model="editFields.fields[ind].value"
              required
            ></b-form-input>
          </template>
          <template v-if="item.view === 'text'">
            {{ editFields.fields[ind].value }}
          </template>
          <template v-if="item.view === 'select'">
            <b-form-select
              v-model="editFields.fields[ind].value"
              :options="editFields.fields[ind].options"
            ></b-form-select>
          </template>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import {mapState} from 'vuex'
//import multiselect from '@/components/elements/multiselect'
import validMixin from '@/mixins/validation'
//import {directive} from 'vue/types/umd'

export default {
  name: 'module-mng-form',
  mixins: [validMixin],
  components: {
    //multiselect
  },
  props: {
    oper: String
  },
  data() {
    return {
      validFormName: 'mnModule',
      titleUniqError: '',
      src: {instructor_note: {title: ''}},
      mnModule: {
        instructor_note: {title: ''},
        deleted_at: '',

        modid: ''
      },
      module_lessons: [],
      moduleNotFound: false,
      modalShow: false,
      editFields: [],
      module_lessons_data_types: {},
      lessons_changes: false
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  watch: {
    ['mnSection.instructor_note.title'](newVal) {
      if (this.titleUniqError !== '') {
        this.titleUniqError = ''
      }
    }
  },
  methods: {
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      this.modalShow = false
      // Trigger submit handler
      this.handleModalSubmit()
    },

    handleModalSubmit() {
      const {type, subject, fields, parent_ind, ind} = this.editFields
      let object = {}
      fields.forEach((field) => {
        object[field.title] = field.value
      })
      const fn = `${type}_${subject}`
      if (typeof this[fn] === 'function') {
        this.lessons_changes = true
        this[fn]({object, ind, parent_ind})
      }
    },

    onOperLesson({type, subject, parent_ind = null, ind = null}) {
      const module_lessons_data_types = {...this.module_lessons_data_types}

      let fields = []
      const curr_data =
        subject === 'lessons'
          ? this.module_lessons[ind]
          : this.module_lessons[parent_ind].tasks[ind]

      const values = module_lessons_data_types[subject].map((item) => {
        return ind !== null ? curr_data[item.title] : ''
      })

      if (['add', 'upd'].includes(type)) {
        fields = module_lessons_data_types[subject].map((field, index) => {
          const currField = {...field}
          currField.value = values[index]
          return currField
        })
      } else if (type === 'del') {
        fields = module_lessons_data_types[subject].map((field, index) => {
          const currField = {...field}
          currField.value = `Delete "${values[index]}" ${subject} ?`
          currField.view = 'text'
          return currField
        })
      } else if (['down', 'up'].includes(type)) {
        const to = type === 'up' ? ind - 1 : ind + 1
        this.moveArrayItem(ind, to, this.module_lessons)
        this.lessons_changes = true
        return
      }

      this.editFields = {
        type,
        subject,
        ind,
        parent_ind,
        fields: [...fields]
      }

      this.modalShow = true
    },

    add_lessons({object}) {
      object.tasks = []
      this.module_lessons.push({...object})
    },
    add_tasks(payload) {
      const {object, parent_ind} = payload
      this.module_lessons[parent_ind].tasks.push({...object})
    },
    upd_lessons({object, ind}) {
      const lesson = this.module_lessons[ind]
      this.module_lessons[ind] = {...lesson, ...object}
    },
    upd_tasks(payload) {
      const {object, parent_ind, ind} = payload
      const task = this.module_lessons[parent_ind].tasks[ind]
      this.module_lessons[parent_ind].tasks[ind] = {...task, ...object}
    },
    del_lessons({ind}) {
      this.module_lessons.splice(ind, 1)
    },
    del_tasks(payload) {
      const {parent_ind, ind} = payload
      this.module_lessons[parent_ind].tasks.splice(ind, 1)
    },
    moveArrayItem(from, to, arr) {
      const cutOut = arr.splice(from, 1)[0]
      arr.splice(to, 0, cutOut)
    },
    onSelectSection(uuid) {
      this.contentElementClick(`/module-module/edit/${uuid}`)
    },
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },
    cancel_click() {
      this.$router.go(-1)
    },

    async onSubmit() {
      try {
        const oper_type =
          this.oper === 'edit' ? 'COURSE_MODULE_UPD' : 'COURSE_MODULE_ADD'
        if (this.oper === 'edit' && this.lessons_changes) {
          await this.$store.dispatch('COURSE_MODULE_LESSONS_UPD', {
            modid: this.mnModule.modid,
            lessons: this.module_lessons
          })
          this.lessons_changes = false
          return
        }

        await this.$store.dispatch(oper_type, this.mnModule)

        // const section_id = this.$route.query.section
        // if (this.oper === 'add' && section_id && modid) {
        //   await this.$store.dispatch('MODIFY_SECTION_MODULES', {
        //     secid: section_id,
        //     modid,
        //     act: 'add'
        //   })
        // }
        //this.$router.go(-1)
      } catch (err) {
        const errMess = err.message.replace('Error: ', '')
        switch (errMess) {
          default:
            console.log('error=', errMess)
            break
        }
      }
    }
  },

  async created() {
    const {modid = null} = this.$route.params
    const cid = this.cid

    if (this.oper === 'edit') {
      try {
        this.$store.dispatch('LOAD_COURSE_MODULE_INFO', {cid, modid}).then(
          (module) => {
            this.src = {...module}
            this.mnModule = {...this.mnModule, ...module}
          },
          (error) => {
            console.log(error)
            this.moduleNotFound = true
            return
          }
        )
        const lessons = await this.$store.dispatch('LOAD_MODULE_LESSONS', {
          cid,
          modid
        })
        this.module_lessons = [...lessons]
        this.module_lessons_data_types = await this.$store.dispatch(
          'LOAD_COURSE_MODULE_DATA_TYPES'
        )
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id,
      fieldsRestr: (store) => store.FieldRestr.categories.courses_module
    }),
    module_title() {
      return `modules.oper_title_${this.oper}`
    },
    dataNotChanged() {
      return (
        this.src.instructor_note === this.mnModule.instructor_note &&
        !this.lessons_changes
      )
    },
    module_is_deleted() {
      return Boolean(this.mnModule.deleted_at)
    }
  }
}
</script>

<style lang="scss">
.multiselect {
  width: 100%;
  font-size: 0.8em;
}
.module-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }

  .module-operation-button-zone {
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
.module-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}

.module-item {
  display: flex;
  > * {
    margin-left: 10px;
  }
}
.module-description {
  font-size: 0.8rem;
}
</style>
