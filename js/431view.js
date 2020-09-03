(function(){

    window.onload = function(){
        const btn = document.querySelector("button.ui-btn");
    
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
    };

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