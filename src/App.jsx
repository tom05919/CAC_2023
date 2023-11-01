import { useState, useEffect } from 'react';
import axios from "axios";
import './App.scss';

function App() {
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [text, setText] = useState("");
  const [fakeTwo, setFakeTwo] = useState(0);
  const [textareaValue, setTextareaValue] = useState();
  const [AISentence, setAISentence] = useState([]);
 

  //detects change in text, and thus updating textareaValue
  useEffect(() => {
    const temp = text.replace('\n', ' ');
    setText(temp);
    const newValue = text;
    setTextareaValue(newValue);
  }, [text]);

  //makes an image preview of what the user uploaded
  function handleFileInputChange(event) {
    setImageFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  }

  //changes the textareaValue when the user changes the stuff in textarea
  function onTextChange (event) {
    setTextareaValue(event.target.value);
  }

  function makeNewText() {
    let newString = "";
    let lastIndex = 0;
    for (let i = 0; i < AISentence.length; i++) {
      let index = textareaValue.indexOf(AISentence[i]);
      if (i == 0) {
        newString = newString.concat(textareaValue.substring(0, index));
        newString = newString.concat("<span style='color:red;'>" + AISentence[i] + "</span>"); 
      } else {
        newString = newString.concat(textareaValue.substring(lastIndex, index));
        newString = newString.concat("<span style='color:red;'>" + AISentence[i] + "</span>");
      }
      lastIndex = index + AISentence[i].length;
    }
    document.getElementById('result').innerHTML = "" + newString
  }

  //calls the hnadwriting to text api
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

  //calls the AI content detection api
  function AIConDet() {
    const options = {
      method: 'POST',
      url: 'https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/',
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_API_KEY_AI,
        'X-RapidAPI-Host': 'ai-content-detector-ai-gpt.p.rapidapi.com'
      },
      data: {
        text: textareaValue,
      }
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response); //fakePercentage
        setFakeTwo(response.data.fakePercentage);
        console.log(response.data.aiSentences);
        setAISentence(response.data.aiSentences);

      })
     .catch(function (error) {
       console.error(error);
     });
  }

  useEffect(() => {
    makeNewText();
  }, [AISentence]);

  return (
    <div className="root">
      <div className="card">
        <p className="title">Upload file</p>
        <div className="textareaContainer">
          <img className="image" src={previewImage} />
          <form className="form" onSubmit={handleFormSubmit}>
            <input type="file" onChange={handleFileInputChange}/>
            <input type="submit" value="Extract Text" />
          </form>
          <textarea className="textarea"
            value={textareaValue}
            onInput={onTextChange}
          />
        </div>
        <button 
          className="checkAIButton"
          onClick={() => {
            AIConDet();
            //zeroGPT()
         }}>
          check for AI
        </button>
        <p className="text">AI generated: {fakeTwo}%</p>
        <p className="result" id="result"></p>
        <p className="info">*texts that are in red are the AI generated sentence(s)*</p>
      </div>
    </div>
  )
}

export default App