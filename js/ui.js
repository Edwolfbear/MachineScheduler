// ((elmnt) => {
//   let pos1, pos2, pos3, pos4;
//
//   elmnt.onmousedown = (event) => {
//     event = event || window.event;
//     //event.preventDefault();
//
//     pos3 = event.clientX;
//     pos4 = event.clientY;
//
//     document.onmouseup = () => {
//       document.onmouseup = null;
//       document.onmousemove = null;
//     };
//
//     document.onmousemove = (event) => {
//       event = event || window.event;
//       event.preventDefault();
//
//       pos1 = pos3 - event.clientX;
//       pos2 = pos4 - event.clientY;
//       pos3 = event.clientX;
//       pos4 = event.clientY;
//
//       elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//       elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     };
//   };
//
// })(document.getElementById("options"));
