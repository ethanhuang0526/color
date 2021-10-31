<script setup>
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

import { ref, onMounted } from 'vue'


function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    // 如果最后的节点是目标元素，则直接添加。因为默认是最后
    parent.appendChild(newElement);
  }
  else {
    //如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}



defineProps({
  msg: String
})

const count = ref(0)

const save = () => {
  window.editor.save().then((outputData) => {
    console.log('Article data: ', outputData)
  }).catch((error) => {
    console.log('Saving failed: ', error)
  });
}

class MarkerTool {

  static get isInline() {
    return true;
  }
  static get sanitize() {
    return {
      span: {
        class: ['color-marker', 'success'],
        style: ['.']
      }
    };
  }
  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({ api, textColorList, backgroundColorList }) {
    this.api = api;
    this.button = null;
    this._state = false;
    this.range = null;
    this.showPannel = false;
    this.tag = 'SPAN';
    this.class = 'color-marker';
    this.textColor = '#000'
    this.backgroundColor = 'transparent'
    this.textColorList = textColorList || ['#da4039', '#db6d00', '#239c15', '#00ad92', '#2d61dc', '#303ac9', '#888e98']
    this.backgroundColorList = backgroundColorList || [
      '#fde2e2', '#feead2', '#d9f5d6', '#d5f6d2', '#e1eaff', '#e0e2fa', '#eff0f1',
      '#fbbfbc', '#fed4a4', '#b7edb1', '#a9efe6', '#bacefd', '#b4b9f3', '#dee0e3'
    ]

  }




  render() {
    console.log(1, 'render');
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = `<svg t="1635605104529" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6511" width="20" height="20"><path d="M776.533333 917.333333h115.2L578.133333 106.666667H448L134.4 917.333333h115.2l70.4-181.333333h388.266667l68.266666 181.333333zM358.4 629.333333L512 232.533333l153.6 396.8H358.4z"  p-id="6512"></path></svg>`;
    this.button.classList.add(this.api.styles.inlineToolButton);
    return this.button;
  }
  renderActions() {
    console.log(2, 'renderActions');
    this.pannel = document.createElement('div');
    this.picker = document.createElement('div');
    this.picker.classList.add('color-picker')
    this.picker.innerHTML = this.generateTemplate()

    this.reset = document.createElement('div');
    this.reset.innerHTML = `<button>reset</button>`

    this.pannel.appendChild(this.picker)
    this.pannel.appendChild(this.reset)
    // this.picker.hidden = true;

    return this.pannel;
  }
  generateTemplate() {
    let text_colors = ''
    let back_colors = ''
    this.textColorList.forEach(element => {
      text_colors += `<div class="text-color-wrapper">
          <span class="text-color" data-info="text-0-${element}" style="color:${element}">A</span>
        </div>`
    });
    this.backgroundColorList.forEach(element => {
      back_colors += `<div class="back-color-wrapper">
          <span class="back-color" data-info="back-0-${element}" style="background-color: ${element};"></span>
        </div>`
    })
    let template = `
     <div class="color-picker">
      <div class="color-picker-title">TextColor</div>
      <div class="text-colors">
        ${text_colors}
      </div>
      <div class="color-picker-title">BackgroundColor</div>
      <div class="back-colors">
        ${back_colors}
      </div>
      
    </div>
    `
    return template

  }
  checkState() {
    console.log('checkState');
    

    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;
    console.log('current state', this.state);
    if (this.showPannel) {
      this.showActions(mark);
    } else {
      this.hideActions();
    }
  }


  surround(range) {
    console.log('surround-parmas', range);
    this.showPannel = true;
    this.range = range;
    if (this.state) {
      this.unwrap(range);
    } else {
      this.wrap(range);
    }
    // this.picker.hidden = false;
    // this.wrap(range);
  }

  clear() {
    this.showPannel = false;
    this.range = null;
  }
  showActions(mark) {
    console.log('showActions');
    this.reset.addEventListener('click', (e) => {
      this.unwrap(this.range)
    })
    this.picker.addEventListener('click', (e) => {
      console.log(e.target.dataset.info);
      let [type, order, color] = (e.target.dataset.info).split('-')
      let dom
      if (mark) {
        dom = mark
      } else {
        dom = this.wrap(this.range)
      }
      if (type === 'text') {
        dom.style.color = color
      } else {
        dom.style.backgroundColor = color
      }
    })
    this.pannel.hidden = false;
  }
  hideActions() {
    console.log('hideActions');
    this.picker.removeEventListener('click', () => { })
    this.reset.removeEventListener('click', () => { })
    this.pannel.hidden = true;
  }


  wrap(range) {
    debugger
    const selectedText = range.extractContents();
    const mark = document.createElement(this.tag);
    mark.classList.add(this.class);
    // mark.innerText = selectedText.textContent
    // mark.appendChild(selectedText.textContent);
    mark.appendChild(selectedText);

    range.insertNode(mark);
    this.api.selection.expandToTag(mark);

    return mark
  }

  unwrap(range) {
    debugger
    const mark = this.api.selection.findParentTag(this.tag, this.class);
    console.log(mark, this.tag, this.class);
    const text = range.extractContents();
    let textNode = document.createTextNode(text)
    mark.remove();
    insertAfter(textNode,range.startContainer)
    range.insertNode(text);
  }



}



onMounted(async () => {
  const editor = new EditorJS({
    holder: 'editorjs',
    autofocus: true,
    placeholder: 'Let`s write !',
    tools: {
      header: {
        class: Header,
        inlineToolbar: ['link']
      },
      list: {
        class: List,
        inlineToolbar: true
      },
      mark: {
        class: MarkerTool,
        inlineToolbar: true
      }
    },
    data: {
      blocks: [{
        data: { text: '0123456789abcdefghijklmnopqrstuvwxyz' },
        id: "6lQ5zE_VlU",
        type: "paragraph"
      }],
      time: 1635600719831,
      version: "2.22.2"
    }
  });
  window.editor = editor





  //
  try {
    await editor.isReady;
    console.log('Editor.js is ready to work!')
    /** Do anything you need after editor initialization */
  } catch (reason) {
    console.log(`Editor.js initialization failed because of ${reason}`)
  }

})

</script>

<template>
  <h1 @click="save">inline-tool-bar-task</h1>
  <div id="editorjs"></div>
  <div style="width:200px">
    <div class="color-picker">
      <div class="color-picker-title">TextColor</div>
      <div class="text-colors">
        <div class="text-color-wrapper">
          <span class="text-color" data-info="text-0-#da4039" style="color:#da4039">A</span>
        </div>
        <div class="text-color-wrapper">
          <span class="text-color" data-info="text-1-#db6d00" style="color:#db6d00">A</span>
        </div>
        <div class="text-color-wrapper">
          <span class="text-color" data-info="text-2-#239c15" style="color:#239c15">A</span>
        </div>
        <div class="text-color-wrapper">
          <span class="text-color" data-info="text-3-#00ad92" style="color:#00ad92">A</span>
        </div>
        <div class="text-color-wrapper">
          <span class="text-color" data-info="text-4-#2d61dc" style="color:#2d61dc">A</span>
        </div>
        <div class="text-color-wrapper">
          <span class="text-color" data-info="text-5-#303ac9" style="color:#303ac9">A</span>
        </div>
        <div class="text-color-wrapper">
          <span class="text-color" data-info="text-6-#888e98" style="color:#888e98">A</span>
        </div>
      </div>
      <div class="color-picker-title">BackgroundColor</div>
      <div class="back-colors">
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-0-#fde2e2" style="background-color: #fde2e2;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-1-#feead2" style="background-color: #feead2;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-2-#d9f5d6" style="background-color: #d9f5d6;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-3-#d5f6d2" style="background-color: #d5f6d2;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-4-#e1eaff" style="background-color: #e1eaff;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-5-#e0e2fa" style="background-color: #e0e2fa;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-6-#eff0f1" style="background-color: #eff0f1;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-7-#fbbfbc" style="background-color: #fbbfbc;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-8-#fed4a4" style="background-color: #fed4a4;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-9-#b7edb1" style="background-color: #b7edb1;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-10-#a9efe6" style="background-color: #a9efe6;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-11-#bacefd" style="background-color: #bacefd;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-12-#b4b9f3" style="background-color: #b4b9f3;"></span>
        </div>
        <div class="back-color-wrapper">
          <span class="back-color" data-info="back-13-#dee0e3" style="background-color: #dee0e3;"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
#editorjs {
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>
<style lang="less">
.color-marker {
  background-color: transparent;
  padding: 0 2px;
}
.color-picker {
  width: 200px;
  margin: 5px;
  border-radius: 5px;
  text-align: left;
  .color-picker-title {
    font-size: 14px;
    padding: 5px 0;
  }
  .text-colors,
  .back-colors {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
  }
  .back-color-wrapper,
  .text-color-wrapper {
    width: 22px;
    height: 22px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 2px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    margin: 0 5px 5px 0;
    &.active {
      border: 1px solid red;
    }
  }
  .text-color,
  .back-color {
    cursor: pointer;
    width: 100%;
    height: 100%;
    text-align: center;
  }
}
</style>
