//  SPA 웹에서는 html을 파싱할 수 없으므로
//  JS의 컨텐츠 로딩을 기다릴 수 있는 puppeteer 라이브러리 이용

//  정규식 이용해서 소스의 html상에서 직접 텍스트 추출하셈

(async () => {
  const puppeteer = require('puppeteer');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://192.168.18.38:5173/'); //  target URL

  // await page.type('target class', '검색어');
  // await page.type('input[class="gLFyf gsfi"]', String.fromCharCode(13));  // 엔터키 -> 검색

  await page.waitForSelector('article div');  //  selector 가 로드될 때까지 대기
  const div = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div')).map(div => (div.textContent));
  });
  const p = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('p')).map(p => (p.textContent));
  });
  const span = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('span')).map(span => (span.textContent));
  });
  console.log('div: ', div);
  console.log('p: ', p);
  console.log('span: ', span);
  await browser.close();
})();
