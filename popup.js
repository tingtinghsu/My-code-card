window.addEventListener('DOMContentLoaded', () => {
  let wrap = document.querySelector('.wrap')
  let modeType = document.querySelector('select')
  let desc = document.querySelector('[name=desc]')
  var myCodeMirror
  // 先將storage裡的變數叫出來，把使用者選到的字塞到codeArea!
  chrome.storage.local.get(['arguments'] || {}, result => {
    // 當type選單選好才給 mode
    let editorConfig = {
      mode: "meta",
      lint: true,
      lineNumbers: true,
      theme: 'rubyblue',
      lineWrapping: true,
      value: `${result.arguments.selected}`.replace(/ }/g,"\n}").replace(/  /g,"\n")
    }
    myCodeMirror = CodeMirror(wrap, editorConfig);
  })

  modeType.addEventListener('change', (e) => {
    myCodeMirror.setOption('mode', modeType.value)
  })

  // 有幾筆資料
  chrome.storage.local.get(['codes'], result => {
    const codes = Object.keys(result.codes || {})
    let codesCount = codes.length;
    document.getElementById('code-notes-count').textContent = codesCount;
  })

  //新增
  const btn = document.querySelector('[type=submit]')
  btn.addEventListener('click', (event) => {
    let codesContext = myCodeMirror.getValue()
    // event.preventDefault()
    event.stopPropagation()
    chrome.storage.local.get(['codes'], result => {
      // console.log(result)
      chrome.storage.local.set({
        codes: {
          ...result.codes,
          [Date.now()]: {
            type: modeType.value,
            desc: desc.value,
            code: codesContext,
          }
        }
      })
    })
  })

  document.getElementById('review').addEventListener('click', () => {
    window.open(chrome.runtime.getURL('review.html'))
  })
});
