import './index.css';

function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parent.appendChild(newElement);
    } else {
        //如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

function insertBefore(newElement, targetElement) {
    var parent = targetElement.parentNode;
    parent.insertBefore(newElement, targetElement);

}
export default class ColorTool {

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
        console.log('change state');
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
        // console.log(1, 'render');
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = `<svg t="1635605104529" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6511" width="20" height="20"><path d="M776.533333 917.333333h115.2L578.133333 106.666667H448L134.4 917.333333h115.2l70.4-181.333333h388.266667l68.266666 181.333333zM358.4 629.333333L512 232.533333l153.6 396.8H358.4z"  p-id="6512"></path></svg>`;
        this.button.classList.add(this.api.styles.inlineToolButton);
        return this.button;
    }
    renderActions() {
        // console.log(2, 'renderActions');
        this.pannel = document.createElement('div');
        this.picker = document.createElement('div');
        // this.picker.classList.add('color-picker')
        this.picker.innerHTML = this.generateTemplate()
        this.reset = document.createElement('div');
        this.reset.innerHTML = `<div class="button-wrap"> <button class="color_reset">reset</button>`
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
      <div class="color-picker-wrap">
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
      <div>
      `
        return template

    }
    checkState() {
        // console.log('checkState');
        // const mark = this.api.selection.findParentTag(this.tag);

        // this.state = !!mark;
        // console.log('current state', this.state);
        if (this.showPannel) {
            // this.showActions(mark);
            this.showActions();
        } else {
            this.hideActions();
        }
    }


    surround(range) {
        // console.log('surround-parmas', range);
        this.showPannel = true;
        this.range = range;
        this.selectedText = this.range.toString()
        // if (this.state) {
        //   // this.unwrap(range);
        // } else {
        //   this.wrap(range);
        // }
        // this.picker.hidden = false;
        // this.wrap(range);
    }

    clear() {
        // console.log('clear');
        this.showPannel = false;
        this.range = null;
        this.uniMark = false
        this.olderNode = null
        this.mark = null
    }
    // showActions(mark) {
    showActions() {
        const mark = this.api.selection.findParentTag(this.tag, this.class);
        console.log(mark);
        this.state = !!mark;
        this.mark = mark

        // console.log('showActions');
        this.reset.addEventListener('click', (e) => {
            this.unwrap(this.range)
        })
        this.picker.addEventListener('click', (e) => {
            // console.log(e.target.dataset.info);
            if (!e.target.dataset.info) {
                console.log('非按钮提前退出');
                return
            }
            let [type, order, color] = (e.target.dataset.info).split('-')
            let dom
            if (this.uniMark === true) {
                // console.log('相同节点');
                dom = this.olderNode
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
        // console.log('hideActions');
        //todo 非同一引用
        this.picker.removeEventListener('click', () => { })
        this.reset.removeEventListener('click', () => { })
        this.pannel.hidden = true;
        // this.mark = null
    }


    wrap(range) {
        console.log(range);
        const mark = this.mark
        let { startContainer, endContainer, startOffset, endOffset, commonAncestorContainer } = range
        let seletedText = document.createTextNode(this.range.toString())
        let spanNode = document.createElement(this.tag);
        spanNode.classList.add(this.class);
        this.uniMark = true
        this.olderNode = spanNode
        spanNode.appendChild(seletedText)
        if (endContainer.parentElement === startContainer.parentElement && endContainer.parentElement === mark) {
            console.log('range 被包裹的情况');
            let clonedSpan = mark.cloneNode()
            let beforeText = startContainer.textContent.slice(0, startOffset)
            let afterText = endContainer.textContent.slice(endOffset)
            mark.innerText = beforeText
            clonedSpan.innerText = afterText
            insertAfter(clonedSpan, mark)
            insertBefore(spanNode, clonedSpan)
            // 抽象了全选的情况
            if (startOffset === 0) {
                mark && mark.remove()
            }
            if (endOffset === endContainer.length) {
                clonedSpan.remove()
            }
            range.extractContents();

        } else {
            const selectedFrag = range.extractContents();
            range.insertNode(spanNode);
            this.removeEmptySpan(commonAncestorContainer)
        }
        return spanNode

    }

    unwrap(range) {
        // const mark = this.api.selection.findParentTag(this.tag, this.class)
        let mark = this.mark
        console.log({ mark });
        let seletedText = document.createTextNode(this.range.toString())
        let { startContainer, endContainer, startOffset, endOffset, commonAncestorContainer } = range
        // range 被包裹的情况
        if (endContainer.parentElement === startContainer.parentElement && endContainer.parentElement === mark && startContainer.parentElement === mark) {
            let clonedSpan = mark.cloneNode()
            let beforeText = startContainer.textContent.slice(0, startOffset)
            let afterText = endContainer.textContent.slice(endOffset)
            mark.innerText = beforeText
            clonedSpan.innerText = afterText
            insertAfter(clonedSpan, mark)
            insertBefore(seletedText, clonedSpan)
            // 抽象了全选的情况
            startOffset === 0 && mark && mark.remove()
            endOffset === endContainer.length && clonedSpan.remove()
            range.extractContents();
            
        } else {
            range.extractContents();
            // mark&&mark.remove()
            range.insertNode(seletedText)
            this.removeEmptySpan(commonAncestorContainer)
        }
    }

    removeEmptySpan(container){
        let htmlCollection = container.children
        console.log(htmlCollection);
        let arr = []
        for (const key in htmlCollection) {
            if (Object.hasOwnProperty.call(htmlCollection, key)) {
                const element = htmlCollection[key];
                if (element.textContent === '') {
                    arr.push(element)
                }
            }
        }
        arr.forEach(i=>{
            i.remove()
        })
    }
}
