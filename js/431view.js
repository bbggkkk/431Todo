
function colorStepGenerator ($hex,$step){
    $hsv = hexToHsv($hex);
    $hsv = hsvReplacer($hsv);
    let h = $hsv[0];
    let s = $hsv[1];
    let v = $hsv[2];
    let step = $step ? Number($step) : 10;

    let hsvArr = [];

    for(let i=0; i<=100; i+=step){
        hsvArr.push(hsvToHex("hsv("+h+","+s+","+i/100+")"));
    }
    console.log(hsvArr);
    return hsvArr;
}

function hexToHsv ($hex){
    $hex    = $hex.replace(/[#G-Zg-z]/g,"");
    let r   = parseInt($hex.slice(0,2),16)/255;
    let g   = parseInt($hex.slice(2,4),16)/255;
    let b   = parseInt($hex.slice(4,6),16)/255;

    let max = Math.max(r,g,b);
    let min = Math.min(r,g,b);
    let delta = max-min;

    let h = 0
    if(delta != 0){
        let $h;
        switch (max){
            case r :
                $h = (g-b)/delta;
                break;
            case g :
                $h = (b-r)/delta + 2;
                break;
            case b :
                $h = (r-g)/delta + 4;
                break;
        }
        $h*=60;
        if($h < 0) $h += 360;
        h = $h;
    }
    let s = max == 0 ? 0 : delta/max;
    let v = max;
    let hsv = "hsv("+h+","+s+","+v+")";

    return hsv;
}

function hsvToHex ($hsv){
    $hsv = hsvReplacer($hsv);
    let h = $hsv[0];
    let s = $hsv[1];
    let v = $hsv[2];

    let c = s*v;
    let x = (1-(Math.abs((h/60)%2-1)))*c;
    let m = v-c;

    let r;
    let g;
    let b;

    switch (true){
        case (0<=h && h<60) :
            r = c;
            g = x;
            b = 0;
            break;
        case (60<=h && h<120) :
            r = x;
            g = c;
            b = 0;
            break;
        case (120<=h && h<180) :
            r = 0;
            g = c;
            b = x;
            break;
        case (180<=h && h<240) :
            r = 0;
            g = x;
            b = c;
            break;
        case (240<=h && h<300) :
            r = x;
            g = 0;
            b = c;
            break;
        case (300<=h && h<360) :
            r = c;
            g = 0;
            b = x;
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

function hsvReplacer($hsv){
    return $hsv.replace("hsv(","").replace(")","").split(",");
}