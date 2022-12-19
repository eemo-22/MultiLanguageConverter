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
    <!-- <br /><br />
    <hr />
    <br />
    <button type="button" @click="restoreScenario"> 시나리오 복구</button><br />
    <span> 다국어 시나리오를 일반 시나리오로 전환합니다.</span><br />
    <span> 최신 버전의 키 맵과 다국어 시나리오가 필요합니다.</span> -->
  </div>
</template>

<script>
import ForignerScenario from '../json/Forigner_Scenario_Multilingual_221219.json';
import keyMap from '../json/Foringer_keyMap_221216.json';

export default {
  data() {
    return {
      gitple_scenario: '',
      containerObject: '',
      // container: [],

      multiLanguage: [],
      jsonKey: [],
      rString: '',
    }
  },
  methods: {
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
      //  깃플 다국어 json 형식
      const koreanObject = {};
      koreanObject.ko = this.containerObject;

      const data = JSON.stringify(koreanObject)
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
      const keyMapValues = Object.values(keyMap.ko);
      let init = [];
      // let counter = [];
      let container = [];
      const resultContainer = [];
      let newKeyMap =[];

      const originKeyMap = keyMap.ko;
      // console.log('ori', originKeyMap);

      //  변경 예정

      let newKeyMapArray = Object.keys(originKeyMap).map(key => originKeyMap[key]);
      let settedKeyMap = new Set(newKeyMapArray);

      newKeyMap = [...settedKeyMap];
      console.log('NEW KEY MAP!: ', newKeyMap);

    
      let newKeyJSON = new Object();
      newKeyMap.forEach(function (item, idx, array) {
        newKeyJSON[item] = item;
      })

      console.log('NKJ', newKeyJSON);

      

      let i = 0;

      /* 
        주석 제거 금지 -> 이게 여기에 선언되니까 i++가 안 먹히던 것...
        let keyIdx = 'message_' + ((i++).toString().padStart(4, '0'));

        중복을 제거하면, 원본 시나리오와 key로 교체된 시나리오의 _contents 숫자가 일치하지 않게 된다.
        중복 제거는 번역 수준에서 처리하거나, 별개의 key map 생성 로직 필요
        container[] 에서 중복을 제거하고 key map을 형성하는 쪽이 현재로서는 좋아 보인다.
      */

      /*
        시나리오가 업데이트 되었을 경우(내용 추가가 아닌, 업로드 되어 있는 시나리오 json의 다양한 이유로 인한 구조상의 변화)
        시나리오를 내려받고, 해당 시나리오와 key map을 import 하여 1 -> 2 -> 3 순서로 다시 작동시킨다.
      */

      /*
        "type": "openLink"
        상기 항목이 나투홈 또는 예약으로 이동 등 링크 연결 버튼이다.
        입력값은 "label"에 저장되고, 해당 항목을 다국어 처리 하면 적용된다.
      */

      this.gitple_scenario.graph.forEach(element => {
        init.push(element);

        if (element.value) {  //  value._contents -> 1차
          if (!element.value._contents == null || !element.value._contents == "") {
            container.push(element.value._contents);
            if (element.value._contents) {
              element.value._contents = '${$lang.message_' + ((i++).toString().padStart(4, '0')) + '}';
            }
            if (element.value._navButtons.length) {
              element.value._navButtons.forEach(el => {
                if (el.type === "openLink") {
                  container.push(el.label);
                  el.label = '${$lang.message_' + ((i++).toString().padStart(4, '0')) + '}';
                }
              })
            }
          }
          
          if (element.value._items) { //  value.items[_contents] -> 2차
            element.value._items.forEach(item => {
              if (!item._contents == null || !item._contents == "") {
                container.push(item._contents);
                item._contents = '${$lang.message_' + ((i++).toString().padStart(4, '0')) + '}';
              }
            })
          }
        }

        if (element.children) { //  children[value._contents] -> 2차
          element.children.forEach(child => {
            if (!child.value._contents == null || !child.value._contents == "") {
              container.push(child.value._contents);
              child.value._contents = '${$lang.message_' + ((i++).toString().padStart(4, '0')) + '}';
            }
          })
        }
      });

      console.log('changed obj', this.gitple_scenario.graph); //  key로 _contents를 변환한 시나리오
      console.log('values', container); //  key 매핑 위해 추출된 _contents: value

    //  수정 진행 중 - key map -> value 기반 처리 

    //   // console.log('최상위 요소들 수', init.length);
    //   // console.log('지금까지 잡아낸 _contents 개수', this.container.length);
    //   // console.log('개수', counter.length);

    //   // let tempResult = [];
    //   // let settedContainer = [];

    //   // container.forEach((item, index) => {
    //   //   if (item.includes("${$lang.message_")===true) {
    //   //     item = keyMapValues[index];
    //   //   } else {
    //   //     item = item;
    //   //   }
    //   //   tempResult.push(item);
    //   // })
    //   container.forEach((item, index) => {
    //     if (item.includes("${$lang.message_")===true) {
    //       item = keyMapValues[index];
    //     } else {
    //       item = item;
    //     }
    //     resultContainer.push(item);
    //   })

    //   // settedContainer = new Set(tempResult);
    //   // console.log('SET', settedContainer);

    //   // this.resultContainer = [...settedContainer];

    //   let containerObject = new Object();
    //   resultContainer.forEach(function (item, idx, array) {
    //     // console.log('ggg', item);
    //     // console.log('iiiiiii', idx);
    //     containerObject["message_" + (idx.toString().padStart(4, '0'))] = item;
    //   })
    //   this.containerObject = containerObject;
    //   console.log('obj for download', this.containerObject)
    },
  }
}
</script>

<style>

</style>
