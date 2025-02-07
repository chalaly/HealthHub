'use strict';
let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.38206851627498, 126.66198631031601), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };

let map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

let linePath = [
    new kakao.maps.LatLng(37.38200005354517, 126.65698463147523),
    new kakao.maps.LatLng(37.38398801835701, 126.65896287347074),
    new kakao.maps.LatLng(37.3825735649393, 126.66215341215525)
];

// 지도에 표시할 선을 생성합니다
let polyline = new kakao.maps.Polyline({
    path: linePath, // 선을 구성하는 좌표배열 입니다
    strokeWeight: 5, // 선의 두께 입니다
    strokeColor: '#ff9000', // 선의 색깔입니다
    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
});

// 지도에 선을 표시합니다 
polyline.setMap(map);
// 마커를 표시할 위치입니다 
let position = new kakao.maps.LatLng(37.3820504961064, 126.66198639119948);

// 마커를 생성합니다
let marker = new kakao.maps.Marker({
    position:
        map.getCenter(),
    position,
    clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
});
// 아래 코드는 위의 마커를 생성하는 코드에서 clickable: true 와 같이
// 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
// marker.setClickable(true);

// 지도에 마커를 표시합니다
marker.setMap(map);

// 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
let iwContent = '<div style="padding:5px;">테크노파크역 2번출구에서 좌로 200미터 우로 200미터&nbsp&nbsp&nbsp&nbsp&nbsp</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

// 인포윈도우를 생성합니다
let infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable
});

// 마커에 클릭이벤트를 등록합니다
kakao.maps.event.addListener(marker, 'click', function () {
    // 마커 위에 인포윈도우를 표시합니다
    infowindow.open(map, marker);
});

