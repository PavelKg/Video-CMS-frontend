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
      <BindingTable :binding_data="binding_data"></BindingTable>
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
//import {Promise} from 'q'
import BindingTable from '@/components/elements/table-binding'

export default {
  name: 'binding-page',
  components: {
    BindingTable
  },
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
      binding_data: []
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
.truncate-text {
  max-width: 700px;
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
}

.buttom-column {
  display: flex;
  flex-direction: column;
  max-width: 60px;
}
</style>
