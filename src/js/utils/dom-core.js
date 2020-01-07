/**
 * 
 * DOM 操作
 * 
 */

function createElemByHTML(html){
    let div;
    div = document.createElement('div');
    div.innerHTML = html;
    return div.children;
}

// 判断是否是domList
function isDomList(selector){
    if(!selector) return false;
    if(selector instanceof HTMLCollection || selector instanceof NodeList){
        return true;
    }
    return false;
}

// 元素选择器
function querySelectorAll(selector){
    const result = document.querySelectorAll(selector);
    if(isDomList(result)){
        return result;
    }else{
        return [result];
    }
}

// 记录所有的事件绑定
const eventList = [];

// 创建构造函数

function DomElement(selector){

    if(!selector) return;

    // selector 本来就是DomElement对象 直接返回
    if(selector instanceof DomElement) return selector;

    this.selector = selector;
    const nodeType = selector.nodeType;

    // 根据selector 得出的结果 (如 DOM DOM list)
    let selectorResult = [];
    if(nodeType === 9){
        // document 节点
        selectorResult = [selector];
    }else if(nodeType === 1){
        // 单个dom节点
        selectorResult = [selector];
    }else if(typeof selector === 'string'){
        // 字符串
        selector = selector.replace('/\n/mg', '').trim(); //字符串去空
        if(selector.indexOf('<') === 0){
            // 比如<div>
            selectorResult = createElemByHTML(selector);
        }else{
            // 如 # . 选择器
            selectorResult = querySelectorAll(selector);
        };
    };

    const length = selectorResult.length;
    if(!length) return this; //空数组

    for(let i = 0; i<length; i++){
        this[i] = selectorResult[i];
    };
    this.length = length;

};

DomElement.prototype = {

    forEach:function(fn){
        for(let i = 0; i<this.length;i++){
            const elem = this[i];
            const result = fn.call(elem, elem, i);
            if(result === false){
                break;
            }
        };
        return this;
    },

    // 绑定事件
    on:function(type, selector, fn){
        if(!fn){
            fn = selector;
            selector = null;
        };

        // type是否有多个
        let types = [];
        types = type.split(/\s+/);

        return this.forEach(elem=>{
            types.forEach(type=>{
                if(!type) return;

                // 记录
                eventList.push({
                    elem:elem,
                    type:type,
                    fn:fn
                });
                if(!selector){
                    elem.addEventListener(type, fn);
                    return;
                }

                elem.addEventListener(type, e =>{
                    const target = e.target;
                    if(target.matches(selector)){
                        fn.call(target, e);
                    }
                })
            })
        })
    },

    // 获取子节点
    children:function(){
        const elem = this[0];
        if(!elem){
            return null;
        };
        return $(elem.children)
    },

    // 添加class
    addClass:function(className){
        if(!className) return this;
        return this.forEach(elem=>{
            let arr;
            if(elem.className){
                arr = elem.className.split(/\s/);
                arr = arr.filter(item =>{
                    return !!item.trim();
                });
                if(arr.indexOf(className) < 0){
                    arr.push(className);
                };
                elem.className = arr.join(' ');
            }else{
                elem.className = className;
            }
        })
    },

    // 添加子节点
    append:function($children){
        return this.forEach(elem =>{
            $children.forEach(child=>{
                elem.appendChild(child);
            })
        })
    },

    innerText:function(text){
        return this.forEach(elem=>{
            if(!text) return;
            elem.innerText = text;
        })
    },

    // 视频播放
    play:function(){
        return this.forEach(elem =>{
            elem.play();
        })
    },

    // 视频暂停
    pause:function(){
        return this.forEach(elem=>{
            elem.pause();
        })
    }
};

function $ (selector){
    return new DomElement(selector);
};

export default $;