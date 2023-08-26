import { useState } from 'react'
import axios from "axios";
import './App.scss'

function App() {
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [text, setText] = useState("");
  const [real, setReal] = useState();
  const [fake, setFake] = useState();

  function handleFileInputChange(event) {
    setImageFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const form = new FormData();
    form.append("Session", "string");
    form.append("srcImg", imageFile);
    const options = {
      method: "POST",
      url: "https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/",
      headers: {
        "content-type": "multipart/form-data",
        "x-rapidapi-host": "pen-to-print-handwriting-ocr.p.rapidapi.com",
        "x-rapidapi-key": import.meta.env.VITE_API_KEY_PEN,
      },
      data: form,
    };
    axios
      .request(options)
      .then(function (response) {
        setText(response.data.value);
        console.log(response);
      })
     .catch(function (error) {
       console.error(error);
     });
     console.log(text);
  }

  function checkForAI () {
    const options = {
      method: 'POST',
      url: 'https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/',
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': '9133386cf9msh24b0ee9eea003c6p12addejsn8086f047f132',
        'X-RapidAPI-Host': 'ai-content-detector-ai-gpt.p.rapidapi.com'
      },
      data: {
        text: text,
      }
    };

    axios
      .request(options)
      .then(function (response) {
        setReal(response.data.isHuman);
        setFake(response.data.fakePercentage)
        console.log(response);
      })
     .catch(function (error) {
       console.error(error);
     });
  }


  return (
    <>
      <div className="card">
        <p classname="title">Upload file</p>
        <div>
          <img src={previewImage} />
          <form onSubmit={handleFormSubmit}>
            <input type="file" onChange={handleFileInputChange}/>
            <input type="submit" value="Extract Text" />
          </form>
          <p className="text">{text}</p>
        </div>
        <button onClick={checkForAI}>
          check for AI
        </button>
        <p>real: {real}</p>
        <p>fake: {fake}</p>
      </div>
    </>
  )
}

export default App
