function setfocus() {
 document.kimsancalcform.x.focus();
}
function calc() {
 x = document.kimsancalcform.x.value;
 y = convert(x);
  y = roundresult(y);
  document.kimsancalcform.y.value = y;
}
function calctest() {
 x = document.kimsancalcform.x.value;
 y = convert(x);
  //y = roundresult(y);
  y = roundresult1(y);
  document.kimsancalcform.y.value = y;
}
function calc3() {
 x1 = document.kimsancalcform.x1.value;
 x2 = document.kimsancalcform.x2.value;
 y  = convert(x1,x2);
  y  = roundresult(y);
  document.kimsancalcform.y.value = y;
}
function calc4() {
 x1 = document.kimsancalcform.x1.value;
 x2 = document.kimsancalcform.x2.value;
 x3 = document.kimsancalcform.x3.value;
 y  = convert(x1,x2,x3);
  y  = roundresult(y);
  //yy = y.toString();
  //if( yy.length>12 ) {
  // y = parseFloat(y);
  // y = y.toPrecision(10);
  //}
  document.kimsancalcform.y.value = y;
}
function calc5() {
 x = document.kimsancalcform.x.value;
 y  = convert1(x);
  y  = roundresult(y);
  document.kimsancalcform.y1.value = y;
 y  = convert2(x);
  y  = roundresult(y);
  document.kimsancalcform.y2.value = y;
}
function calcbase(b1,b2) {
 x = document.kimsancalcform.x.value;
  document.kimsancalcform.y.value = convertbase(x,b1,b2);
}
function calcbase2() {
 x = document.kimsancalcform.x.value;
 y = convert(x);
  document.kimsancalcform.y.value = y;
}

function roundresult(x) {
  y = parseFloat(x);
  y = roundnum(y,10);
  return y;
}
function roundnum(x,p) {
 var i;
  var n=parseFloat(x);
 var m=n.toPrecision(p+1);
 var y=String(m);
 i=y.indexOf('e');
 if( i==-1 ) i=y.length;
 j=y.indexOf('.');
 if( i>j && j!=-1 ) 
 {
  while(i>0)
  {
   if(y.charAt(--i)=='0')
    y = removeAt(y,i);
   else
    break;
  }
  if(y.charAt(i)=='.')
   y = removeAt(y,i);
 }
 return y;
}
function removeAt(s,i) {
 s = s.substring(0,i)+s.substring(i+1,s.length);
 return s;
}
