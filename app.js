const popularLocations = {
  // 서울
  명동: { city: "서울", suburb: "명동" },
  을지로: { city: "서울", suburb: "을지로" },
  강남역: { city: "서울", suburb: "강남역" },
  홍대입구: { city: "서울", suburb: "홍대" },
  종로: { city: "서울", suburb: "종로" },
  // 부산
  해운대: { city: "부산", suburb: "해운대" },
  광안리: { city: "부산", suburb: "광안리" },
  부산역: { city: "부산", suburb: "부산역" },
  남포동: { city: "부산", suburb: "남포동" },
  // 제주
  제주시: { city: "제주", suburb: "제주시" },
  서귀포시: { city: "제주", suburb: "서귀포" },
  한라산: { city: "제주", suburb: "한라산" },
};

// 지도 초기화 (map 선언 및 초기화)
const map = L.map("map").setView([37.5665, 126.978], 10); // 서울 좌표
L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://carto.com/">CartoDB</a> contributors',
}).addTo(map);

// 전역 변수로 주제 선택 및 마커 그룹 저장
let selectedTopic = ""; // 현재 선택된 주제
const markerGroup = L.layerGroup().addTo(map); // 마커 그룹 생성 및 지도에 추가

// 주제 버튼 클릭 이벤트 처리
document.querySelectorAll("button[data-topic]").forEach((button) => {
  button.addEventListener("click", (e) => {
    selectedTopic = e.target.getAttribute("data-topic");

    // 기존 마커 제거
    markerGroup.clearLayers();

    alert(`주제 "${selectedTopic}" 선택됨. 지도에서 지역을 클릭하세요.`);
  });
});

// Reverse Geocoding으로 지역 이름 가져오기
async function getLocationName(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const response = await fetch(url);
  const data = await response.json();

  // Nominatim 데이터에서 상위/하위 지역 추출
  let city =
    data.address?.city || data.address?.town || data.address?.village || "";
  let suburb =
    data.address?.suburb ||
    data.address?.neighbourhood ||
    data.address?.road ||
    "";

  // 특정 지역 리스트와 매칭
  for (const [key, value] of Object.entries(popularLocations)) {
    if (suburb.includes(key) || city.includes(key)) {
      console.log(`예외 처리된 지역 발견: ${key}`);
      return value; // 리스트에서 매칭된 값 반환
    }
  }

  console.log("Nominatim API 응답 데이터:", data);
  return { city, suburb }; // 기본 Nominatim 데이터 반환
}

// YouTube API로 해시태그 검색 (주제 포함)
async function fetchVideosByHashtag(hashtag, topic) {
  const apiKey = "AIzaSyC55FMnirPdb5tUPg3Puh9GqjonnXuJy4w"; // API 키 입력

  // 검색 쿼리 생성
  const query = `${hashtag} ${topic}`.trim(); // 해시태그와 주제를 조합
  console.log("검색 쿼리:", query); // 검색 쿼리 로그 출력

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&type=video&order=viewCount&maxResults=5&key=${apiKey}`;
  console.log("YouTube API 요청 URL:", url); // 요청 URL 로그 출력

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("YouTube API 응답 데이터:", data); // 응답 데이터 로그 출력

    if (!data.items || data.items.length === 0) {
      alert(`"${query}"에 대한 관련 동영상을 찾을 수 없습니다.`);
    }

    return data.items || [];
  } catch (error) {
    console.error("YouTube API 요청 실패:", error);
    alert("YouTube API 요청 중 오류가 발생했습니다.");
    return [];
  }
}

// 검색 결과를 HTML에 표시
function displayVideos(videos, query) {
  const videoList = document.getElementById("video-list");
  videoList.innerHTML = `<h2>${query} 관련 동영상</h2>`;
  videos.forEach((video) => {
    const videoItem = document.createElement("div");
    videoItem.className = "video-item";

    videoItem.innerHTML = `
            <img src="${video.snippet.thumbnails.medium.url}" alt="썸네일">
            <div>
                <a href="https://www.youtube.com/watch?v=${
                  video.id.videoId
                }" target="_blank">
                    ${video.snippet.title}
                </a>
                <p>${video.snippet.description.substring(0, 100)}...</p>
            </div>
        `;
    videoList.appendChild(videoItem);
  });
}

// 지도 클릭 이벤트
map.on("click", async (e) => {
  const { lat, lng } = e.latlng;

  // 위치 정보 가져오기
  const locationInfo = await getLocationName(lat, lng); // { city: "서울", suburb: "명동" }
  console.log("선택한 위치 정보:", locationInfo);

  const city = locationInfo.city; // 상위 지역 (예: 서울)
  const suburb = locationInfo.suburb; // 하위 지역 (예: 명동)

  // 기존 마커 제거 (새로운 클릭 시 이전 마커 삭제)
  markerGroup.clearLayers();

  // 새로운 마커 추가
  const marker = L.marker([lat, lng])
    .addTo(markerGroup)
    .bindPopup(`${city}, ${suburb}`);
  marker.openPopup();

  // UI 요소 가져오기
  const locationUI = document.getElementById("location-selection");
  const locationText = document.getElementById("location-text");

  // UI에 지역 정보 표시
  locationText.innerHTML = `<strong>상위 지역:</strong> ${city} <br> <strong>하위 지역:</strong> ${suburb}`;

  // UI 표시 및 위치 조정
  locationUI.style.display = "block";
  locationUI.style.top = `${e.containerPoint.y}px`;
  locationUI.style.left = `${e.containerPoint.x}px`;

  // "상위 지역" 버튼 클릭 시
  document.getElementById("select-city").onclick = async () => {
    locationUI.style.display = "none"; // UI 숨기기
    const videos = await fetchVideosByHashtag(`#${city}`, selectedTopic);
    displayVideos(videos, `${city} ${selectedTopic}`);
  };

  // "하위 지역" 버튼 클릭 시
  document.getElementById("select-suburb").onclick = async () => {
    locationUI.style.display = "none"; // UI 숨기기
    const videos = await fetchVideosByHashtag(`#${suburb}`, selectedTopic);
    displayVideos(videos, `${suburb} ${selectedTopic}`);
  };
});

// 검색 창 기능 추가
document.getElementById("search-btn").addEventListener("click", async () => {
  const location = document.getElementById("location-search").value.trim();
  if (!location) {
    alert("지역 이름을 입력하세요.");
    return;
  }

  // Nominatim API로 검색
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    location
  )}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.length > 0) {
    const { lat, lon } = data[0];
    map.setView([lat, lon], 13); // 해당 위치로 지도 이동
    alert(`${location}으로 이동했습니다.`);
  } else {
    alert("해당 지역을 찾을 수 없습니다.");
  }
});