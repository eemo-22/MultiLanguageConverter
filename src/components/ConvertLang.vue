<!-- <template>
  <span>아아ㅏㅏ아아아아아아아아앙아아</span>
  <br /><br />
  <button @click="convertLang">아아ㅏㅏ아</button>
</template>

<script>
import myJson from '../json/myJson.json';
export default {
  data() {
    return {
      testJson: myJson,
      tempCon: [],
      // container: [],
    }
  },
  methods: {
    convertLang() {
      //  value들을 추출해서 하나의 배열, 긴 json으로 전환
      //  그 파일을 엑셀시트에 앉혀서 번역용 시트로 써야 함. 그래야 추후 변경사항 대응 용이

      let tempVals = [];
      let vals = {};
      let strs = [];
      // const strKor = JSON.stringify(this.testJson);
      // console.log(strKor);
      // console.log(this.testJson);

      // let regex = /(?<=\s)(\\n)(?=\s[a-zA-Z])/g;

      // const strJson = JSON.stringify(this.testJson);
      // console.log(strJson);

      this.testJson.forEach(element => {
        vals = Object.values(element);
        // console.log(vals);

        tempVals.push([...vals]);

        console.log(tempVals);
        Array.apply(this.container, tempVals);
      })
      console.log('vals', this.container);
    }
  }
}
</script>

<style>

</style> -->