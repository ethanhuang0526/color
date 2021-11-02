# inline-color-tool  
color tool for Editor.js. 
this tool can change  the fontColor and  backgroundColor.

file in /src/color
### Install via NPM
Get the package
```shell
$ npm i --save editorjs-inline-color
```

Include module at your application

```javascript
import ColorTool from 'editorjs-inline-color';
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
const editor = EditorJS({
  tools: {
      color: {
        class: ColorTool,
        inlineToolbar: true,
      }
  }
});
```

## preview
You can preview this plugin through the local service
### steps
1. clone this repo
2. npm install
3. npm run dev 

