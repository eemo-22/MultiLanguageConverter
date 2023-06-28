const fs = require('fs');
const { parse } = require('@vue/compiler-sfc');

// Vue 파일 읽기
const vueCode = fs.readFileSync('C:/NatooAPI3/frontend/src/coupon_v2/src/views/MembershipUpgradeView.vue', 'utf-8');

// Vue 파일 파싱
const { descriptor } = parse(vueCode);

// Template 파싱
if (descriptor.template) {
  const templateAst = descriptor.template.ast;

  // Template 내부의 요소 추출 및 중복 제거된 텍스트 출력
  function extractUniqueTextFromElements(elements) {
    const uniqueTextSet = new Set(); // 중복을 제거하기 위한 Set
    elements.forEach((element) => {
      if (element.tag === 'div' || element.tag === 'p' || element.tag === 'span') {
        const text = extractTextFromElement(element);
        uniqueTextSet.add(text);
      }
      if (element.children) {
        extractUniqueTextFromElements(element.children);
      }
    });
    // 중복을 제거한 텍스트 출력
    uniqueTextSet.forEach((text) => {
      console.log(`Text: ${text}`);
    });
  }

  // 요소 내부의 텍스트 추출
  function extractTextFromElement(element) {
    let text = '';
    if (element.children) {
      element.children.forEach((child) => {
        if (child.type === 2) { // 2 represents TEXT type
          text += child.content.trim();
        } else if (child.children) {
          text += extractTextFromElement(child);
        }
      });
    }
    return text;
  }

  // Template 내부의 요소에서 중복을 제거한 텍스트 추출
  extractUniqueTextFromElements(templateAst.children);
}