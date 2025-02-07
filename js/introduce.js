'use strict';

const mapbtn = document.querySelector('.mapbtn');
console.log(mapbtn);
let pop;

mapbtn.addEventListener('click', () => {
   let locationX = (screen.width - 650) / 2;
   let locationY = (screen.height - 650) / 2; // 팝업창의 중앙 배치를 위한 수직 좌표값 측정.
   pop = open('../html/map.html', 'pop', `width=400px, height=400px, left=${locationX}px, top=${locationY}px`);
   pop.resizeTo(600, 600);
   console.log(pop);
});
