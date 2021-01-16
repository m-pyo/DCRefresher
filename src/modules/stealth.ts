const getURL = (u: string) => {
  return !chrome || !chrome.extension ? u : chrome.extension.getURL(u)
}

const tempButtonCreate = (elem:HTMLElement):void =>{
  const buttonNum:number = elem.querySelectorAll('.stealth_control_button').length
  const contentNum:number = elem.querySelectorAll('.write_div img, .write_div video').length;

  if(buttonNum == 0 && contentNum != 0){
    let buttonFrame:HTMLElement = document.createElement('div');
    buttonFrame.classList.add('stealth_control_button');   
    buttonFrame.classList.add('blur');   

    buttonFrame.innerHTML = `      
      <div class="button" id ="tempview">
      <img src="${getURL('/assets/icons/change.png')}"></img>
      <p>일시해제</p>
      </div>
    `

    let button = buttonFrame.querySelector('#tempview') as HTMLElement;

    button.addEventListener('click', ev => {
      if(elem.className.indexOf('stlth') < 0){
        elem.classList.add('stlth')
      }else{
        elem.classList.remove('stlth')
      }
    })

    elem.prepend(buttonFrame);   
  }
}

export default {
  name: '스텔스 모드',
  description: '페이지내에서 표시되는 이미지를 비활성화합니다',
  author: { name: 'pyo', url: '' },
  status: false,
  memory: {
    uuid: null,
    contentViewUUID: null
  },
  enable: true,
  default_enable: true,
  require: ['filter', 'eventBus'],
  func (
    filter: RefresherFilter, 
    eventBus: RefresherEventBus,
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
      if(elem.querySelectorAll('.stealth_control_button').length == 0){
        tempButtonCreate(elem)
      }
    })

    filter.runSpecific(this.memory.uuid)

    this.memory.contentViewUUID = eventBus.on('contentPreview', (elem: HTMLElement)=>{
      if(elem.querySelectorAll('.stealth_control_button').length == 0){
        tempButtonCreate(elem)
      }
    })

  },

  revoke(filter: RefresherFilter, eventBus: RefresherEventBus){
    document.documentElement.classList.remove('refresherStealth')

    if (this.memory.uuid) {
      filter.remove(this.memory.uuid, true)
    }

    if (this.memory.contentViewUUID) {
      eventBus.remove('refresherStealth', this.memory.contentViewUUID, true)
    }
  }
}
