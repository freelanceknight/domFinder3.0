function findDomElement({ notifications}) {
    console.log(window.location.href);
    //window.location.reload(true);
    let currentUrl = window.location.href;
    if(currentUrl === "https://urlsegment"){
        let nodeElements = document.querySelectorAll('td span');
        //let nodeElements2 = document.querySelectorAll('td:nth-of-type(4)');
        //console.log(nodeElements);
        nodeElements.forEach(element => {
            if(performance.navigation.type === performance.navigation.TYPE_RELOAD){
                element.children[0].setAttribute('style', 'background: none;');
                element.setAttribute('title', "");
            }
            let parent = element.parentNode;
            //console.log(parent);
            let grandParent = parent.parentNode;
            //console.log(grandParent);
            let amountChildren = grandParent.children.item(3);
            //console.log(amountChildren);
            let amount = amountChildren.textContent.trim();
            let amount2 = amount.replace(/\s/g, "");
            //console.log(amount2);
            const transactionId = element.childNodes[1].textContent.replace(': ', '');
            //console.log(transactionId);
            const mobile = element.childNodes[4].textContent?.replace(': ', '');
            //console.log(typeof mobile);
            //console.log("<br>");
            notifications.forEach(item => {
                
                if (item.transaction_id === transactionId) {
                    
                    if(parseFloat(item.amount) === parseFloat(amount2)){
                        //console.log(item.amount);
                        if(item.sender.trim().replace(/\s/g, "") === mobile.trim().replace(/\s/g, "")){
                            element.children[0].setAttribute('style', 'background: #90EE90;');
                        }else {
                            element.children[0].setAttribute('style', 'background: yellow;');
                        }
                    }else {
                        element.children[0].setAttribute('style', 'background: red;');
                    }
                    
                    element.setAttribute('title', item.android_text);
                }
            });

        });
    }else {

        const nodeElements = document.querySelectorAll('td:nth-of-type(3)');
        //console.log(nodeElements);
        nodeElements.forEach(element => {
            let amountTd = element.previousElementSibling;
            let amount = amountTd.textContent.trim();
            let amount2 = amount.replace(/\s/g, "");
            //console.log(parseFloat(amount2));
            if(performance.navigation.type === performance.navigation.TYPE_RELOAD){
                element.setAttribute('style', 'background: none;');
                element.setAttribute('title', "");
            }
            //console.log(element.textContent);
            let text = element.textContent;
            let arr = text.split(" ");
            console.log(arr);
            //const transactionId = element?.childNodes[1]?.textContent?.replace(': ', '');
            const transactionId = arr[1];
            let mobile = arr[13];
            if(mobile === undefined){
                mobile = arr[11];
            }
            console.log(mobile);
            //console.log(transactionId);
            if (transactionId !== null) {
                notifications.forEach(item => {
                    console.log(item.sender);
                    if (transactionId === item.transaction_id) {
                        if(parseFloat(item.amount) === parseFloat(amount2)){
                            //console.log(typeof item.sender);
                            //if(mobile){
                                if(item.sender.trim().replace(/\s/g, "") === mobile.trim().replace(/\s/g, "")){
                                    element.setAttribute('style', 'background: #90EE90;');
                                }else {
                                    element.setAttribute('style', 'background: yellow;');
                                }
                            //}
                        }else {
                            element.setAttribute('style', 'background: red;');
                        }
                        element.setAttribute('title', item.android_text);
                    }

                });
            }
        });
    }



}

const observeDOM = (function(){
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function( obj, callback ){
        if( !obj || obj.nodeType !== 1 ) return;

        if( MutationObserver ){
            // define a new observer
            const mutationObserver = new MutationObserver(callback)
            // have the observer observe foo for changes in children
            mutationObserver.observe( obj, { childList:true, subtree:true })
            //mutationObserver.observe( obj, { childList:true })

            //console.log("REFRESHED");
            return mutationObserver;
        }
        // browser support fallback
        else if( window.addEventListener ){
            obj.addEventListener('DOMNodeInserted', callback, false)
            obj.addEventListener('DOMNodeRemoved', callback, false)
        }

    }

})()

// const listElm = document.getElementById("mainpanel");
const listElm = document.querySelector(".mainpanel");

// Observe a specific DOM element:
observeDOM(listElm, function(m){
    
    fetch('http://fetchurl')
        .then((response) => response.json())
        .then((json) => {
            findDomElement(json);
        });


});