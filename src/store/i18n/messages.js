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
      text: 'Text',
      tab_inbox: 'Inbox',
      tab_outbox: 'Outbox'
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
      role_id: 'ID',
      role_name: 'Role Name',
      administrator: 'Administrator'
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
      name: 'Name',
      group_name: 'Group Name',
      oper_title_edit: 'Group Information',
      oper_title_add: 'Add New Group',
      in_page: 'In page'
    },
    screen: {
      display: 'Display',
      hidden: 'Hidden'
    },
    videos: {
      video_title: 'Video Title',
      tag: 'Tag',
      video_description: 'Video Description',
      last_modified: 'Last modified',
      video_information: 'Video Information'
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
      save: 'Save',
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
      auto: 'Auto',
      keyword_search: 'Keyword Search',
      all: 'All',
      public: 'Public',
      private: 'Private',
      group: 'Group',
      role: 'Role'
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
      home: 'HOME',
      company: '企業情報',
      video: '動画検索',
      messages: 'メッセージ',
      roles: 'ロール設定',
      users: 'ユーザー管理',
      groups: 'グループ管理',
      screen: '画面カスタマイズ'
    },
    message: {
      appHeader: '視聴管理システム',
      app_name: '視聴管理システム',
      company_id: '企業ID',
      personal_id: 'ID',
      password: 'Password',
      btnLogin: 'LOGIN',
      lnkPassRec: 'ID・パスワードを忘れた方はこちら',
      authError: '【認証エラー】IDまたはパスワードが違います',
      logOut: 'Log out',
      forgot_pass_descr: `ご登録頂いたメールアドレスをご入力いただき、【送信】ボタンを押してください。
      ご入力いただきましたメールアドレス宛に変更用URLを記載したメールを送信いたします。`,
      number_of_registered_users: 'ユーザー登録数',
      btn_add: '新規作成',
      check: 'Check',
      subject: '件名',
      to: '宛先',
      from: '送信元',
      received: '受信日時',
      sent: '送信日時',
      text: '本文'
    },
    roles: {
      btn_add: 'ロール追加',
      tbl_header_ID: 'ID',
      tbl_header_name: 'ロール名',
      tbl_header_auth: '管理者権限',
      tbl_header_mng: '設定',
      tbl_deleted: '削除済',
      oper_title_edit: 'ロール情報',
      oper_title_add: 'ロール新規追加',
      role_id: 'ID'
    },
    users: {
      btn_add: 'ユーザー新規追加',
      tbl_header_ID: 'ID',
      tbl_header_name: '名前',
      tbl_header_group: 'グループ',
      tbl_header_last_login: '最終ログイン',
      tbl_header_mgn: '管理',
      tbl_deleted: '削除済',
      oper_title_edit: 'ユーザー情報',
      oper_title_add: 'ユーザー新規追加',
      user_id: 'ID',
      user_fullname: '氏名',
      user_email: 'E-Mail',
      password: '新しいパスワード',
      conf_password: 'パスワード再入力'
    },
    groups: {
      btn_add: 'グループ新規追加',
      tbl_header_name: 'グループ名',
      tbl_header_mgn: '管理',
      tbl_deleted: '削除済',
      group_name: 'グループ名',
      oper_title_edit: 'グループ情報',
      oper_title_add: 'グループ新規追加',
      in_page: 'ページ内選択'
    },
    label: {
      delete: '削除',
      back: '戻る',
      edit: '編集',
      required: '必須項目',
      register: '登録',
      registration: '登録',
      reply: '返信',
      change: '変更',
      send: '送信',
      add_new: '新規追加',
      storageVideoCapacity: 'ストレージ上限',
      forgot_pass: 'ID・パスワードを忘れてしまった方',
      mail_address: 'E-Mail',
      video_upload: '動画アップロード',
      select_file: 'ファイルを選択',
      upload: 'アップロード',
      cancel: 'キャンセル',
      drop_file_here: 'ここにファイルをドロップ',
      or: 'または',
      yes: '有',
      no: '無',
      remove: '取消',
      edit_video: '動画情報の編集',
      thumb_image_upload: 'サムネイル画像アップロード',
      select_all: 'すべて',
      deselect_all: '解除',
      comment_box: 'コメント欄設定',
      logo_registration: 'ロゴ登録',
      in_page: 'ページ内選択',
      people: '人',
      auto: '自動割当'
    }
  }
}

export default messages
