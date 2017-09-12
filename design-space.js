var utils = (function () {
    return {

        dom: {
            /**
             * 将string转换成dom，然后返回选择器元素
             */
            strToDom: function (str, selector, all) {
                let
                    parser = new DOMParser
                doc = parser.parseFromString(str, 'text/html')

                return all ? document.querySelectorAll(selector) : doc.querySelector(selector)
            },
            /**
             * 查看selector是否为node的父或祖先节点
             * @return boolen
             */
            ancestors: function (node, selector) {},

            /**
             * 查找子元素
             */
            chilren: function () {},

            /** 事件 */
            // 倾听
            on: function () {},

            // 移除
            off: function () {},

            // 触发
            emit: function () {},
            /** 事件结束 */

        }

    }

})()

function DesignSpace(cfg) {
    this.width = cfg.width || '500px'
    this.height = cfg.height || '500px'
    this.cfg = cfg
    this.designSpace = document.querySelector(this.cfg.el) || undefined
}

DesignSpace.prototype = (function () {
    return {
        makeDesignSpace: function () {
            if (!this.designSpace) {
                this.designSpace = utils.dom.strToDom(`
                        <div class="design-space"></div> 
                    `, '.auxiliary-line')
            }
            let style = {}
            if (this.cfg.width) style.width = this.cfg.width
            if (this.cfg.height) style.height = this.cfg.height
            this.setStyle(style).makeAuxLineWrapper()
            return this

        },
        setStyle: function (rules) {
            if (rules) {
                for (let rule in rules) {
                    if (rules.hasOwnProperty(rule)) {
                        this.designSpace.style[rule] = rules[rule]
                    }
                }
            }
            return this
        },
        makeAuxLineWrapper: function () {
            this.auxLineWrapper = utils.dom.strToDom(`<div class="auxiliary-line-wrapper" 
                style="
                    width: 100%; 
                    height: 100%;
                    left: 0;
                    top: 0;
                    position: absolute;
                    overflow: hidden;
                "></div>`, '.auxiliary-line-wrapper')
            this.designSpace.append(this.auxLineWrapper)
            return this
        },
        addAuxLine: function () {
            let line = new AuxiliaryLine({
                bgColor: 'green',
                direction: 'horizontal'
            })
            line.makeLine()
            this.line = line
            line
                .move('300px', '100px')
                .size('20px')
            this.auxLineWrapper.append(line.line)
            return this
        },
        rmAuxLine: function () {},
        clearAuxLine: function () {

        }
    }
})()

// 位置检测
function PositionDetection(opts) {
    // 被检测元素
    this.els = this.opts.els || []

    /**
     * 检测配置
     * 1. 容器边框
     * 2. 兄弟元素边框（最近的还是所有的）
     * 3. 灵敏度： 检测多少范围内的对象 
     */ 
    this.detectOpts = this.opts.detectCfg || {
        // 边框检测
        boundary: true,

        // 兄弟元素检测
        sinblin: 'nearest',  // all

        // 在这些范围之内就进行检测
        distance: {
            left: 100,
            top: 100,
            right: 100,
            bottom: 100
        }
    }

    //被检测对象
    this.target = this.opts.target

}

PositionDetection.prototype = (function() {
    return {
        detect: function() {

        },

        // 匹配成功
        match: function() {
            // 检测规则

            // 添加辅助线
            this.addAuxLine()
        },

        addAuxLine: function() {

        }
    }
})()




function Drag(cfg) {
    this.cfg = cfg
    this.startPoint = {
        x: 0,
        y: 0
    }
    this.mouseDown = false
    this.target = this.cfg && this.cfg.target || null
    this.handle = this.cfg && this.cfg.handle || null
    this.handle && this.handle.classList.add('dragarea')

    // 拖动范围
    this.region = this.cfg && this.cfg.region || null

    this.direction = this.cfg.direction || null

    this.start()
}

Drag.prototype = (function () {
    return {
        start: function () {
            if (this.target && this.region) {
                let
                    targetDim = this.target.getBoundingClientRect(),
                    regionDim = this.region.getBoundingClientRect(),
                    self = this

                window.addEventListener('mousedown', evt => {
                    if (
                        (self.handle && evt.target == self.handle) ||
                        (!self.handle && evt.target == self.target)
                    ) {
                        self.mouseDown = true
                        self.startPoint = {
                            x: evt.clientX,
                            y: evt.clientY
                        }
                    }


                }, false)

                window.addEventListener('mouseup', evt => {
                    self.mouseDown = false
                    self.startPoint = {
                        x: 0,
                        y: 0
                    }
                    targetDim = self.target.getBoundingClientRect()
                    regionDim = self.region.getBoundingClientRect()
                }, false)

                window.addEventListener('mousemove', (evt) => {
                    if (self.mouseDown) {
                        let
                            mouseOffset = {
                                x: evt.clientX - self.startPoint.x,
                                y: evt.clientY - self.startPoint.y
                            }
                        if (!self.direction) {
                            self.target.style.left = (mouseOffset.x + (targetDim.left - regionDim.left)) + 'px'
                            self.target.style.top = (mouseOffset.y + (targetDim.top - regionDim.top)) + 'px'
                        }

                        if (self.direction == 'horizontal')
                            self.target.style.left = (mouseOffset.x + (targetDim.left - regionDim.left)) + 'px'
                        if (self.direction == 'vertical')
                            self.target.style.top = (mouseOffset.y + (targetDim.top - regionDim.top)) + 'px'
                    }
                }, false)
            }

            return this
        },
        setHandle: function (handle) {
            this.handle = handle || null
            this.handle && this.handle.classList.add('dragarea')
            this.start()
            return this
        },
        end: function () {},

        // 移动方向
        setDirection: function(dir) {
            this.direction = dir
            this.start()
            return this
        },

        // 移动, 根据当前位置，移动offset个单位
        // 用于鼠标，拖拽等移动
        move: function(offset) {

        },


        // 设置拖动范围
        setBoundary: function() {

        }
    }
})()

new Drag({
        target: document.querySelector('#item'),
        // handle: document.querySelector('.handle'),
        region: document.querySelector('.design-space'),
        direction: 'vertical'
    })
    .setHandle(document.querySelector('.handle'))



function AuxiliaryLine(cfg) {
    this.cfg = cfg
    this.direction = cfg.direction || 'vertical'
}

AuxiliaryLine.prototype = (function () {
    function genCss(dir) {
        if (dir === 'horizontal') {
            return `
                width: 100%;
                height: 5px;
            `
        } else {
            return `
                width:5px;
                height: 100%;
            `
        }
    }
    return {
        makeLine: function () {
            let css = genCss.call(this, this.direction),
                direction = this.direction
            this.line = utils.dom.strToDom(`
                    <div class="auxiliary-line ${direction}"
                        style="
                            ${css}
                            position: absolute;
                        "
                    ></div> 
                `, '.auxiliary-line')
            document.styleSheets[0].addRule('.auxiliary-line:after', `background-color: ${this.cfg.bgColor}`)
            return this
        },
        move: function (x, y) {
            x = x || 0
            y = y || 0
            this.line.style.left = x
            this.line.style.top = y
            return this
        },
        size: function (value) {
            if (this.direction === 'horizontal') {
                this.line.style.width = value
            }

            if (this.direction === 'vertical') {
                this.line.style.height = value
            }

            // 显示尺寸信息
            this.line.setAttribute('data-size', value)
            document.styleSheets[0].addRule('.auxiliary-line:before', `content: attr(data-size)`)

            return this
        }
    }
})()



let
    ws = new DesignSpace({
        width: '500px',
        height: '500px',
        el: '.design-space'
    })

ws
    .makeDesignSpace()
    .addAuxLine()