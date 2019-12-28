<template>
  <div class="binding-zone">
    <p>{{ $t('binding.binding_settings') }}</p>
    <b-container fluid class="pl-0 bv-example-row-flex-cols">
      <b-row class="justify-content-md-left">
        <b-col sm class="mb-2">
          <b-form-select
            v-model="selected_category"
            :options="targets"
            @change="onCategoryChange"
          ></b-form-select>
        </b-col>
        <b-col sm class="mb-2">
          <b-form-select
            v-model="selected_id"
            :options="id_options"
            :disabled="!selected_category"
            @change="onIdChange"
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
      <BindingTable
        :binding_data="binding_data"
        v-model="bindingMembersState"
        :isLoadingData="isLoadingTableData"
      ></BindingTable>
      <b-row class="justify-content-md-left">
        <b-col cols="auto">
          <button
            class="button btn-blue"
            :disabled="!bindingMembersState.length"
            @click="onRegister"
          >
            {{ $t('label.registration') }}
          </button> </b-col
        ><b-col cols="auto">
          <button class="button btn-braun" @click="$router.go(-1)">
            {{ $t('label.back') }}
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
import {Promise} from 'q'

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
      zero_id_option: [
        {
          value: null,
          text: this.$t('binding.please_select_id_name'),
          disabled: true
        }
      ],
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
      binding_data: [],
      bindingMembersState: [],
      isLoadingTableData: false
    }
  },
  mounted() {
    this.id_options = [...this.zero_id_option]
  },
  methods: {
    onIdChange(val) {
      this.binding_data = []
    },
    onCategoryChange(val) {
      const cid = this.cid
      this.binding_data = []

      let res_list = []
      this.$store.dispatch(`LOAD_${val.toUpperCase()}`, {cid}).then((res) => {
        let valRef = ''
        let textRef = ''
        let textAdd = ''
        switch (val) {
          case 'series':
            valRef = 'sid'
            textRef = 'name'
            break
          case 'groups':
            valRef = 'gid'
            textRef = 'name'
            break
          case 'videos':
            valRef = 'video_id'
            textRef = 'video_title'

            break
        }
        res_list = this[val]
          .filter((item) => !item.deleted_at)
          .map((item) => {
            return {
              value: item[valRef],
              text:
                item[textRef] && item[textRef].length > 20
                  ? val !== 'videos'
                    ? `${item[textRef].substring(1, 20)}... `
                    : `${item[valRef]} / ${item[textRef].substring(1, 20)}... `
                  : val !== 'videos'
                  ? item[textRef]
                  : `${item[valRef]} /  ${item[textRef]}`,
              uid: val !== 'videos' ? item[valRef] : item.video_uuid
            }
          })
        this.id_options = [...this.zero_id_option, ...res_list]
        this.selected_id = null
      })
    },
    onLoadBindingData() {
      this.binding_data = []
      this.isLoadingTableData = true
      const category = this.selected_category

      const id = this.id_options.find((item) => {
        return item.value === this.selected_id
      }).uid

      this.$store
        .dispatch('GET_BINDED_LIST', {
          cid: this.cid,
          category,
          id
        })
        .then(
          (res) => {
            this.binding_data = [...res]
            this.isLoadingTableData = false
          },
          (error) => {
            this.isLoadingTableData = false
          }
        )
    },
    onRegister() {
      const cid = this.cid
      let send_data = {}
      const {uid: id, text: name} = this.id_options.find((item) => {
        return item.value === this.selected_id
      })

      const category = this.selected_category
      switch (category) {
        case 'videos':
          const video_groups = this.bindingMembersList
            .filter((item) => item.category === 'groups')
            .map((item) => {
              return item.uid
            })
          const video_series = this.bindingMembersList
            .filter((item) => item.category === 'series')
            .map((item) => {
              return item.uid
            })

          send_data = Object.assign(
            {cid, video_uuid: id},
            {video_groups},
            {video_series}
          )

          this.$store.dispatch('UPDATE_VIDEO_INFO', send_data).then(
            (res) => {
              this.onLoadBindingData()
            },
            (error) => {
              console.log('videos-update-error=', error)
            }
          )
          break
        case 'groups':
          const group_series = this.bindingMembersList
            .filter((item) => item.category === 'series')
            .map((item) => {
              return item.uid
            })

          send_data = Object.assign(
            {},
            {cid},
            {gid: id},
            {name},
            {group_series}
          )
          const grpPromise = this.$store.dispatch('GROUP_UPD', send_data)

          const vidPromise = this.videosModify(category, id)
          Promise.all([grpPromise, vidPromise]).then(
            () => {
              this.onLoadBindingData()
            },
            (error) => {
              console.log('groups-promise-error=', error)
            }
          )
          break
        case 'series':
          const videoPromise = this.videosModify(category, id)
          const groupPromise = this.groupsModify(category, id)
          Promise.all([groupPromise, videoPromise]).then(
            () => {
              this.onLoadBindingData()
            },
            (error) => {
              console.log('series-promise-error=', error)
            }
          )
          break
        default:
          break
      }
    },
    async videosModify(category, id) {
      const idTitles = {groups: 'gid', series: 'sid'}
      const send_data = {
        uuid_list: [],
        [idTitles[category]]: id,
        oper: 'del'
      }

      const forRemove = this.bindingMembersState
        .filter((video) => {
          return video.list === 'removed' && video.category === 'videos'
        })
        .map((video) => {
          return video.uuid
        })
      send_data.uuid_list = [...forRemove]

      await this.$store.dispatch(
        `VIDEO_${category.toUpperCase()}_MULTI_OPER`,
        send_data
      )

      const forAdd = this.bindingMembersState
        .filter(
          (video) => video.list === 'added' && video.category === 'videos'
        )
        .map((video) => {
          return video.uuid
        })

      send_data.uuid_list = [...forAdd]
      send_data.oper = 'add'

      await this.$store.dispatch(
        `VIDEO_${category.toUpperCase()}_MULTI_OPER`,
        send_data
      )
      return Promise.resolve('finished')
    },
    async groupsModify(category, id) {
      const idTitles = {groups: 'gid', series: 'sid'}
      const send_data = {
        gid_list: [],
        [idTitles[category]]: id,
        oper: 'del'
      }

      const forRemove = this.bindingMembersState
        .filter((group) => {
          return group.list === 'removed' && group.category === 'groups'
        })
        .map((group) => {
          return group.uid
        })

      if (forRemove.length > 0) {
        send_data.gid_list = [...forRemove]
        await this.$store.dispatch(
          `GROUP_${category.toUpperCase()}_MULTI_OPER`,
          send_data
        )
      }

      const forAdd = this.bindingMembersState
        .filter(
          (group) => group.list === 'added' && group.category === 'groups'
        )
        .map((group) => {
          return group.uid
        })

      if (forAdd.length > 0) {
        send_data.gid_list = [...forAdd]
        send_data.oper = 'add'

        await this.$store.dispatch(
          `GROUP_${category.toUpperCase()}_MULTI_OPER`,
          send_data
        )
      }

      return Promise.resolve('finished')
    }
  },
  computed: {
    ...mapState({
      cid: (state) => state.Login.me.profile.company_id,
      groups: (state) => state.Companies.Groups.list,
      series: (state) => state.Companies.Series.list,
      videos: (state) =>
        state.Videos.list.filter((item) => item.deleted_at === '')
    }),
    bindingMembersList() {
      const movedToMember = this.bindingMembersState
        .filter((item) => item.list === 'added')
        .map((item) => item.id)
      const movedFromMember = this.bindingMembersState
        .filter((item) => item.list === 'removed')
        .map((item) => item.id)
      return this.binding_data.filter((item) => {
        return (
          (item.binded && !movedFromMember.includes(item.id)) ||
          (!item.binded && movedToMember.includes(item.id))
        )
      })
    }
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
