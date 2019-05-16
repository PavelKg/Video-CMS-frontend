const messages = {
  en: {
    menu: {
      home: 'HOME',
      company: 'Company',
      video: 'Video',
      messages: 'Messages',
      roles: 'Roles settings',
      users: 'Users',
      groups: 'Groups',
      screen: 'Screen custom.'
    },
    message: {
      appHeader: 'Video Contents Management',
      app_name: 'Video Content Management System',
      company_id: 'Company ID',
      personal_id: 'ID',
      password: 'Password',
      btnLogin: 'LOGIN',
      lnkPassRec: 'Forgot Your ID/Password ?',
      authError: 'Authorization error',
      logOut: 'Log out',
      forgot_pass_descr: `Please enter your registered email address and press the [Send] button.
      We will send you an email with the URL for the change to the email address you have entered.`,
      number_of_registered_users: 'Number of registered users',
      btn_add: 'Create New',
      check: 'Check',
      subject: 'Subject',
      to: 'To',
      from: 'From',
      received: 'Received',
      sent: 'Sent',
      text: 'Text'

    },
    roles: {
      btn_add: 'Add Role',
      tbl_header_ID: 'ID',
      tbl_header_name: 'Role Name',
      tbl_header_auth: 'Administrator authority',
      tbl_header_mng: 'Mng',
      tbl_deleted: 'Deleted',
      oper_title_edit: 'Role Information',
      oper_title_add: 'Add New Role',
      role_id: 'ID'
    },
    users: {
      btn_add: 'Add New User',
      tbl_header_ID: 'ID',
      tbl_header_name: 'Name',
      tbl_header_group: 'Group',
      tbl_header_last_login: 'Last Login',
      tbl_header_mgn: 'Mng',
      tbl_deleted: 'Deleted',
      oper_title_edit: 'User Information',
      oper_title_add: 'Add New User',
      user_id: 'ID',
      user_fullname: 'Full Name',
      user_email: 'E-Mail',
      password: 'Password',
      conf_password: 'Confirm Password'
    },
    groups: {
      btn_add: 'Add New Group',
      tbl_header_name: 'Group',
      tbl_header_mgn: 'Mng',
      tbl_deleted: 'Deleted',
      group_name: 'Name',
      oper_title_edit: 'Group Information',
      oper_title_add: 'Add New Group',
      in_page: 'In page'
    },
    label: {
      delete: 'Delete',
      back: 'Back',
      edit: 'Edit',
      required: 'Required',
      register: 'Register',
      registration: 'Registration',
      reply: 'Replay',
      change: 'Change',
      send: 'Send',
      add_new: 'Add new',
      storageVideoCapacity: 'Storage video capacity',
      forgot_pass: 'Forgot ID/password',
      mail_address: 'Mail Address',
      video_upload: 'Video upload',
      select_file: 'Select File',
      upload: 'Upload',
      cancel: 'Cancel',
      drop_file_here: 'Drop file here',
      or: 'or',
      yes: 'Yes',
      no: 'No',
      remove: 'Remove',
      edit_video: 'Edit Video Information',
      thumb_image_upload: 'Thumbnail image upload',
      select_all: 'Select All',
      deselect_all: 'Deselect All',
      comment_box: 'Comment Box',
      logo_registration: 'Logo Registration',
      in_page: 'In-Page',
      people: 'people',
      auto: 'Auto'
    }
  },
  ru: {
    menu: {
      home: 'Главная',
      company: 'Company',
      video: 'Video',
      messages: 'Messages',
      roles: 'Roles settings',
      users: 'Users',
      groups: 'Groups',
      screen: 'Screen custom.'
    },
    message: {
      appHeader: 'Video Contents Management',
      app_name: 'Video Content Management System',
      company_id: 'Company ID',
      personal_id: 'Логин',
      password: 'Пароль',
      btnLogin: 'Вход',
      lnkPassRec: 'Забыли Логин/Пароль ?',
      authError: 'Ошибка авторизации',
      logOut: 'Log out',
      forgot_pass_descr: `Please enter your registered email address and press the [Send] button.
      We will send you an email with the URL for the change to the email address you have entered.`
    },
    label: {
      delete: 'Delete',
      back: 'Back',
      edit: 'Edit',
      required: 'Required',
      register: 'Register',
      registration: 'Сохранить',
      change: 'Change',
      send: 'Send',
      storageVideoCapacity: 'Storage video capacity',
      forgot_pass: 'Forgot ID/password',
      mail_address: 'Mail Address',
      edit_video: 'Редактировать информацию о ролике',
      thumb_image_upload: 'Загрузить миниатюру'
    }
  },
  jp: {
    menu: {
      home: 'Home',
      company: 'Co mgmt',
      comp_add: 'Add Co',
      comp_videos: 'Videos',
      email: 'Mail BOX',
      email_make: 'template Make',
      email_check: 'template Ckeck',
      settings: 'Settings',
      admin_list: 'Administrator list',
      admin_add: 'Administrator add'
    },
    company: {
      name: 'Name'
    },
    message: {},
    label: {
      companyList: 'Company List'
    }
  }
}

export default messages
