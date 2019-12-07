<template>
  <div class="binding-zone">
    <p>{{ $t('binding.binding_settings') }}</p>
    <b-container fluid class="pl-0 bv-example-row-flex-cols">
      <b-row class="justify-content-md-left">
        <b-col sm class="mb-2">
          <b-form-select
            v-model="selected_category"
            :options="targets"
            @change="onTargetChange"
          ></b-form-select>
        </b-col>
        <b-col sm class="mb-2">
          <b-form-select
            v-model="selected_id"
            :options="id_options"
            :disabled="!selected_category"
            ><b-spinner small></b-spinner
          ></b-form-select>
        </b-col>
        <b-col class="mb-2 ">
          <button
            class="button btn-blue"
            :disabled="!selected_id"
            @click="onLoadBindingData"
          >
            {{ $t('binding.btn_bind') }}
          </button>
        </b-col>
      </b-row>
      <b-row align-v="center">
        <b-col cols="5" sm class="mb-2 ">
          <div class="scroll-table">
            <b-table
              responsive
              :items="source_table_items"
              :fields="table_fields"
              selectable
              @row-selected="onSourceRowSelected"
              ><template v-slot:cell(name)="row">
                <p class="truncate-text">{{ row.item.name }}</p>
              </template>
            </b-table>
          </div>
        </b-col>
        <b-col cols="2" class="p-1 justify-content-md-center buttom-column">
          <b-button
            class="m-1"
            variant="outline-secondary"
            v-html="'>'"
          ></b-button>
          <b-button
            class="m-1"
            variant="outline-secondary"
            v-html="'<'"
          ></b-button
        ></b-col>
        <b-col cols="5" sm class="mb-2 ">
          <div class="scroll-table">
            <b-table
              responsive
              :items="target_table_items"
              :fields="table_fields"
              ><template v-slot:cell(name)="row">
                <p class="truncate-text">{{ row.name }}</p>
              </template>
            </b-table>
          </div>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-left">
        <b-col cols="auto">
          <button class="button btn-blue" :disabled="!selected_id">
            {{ $t('binding.btn_bind') }}
          </button> </b-col
        ><b-col cols="auto">
          <button class="button btn-blue" :disabled="!selected_id">
            {{ $t('binding.btn_bind') }}
          </button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {Promise} from 'q'
export default {
  name: 'binding-page',
  data() {
    return {
      target_text: this.$t('binding.target'),
      selected_category: null,
      selected_id: null,
      zero_id_option: {
        value: null,
        text: this.$t('binding.please_select_id_name'),
        disabled: true
      },
      id_options: [],
      subTables: {
        series: [
          {entity: 'groups', fields: ['gid', 'name']},
          {entity: 'videos', fields: ['video_id', 'video_title']}
        ],
        videos: [{entity: 'groups', fields: ['gid', 'name']}],
        groups: [
          {entity: 'series', fields: ['sid', 'name']},
          {entity: 'videos', fields: ['video_id', 'video_title']}
        ]
      },

      targets: [
        {
          value: null,
          text: this.$t('binding.please_select_a_target'),
          disabled: true
        },
        {value: 'groups', text: this.$t('binding.groups')},
        {value: 'series', text: this.$t('binding.series')},
        {value: 'videos', text: this.$t('binding.videos')}
      ],
      source_table_items: [],
      table_fields: ['id', 'name'],
      target_table_items: []
    }
  },
  mounted() {
    this.id_options = [this.zero_id_option]
  },
  methods: {
    onTargetChange(val) {
      const cid = this.cid
      let res_list = []
      this.$store.dispatch(`LOAD_${val.toUpperCase()}`, {cid}).then((res) => {
        switch (val) {
          case 'series':
            res_list = this.series.map((item) => {
              return {
                value: item.sid,
                text:
                  item.name.length > 20
                    ? `${item.name.substring(1, 20)}... `
                    : item.name
              }
            })
            //console.log('series=', this.series)
            break
          case 'groups':
            res_list = this.groups.map((item) => {
              return {
                value: item.gid,
                text:
                  item.name.length > 20
                    ? `${item.name.substring(1, 20)}... `
                    : item.name
              }
            })
            //console.log('groups=', this.groups)
            break
          case 'videos':
            res_list = this.videos.map((item) => {
              return {
                value: item.video_id,
                text:
                  item.video_title && item.video_title.length > 20
                    ? `${item.video_id} / ${item.video_title.substring(
                        1,
                        20
                      )}... `
                    : `${item.video_id} / ${item.video_title}`
              }
            })
            break
        }

        this.selected_id = null
        this.id_options = [this.zero_id_option, ...res_list]
      })
    },
    onLoadBindingData() {
      console.log('selected_id=', this.selected_id)
      this.onLoadTablesData(this.selected_category, this.selected_id)
    },
    onLoadTablesData(category, id) {
      const cid = this.cid
      this.source_table_items = []
      const mixData = []
      const promiseSourceArray = []
      this.subTables[category].forEach((item) => {
        promiseSourceArray.push[
          this.$store.dispatch(`LOAD_${item.entity.toUpperCase()}`, {cid})
        ]
      })
      Promise.all(promiseSourceArray).then(() =>
        this.subTables[category].forEach((item) => {
          this.source_table_items.push(
            ...this[item.entity].map((elem) => {
              console.log('elem=', elem)
              return {
                id: elem[item.fields[0]],
                name: elem[item.fields[1]],
                category: item.entity
              }
            })
          )
        })
      )
    },
    onSourceRowSelected(evt) {
      console.log('evt=', evt)
    }
  },
  computed: {
    ...mapState({
      cid: (state) => state.Login.me.profile.company_id,
      groups: (state) => state.Companies.Groups.list,
      series: (state) => state.Companies.Series.list,
      videos: (state) =>
        state.Videos.list.filter((item) => item.deleted_at === '')
    })
  }
}
</script>

<style lang="scss">
#select-id {
  background: black;
}
.truncate-text {
  max-width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.binding-zone {
  //max-width: 900px;
  > p {
    font-size: 1.4em;
    font-weight: 600;
  }
  .binding-mng {
    display: flex;
    align-items: center;
  }
}

.scroll-table {
  height: 300px;
  overflow: auto;
}

.buttom-column {
  display: flex;
  flex-direction: column;
}
</style>
