<template>
  <div>
    <span style="color:red; font-weight:bold"> 반드시 1 -> 2 -> 3 순서로 눌러주세요.</span>
    <br /><br />
    <button type="button" @click="convertToObject">1. 시나리오 변환</button>
    <span> 시나리오 json 파일을 객체로 변환합니다.</span>
    <br /><br />
    <button type="button" @click="downloadKoreanJson">2. Korean JSON 다운로드</button>
    <span> Key Map 을 다운받습니다. </span>
    <br /><br />
    <button type="button" @click="generateNewScenario">3. 새로운 시나리오 생성</button>
    <span> 새로운 시나리오를 다운받습니다.</span>
    <br /><br />
    <button type="button" @click="scenarioTranslation">ㅎㅎ</button>
    <!-- <br /><br />
    <hr />
    <br />
    <button type="button" @click="restoreScenario"> 시나리오 복구</button><br />
    <span> 다국어 시나리오를 일반 시나리오로 전환합니다.</span><br />
    <span> 최신 버전의 키 맵과 다국어 시나리오가 필요합니다.</span> -->
  </div>
</template>

<script>
import ForignerScenario from '../json/local/Local_Scenario_Origin.json';
import KeyMap from '../json/local/Local_Scenario_Keymap_230112.json';
import axios from 'axios'

export default {
  data() {
    return {
      gitple_scenario: '',
      containerObject: '',
      // container: [],

      multiLanguage: [],
      jsonKey: [],
      rString: '',

      translateLanguage: [
        'zh',
        'en'
      ],
      textBuff: [],
      textsTofile: [],

      keyMapObject: {},
      isOngoing: false
    }
  },
  methods: {
    scenarioTranslation() {
      let textBuffDuplicator = this.textBuff;

      for (let i = 0; i < this.translateLanguage.length; i++) {
        if (i === 0) {
          console.log(this.translateLanguage[0])
          this.translateApi(this.translateLanguage[0]);





          //  이거 다음 언어로 왜 안넘어감?
          //  required text 뜨는데 배열 비워졌길래 채워줬는데?
          //  시간 문제임? 비동기처리 타이밍 이상해서?



          

        } else if (i > 0) {
          setInterval(() => {
            if (this.isOngoing === false) {
              console.log('my turn!', this.translateLanguage[i]);
              if (this.textBuff.length === 0) {
                this.textBuff = textBuffDuplicator;
                this.translateApi(this.translateLanguage[i]);
              }
            } else {
              setTimeout(() => {
                console.log('waiting.....')
              }, 1000);
            }
          }, 1000);
        }

      }
    
    },
    async translateApi(inputLanguage) {
      this.isOngoing = true;
      let bigText = [];

      // console.log('text buff', this.textBuff);

      if (this.textBuff.length > 128) {
        for (let i = 0; i < 128; i++) {
          console.log('shift');
          bigText.push(this.textBuff.shift());
        }
      } else {
        console.log('ok');
        for (let i = 0; i < this.textBuff.length; i++) {
          bigText.push(this.textBuff.shift());
        }
        // console.log('what?', bigText);
        console.log('how many?', bigText.length);
      }

      await axios.post('/aiapi/ait/translate', 
      {
        target: inputLanguage,
        text: bigText
        // text: ['안녕', '반가워요', '잘 되나요?']
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        console.log('RES!!', response);
        response.data.result.forEach(element => {
          this.textsTofile.push(element.translatedText);
        })

        // console.log('to file', this.textsTofile);
        

        if (this.textBuff.length === 0) {
          console.log('done!');
          this.isOngoing = false;
        } else {
          this.translateApi(inputLanguage);
          this.isOngoing = true;
        }
      })
      let containerObject = new Object();
      this.textsTofile.forEach(function (item, idx, array) {
        containerObject["message_" + (idx.toString().padStart(4, '0'))] = item;
      })
      this.translatedObject = containerObject;
      
      //  ready to file writing
      let writeLang = inputLanguage;
      this.keyMapObject.ko = this.containerObject;
      this.keyMapObject[writeLang] = this.translatedObject;
    },
    generateNewScenario() {
      const data = JSON.stringify(this.gitple_scenario)

      const blob = new Blob([data], { type: 'text/plain' });
      const e = document.createEvent('MouseEvent'),
        a = document.createElement('a');
      a.download = 'test.json';
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    downloadKoreanJson() {
      //  깃플 다국어 json 형식 Key Map

      //  여기야 여기
      //  언어별로 json에 넣는 방법은?
      //  한 번에 가능? 버튼으로 여러번에?
      //  다운로드 전에 입력 후 다운하도록 해야 할까?

      //  keyMapObject 를 전역으로 만들어서
      //  번역기에서 언어별로 돌리면서 json 자체를 완성한 다음
      //  이 메서드에서는 파일 쓰기와 다운로드 처리만 ㄱ



      const data = JSON.stringify(this.keyMapObject)
        .replace(/<\/?[^>]+>/gi, '')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&bull;/g, '•')
        .replace(/&#39;/g, '\'');

      const blob = new Blob([data], { type: 'text/plain' });
      const e = document.createEvent('MouseEvent'),
        a = document.createElement('a');
      a.download = 'test.json';
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    convertToObject() {
      this.gitple_scenario = ForignerScenario;
      const keyMap = Object.values(KeyMap.ko);
      let init = [];
      // let counter = [];
      let container = [];
      const resultContainer = [];

      let i = 0;

      /* 
        주석 제거 금지 -> 이게 여기에 선언되니까 i++가 안 먹히던 것...
        let keyIdx = 'message_' + ((i++).toString().padStart(4, '0'));

        중복을 제거하면, 원본 시나리오와 key로 교체된 시나리오의 _contents 숫자가 일치하지 않게 된다.
        중복 제거는 번역 수준에서 처리하거나, 별개의 key map 생성 로직 필요
        container[] 에서 중복을 제거하고 key map을 형성하는 쪽이 현재로서는 좋아 보인다.
      */
      //  한 번 읽어서 값 가져옴 -> 키맵 생성(중복제거) -> 다시 읽어서 키맵 값과 일치하는 곳에 번호 매기기

      /*
        시나리오가 업데이트 되었을 경우(내용 추가가 아닌, 업로드 되어 있는 시나리오 json의 다양한 이유로 인한 구조상의 변화)
        시나리오를 내려받고, 해당 시나리오와 key map을 import 하여 1 -> 2 -> 3 순서로 다시 작동시킨다.
      */

      this.gitple_scenario.graph.forEach(element => {
        init.push(element);

        if (element.value) {  //  value._contents -> 1차
          if (!element.value._contents == null || !element.value._contents == "") {
            container.push(element.value._contents);
            if (element.value._navButtons.length) {
              element.value._navButtons.forEach(el => {
                if (el.type === "openLink") {
                  container.push(el.label);
                }
              })
            }
          }
          
          if (element.value._items) { //  value.items[_contents] -> 2차
            element.value._items.forEach(item => {
              if (!item._contents == null || !item._contents == "") {
                container.push(item._contents);
              }
            })
          }
        }

        if (element.children) { //  children[value._contents] -> 2차
          element.children.forEach(child => {
            if (!child.value._contents == null || !child.value._contents == "") {
              container.push(child.value._contents);
            }
          })
        }
      });

      console.log('changed obj', this.gitple_scenario.graph); //  key로 _contents를 변환한 시나리오
      console.log('values', container); //  key 매핑 위해 추출된 _contents: value

      // console.log('최상위 요소들 수', init.length);
      // console.log('지금까지 잡아낸 _contents 개수', this.container.length);
      // console.log('개수', counter.length);

      container.forEach((item, index) => {
        if (item.includes("${$lang.message_")) {  //  업데이트 시 키 값 통일
          item = keyMap[index];
        } else {
          item = item;
        }
        resultContainer.push(item);
      })

      //  중복 제거 키맵
      // 키맵에서 중복되는 키값 제거 -> 중복된 키값 알아내기 -> 제거되는 키 남아있게 되는 키로 통합

      console.log('result container', resultContainer);

      const settedContainer = new Set(resultContainer);
      const newResult = []; //  중복이 제거된 키 맵(key: index)

      settedContainer.forEach((element, index) => {
        if (element.includes("${$lang.message_")) {
          element = keyMap[index];
        } else {
          element = element;
        }
        newResult.push(element);
      })

      console.log('New Result!', newResult);
      newResult.forEach(resultItem => {
        this.textBuff.push(resultItem);
      })
      console.log('wow', this.textBuff);

      //  중복 제거된 키맵
      //  _contents 를 가져오면서 message_n 을 주지 말고, 값만 가져오고 나서
      //  중복 없는 키맵을 만든 후, 이제 키 맵과 값을 비교하면서 값이 일치하는 곳에 해당 키 맵 번호 매기기
      //  이러면 모든게 해결?

      let containerObject = new Object();
      newResult.forEach(function (item, idx, array) {
        containerObject["message_" + (idx.toString().padStart(4, '0'))] = item;
      })
      this.containerObject = containerObject; //  중복 제거, key 값 매겨진 최종 키 맵
      console.log('obj for KeyMap', this.containerObject)

      //  TODO
      //  이제 이 키 맵 value를 번역기로 보내서, 받아온 언어를 키 맵으로 설정하기


      
      this.gitple_scenario.graph.forEach(element => {
        if (element.value) {  //  value._contents -> 1차
          if (!element.value._contents == null || !element.value._contents == "") {
            if (element.value._contents) {
              let idx = newResult.findIndex((targetValue) => targetValue === element.value._contents);
              element.value._contents = '${$lang.message_' + ((idx).toString().padStart(4, '0')) + '}';
            }
            if (element.value._navButtons.length) {
              element.value._navButtons.forEach(el => {
                if (el.type === "openLink") {
                  let idx = newResult.findIndex((targetValue) => targetValue === el.label);
                  el.label = '${$lang.message_' + ((idx).toString().padStart(4, '0')) + '}';
                }
              })
            }
          }
          
          if (element.value._items) { //  value.items[_contents] -> 2차
            element.value._items.forEach(item => {
              if (!item._contents == null || !item._contents == "") {
                let idx = newResult.findIndex((targetValue) => targetValue === item._contents);
                item._contents = '${$lang.message_' + ((idx).toString().padStart(4, '0')) + '}';
              }
            })
          }
        }

        if (element.children) { //  children[value._contents] -> 2차
          element.children.forEach(child => {
            if (!child.value._contents == null || !child.value._contents == "") {
              let idx = newResult.findIndex((targetValue) => targetValue === child.value._contents);
              child.value._contents = '${$lang.message_' + ((idx).toString().padStart(4, '0')) + '}';
            }
          })
        }
      });

      console.log('FINAL', this.gitple_scenario.graph);

      //  기존 키맵
      // let containerObject = new Object();
      // resultContainer.forEach(function (item, idx, array) {
      //   containerObject["message_" + (idx.toString().padStart(4, '0'))] = item;
      // })
      // this.containerObject = containerObject;
      // console.log('obj for download', this.containerObject)
    },
  }
}
</script>

<style>

</style>
