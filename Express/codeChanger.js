const fs = require('fs');

// Vue 파일 읽기
const vueCode = fs.readFileSync('C:/NatooAPI3/frontend/src/coupon_v2/src/views/MembershipUpgradeView.vue', 'utf-8');

// 템플릿 내부의 텍스트 변환 함수
function transformTextInTemplate(template) {
  const regex = /(<(div|p|span)[^>]*>)([^<]*)(<\/\2>)/g;
  return template.replace(regex, (match, openingTag, tag, text, closingTag) => {
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

  // 변경된 Vue 파일 생성
  const transformedVueCode = vueCode.replace(template, transformedTemplate);

  // <style> 영역 제거
  const finalVueCode = transformedVueCode.replace(/<style>[\s\S]*?<\/style>/g, '');

  // 변경된 Vue 파일 출력
  console.log(finalVueCode);
}