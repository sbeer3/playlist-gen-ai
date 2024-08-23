import React, { useState } from 'react';
import './App.css';
import Modal from './Modal'; // Import the Modal component

function App() {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [showSideBox, setShowSideBox] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleGeneratePlaylist = () => {
    if (selectedFile) {
      window.fetchImageAnalysis(selectedFile).then((analysisResult) => {
        const wordsArray = analysisResult
          .split('-')
          .map(word => word.trim())
          .filter(Boolean); // Filter out empty strings
  
        setBubbles(wordsArray.map(word => ({ text: word, selected: false })));
        setShowModal(true); // Show modal after generating words
      });
    } else {
      console.error("No image selected");
    }
  };
  const handleWordSelect = (wordText) => {
    const updatedBubbles = bubbles.map(word =>
      word.text === wordText ? { ...word, selected: !word.selected } : word
    );
    setBubbles(updatedBubbles);
    const selected = updatedBubbles.filter(word => word.selected).map(word => word.text);
    setSelectedWords(selected);
  };

  const handleCloseModal = async () => {
    setShowModal(false);

    const result = await window.generatePlaylistFromWords(selectedWords);

    if (result && Array.isArray(result.songs) && Array.isArray(result.artists) && result.songs.length === result.artists.length) {
        const generatedPlaylist = result.songs.map((title, index) => ({
            title: title,
            artist: result.artists[index],
        }));
        setPlaylist(generatedPlaylist);
        setShowSideBox(true);  // Show the side box
    } else {
        console.error("Invalid playlist structure:", result);
        setPlaylist([]);  // Set to an empty array to avoid further errors
    }
};

const handleCloseSideBox = () => {
    setShowSideBox(false);
};


function PlaylistSideBox({ songs, onClose }) {
  return (
      <div className={`playlist-sidebox ${songs.length > 0 ? 'visible' : ''}`}>
          <button className="close-button" onClick={onClose}>X</button>
          <h2>Your Playlist</h2>
          <ul className="playlist">
              {songs.map((song, index) => (
                  <li key={index} className="playlist-item">
                      <span className="song-title">{song.title}</span> - <span className="song-artist">{song.artist}</span>
                  </li>
              ))}
          </ul>
      </div>
  );
}
  return (
    <div className="App">
      <div className="container">
        <header className="header">AI Playlist Generator</header>
  
        <div className="image-uploader">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && <img src={image} alt="Uploaded" />}
        </div>
  
        <button className="button" onClick={handleGeneratePlaylist}>
          Generate Playlist
        </button>
  
        {/* Modal Component */}
        <Modal
          show={showModal}
          words={bubbles}
          onClose={handleCloseModal}
          onWordSelect={handleWordSelect}
        />
  
        <PlaylistSideBox songs={playlist} onClose={handleCloseSideBox} />
      </div>
    </div>
  );
}

export default App;
