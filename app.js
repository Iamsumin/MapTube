// 지도 초기화
const map = L.map("map").setView([37.5665, 126.978], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  minZoom: 3,
  maxZoom: 19,
}).addTo(map);

// 전역 변수
let selectedTopic = "";
const markerGroup = L.layerGroup().addTo(map);

// 주제 버튼 클릭 이벤트
document.querySelectorAll("button[data-topic]").forEach((button) => {
  button.addEventListener("click", (e) => {
    selectedTopic = e.target.getAttribute("data-topic");
    markerGroup.clearLayers(); // 기존 마커 제거
    alert(`주제 \"${selectedTopic}\" 선택됨. 지도에서 지역을 클릭하세요.`);
  });
});

// Reverse Geocoding으로 지역 이름 가져오기
async function getLocationName(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const response = await fetch(url);
  const data = await response.json();

  const state = data.address?.state || ""; // 상위 지역 (광역시/특별시)
  const county = data.address?.county || data.address?.city_district || ""; // 중간 지역 (구/군/동)
  const road = data.address?.road || data.address?.neighbourhood || ""; // 하위 지역 (도로명/건물명)

  console.log("Nominatim API 응답 데이터:", data);
  console.log("상위 지역:", state);
  console.log("중간 지역:", county);
  console.log("하위 지역:", road);

  return { state, county, road };
}

// YouTube API로 해시태그 검색
async function fetchVideosByHashtag(hashtag, topic) {
  const apiKey = "YOUR_YOUTUBE_API_KEY";
  const query = `${hashtag} ${topic}`.trim();

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&type=video&order=viewCount&maxResults=5&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      alert(`\"${query}\"에 대한 관련 동영상을 찾을 수 없습니다.`);
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
  const locationInfo = await getLocationName(lat, lng); // { state, county, road }
  console.log("선택한 위치 정보:", locationInfo);

  const { state, county, road } = locationInfo; // 상위, 중간, 하위 지역

  // 기존 마커 제거 (새로운 클릭 시 이전 마커 삭제)
  markerGroup.clearLayers();

  // 새로운 마커 추가
  const marker = L.marker([lat, lng])
    .addTo(markerGroup)
    .bindPopup(`${state}, ${county}, ${road}`);
  marker.openPopup();

  // UI 요소 가져오기
  const locationUI = document.getElementById("location-selection");
  const locationText = document.getElementById("location-text");

  // UI에 지역 정보 표시
  locationText.innerHTML = `
    <strong>상위 지역:</strong> ${state || "정보 없음"} <br>
    <strong>중간 지역:</strong> ${county || "정보 없음"} <br>
    <strong>하위 지역:</strong> ${road || "정보 없음"}
  `;

  // UI 표시 및 위치 조정
  locationUI.style.display = "block";
  locationUI.style.top = `${e.containerPoint.y}px`;
  locationUI.style.left = `${e.containerPoint.x}px`;

  // "상위 지역" 버튼 클릭 시
  document.getElementById("select-city").onclick = async () => {
    locationUI.style.display = "none"; // UI 숨기기
    const videos = await fetchVideosByHashtag(`#${state}`, selectedTopic);
    displayVideos(videos, `${state} ${selectedTopic}`);
  };

  // "중간 지역" 버튼 클릭 시
  document.getElementById("select-county").onclick = async () => {
    locationUI.style.display = "none"; // UI 숨기기
    const videos = await fetchVideosByHashtag(`#${county}`, selectedTopic);
    displayVideos(videos, `${county} ${selectedTopic}`);
  };

  // "하위 지역" 버튼 클릭 시
  document.getElementById("select-road").onclick = async () => {
    locationUI.style.display = "none"; // UI 숨기기
    const videos = await fetchVideosByHashtag(`#${road}`, selectedTopic);
    displayVideos(videos, `${road} ${selectedTopic}`);
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
