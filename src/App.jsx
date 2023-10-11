import { useState } from 'react'
import axios from "axios";
import './App.scss'

function App() {
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [text, setText] = useState("");
  const [realOne, setRealOne] = useState();
  const [fakeOne, setFakeOne] = useState();
  const [realTwo, setRealTwo] = useState();
  const [fakeTwo, setFakeTwo] = useState();
  var fakeAvg;

  function handleFileInputChange(event) {
    setImageFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  }

  function onTextChange (event) {
    setText(event.target.value);
    console.log(event.target.value);
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
      })
     .catch(function (error) {
       console.error(error);
     });
     console.log(text);
  }

  function zeroGPT () {
    const options = {
      method: 'POST',
      url: 'https://zerogpt.p.rapidapi.com/api/v1/detectText',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_API_KEY_AI,
        'X-RapidAPI-Host': 'zerogpt.p.rapidapi.com'
      },
      data: {
        input_text: text,
      }
    };

    axios
      .request(options)
      .then(function (response) {
        setRealOne(response.data.data.is_human_written);
        setFakeOne(response.data.data.is_gpt_generated);
        console.log(response);
      })
     .catch(function (error) {
       console.error(error);
     });
  }

  function AIConDet() {
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
        console.log(response); //fakePercentage
        setRealTwo(response.data.isHuman);
        setFakeTwo(response.data.fakePercentage);
      })
     .catch(function (error) {
       console.error(error);
     });
  }

  function avg() {
    fakeAvg = (fakeOne + fakeTwo)/2;
    return fakeAvg;
  }


  return (
    <>
      <div className="card">
        <p className="title">Upload file</p>
        <div>
          <img src={previewImage} />
          <form onSubmit={handleFormSubmit}>
            <input type="file" onChange={handleFileInputChange}/>
            <input type="submit" value="Extract Text" />
          </form>
          <p className="text">{text}</p>
          <textarea className="textarea"
            defaultValue={text}
            onInput={onTextChange}
          />
        </div>
        <button onClick={() => {
          //zeroGPT ();
          AIConDet();
          //avg();
        }}>
          check for AI
        </button>
        <p>real: {100 - fakeTwo}</p>
        <p>fake: {fakeTwo}</p>
      </div>
    </>
  )
}

export default App
