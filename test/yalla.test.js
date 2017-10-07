/**
 * Created by arif on 10/6/2017.
 */

"use strict";

describe('yalla',function(){
    describe('html',function () {

        it('Should generate HtmlTemplate',function () {
            expect(html`Hello World`).to.satisfy(function(template){
                return template instanceof HtmlTemplate
            });
        });
        it('Should generate Button',function () {
            let dom = document.createElement('div');
            render(html`<button></button>`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.tagName == 'BUTTON'
            });
        });
        it('Should generate input type text',function () {
            let dom = document.createElement('div');
            render(html`<input type="text">`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.tagName == 'INPUT'
            });
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.getAttribute('type') == 'text'
            });
        });
        it('Should generate dynamic',function () {
            let dom = document.createElement('div');
            render(html`<input type="${'text'}">`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.tagName == 'INPUT'
            });
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.getAttribute('type') == 'text'
            });
        });

        it('Should generate javascript operation',function () {
            let dom = document.createElement('div');
            let toDisplayText = true;
            render(html`<input type="${toDisplayText ? 'text' : ''}">`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.tagName == 'INPUT'
            });
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.getAttribute('type') == 'text'
            });
        });

        it('Should generate Component in Component',function () {
            let dom = document.createElement('dom');
            render(html`Hello ${html`World`} Yay !!`,dom);
            expect(dom).to.satisfy(function(dom){
                return dom.innerText == 'Hello World Yay !!';
            });
        });

        it('Should generate Component and replace with non Component',function () {
            let dom = document.createElement('dom');
            let toggleComponent = true;
            render(html`Hello ${toggleComponent ? html`World` : 'World'} Yay !!`,dom);
            expect(dom).to.satisfy(function(dom){
                return dom.innerText == 'Hello World Yay !!';
            });
            toggleComponent = false;
            render(html`Hello ${toggleComponent ? html`World` : 'World'} Yay !!`,dom);
            expect(dom).to.satisfy(function(dom){
                return dom.innerText == 'Hello World Yay !!';
            });
            toggleComponent = true;
            render(html`Hello ${toggleComponent ? html`World` : 'World'} Yay !!`,dom);
            expect(dom).to.satisfy(function(dom){
                return dom.innerText == 'Hello World Yay !!';
            });
        });



        it('Should generate list of collections',function () {
            let dom = document.createElement('div');
            let items = [{name:'alpha'},{name:'beta'},{name:'charlie'},{name:'delta'}];
            let template = html`${htmlMap(items,'name',i => html`<li>${i.name}</li>`)}`;
            render(template,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.childElementCount == items.length;
            });
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.tagName == 'LI'
            });
        });

        it('Should perform updates',function () {
            let dom = document.createElement('div');
            let state = {
                value : 'ValueOne'
            };
            render(html`<label>${state.value}</label>`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.textContent == state.value;
            });
            state.value = 'ValueTwo';
            render(html`<label>${state.value}</label>`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.textContent == state.value;
            });
        });

        it('Should perform addition on collections',function () {
            let dom = document.createElement('div');
            let items = [];


            function update(){
                render(html`
                    ${htmlMap(items,'id',i => html`<label>${i.label} ${i.value}</label>`)}
                `,dom);
            }

            for(let i = 0;i < 10;i++){
                items.push({id : i,label:`LABEL-${i}`,value:`VALUE-${i}`});
                update();
                expect(dom).to.satisfy(function (dom) {
                    return dom.childElementCount == i+1;
                });
            }
        });

        it('Should perform deletion on collections',function () {
            let dom = document.createElement('div');
            let items = [];


            function update(){
                render(html`
                    ${htmlMap(items,'id',i => html`<label>${i.label} ${i.value}</label>`)}
                `,dom);
            }

            for(let i = 0;i < 10;i++){
                items.push({id : i,label:`LABEL-${i}`,value:`VALUE-${i}`});
                update();
                expect(dom).to.satisfy(function (dom) {
                    return dom.childElementCount == i+1;
                });
            }

            for(let i = 0;i < 10;i++){
                items.splice(0,1);
                update();
                expect(dom).to.satisfy(function (dom) {
                    return dom.childElementCount == (9-i);
                });
            }
        });

        // perform update and remove update

        it('Should promote component from text to html',function(){
            let dom = document.createElement('div');
            let state = {
                displayHtml : false
            };
            let update = () => {
                render(html`<div>${state.displayHtml ? html`<div>Hello World</div>` : ''}</div>`,dom);
            }
            update();
            expect(dom).to.satisfy(function (dom) {
                return dom.innerText == '';
            });
            state.displayHtml=true;
            update();
            expect(dom).to.satisfy(function (dom) {
                return dom.innerText == `Hello World`;
            });
            state.displayHtml=false;

            update();
            expect(dom).to.satisfy(function (dom) {
                return dom.innerText == ``;
            });

            state.displayHtml=true;
            update();
            expect(dom).to.satisfy(function (dom) {
                return dom.innerText == `Hello World`;
            });
        });

        it('should bind with attribute whitespace',function(){
            let dom = document.createElement('div');
            let color = 'blue';

            render(html`<div style="display: ${'block'};color: ${color}"></div>`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.style.color == 'blue';
            });
        });

        it('should bind to event listener',function(){
            let dom = document.createElement('div');
            let color = 'blue';
            let onclick = function(){
                alert('Hello World');
            };
            render(html`<button style="display: ${'block'};color: ${color}" onclick="${onclick}"></button>`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.onclick == onclick;
            });
        });

        it('should validate attribute minimization',function(){
            let dom = document.createElement('div');
            let checked = true;
            render(html`<input type="checkbox" checked=" ${checked} ">`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.checked == true;
            });

            checked = false;
            render(html`<input type="checkbox" checked=" ${checked} ">`,dom);
            expect(dom).to.satisfy(function (dom) {
                return dom.firstElementChild.checked == false;
            });
        });

        it('should validate swapped collections',function(){
            let dom = document.createElement('div');
            let items = [
                {key:'one',label:'one',value:'one'},
                {key:'two',label:'two',value:'two'},
                {key:'three',label:'three',value:'three'},
            ];
            function update(){
                render(html`
                ${htmlMap(items,i => i.key, (item,index) => html`
                    <li>${item.label}</li>
                `)}
            `,dom);
            }
            update();
            let tags = dom.getElementsByTagName('li');
            items.forEach((item,index) => {
                expect(item).to.satisfy(function (item) {
                    return tags[index].innerText == item.label;
                });
            });
            let t = items[1];
            items[1] = items[0];
            items[0] = t;
            update();
            tags = dom.getElementsByTagName('li');
            items.forEach((item,index) => {
                expect(item).to.satisfy(function (item) {
                    return tags[index].innerText == item.label;
                });
            });
        });

        it('should validate swapped content inside',function(){
            let dom = document.createElement('div');
            let items = [
                {key:'one',label:'one',value:'one',hasInputField:false},
                {key:'two',label:'two',value:'two',hasInputField:true},
                {key:'three',label:'three',value:'three',hasInputField:false},
            ];
            function update(){
                render(html`
                ${htmlMap(items,i => i.key, (item,index) => html`
                    <li>${item.label}${item.hasInputField ? html`<input type='text'>` : ''}</li>
                `)}
            `,dom);
            }
            update();
            let tags = dom.getElementsByTagName('li');
            expect(tags[0]).to.satisfy(function (tag) {
                return tag.getElementsByTagName('input').length == 0;
            });
            expect(tags[1]).to.satisfy(function (tag) {
                return tag.getElementsByTagName('input').length == 1;
            });
            let t = items[1];
            items[1] = items[0];
            items[0] = t;
            update();
            tags = dom.getElementsByTagName('li');
            expect(tags[0]).to.satisfy(function (tag) {
                return tag.getElementsByTagName('input').length == 1;
            });
            expect(tags[1]).to.satisfy(function (tag) {
                return tag.getElementsByTagName('input').length == 0;
            });
        });

        it('should validate swapped content inside and removed',function(){
            let dom = document.createElement('div');
            let items = [
                {key:'one',label:'one',value:'one',hasInputField:false},
                {key:'two',label:'two',value:'two',hasInputField:true},
                {key:'three',label:'three',value:'three',hasInputField:false},
            ];
            function update(){
                render(html`${htmlMap(items,i => i.key, (item,index) => {return item.hasInputField ? html`<li>${item.hasInputField ? html`<input type='text'>` : ''}</li>`:  html`Hello Yalla!`;})}`,dom);
            }
            update();
            expect(dom.innerHTML).to.satisfy(function (innerHtml) {
                return innerHtml == `Hello Yalla!<li><input type="text">${SEPARATOR}</li>Hello Yalla!${SEPARATOR}`;
            });
            let t = items[1];
            items[1] = items[0];
            items[0] = t;
            update();
            expect(dom.innerHTML).to.satisfy(function (innerHtml) {
                return innerHtml == `<li><input type="text">${SEPARATOR}</li>Hello Yalla!Hello Yalla!${SEPARATOR}`;
            });
        });

        it('should validate swapped content inside and replace with string',function(){
            let dom = document.createElement('div');
            let items = [
                {key:'one',label:'one',value:'one',hasInputField:false},
                {key:'two',label:'two',value:'two',hasInputField:true},
                {key:'three',label:'three',value:'three',hasInputField:false},
            ];
            function update(){
                render(html`${htmlMap(items,i => i.key, (item,index) => {return item.hasInputField ? html`<li>${item.hasInputField ? html`<input type='text'>` : ''}</li>`:  `Hello Yalla!`;})}`,dom);
            }
            update();
            expect(dom.innerHTML).to.satisfy(function (innerHtml) {
                return innerHtml == `Hello Yalla!<li><input type="text">${SEPARATOR}</li>Hello Yalla!${SEPARATOR}`;
            });
            let t = items[1];
            items[1] = items[0];
            items[0] = t;
            update();
            expect(dom.innerHTML).to.satisfy(function (innerHtml) {
                return innerHtml == `<li><input type="text">${SEPARATOR}</li>Hello Yalla!Hello Yalla!${SEPARATOR}`;
            });
        });

        it('Should not throw exception',function () {
            render(null,null);
        });


        //HEY WE HAVE BUGS HERE !!
        it('Should render array',function () {
            let dom = document.createElement('dom');
            let items = [{label:'one'},{label:'two'},{label:'three'}];
            //render(html`${items.map(i => `${i.label}`)}`,dom);
            render(html`${htmlMap(items,'label',i => html`${i.label}`) }`,dom);
            expect(dom.innerHTML).to.satisfy(function (innerHtml) {
                return innerHtml == `one${SEPARATOR}two${SEPARATOR}three${SEPARATOR}${SEPARATOR}`;
            });


            items = [{label:'four'},{label:'five'},{label:'six'}];
            //render(html`${items.map(i => `${i.label}`)}`,dom);
            render(html`${htmlMap(items,'label',i =>html`${i.label}`) }`,dom);
            expect(dom.innerHTML).to.satisfy(function (innerHtml) {
                return innerHtml == `four${SEPARATOR}five${SEPARATOR}six${SEPARATOR}${SEPARATOR}`;
            });
        });

        // i think we have bug here !!
        it('Should render array two',function () {
            let dom = document.createElement('dom');
            let items = [{label:'one'},{label:'two'},{label:'three'}];
            //render(html`${items.map(i => `${i.label}`)}`,dom);
            render(html`${htmlMap(items,'label',i => html`${i.label}`) }`,dom);
            expect(dom.innerHTML).to.satisfy(function (innerHtml) {
                return innerHtml == `one${SEPARATOR}two${SEPARATOR}three${SEPARATOR}${SEPARATOR}`;
            });


            items = [{label:'three'},{label:'two'},{label:'one'}];
            //render(html`${items.map(i => `${i.label}`)}`,dom);
            render(html`${htmlMap(items,'label',i =>html`${i.label}`) }`,dom);
            console.log(dom.innerHTML);
            // expect(dom.innerHTML).to.satisfy(function (innerHtml) {
            //     return innerHtml == `four${SEPARATOR}five${SEPARATOR}six${SEPARATOR}${SEPARATOR}`;
            // });
        });



    });
});