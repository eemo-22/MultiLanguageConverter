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
  </div>
</template>

<script>
import resourceScenario from '../json/userToNatooScenario.json';
export default {
  data() {
    return {
      gitple_scenario: '',
      containerObject: '',
      translateTargets: [],

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
    removeDuplication (str, arr) {
      if (arr.includes(str)) {
        return;
      } else {
        arr.push(str);
      }
    },
    convertToObject() {
      // this.gitple_scenario = resourceScenario;
      let init = [];
      let counter = [];

      const resourceJson = structuredClone(resourceScenario);

      console.log('origin', resourceScenario);
      console.log('clone', resourceJson);

      resourceJson.graph.forEach(element => {
        init.push(element);

        if (element.value) {  //  value._contents -> 1차
          if (!element.value._contents == null || !element.value._contents == "") {
            this.removeDuplication(element.value._contents, this.translateTargets);
          }
          
          if (element.value._items) { //  value.items[_contents] -> 2차
            element.value._items.forEach(item => {
              if (!item._contents == null || !item._contents == "") {
                this.removeDuplication(item._contents, this.translateTargets);
              }
            })
          }
        }

        if (element.children) { //  children[value._contents] -> 2차
          element.children.forEach(child => {
            if (!child.value._contents == null || !child.value._contents == "") {
              this.removeDuplication(child.value._contents, this.translateTargets);
            }
          })
        }
      });

      console.log('changed obj', resourceJson.graph); //  key로 _contents를 변환한 시나리오
      console.log('values', this.translateTargets); //  key 매핑 위해 추출된 _contents: value

      console.log('최상위 요소들 수', init.length);
      console.log('지금까지 잡아낸 _contents 개수', this.translateTargets.length);
      // console.log('개수', counter.length);

      let containerObject = new Object();
      this.translateTargets.forEach(function (item, idx, array) {
        containerObject["message_" + (idx.toString().padStart(4, '0'))] = item;
      })
      this.containerObject = containerObject;
      console.log('obj for download', this.containerObject)
    },
  }
}
</script>

<style>

</style>
