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


// Mobile View Elements
const mobileEditorPanel = document.getElementById('mobile-editor-panel');
const htmlToggle = document.getElementById('html-toggle');
const cssToggle = document.getElementById('css-toggle');
const jsToggle = document.getElementById('js-toggle');


var state = {
  html: localStorage.getItem('html') ?? '',
  styles: localStorage.getItem('css') ?? '',
  js: localStorage.getItem('script') ?? ''
}

const main = function main() {
  layoutDefaultToggle.classList.add('active');
  htmlToggle.classList.add('active'); // Mobile HTML Tab active by default



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


// Mobile View Editor
let mobileCm = new CodeMirror.fromTextArea(mobileEditorPanel, {
  ...editorDefaultConfig,
  mode: "xml"
})

mobileCm.setValue(localStorage.getItem('html') ?? '')
mobileCm.on('change', main.onEditorInput('html'))

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
  layoutLeftToggle.classList.add('active');
  layoutDefaultToggle.classList.remove('active')
  layoutRightToggle.classList.remove('active')

  editorsResultWrapper.style.flexDirection = 'row';

  editors.classList.remove('editors--default', 'editors--right')
  editors.classList.add('editors--left')

  for(let item of editorPanels) {
    item.style.width = '100%';
  }
})

layoutDefaultToggle.addEventListener('click', () => {
  layoutDefaultToggle.classList.add('active')
  layoutLeftToggle.classList.remove('active')
  layoutRightToggle.classList.remove('active')

  editorsResultWrapper.style.flexDirection = 'column';

  editors.classList.remove('editors--left', 'editors--right')
  editors.classList.add('editors--default')

  for(let item of editorPanels) {
    item.style.width = '33.33%';
  }
})

layoutRightToggle.addEventListener('click', () => {
  layoutRightToggle.classList.add('active')
  layoutDefaultToggle.classList.remove('active')
  layoutLeftToggle.classList.remove('active')

  editorsResultWrapper.style.flexDirection = 'row';

  editors.classList.remove('editors--default', 'editors--left')
  editors.classList.add('editors--right')

  for(let item of editorPanels) {
    item.style.width = '100%';
  }
})


// Mobile View Event handlers
htmlToggle.addEventListener('click', function() {
  htmlToggle.classList.add('active');
  cssToggle.classList.remove('active');
  jsToggle.classList.remove('active');

  removeCodeMirror(); // remove code editor added by default on page load

  mobileCm = new CodeMirror.fromTextArea(mobileEditorPanel, {
    ...editorDefaultConfig,
    mode: "xml"
  })

  mobileCm.setValue(localStorage.getItem('html') ?? '')

  mobileCm.on('change', main.onEditorInput('html'))
})

cssToggle.addEventListener('click', function() {
  cssToggle.classList.add('active');
  htmlToggle.classList.remove('active');
  jsToggle.classList.remove('active');

  removeCodeMirror(); // remove code editor added by default on page load

  mobileCm = new CodeMirror.fromTextArea(mobileEditorPanel, {
    ...editorDefaultConfig,
    mode: "css"
  })

  mobileCm.setValue(localStorage.getItem('css') ?? '')
  mobileCm.on('change', main.onEditorInput('css'))
})

jsToggle.addEventListener('click', function() {
  jsToggle.classList.add('active');
  htmlToggle.classList.remove('active');
  cssToggle.classList.remove('active');

  removeCodeMirror(); // remove code editor added by default on page load

  mobileCm = new CodeMirror.fromTextArea(mobileEditorPanel, {
    ...editorDefaultConfig,
    mode: "javascript"
  })

  mobileCm.setValue(localStorage.getItem('script') ?? '')
  mobileCm.on('change', main.onEditorInput('js'))
})

function removeCodeMirror() {
  if(mobileCm) {
    mobileCm.toTextArea();
    mobileCm = null;
  }
}

function debounce(cb, delay = 300) {
  let timer = null;
  return function(arg1, arg2) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(arg1, arg2);
    }, delay)
  }
}