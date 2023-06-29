const fs = require('fs');

// Vue 파일 읽기
const vueCode = fs.readFileSync('C:/NatooAPI3/frontend/src/coupon_v2/src/components/hospitalCoupon_v2.vue', 'utf-8');

// 템플릿 내부의 텍스트 변환 함수
function transformTextInTemplate(template) {
  const regex = /(<(div|p|span)[^>]*>)([^<]*)(<\/\2>)/g;
  return template.replace(regex, (match, openingTag, tag, text, closingTag) => {
    if (text.trim() === '') {
      return match; // Skip transformation if the text is empty
    }
    const transformedText = `{{$t("${text.trim()}")}}`;
    return openingTag + transformedText + closingTag;
  });
}


// Vue 파일에서 <template> 영역 추출
const templateRegex = /<template>([\s\S]*?)<\/template>/;
const templateMatch = vueCode.match(templateRegex);
if (templateMatch) {
  const template = templateMatch[1];
  const transformedTemplate = transformTextInTemplate(template);

  // 변경된 Vue 코드 생성
  const transformedVueCode = vueCode.replace(template, transformedTemplate);

  // 변경된 Vue 파일의 경로 및 이름 설정
  const outputFilePath = 'transformed-vue-file.vue';

  // 변경된 Vue 파일에 쓰기
  fs.writeFileSync(outputFilePath, transformedVueCode, 'utf-8');

  console.log(`변경된 Vue 파일이 ${outputFilePath}에 성공적으로 저장되었습니다.`);
}