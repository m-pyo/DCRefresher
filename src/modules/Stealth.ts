import { queryString } from '../utils/http'
import * as DOM from '../utils/dom'

const border_set = 2;

const setImgTarget = ".write_div img, .write_div video, .mintro_imgbox, .dory_img, #zzbang_div, .written_dccon"
const previewImgTarget = ".refresher-preview-comments .written_dccon"
const rightPannerTarget = ".img_box"

const button_set = (target:HTMLElement, setElem?:HTMLElement) => {
  let element = document.createElement('div');
  element.classList.add('stealth_off_button');
  
  const height = target.offsetHeight;
  const width = target.offsetWidth;    
  
  if(height != 0 && width != 0){
    element.style.height = `${height - border_set}px`;
    element.style.width = `${width - border_set}px`;
    element.classList.add('off_button_work');
    element.classList.add('content');
  }

  element.addEventListener('click', ev => {
    let target = ev.target as HTMLElement
    target.style.display = 'none'; 
    if(!setElem){
      let parent = target.parentNode as HTMLElement
      parent.classList.add('stealth_off');
    }else{
      setElem.classList.add('stealth_off');
    }
    ev.preventDefault();
  }) 
  
  target.parentNode?.prepend(element);
}

const cutton_set = (target:HTMLElement, setElem?:HTMLElement) => {
  if(target){
    let element = document.createElement('div');
    element.classList.add('stealth_off_button');
    
    // const height = target.offsetHeight;
    // const width = target.offsetWidth;    
    const height = 100;
    const width = 100;    


    element.style.height = `${height - border_set}px`;
    element.style.width = `${width - border_set}px`;
    element.classList.add('off_cutton_work');
    element.classList.add('content');


    element.addEventListener('mouseover', ev => {
      let target = ev.target as HTMLElement
      if(!setElem){
        let parent = target.parentNode as HTMLElement
        parent.classList.add('stealth_off');
      }else{
        setElem.classList.add('stealth_off');
      }
    })

    element.addEventListener('mouseout', ev => {
      let target = ev.target as HTMLElement
      if(!setElem){
        let parent = target.parentNode as HTMLElement
        parent.classList.remove('stealth_off');
      }else{
        setElem.classList.remove('stealth_off');
      }
    })
    
    target.parentNode?.prepend(element);
  }
}


const button_set_all = (elem:HTMLElement, targetSet:string) =>{
  let targetElems = elem.querySelectorAll(targetSet);
    
  [...targetElems].map((target)=>{
    button_set(target as HTMLElement)
  })
}

const cutton_set_all = (elem:HTMLElement, targetSet:string) =>{
  let targetElems = elem.querySelectorAll(targetSet);
    
  [...targetElems].map((target)=>{
    cutton_set(target as HTMLElement)
  })
}

const tempButtonCreate = (elem:HTMLElement) =>{
  const buttonNum = elem.querySelectorAll('.stealth_control_button').length
  const contentNum = elem.querySelectorAll('.write_div img, .write_div video').length;

  if(buttonNum == 0 && contentNum != 0){
    let button = document.createElement('div');
    button.classList.add('stealth_control_button');
    // button.classList.add('.refresher-management-panel');
    
    
    button.addEventListener('click', ev => {
      if(document.documentElement.className.indexOf('stlth') < 0){
        document.documentElement.classList.add('stlth')
      }else{
        document.documentElement.classList.remove('stlth')
      }
      
    })
    elem.prepend(button);
  }
}







export default {
  name: '스텔스 모드',
  description: '페이지내에서 표시되는 모든 이미지를 비활성화합니다',
  author: { name: 'pyo', url: '' },
  status: false,
  memory: {
    uuid: null,
    uuid2: null,
    contentViewUUID: null
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'eventBus', 'block', 'dom'],
  func (
    filter: RefresherFilter, 
    eventBus: RefresherEventBus,
    block: RefresherBlock,
    dom: RefresherDOM
  ) {
    if (
      document &&
      document.documentElement &&
      document.documentElement.className.indexOf('refresherStealth') < 0
    ) {
      document.documentElement.className += ' refresherStealth'
    }    
    
    this.memory.uuid = filter.add('html', (elem: HTMLElement) => {

      if (elem.className.indexOf('refresherStealth') == -1) {
        elem.className += ' refresherStealth'
      }
      // if(!elem.querySelectorAll('.stealth_off_button').length){
      //   button_set_all(elem, setImgTarget)
      // }
    })
    filter.runSpecific(this.memory.uuid)

    this.memory.uuid2 = filter.add('.wrap_inner', (elem: HTMLElement) => {
      if(!elem.querySelectorAll('.stealth_off_button').length){
        // button_set_all(elem, setImgTarget)
        // cutton_set_all(elem, '.right_content article div > a')
        cutton_set_all(elem, '.comment_box .comment_dccon')
        tempButtonCreate(elem)
      
      }
    })

    this.memory.contentViewUUID = eventBus.on('contentPreview', (elem: HTMLElement)=>{
      if(!elem.querySelectorAll('.stealth_off_button').length){
        cutton_set_all(elem, previewImgTarget)
        tempButtonCreate(elem)
      }
    })

 
  },
  revoke(filter: RefresherFilter, eventBus: RefresherEventBus){
    document.documentElement.classList.remove('refresherStealth')

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }

    if (this.memory.uuid2) {
      filter.remove(this.memory.uuid2, true)
    }

    if (this.memory.contentViewUUID) {
      filter.remove(this.memory.contentViewUUID, true)
    }
  }
}
