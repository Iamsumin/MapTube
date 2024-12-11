# MapTube 🗺️

**MapTube** is a web application that combines interactive maps with YouTube videos, allowing users to explore different locations and find videos related to selected topics (e.g., food, shopping, tourism).

## Demo
[Watch the MapTube demo on YouTube](https://youtu.be/gt2NM__Z4mA?si=cEIj69W3AygAR7IQ)

## Features

- **Interactive Map**: Explore locations using a map powered by OpenStreetMap and Leaflet.js.
- **Topic Selection**: Choose topics such as "Food," "Tourism," or "Shopping" to discover relevant videos.
- **Search Bar**: Search for a location using a search bar and navigate the map to the desired area.
- **Location-Specific Videos**: Get curated YouTube video recommendations for the selected location and topic.
- **Marker Support**: View and interact with markers on the map for clicked locations.

## Files Overview

- **`index.html`**: Main HTML file containing the structure of the application.
- **`app.js`**: JavaScript file with core logic for map rendering, API interactions, and user interactions.
- **`README.md`**: Documentation for understanding and using the project.

## Getting Started

### Prerequisites

1. A modern web browser (Chrome, Firefox, Edge, etc.).
2. A valid YouTube API key. Obtain one from the [Google Cloud Console](https://console.cloud.google.com/).

### How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/MapTube.git
   ```

2. Navigate to the project folder:
   ```bash
   cd MapTube
   ```

3. Open `index.html` in a web browser:
   - You can use a simple HTTP server, such as [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code.

4. Add your YouTube API key:
   - Open `app.js`.
   - Replace `YOUR_YOUTUBE_API_KEY` with your actual API key.

### Project Structure

```
MapTube/
├── index.html          # Main HTML file
├── app.js              # Core JavaScript logic
├── README.md           # Project documentation
```

## Usage

1. Open the application in your browser.
2. Select a topic (e.g., Food, Tourism, Shopping).
3. Click on a location on the map to view related YouTube videos.
4. Use the search bar to jump to a specific location.

## Technologies Used

- **OpenStreetMap**: For map rendering and location data.
- **Leaflet.js**: For interactive map functionality.
- **YouTube Data API**: To fetch videos based on location and topics.
- **HTML5, CSS3, JavaScript**: Core web technologies.

## Contribution

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [OpenStreetMap](https://www.openstreetmap.org/)
- [Leaflet.js](https://leafletjs.com/)
- [YouTube Data API](https://developers.google.com/youtube/v3)

