import Api from '@/api'

export default {
  state: {},
  actions: {
    async GET_BINDED_LIST({rootState, dispatch}, payment) {
      const {cid, category, id} = payment
      let binded_list = []
      try {
        switch (category) {
          case 'groups':
            const groupInfo = await dispatch('LOAD_GROUP_INFO', {cid, gid: id})
            const groupSeries = groupInfo.group_series

            await dispatch('LOAD_SERIES', {
              cid
              //filter: `series_id[in]:(${groupSeries})`
            })
            const groupSeriesList = rootState.Companies.Series.list
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: `S${item.sid}`,
                  uid: item.sid,
                  name: item.name,
                  category: 'series',
                  binded: groupSeries.includes(item.sid)
                }
              })

            const srcGroupVideosList = await dispatch('VIDEO_BIND_GROUP', {
              cid,
              gid: id
            })
            const groupVideosList = srcGroupVideosList
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: item.video_id,
                  uid: item.video_id,
                  uuid: item.uuid,
                  name: item.name,
                  category: 'videos',
                  binded: item.binded
                }
              })

            const srcGroupFilesList = await dispatch('FILE_BIND_GROUP', {
              cid,
              gid: id
            })
            const groupFilesList = srcGroupFilesList
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: item.file_id,
                  uid: item.file_id,
                  uuid: item.uuid,
                  name: item.name,
                  category: 'files',
                  binded: item.binded
                }
              })

            binded_list = [
              ...groupSeriesList,
              ...groupVideosList,
              ...groupFilesList
            ]

            break
          case 'series':
            const srcSeriesGroupsList = await dispatch('GROUP_BIND_SERIES', {
              cid,
              sid: id
            })
            const seriesGroupsList = srcSeriesGroupsList
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: `G${item.gid}`,
                  uid: item.gid,
                  name: item.name,
                  category: 'groups',
                  binded: item.binded
                }
              })

            const srcSeriesVideosList = await dispatch('VIDEO_BIND_SERIES', {
              cid,
              sid: id
            })
            const seriesVideosList = srcSeriesVideosList
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: item.video_id,
                  uid: item.video_id,
                  uuid: item.uuid,
                  name: item.name,
                  category: 'videos',
                  binded: item.binded
                }
              })

            const srcSeriesFilesList = await dispatch('FILE_BIND_SERIES', {
              cid,
              sid: id
            })
            const seriesFilesList = srcSeriesFilesList
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: item.file_id,
                  uid: item.file_id,
                  uuid: item.uuid,
                  name: item.name,
                  category: 'files',
                  binded: item.binded
                }
              })

            binded_list = [
              ...seriesGroupsList,
              ...seriesVideosList,
              ...seriesFilesList
            ]
            break
          case 'videos':
            const videoInfo = await dispatch('LOAD_VIDEO_INFO_BY_UUID', id)
            const {video_series, video_groups} = videoInfo
            const videoSeries = video_series.length === 0 ? [] : video_series

            await dispatch('LOAD_SERIES', {
              cid
              //filter: `series_id[in]:(${videoSeries})`
            })
            const videoSeriesList = rootState.Companies.Series.list
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: `S${item.sid}`,
                  uid: item.sid,
                  name: item.name,
                  category: 'series',
                  binded: videoSeries.includes(item.sid)
                }
              })

            const videoGroups = video_groups.length === 0 ? [] : video_groups

            await dispatch('LOAD_GROUPS', {
              cid
              //filter: `group_gid[in]:(${videoGroups})`
            })
            const videoGroupsList = rootState.Companies.Groups.list
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: `G${item.gid}`,
                  uid: item.gid,
                  name: item.name,
                  category: 'groups',
                  binded: videoGroups.includes(item.gid)
                }
              })
            binded_list = [...videoSeriesList, ...videoGroupsList]
            break

          case 'files':
            const fileInfo = await dispatch('LOAD_FILE_INFO_BY_UUID', id)
            const {file_series, file_groups} = fileInfo
            const fileSeries = file_series.length === 0 ? [] : file_series

            await dispatch('LOAD_SERIES', {
              cid
              //filter: `series_id[in]:(${videoSeries})`
            })
            const fileSeriesList = rootState.Companies.Series.list
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: `S${item.sid}`,
                  uid: item.sid,
                  name: item.name,
                  category: 'series',
                  binded: fileSeries.includes(item.sid)
                }
              })

            const fileGroups = file_groups.length === 0 ? [] : file_groups

            await dispatch('LOAD_GROUPS', {
              cid
              //filter: `group_gid[in]:(${videoGroups})`
            })
            const fileGroupsList = rootState.Companies.Groups.list
              .filter((item) => {
                return !item.deleted_at || (item.deleted_at && item.binded)
              })
              .map((item) => {
                return {
                  id: `G${item.gid}`,
                  uid: item.gid,
                  name: item.name,
                  category: 'groups',
                  binded: fileGroups.includes(item.gid)
                }
              })
            binded_list = [...fileSeriesList, ...fileGroupsList]
            break

          default:
            break
        }
        return binded_list
      } catch (err) {}
    }
  },
  mutations: {},
  getters: {}
}
