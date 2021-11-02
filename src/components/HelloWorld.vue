<script setup>
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

import { ref, onMounted } from 'vue'
import  ColorTool  from '../../dist/bundle.js';

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
function insertBefore(newElement, targetElement) {
  var parent = targetElement.parentNode;
  parent.insertBefore(newElement, targetElement);

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

// class ColorTool {

//   static get isInline() {
//     return true;
//   }
//   static get sanitize() {
//     return {
//       span: {
//         class: ['color-marker', 'success'],
//         style: ['.']
//       }
//     };
//   }
//   get state() {
//     return this._state;
//   }

//   set state(state) {
//     this._state = state;

//     this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
//   }

//   constructor({ api, textColorList, backgroundColorList }) {
//     this.api = api;
//     this.button = null;
//     this._state = false;
//     this.range = null;
//     this.showPannel = false;
//     this.tag = 'SPAN';
//     this.class = 'color-marker';
//     this.textColor = '#000'
//     this.backgroundColor = 'transparent'
//     this.textColorList = textColorList || ['#da4039', '#db6d00', '#239c15', '#00ad92', '#2d61dc', '#303ac9', '#888e98']
//     this.backgroundColorList = backgroundColorList || [
//       '#fde2e2', '#feead2', '#d9f5d6', '#d5f6d2', '#e1eaff', '#e0e2fa', '#eff0f1',
//       '#fbbfbc', '#fed4a4', '#b7edb1', '#a9efe6', '#bacefd', '#b4b9f3', '#dee0e3'
//     ]

//   }




//   render() {
//     console.log(1, 'render');
//     this.button = document.createElement('button');
//     this.button.type = 'button';
//     this.button.innerHTML = `<svg t="1635605104529" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6511" width="20" height="20"><path d="M776.533333 917.333333h115.2L578.133333 106.666667H448L134.4 917.333333h115.2l70.4-181.333333h388.266667l68.266666 181.333333zM358.4 629.333333L512 232.533333l153.6 396.8H358.4z"  p-id="6512"></path></svg>`;
//     this.button.classList.add(this.api.styles.inlineToolButton);
//     return this.button;
//   }
//   renderActions() {
//     console.log(2, 'renderActions');
//     this.pannel = document.createElement('div');
//     this.picker = document.createElement('div');
//     // this.picker.classList.add('color-picker')
//     this.picker.innerHTML = this.generateTemplate()

//     this.reset = document.createElement('div');
//     this.reset.innerHTML = `<div class="button-wrap"> <button class="color_reset">reset</button>`

//     this.pannel.appendChild(this.picker)
//     this.pannel.appendChild(this.reset)
//     // this.picker.hidden = true;

//     return this.pannel;
//   }
//   generateTemplate() {
//     let text_colors = ''
//     let back_colors = ''
//     this.textColorList.forEach(element => {
//       text_colors += `<div class="text-color-wrapper">
//           <span class="text-color" data-info="text-0-${element}" style="color:${element}">A</span>
//         </div>`
//     });
//     this.backgroundColorList.forEach(element => {
//       back_colors += `<div class="back-color-wrapper">
//           <span class="back-color" data-info="back-0-${element}" style="background-color: ${element};"></span>
//         </div>`
//     })
//     let template = `
//     <div class="color-picker-wrap">
//      <div class="color-picker">
//       <div class="color-picker-title">TextColor</div>
//       <div class="text-colors">
//         ${text_colors}
//       </div>
//       <div class="color-picker-title">BackgroundColor</div>
//       <div class="back-colors">
//         ${back_colors}
//       </div>
      
//     </div>
//     <div>
//     `
//     return template

//   }
//   checkState() {
//     console.log('checkState');
//     // const mark = this.api.selection.findParentTag(this.tag);

//     // this.state = !!mark;
//     console.log('current state', this.state);
//     if (this.showPannel) {
//       // this.showActions(mark);
//       this.showActions();
//     } else {
//       this.hideActions();
//     }
//   }


//   surround(range) {
//     console.log('surround-parmas', range);
//     this.showPannel = true;
//     this.range = range;
//     this.selectedText = this.range.toString()
//     // if (this.state) {
//     //   // this.unwrap(range);
//     // } else {
//     //   this.wrap(range);
//     // }
//     // this.picker.hidden = false;
//     // this.wrap(range);
//   }

//   clear() {
//     console.log('clear');
//     this.showPannel = false;
//     this.range = null;
//     this.uniMark = false
//     this.olderNode = null
//   }
//   // showActions(mark) {
//   showActions() {
//     const mark = this.api.selection.findParentTag(this.tag, this.class);
//     this.state = !!mark;

//     console.log('showActions');
//     this.reset.addEventListener('click', (e) => {
//       this.unwrap(this.range)
//     })
//     this.picker.addEventListener('click', (e) => {
//       console.log(e.target.dataset.info);
//       if (!e.target.dataset.info) {
//         return
//       }
//       let [type, order, color] = (e.target.dataset.info).split('-')
//       let dom
//       if (this.uniMark === true) {
//         console.log('相同节点');
//         dom = this.olderNode
//       } else {
//         dom = this.wrap(this.range)
//         this.olderNode = dom
//       }
//       if (type === 'text') {
//         dom.style.color = color
//       } else {
//         dom.style.backgroundColor = color
//       }
//     })
//     this.pannel.hidden = false;
//   }
//   hideActions() {
//     console.log('hideActions');
//     //todo 非同一引用
//     this.picker.removeEventListener('click', () => { })
//     this.reset.removeEventListener('click', () => { })
//     this.pannel.hidden = true;
//     // this.mark = null
//   }


//   wrap(range) {
//     console.log('wrap');
//     let seletedText = document.createTextNode(this.range.toString())
//     let spanNode = document.createElement(this.tag);
//     spanNode.appendChild(seletedText)
//     spanNode.classList.add(this.class);
//     this.uniMark = true
//     // const mark = spanNode;
//     const selectedFrag = range.extractContents();
//     range.insertNode(spanNode);
//     // this.api.selection.expandToTag(mark);
//     return spanNode
//   }

//   unwrap(range) {
//     // debugger
//     const mark = this.api.selection.findParentTag(this.tag, this.class)
//     console.log('unwrap', range, { mark });
//     let seletedText = document.createTextNode(this.range.toString())
//     let { startContainer, endContainer, startOffset, endOffset } = range
//     if (endContainer.parentElement === startContainer.parentElement && endContainer.parentElement === mark) {
//       console.log('被包裹的情况');
//       if (endContainer.length == endOffset && startOffset == 0) {
//         range.extractContents();
//         mark && mark.remove()
//         range.insertNode(seletedText)
//       }
//       let clonedSpan = mark.cloneNode()
//       let beforeText = startContainer.textContent.slice(0, startOffset)
//       let afterText = endContainer.textContent.slice(endOffset)
//       console.log(beforeText, afterText);
//       mark.innerText = beforeText
//       clonedSpan.innerText = afterText
//       insertAfter(clonedSpan, mark)
//       insertBefore(seletedText, clonedSpan)
//       range.extractContents();
//     } else {

//       range.extractContents();
//       // mark&&mark.remove()
//       range.insertNode(seletedText)
//     }





//   }



// }



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
        class: ColorTool,
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
.color-picker-wrap {
  position: relative;
  width: 0px;
  height: 0px;
}
.color-picker {
  position: absolute;
  top: 10px;
  width: 204px;
  height: 164px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: left;
  padding: 8px;
  .color-picker-title {
    font-size: 14px;
    padding: 5px 0;
  }
  .text-colors,
  .back-colors {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
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
.button-wrap {
  width: 100%;
  top: 192px;
  position: absolute;
}
.color_reset {
  width: 178px;
  height: 28px;
  background-color: transparent;
  outline: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  position: absolute;
  left: 12%;
}
</style>
