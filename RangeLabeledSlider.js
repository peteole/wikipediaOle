/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @param {number} initialValue 
 * @param {(value:number)=>string} valueToLabel
 * @param {(value:number)=>void} onchange
 */
function createRangeLabeledSlider(min,max,initialValue,valueToLabel=value=>"value="+value,onchange=(val)=>{}){
    const id=Math.random().toString();
    const cont=document.createElement("div");
    const label=document.createElement("label");
    label.setAttribute("for",id)
    label.style.position="absolute";
    label.style.bottom="3%";
    label.style.fontSize="100%";
    label.style.width="100%";
    label.style.textAlign="center";
    label.style.height="20%";
    label.style.overflowY="auto";
    const slider=document.createElement("input");
    slider.id=id;
    slider.type="range";
    slider.min=min;
    slider.max=max;
    slider.value=initialValue;
    slider.style.position="absolute";
    slider.style.width="100%";
    slider.style.height="75%";
    slider.onchange=function(ev){
        const val=parseFloat(ev.target.value);
        onchange(val);
        this.labels[0].innerHTML=valueToLabel(val);
    }.bind(slider);
    const lowerLimitMarker=document.createElement("p");
    lowerLimitMarker.style.position="absolute";
    lowerLimitMarker.style.fontSize="100%";
    lowerLimitMarker.style.bottom="3%";
    lowerLimitMarker.style.left="3%"
    lowerLimitMarker.style.height="20%";
    lowerLimitMarker.innerHTML=min;
    const upperLimitMarker=document.createElement("p");
    upperLimitMarker.style.position="absolute";
    upperLimitMarker.style.fontSize="100%";
    upperLimitMarker.style.bottom="3%";
    upperLimitMarker.style.right="3%"
    upperLimitMarker.innerHTML=max;
    cont.appendChild(slider);
    cont.appendChild(label);
    cont.appendChild(lowerLimitMarker);
    cont.appendChild(upperLimitMarker);
    label.innerHTML=valueToLabel(initialValue);
    onchange(initialValue);
    cont.getValue=function(){
        return parseFloat(slider.value)
    }
    return cont;
}