import * as Color from '../utils/color'
import * as DOM from '../utils/dom'

const contentColorFix = (el: HTMLElement) => {
  if (!el) return

  let qSelector = el.querySelector(
    '.refresher-frame:first-child .refresher-preview-contents'
  )! as HTMLElement

  DOM.traversal(qSelector).forEach(elem => {
    if (!elem.style || !(elem.style.color || elem.hasAttribute('color'))) return

    colorCorrection(elem)
  })
}

const colorCorrection = (elem: HTMLElement) => {
  let fontAttr = elem.hasAttribute('color')

  let textColor = Color.parse(
    fontAttr ? elem.getAttribute('color') : elem.style.color
  )

  let contrast = Color.contrast(textColor, [41, 41, 41])

  if (contrast < 3) {
    let trans = Color.RGBtoHSL(textColor[0], textColor[1], textColor[2])
    trans[2] = Color.inverseColor(trans[2])
    let rollback = Color.HSLtoRGB(trans[0], trans[1], trans[2])

    if (fontAttr) {
      elem.setAttribute(
        'color',
        Color.RGBtoHEX(rollback[0], rollback[1], rollback[2])
      )
    } else {
      elem.style.color = `rgb(${rollback[0]}, ${rollback[1]}, ${rollback[2]})`
    }
  }
}

export default {
  name: '다크 모드',
  description: '페이지와 DCRefresher의 창을 어두운 색상으로 변경합니다.',
  author: { name: 'Sochiru', url: 'https://sochiru.pw' },
  status: false,
  top: true,
  memory: {
    uuid: null,
    uuid2: null,
    contentViewUUID: null
  },
  enable: false,
  default_enable: false,
  require: ['filter', 'eventBus'],
  func (filter: RefresherFilter, eventBus: RefresherEventBus) {
    if (document && document.head) {
      let d = document.createElement('style')
      d.id = 'refresherDarkStyle'
      d.innerHTML = `.refresherDark .refresher-frame{background-color:rgba(41,41,41,.855);color:#fff}.refresherDark .refresher-frame-outer.background{background-color:rgba(82,82,82,.6)}.refresherDark body,.refresherDark .dcwrap,.refresherDark .left_content,.refresherDark .dcfoot,.refresherDark .issuebox,.refresherDark .inner_search{background-color:#222}.refresherDark .font_jinlightpurple,.refresherDark .font_lightpurple,.refresherDark .btn_white_round.font_jinlightpurple,.refresherDark .minor_uadmin_setting .font_lightblue,.refresherDark .miniwrap .minor_uadmin_setting .font_lightblue,.refresherDark .minor_uadmin_top .uadmin_top_tit,.refresherDark .miniwrap .minor_uadmin_top .uadmin_top_tit{color:#4987f7}.refresherDark .icon_mini{filter:invert(0.8)}.refresherDark .my_minor_list .mng{color:#4987f7}.refresherDark .mini_catebox{border-top:1px #4987f7 solid}.refresherDark .mini_catebox:first-child{border-top:3px #4987f7 solid}.refresherDark .mini_infotxt .tit{color:#fff}.refresherDark .mini_infotxt .txt{color:#ccc}.refresherDark .minicate_wrap .mini_new .tit{background:#4d3075}.refresherDark .minicate_wrap .mini_new .lists li a{color:#ccc}.refresherDark .minicate_wrap .catehead{border-bottom:1px solid #444}.refresherDark .minicate_wrap .catehead h3{color:#777}.refresherDark .minicate_wrap .catehead h3 ::after{background:#444}.refresherDark .miniinfo_pop .inner{color:#ccc}.refresherDark .miniinfo_pop .inner .box:first-child img{filter:invert(43%) sepia(64%) saturate(1865%) hue-rotate(203deg) brightness(101%) contrast(94%)}.refresherDark .miniinfo_pop .inner .box:last-child img{filter:brightness(10)}.refresherDark .minor_wrap.gallmain .visit_history{border-top:1px #444 solid}.refresherDark .minor_wrap.gallmain .visit_list li a,.refresherDark .under_catelist .under_listbox li a{color:#ccc}.refresherDark .miniinfo_pop .function p{color:#9e9e9e}.refresherDark .miniinfo_pop .function .bg{background-color:#3d3d3d;color:#fff}.refresherDark .miniinfo_pop .function .bg .tit{color:#fff}.refresherDark .miniinfo_pop .function .bg:first-of-type{color:#9e9e9e}.refresherDark .mini_set{color:#9e9e9e}.refresherDark .mini_list_wrap{border:1px solid #292929;border-top-color:#4987f7}.refresherDark .miniwrap .sogaeimg_tit{background:#3d3d3d}.refresherDark .mgall_list_wrap a,.refresherDark .mini_list_wrap a,.refresherDark .option_box li,.refresherDark .pop_wrap .my_minor_mini li a,.refresherDark .pop_wrap .my_minor_mini .inner.my_minor_empty{color:#ccc}.refresherDark .hot_minigall .rank_num,.refresherDark .miniwrap .mgall .rank_num,.refresherDark .minor_uadmin_menu li a.on,.refresherDark .miniwrap .minor_uadmin_menu li a.on{background:#4987f7;border:1px #176ef1d5 solid}.refresherDark .minor_uadmin_menu li a{border:1px solid #3d3d3d}.refresherDark .miniwrap .img_contbox{border-right:0px}.refresherDark .pop_wrap .my_minor_mini .tab_menubox button.on,.refresherDark .pop_wrap .my_minor_mini .tab_menubox button:first-child.on,.refresherDark .pop_wrap .my_minor_mini .block_tab button.on,.refresherDark .pop_wrap .my_minor_mini .block_tab button:first-child.on{background:#292929;color:#4987f7}.refresherDark .type3.lightpurple .tab_menubox button.on,.refresherDark .type3.lightpurple .tab_menubox button:first-child.on,.refresherDark .type3.lightpurple .block_tab button.on,.refresherDark .type3.lightpurple .block_tab button:first-child.on{border-color:#777}.refresherDark .pop_wrap .my_minor_mini .tab_menubox button{background-color:#3d3d3d}.refresherDark .type3.lightpurple .tab_menubox button,.refresherDark .type3.lightpurple .block_tab button{border-bottom-color:#777}.refresherDark .notice_list::-webkit-scrollbar,.refresherDark .info_contbox::-webkit-scrollbar,.refresherDark .gall_guide .caption_box::-webkit-scrollbar{width:5px}.refresherDark .notice_list::-webkit-scrollbar-track,.refresherDark .info_contbox::-webkit-scrollbar-track,.refresherDark .gall_guide .caption_box::-webkit-scrollbar-track{background:#292929}.refresherDark .notice_list::-webkit-scrollbar-thumb,.refresherDark .info_contbox::-webkit-scrollbar-thumb,.refresherDark .gall_guide .caption_box::-webkit-scrollbar-thumb{background:#3d3d3d}.refresherDark .notice_list::-webkit-scrollbar-thumb:hover,.refresherDark .info_contbox::-webkit-scrollbar-thumb:hover,.refresherDark .gall_guide .caption_box::-webkit-scrollbar-thumb:hover{background:#555}.refresherDark .top_search,.refresherDark .bottom_search,.refresherDark .miniwrap .bottom_search,.refresherDark .login_box{border:1px solid #292929}.refresherDark .miniwrap .bottom_search{background:#292929}.refresherDark .mintro_imgbox.in_img,.refresherDark .pop_tipbox.minor_tip .inner,.refresherDark .hot_gall_box,.refresherDark .dccon_storage_table td,.refresherDark .dccon_storage_table th,.refresherDark .hotcate_list .cate_wrap{border:1px solid #3d3d3d}.refresherDark .tab_btnlist li{border:0}.refresherDark .uadmin_cont_box{border-top:1px solid #444}.refresherDark .gallview_head,.refresherDark .all_list,.refresherDark .pop_wrap.type3 .pop_head{border-bottom:1px solid #444}.refresherDark .gall_list,.refresherDark .view_comment .cmt_write_box{border-bottom:2px solid #444}.refresherDark .info_viewbox{border-bottom:1px solid #3d3d3d}.refresherDark .dccon_popinfo .dccon_infobox{border-top:1px solid #3d3d3d}.refresherDark .all_list dl,.refresherDark .relation_wrap .inner:last-of-type,.refresherDark .minor_uadmin_wrap .right_content{border-left:1px solid #444}.refresherDark .reply_list li,.refresherDark .recom_bottom_box,.refresherDark .cmt_info,.refresherDark .comment_wrap .bottom_paging_box,.refresherDark .issuebox.open .visit_history,.refresherDark .form_group,.refresherDark .rcont_sec .txt{border-top:1px solid #444}.refresherDark .issue_wrap,.refresherDark .comment_box{border-top:2px solid #4987f7}.refresherDark .guide_cont{border:2px #4987f7 solid;background:#292929}.refresherDark .dc_all{border-left:1px solid #3d3d3d;border-top:2px solid #3d3d3d;border-right:1px solid #3d3d3d;border-bottom:1px solid #3d3d3d}.refresherDark .minor_uadmin_wrap,.refresherDark .miniwrap .minor_uadmin_wrap{border-top:2px solid #4987f7;border-bottom:2px solid #4987f7;border-color:#4987f7}.refresherDark .minor_block_list,.refresherDark .mini_member_list,.refresherDark .table_head{border-bottom:1px solid #4987f7}.refresherDark .minor_block_list th,.refresherDark .mini_member_list th{border:1px solid #4987f7;border-width:1px 0 1px}.refresherDark .minor_intro_box,.refresherDark .minor_wrap.gallmain .left_content .mgall_info .txt,.refresherDark .view_content_wrap,.refresherDark .view_content_wrap a,.refresherDark .comment_wrap,.refresherDark .btn_noti_alldel,.refresherDark .btn_noti_setting,.refresherDark .relation_wrap .pop_info b,.refresherDark .gall_guide .caption_box,.refresherDark .bottom_paging_box a,.refresherDark .pop_tipbox.minor_tip .inner,.refresherDark .tabcontent,.refresherDark .minor_uadmin_setting,.refresherDark .cont_tit,.refresherDark .pop_info,.refresherDark .favorite_list .list_box li a,.refresherDark .tab_menubox button,.refresherDark .block_tab button,.refresherDark .calendar_box thead th,.refresherDark .pop_hot_mgall .inner_txt,.refresherDark .pop_hot_gall .inner_txt,.refresherDark .info_policy a,.refresherDark .content,.refresherDark .guide_cont.mng .gcont_box,.refresherDark .inner_txt,.refresherDark .tiptxt,.refresherDark .box_infotxt,.refresherDark .form_group,.refresherDark th,.refresherDark td,.refresherDark a,.refresherDark .usertxt{color:#ccc}.refresherDark .gnb_list li a.on,.refresherDark .all_list dt,.refresherDark .all_list dt a,.refresherDark .area_links a,.refresherDark .gall_issuebox button,.refresherDark .all_list dl a,.refresherDark .btn_cmt_close,.refresherDark .btn_cmt_refresh,.refresherDark .center_box ul li a,.refresherDark .btn_cmt_open,.refresherDark .copyright,.refresherDark .up_num_box,.refresherDark .down_num_box,.refresherDark .page_num,.refresherDark .comment_box .nickname,.refresherDark .concept_txtbox .writer,.refresherDark .btn_cmt_close,.refresherDark .btn_cmt_close span,.refresherDark .btn_cmt_refresh,.refresherDark .calendar_box .day,.refresherDark .btn_cmt_open,.refresherDark .concept_txtbox .writer_info,.refresherDark .dccon_guide,.refresherDark .word_tit,.refresherDark .right_content .page_num{color:#9e9e9e}.refresherDark .gall_issuebox button::before,.refresherDark .user_option span::before,.refresherDark .area_links li::before,.refresherDark .btn_noti_setting::before,.refresherDark .r_hit .tit:last-of-type:before{color:#444}.refresherDark .uadmin_top_tit,.refresherDark .btn_upmgall_info,.refresherDark .font_lightblue,.refresherDark .miniwrap .visit_history .tit,.refresherDark .pop_dccon_tit,.refresherDark .guide_cont.mng .bg_box .email,.refresherDark .guide_cont .gcont_head.txt .tit{color:#4987f7}.refresherDark .guide_cont.mng .bg_box,.refresherDark .guide_cont .gcont_head.txt .subtxt{color:#ccc}.refresherDark .guide_cont.mng .code_input{background:#222}.refresherDark .bg_box,.refresherDark .guide_cont .gcont_head{background:#3d3d3d}.refresherDark .reply_num{color:#777}.refresherDark .nickname.me{background-color:#176ef1d5;color:#fff;border-radius:5px;padding:2px 5px}.refresherDark .pop_info,.refresherDark .word_tit{background-color:#3d3d3d}.refresherDark .gallview_head .gall_writer .fr>span::before,.refresherDark .album_head .gall_writer .fr>span::before,.refresherDark .btn_cmt_refresh::before,.refresherDark .gallview_head .gall_date::before{background-color:#444}.refresherDark .minor_ranking_box,.refresherDark .top_search,.refresherDark .bottom_search{background-color:#333;border-left:#d5d5d5}.refresherDark .minor_ranking_box .ranking span.blind,.refresherDark .top_search .ranking span.blind,.refresherDark .bottom_search .ranking span.blind{color:#ccc}.refresherDark .minor_ranking_box .rank_img,.refresherDark .minor_ranking_box .ranking_tit,.refresherDark .top_search .rank_img,.refresherDark .top_search .ranking_tit,.refresherDark .bottom_search .rank_img,.refresherDark .bottom_search .ranking_tit{filter:invert(1)}.refresherDark .checkmark,.refresherDark .icon_lyclose,.refresherDark .tip_deco{filter:invert(1)}.refresherDark .noaccess_wrap .dc_logo a img{filter:invert(0)}.refresherDark .top_search input,.refresherDark .bottom_search input{color:#fff}.refresherDark .miniwrap .page_head a,.refresherDark .page_head a,.refresherDark .visit_history .tit,.refresherDark .font_blue,.refresherDark .pop_wrap .pop_head.dashed,.refresherDark .pop_wrap.type3 .pop_head,.refresherDark .viewtxt_top .useday{color:#4987f7}.refresherDark .dc_logo img[alt=디시인사이드]{filter:invert(1)}.refresherDark .dc_logo img[alt=갤러리]{filter:brightness(2)}.refresherDark .btn_hitgall,.refresherDark .btn_snsmore,.refresherDark .btn_report,.refresherDark .btn_user_control,.refresherDark .btn_blue,.refresherDark .btn_lightpurple,.refresherDark .btn_lightgrey,.refresherDark .array_tab button.on{text-shadow:unset}.refresherDark .bottom_array .select_area,.refresherDark .miniwrap .bottom_array .select_area,.refresherDark .bottom_array .select_area .inner,.refresherDark .miniwrap .bottom_array .select_area .inner,.refresherDark .user_info_input.id input,.refresherDark .cmt_write_box .user_info_input.id>label,.refresherDark .btn_user_control,.refresherDark .btn_white{background-color:#292929;color:#ccc}.refresherDark .btn_blue,.refresherDark .btn_lightpurple,.refresherDark .word_close{background-color:#4987f7;color:#fff;border-color:#4987f7}.refresherDark .pop_wrap.type2,.refresherDark .issuebox.open{border:1px solid #4987f7}.refresherDark .miniwrap .issue_wrap,.refresherDark .miniwrap .issuebox.open,.refresherDark .miniwrap table th,.refresherDark .miniwrap table{border-color:#3d3d3d}.refresherDark .pop_wrap.type3{border:1px solid #4987f7;border-width:2px 1px 1px}.refresherDark .btn_white{border-color:#777}.refresherDark .content_box,.refresherDark .visit_history,.refresherDark .array_tab button,.refresherDark .content_box .img_box,.refresherDark .content_box .secimg_box .img_box,.refresherDark .output_array .select_area,.refresherDark .area_links .btn_top_loginout,.refresherDark .cmt_write_box,.refresherDark .subject_morelist,.refresherDark .pop_wrap,.refresherDark .pop_tipbox .inner,.refresherDark .rcont_wiki,.refresherDark .tab_menubox button.on,.refresherDark .tab_menubox button:first-child.on,.refresherDark .block_tab button.on,.refresherDark .option_box.white,.refresherDark .bg_greybox,.refresherDark .box_head,.refresherDark .cate_tit,.refresherDark .bottom_array .option_box,.refresherDark .miniwrap .bottom_array .option_box,.refresherDark .block_tab button:first-child.on,.refresherDark button,.refresherDark .minor_tip_txt.bg,.refresherDark .output_array .option_box,.refresherDark .box_bottom,.refresherDark .reply_box{background-color:#292929;color:#ccc;border:1px solid #292929}.refresherDark .content_box a,.refresherDark .visit_history a,.refresherDark .array_tab button a,.refresherDark .content_box .img_box a,.refresherDark .content_box .secimg_box .img_box a,.refresherDark .output_array .select_area a,.refresherDark .area_links .btn_top_loginout a,.refresherDark .cmt_write_box a,.refresherDark .subject_morelist a,.refresherDark .pop_wrap a,.refresherDark .pop_tipbox .inner a,.refresherDark .rcont_wiki a,.refresherDark .tab_menubox button.on a,.refresherDark .tab_menubox button:first-child.on a,.refresherDark .block_tab button.on a,.refresherDark .option_box.white a,.refresherDark .bg_greybox a,.refresherDark .box_head a,.refresherDark .cate_tit a,.refresherDark .bottom_array .option_box a,.refresherDark .miniwrap .bottom_array .option_box a,.refresherDark .block_tab button:first-child.on a,.refresherDark button a,.refresherDark .minor_tip_txt.bg a,.refresherDark .output_array .option_box a,.refresherDark .box_bottom a,.refresherDark .reply_box a{color:#ccc}.refresherDark .user_info_input input{background-color:#292929 !important}.refresherDark .array_tab button,.refresherDark .cmt_txt_cont textarea,.refresherDark .user_info_input,.refresherDark .user_info_input input,.refresherDark .appending_file_box,.refresherDark .btn_recommend_box,.refresherDark .btn_hitgall,.refresherDark .btn_snsmore,.refresherDark .btn_report,.refresherDark .select_box.array_latest,.refresherDark .btn_lightblue,.refresherDark .set_cont input[type=text],.refresherDark .select_arraybox,.refresherDark .option_sort .select_arraybox,.refresherDark .option_sort .select_arraybox .option_box,.refresherDark .calendar_wrap .inner,.refresherDark .autodeltime_set .calendar_wrap .inner,.refresherDark .gall_guide,.refresherDark .btn_lightgrey,.refresherDark .option_box,.refresherDark .auto_wordwrap,.refresherDark .checkbox input[type=checkbox],.refresherDark .mng_subject_sel,.refresherDark .all_ranklist,.refresherDark .t_area,.refresherDark .under_paging,.refresherDark .int,.refresherDark .dccon_infobox,.refresherDark .select_box.dccon_use,.refresherDark .dccon_use .option_box,.refresherDark .miniwrap .bottom_array,.refresherDark .bottom_array{background-color:#292929;color:#ccc;border:1px solid #3d3d3d}.refresherDark .array_tab button a,.refresherDark .cmt_txt_cont textarea a,.refresherDark .user_info_input a,.refresherDark .user_info_input input a,.refresherDark .appending_file_box a,.refresherDark .btn_recommend_box a,.refresherDark .btn_hitgall a,.refresherDark .btn_snsmore a,.refresherDark .btn_report a,.refresherDark .select_box.array_latest a,.refresherDark .btn_lightblue a,.refresherDark .set_cont input[type=text] a,.refresherDark .select_arraybox a,.refresherDark .option_sort .select_arraybox a,.refresherDark .option_sort .select_arraybox .option_box a,.refresherDark .calendar_wrap .inner a,.refresherDark .autodeltime_set .calendar_wrap .inner a,.refresherDark .gall_guide a,.refresherDark .btn_lightgrey a,.refresherDark .option_box a,.refresherDark .auto_wordwrap a,.refresherDark .checkbox input[type=checkbox] a,.refresherDark .mng_subject_sel a,.refresherDark .all_ranklist a,.refresherDark .t_area a,.refresherDark .under_paging a,.refresherDark .int a,.refresherDark .dccon_infobox a,.refresherDark .select_box.dccon_use a,.refresherDark .dccon_use .option_box a,.refresherDark .miniwrap .bottom_array a,.refresherDark .bottom_array a{color:#ccc}.refresherDark .miniwrap .array_tab button.on,.refresherDark .array_tab button.on,.refresherDark .pop_wrap.file .pop_head,.refresherDark .pop_wrap .pop_head.bg{background-color:#4987f7}.refresherDark .content_box header,.refresherDark .pop_wrap .pop_head.dashed{border-bottom:1px dashed #444}.refresherDark .gnb_bar,.refresherDark .login_box,.refresherDark .info_viewtxt{background-color:#292929}.refresherDark .word_list .search_key{background-color:#292929 !important}.refresherDark .word_list .search_key.on{background-color:#3d3d3d !important}.refresherDark .gnb_bar{border:0}.refresherDark .login_box .user_info{color:#4987f7}.refresherDark .login_box .user_option{background-color:#3d3d3d}.refresherDark .login_box .user_option a{color:#ccc}.refresherDark .gall_list th,.refresherDark .gall_list tbody tr td,.refresherDark .gall_list th,.refresherDark .gall_list tbody tr td a{color:#ccc}.refresherDark .gall_list th{border-color:#444}.refresherDark .gall_list td{border-top:1px solid #444}.refresherDark .gall_list tbody tr:hover{background-color:#292929}.refresherDark .gall_list tbody tr td a:visited{color:#616161}.refresherDark>.innerbox,.refresherDark .gallog_wrap>.headbox,.refresherDark #container>article>.conent_wrap{background-color:#292929}.refresherDark #top>div.top_bar>div{background:#113475}.refresherDark #top>div.top_bar>div ::after{background:linear-gradient(#fff, #000)}.refresherDark .cont_head .tit{color:#e21919}.refresherDark .gallog_wrap .cont_listbox{border:1px solid #4987f7;border-width:2px 0 1px 0}.refresherDark .gallog_wrap .tit_box>strong{color:#4987f7}.refresherDark .gallog_wrap .writing_day button,.refresherDark .gallog_wrap .writing_info .tit{background:#4987f7}.refresherDark .gallog_wrap .choice_sect button{color:#4987f7}.refresherDark .gallog_wrap .choice_sect button.on{color:#e21919}.refresherDark .gallog_wrap .choice_sect button.on::after{background:#4987f7}.refresherDark .gallog_wrap .cont_listbox li{border-top:1px #444 solid}.refresherDark .gallog_wrap .gallog_menu li.on a{background:#4987f7;color:#fff;text-shadow:0px}.refresherDark .gallog_wrap .cmt_write_box.gallog{border-top:2px #4987f7 solid}.refresherDark .gallog_wrap .gallog_menu li a,.refresherDark .gallog_wrap .gallog_empty{border:1px solid #4987f7}.refresherDark .gallog_wrap .gallog_empty{border-width:2px 0 1px 0}.refresherDark .gallog_wrap .cont,.refresherDark .gallog_wrap .gallog_empty{color:#ccc}`
      document.head.appendChild(d)
    }

    if (
      document &&
      document.documentElement &&
      document.documentElement.className.indexOf('refresherDark') < 0
    ) {
      document.documentElement.className += ' refresherDark'
    }

    this.memory.uuid = filter.add('html', (elem: HTMLElement) => {
      if (elem.className.indexOf('refresherDark') == -1) {
        elem.className += ' refresherDark'
      }
    })

    // 다크모드는 반응성이 중요하니깐 모듈에서 바로 로드 시키기
    filter.runSpecific(this.memory.uuid)

    this.memory.uuid2 = filter.add(
      '.gallview_contents .inner .writing_view_box *',
      (elem: HTMLElement) => {
        if (!elem.style || !(elem.style.color || elem.hasAttribute('color')))
          return

        colorCorrection(elem)
      }
    )

    this.memory.contentViewUUID = eventBus.on('contentPreview', contentColorFix)
  },

  revoke (filter: RefresherFilter, eventBus: RefresherEventBus) {
    document.documentElement.classList.remove('refresherDark')

    let style = document.querySelector('#refresherDarkStyle')
    if (style) {
      style.parentElement?.removeChild(style)
    }

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }

    if (this.memory.uuid2) {
      filter.remove(this.memory.uuid2, true)
    }

    if (this.memory.contentViewUUID) {
      eventBus.remove('contentPreview', this.memory.contentViewUUID, true)
    }
  }
}
