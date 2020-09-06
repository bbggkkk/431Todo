(function(){

    window.onload = function(){
        window.strg  = [];
        const btn = document.querySelector("button.ui-btn.gen");
    
        btn.addEventListener("click",function(e){
            const hexEle    = document.querySelector(".color");
            const stepEle   = document.querySelector(".step");
            const ele       = [hexEle,stepEle];
            const errEle    = inputErrCheck(ele);

            if(errEle.length){
                console.error(errEle,"is Empty");
            }else{
                drawList(document.querySelector("[data-431-comp='list']"),colorStepGenerator(hexEle.value,stepEle.value));
            }
    
        });

        const btn2 = document.querySelector("button.ui-btn.saying");
    
        btn2.addEventListener("click",function(e){
            const say        = document.querySelector(".sayInput");
            const ele        = document.querySelector("[data-431-comp='list']");
            const gStrg      = window.strg;

            const data       = {
                say     : say.value,
                ele     : ele,
                gStrg   : gStrg
            }
            
            subject.update("saveData",data);
    
        });

        






        let Subject = function(){
            let observers = [];

            return {
                subscribe : function(observer){
                    observers.push(observer);
                },
                unsubscribe : function(observer){
                    let idx = observers.indexOf(observer);
                    if(idx != -1){
                        observers.splice(idx,1);
                    }else{
                        console.error("no observer",observers,observer);
                    }
                },
                updateOne : function(observer,serviceName,data){
                    observer[serviceName].call(observer,data);
                },
                update : function(serviceName,data){
                    for(let i in observers){
                        observers[i][serviceName].call(observers[i],data);
                    }
                }
            }
        }
        //Subject 선언

        let Observer = function(){
            return {
                log : function(data){
                    console.log(this,data);
                },
                alert : function(data){
                    alert(data);
                },
                prompt : function(data){
                    prompt(data);
                }
                ,saveData : function(data){
                    let gStrg = {}
                    gStrg.listData = window.strg ? window.strg : [];
                    gStrg.listData.push({say:data.say});
                    if(!data.ele) return;
                    this.drawList({
                        ele:data.ele,
                        say:gStrg.listData
                    });
                }
                ,drawList : function(data){
                    const $listEle = data.ele;
                    const $listData = data.say;
                    $listEle.row = $listEle.querySelectorAll("[data-431-comp='list-row']")[0];
                    $listEle.innerHTML = "";
                    for(let i in $listData){
                        let row = $listEle.row.cloneNode(true);
                        row.innerHTML = $listData[i].say;
                        row.setAttribute("style","background:"+$listData[i]+";");
                        $listEle.append(row);
                    }
                }
            }
        }

        let subject = new Subject();
        let sub = new Observer();
        subject.subscribe(sub);
        

    };//onload

})();


function colorStepGenerator ($hex,$step){
    $hsl = hexToHsl($hex);
    $hsl = hslReplacer($hsl);
    let h = $hsl[0];
    let s = $hsl[1];
    let v = $hsl[2];
    let step = $step ? 100/Number($step) : 10;

    let hslArr = [];

    for(let i=0; i<=100; i+=step){
        hslArr.push(hslToHex("hsl("+h+","+s+","+i/100+")"));
    }
    return hslArr;
}

function hexToHsl ($hex){
    $hex    = $hex.replace(/[#G-Zg-z]/g,"");
    let r   = parseInt($hex.slice(0,2),16)/255;
    let g   = parseInt($hex.slice(2,4),16)/255;
    let b   = parseInt($hex.slice(4,6),16)/255;

    let max = Math.max(r,g,b);
    let min = Math.min(r,g,b);
    let delta = max-min;

    let h = 0;
    let s = 0;
    let l = (max+min)/2;
    if(delta != 0){
        let $h;
        switch (max){
            case r :
                $h = ((g-b)/delta)%6;
                break;
            case g :
                $h = (b-r)/delta + 2;
                break;
            case b :
                $h = (r-g)/delta + 4;
                break;
        }
        $h*=60;
        if($h <= 0) $h += 360;
        h = $h;
        s = delta == 0 ? 0 : delta/((1-Math.abs(l*2-1)));
    }
    let hsl = "hsl("+h+","+s+","+l+")";
    return hsl;
}

function hslToHex ($hsl){
    $hsl = hslReplacer($hsl);
    let h = $hsl[0];
    let s = $hsl[1];
    let l = $hsl[2];

    let c = (1-Math.abs(2*l-1))*s;
    let x = c*(1-(Math.abs((h/60)%2-1)));
    let m = l-c/2;

    let r;
    let g;
    let b;

    switch (Math.floor(h/60)){
        case 0 :
            r = c; g = x; b = 0;
            break;
        case 1 :
            r = x; g = c; b = 0;
            break;
        case 2 :
            r = 0; g = c; b = x;
            break;
        case 3 :
            r = 0; g = x; b = c;
            break;
        case 4 :
            r = x; g = 0; b = c;
            break;
        case 5 :
            r = c; g = 0; b = x;
            break;
        case 6 :
            r = c; g = x; b = 0;
            break;
    }
    r = Math.round((r+m)*255);
    g = Math.round((g+m)*255);
    b = Math.round((b+m)*255);
    r = r<16 ? "0"+r.toString(16) : r.toString(16);
    g = g<16 ? "0"+g.toString(16) : g.toString(16);
    b = b<16 ? "0"+b.toString(16) : b.toString(16);

    
    return "#"+r+g+b;
}

function hslReplacer($hsl){
    return $hsl.replace("hsl(","").replace(")","").split(",");
}

function inputErrCheck($ele){
    let err = "err";
    let errEle = [];
    for(let i in $ele){
        if(inputBlankCheck($ele[i])){
            errEle.push($ele[i]);
            addClass($ele[i],err);
            errEle[0].focus();
        }
        else{
            removeClass($ele[i],err);
        }
    }
    return errEle;
}
function inputBlankCheck($ele){
    if(!$ele.value)         return true;
    else                    return false;
}
function addClass($ele,$class){
    $ele.classList.add($class);
    return true;
}
function removeClass($ele,$class){
    $ele.classList.remove($class);
    return true;
}

function drawList($listEle,$listData){
    $listEle.row = $listEle.querySelectorAll("[data-431-comp='list-row']")[0];
    $listEle.innerHTML = "";
    for(let i in $listData){
        let row = $listEle.row.cloneNode(true);
        row.innerHTML = $listData[i];
        row.setAttribute("style","background:"+$listData[i]+";");
        $listEle.append(row);
    }
}