const editorsResultWrapper = document.getElementById('editors-result-wrapper');
const editors = document.getElementById('editors');
const editorPanels = document.getElementsByClassName('editor-panel');
const resultWindow = document.getElementById('result-window-iframe');
const htmlEditor = document.getElementById('html-editor-body');
const cssEditor = document.getElementById('css-editor-body');
const jsEditor = document.getElementById('js-editor-body');

const layoutToggle = document.getElementById('layout-toggle');
const layoutDropdown =document.getElementById('layout-dropdown');
const layoutLeftToggle = document.getElementById('layout-left');
const layoutDefaultToggle = document.getElementById('layout-default');
const layoutRightToggle = document.getElementById('layout-right');

var state = {
  html: localStorage.getItem('html') ?? '',
  styles: localStorage.getItem('css') ?? '',
  js: localStorage.getItem('script') ?? ''
}

const main = function main() {

  var debounceUpdate = debounce(update());

  function update() {
    return function(content) {
      let resultMarkup = `<html><head><style>${content.styles}</style></head><body>${content.html}</body></html>`;

      let resultDocument = resultWindow.contentWindow.document;
    
      resultDocument.location.reload()
      resultDocument.open();
    
      resultDocument.write(resultMarkup);
    
      resultDocument.close();

      try {
        resultWindow.contentWindow.eval(content.js)
      }
      catch(error) {
        console.log("--Error evaluating js code--", error.message)
        
      }
    }
  }

  function onEditorInput(type) {
    return function(instance) {
  
      let sanitizedContent = DOMPurify.sanitize(instance.getValue());

      if(type === 'html') {
        state.html = sanitizedContent;
      }
      else if(type === 'css') {
        state.styles = sanitizedContent;
      }
      else if(type === 'js') {
        state.js = sanitizedContent;
      }


      localStorage.setItem('html', state.html);
      localStorage.setItem('css', state.styles);
      localStorage.setItem('script', state.js)

      debounceUpdate(state)
    }
  }

  return {
    onEditorInput,
    update
  }
}()

main.update()(state)

let editorDefaultConfig = {
  lineNumbers: true,
  theme: "dracula",
  lineWrapping: true,

}


//HTML Code Mirror
const htmlCm = new CodeMirror.fromTextArea(htmlEditor, {
  ...editorDefaultConfig,
  mode: "xml"
})

htmlCm.setValue(localStorage.getItem('html') ?? '')

//CSS Code Mirror
const cssCm = new CodeMirror.fromTextArea(cssEditor, {
  ...editorDefaultConfig,
  mode: 'text/css',
  value: localStorage.getItem('css') ?? ''
})

cssCm.setValue(localStorage.getItem('css') ?? '')

//JS Code Mirror
const jsCm = new CodeMirror.fromTextArea(jsEditor, {
  ...editorDefaultConfig,
  mode: "javascript",
  value: localStorage.getItem('js') ?? ''
})

jsCm.setValue(localStorage.getItem('script') ?? '')

htmlCm.on('change', main.onEditorInput('html'))

cssCm.on('change', main.onEditorInput('css'))

jsCm.on('change', main.onEditorInput('js'))

layoutToggle.addEventListener('click', (e) => {

  if(layoutDropdown.style.display === 'block') {
    layoutDropdown.style.display =  'none';
  }
  else {
    layoutDropdown.style.display =  'block';
  }
})

layoutLeftToggle.addEventListener('click', () => {
  editorsResultWrapper.style.flexDirection = 'row';

  editors.classList.remove('editors--default', 'editors--right')
  editors.classList.add('editors--left')

  for(let item of editorPanels) {
    item.style.width = '100%';
  }
})

layoutDefaultToggle.addEventListener('click', () => {
  editorsResultWrapper.style.flexDirection = 'column';

  editors.classList.remove('editors--left', 'editors--right')
  editors.classList.add('editors--default')

  for(let item of editorPanels) {
    item.style.width = '33.33%';
  }
})

layoutRightToggle.addEventListener('click', () => {
  editorsResultWrapper.style.flexDirection = 'row';

  editors.classList.remove('editors--default', 'editors--left')
  editors.classList.add('editors--right')

  for(let item of editorPanels) {
    item.style.width = '100%';
  }
})

function debounce(cb, delay = 300) {
  let timer = null;
  return function(arg1, arg2) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(arg1, arg2);
    }, delay)
  }
}