// import {
//   required,
//   minLength,
//   maxLength,
//   sameAs,
//   email
// } from 'vuelidate/lib/validators'
// import {withParams} from 'vuelidate/lib/validators/common'

// import i18n from './i18n'

// // const appModules = {}
// // // const lazyLoad = (_path) =>
// // //   import().then((res)=>console.log('aaaa=', res))

// // const routeChilds = function(menu, parent) {
// //   let children = []
// //   Object.keys(menu.subItems).map((sub) => {
// //     let item = {}
// //     //const child_name =
// //     item.name = parent !== '' ? `${parent}_${sub}` : sub
// //     item.path = sub
// //     //item.path = `${mainpath}/${sub}`
// //     // Vue.component(menu.subItems[sub].component,
// //     // // The `import` function returns a Promise.
// //     // () => {
// //     //   console.log('aaa=', userAppMod[menu.subItems[sub].component])
// //     //   return import(userAppMod[menu.subItems[sub].component])})
// //     // console.log('Vue.component(menu.subItems[sub].component=', Vue.component(menu.subItems[sub].component))
// //     if (appModules[menu.subItems[sub].component]) {
// //       item.component = appModules[menu.subItems[sub].component]()
// //     } else {
// //       item.component = '{<template><div>Module not found</div></template>}'
// //     }
// //     //appModules[menu.subItems[sub].component]() //Vue.component(menu.subItems[sub].component)

// //     if (menu.subItems[sub].hasOwnProperty('subItems')) {
// //       item.children = routeChilds(menu.subItems[sub], sub)
// //     }
// //     children.push(item)
// //   })
// //   return children
// // }

// // const modulesChilds = (function() {
// //   const resArr = []
// //   return (userMenuItem) => {
// //     Object.keys(userMenuItem.subItems).map((sub) => {
// //       if (userMenuItem.subItems[sub].hasOwnProperty('subItems')) {
// //         modulesChilds(userMenuItem.subItems[sub])
// //       }
// //       resArr.push(userMenuItem.subItems[sub].component)
// //     })
// //     return resArr
// //   }
// // })()

// const vRequired = () => {
//   return withParams({msg: i18n.tc('validation.required_field')}, required)
// }
// const vRegex = function(reg) {
//   return withParams(
//     {msg: i18n.tc('validation.invalid_data_format')},
//     (value) => {
//       return reg.test(value)
//     }
//   )
// }
// const vMinLength = function(length) {
//   console.log('length=', typeof length)
//   return withParams(
//     {
//       msg: i18n.tc('validation.min_length', {
//         cnt: length
//       })
//     },
//     minLength(length)
//   )
// }

// const vMaxLength = function(length) {
//   return withParams(
//     {
//       msg: i18n.tc('validation.max_length', {
//         cnt: length
//       })
//     },
//     maxLength(length)
//   )
// }
// const vIsUnique = (param) =>
//   withParams({msg: i18n.tc('validation.is_not_unique')}, (val) => {
//     if (val === '') return true
//     return param === ''
//   })
// const vIsEmail = () => {
//   return withParams({msg: i18n.tc('validation.email')}, email)
// }
// const vConfPassword = (passField) => {
//   return withParams(
//     {msg: i18n.tc('validation.same_as_password')},
//     sameAs(passField)
//   )
// }

// export {
//   // routeChilds,
//   // modulesChilds,
//   vRequired,
//   vMinLength,
//   vMaxLength,
//   vIsUnique,
//   vIsEmail,
//   vConfPassword,
//   vRegex
// }
