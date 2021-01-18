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
      <p id="temp_button_text">이미지 보이기</p>
      </div>
    `

    let button = buttonFrame.querySelector('#tempview') as HTMLElement;
    let buttonText = buttonFrame.querySelector('#temp_button_text') as HTMLElement;

    button.addEventListener('click', ev => {
      if(elem.className.indexOf('stlth') < 0){
        elem.classList.add('stlth')
        buttonText.innerText = '이미지 숨기기';
      }else{
        elem.classList.remove('stlth')
        buttonText.innerText = '이미지 보이기';
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
      document.documentElement.classList.add('refresherStealth')
    }    

    if(document.querySelectorAll('.stealth_control_button').length == 0){
      tempButtonCreate(document.documentElement)
    }
  
    this.memory.contentViewUUID = eventBus.on('contentPreview', (elem: HTMLElement)=>{
      if(elem.querySelectorAll('.stealth_control_button').length == 0){
        tempButtonCreate(elem)
      }
    })

  },

  revoke(filter: RefresherFilter, eventBus: RefresherEventBus){
    document.documentElement.classList.remove('refresherStealth')

    if (this.memory.contentViewUUID) {
      eventBus.remove('refresherStealth', this.memory.contentViewUUID, true)
    }
  }
}
