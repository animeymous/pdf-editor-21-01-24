import { useState } from 'react'
import './App.css'

function App() {
  
  let [responseData, setResponseData] = useState(null);
  let [keyValue, setKeyValue] = useState([]);
  
  // function to fetch data from pdf
  const fetchApiData = async () => {
    let API = "http://localhost:3000/createPdf/example.pdf"
    try{
      fetch(API)
      .then(response =>{
        return response.json()
      })
      .then(data => {
        let keyValueArray = [];
        data?.specificFieldNameArray?.forEach((element)=>{
          let obj = {
            key: element,
            value: ""
          }

          keyValueArray.push(obj);
        })

        setResponseData(data)
        setKeyValue(keyValueArray);
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  // this function will get triggered in every change in form
  const handleChange = (event, index) => {
    const { value } = event.target;
    setKeyValue(prevState => {
      const newArray = [...prevState];
      newArray[index].value = value;
      return newArray;
    });
  };

  // this function will submit our form
  const handleSubmit = (event) => {
    event.preventDefault();

    // Make an HTTP POST request to the server
    fetch('http://localhost:3000/savePdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(keyValue)
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // for PDFTextFields in pdf
  const inputFields = responseData?.specificFieldNameArray.slice(0, 15).map((value, index) => (
    <div key={index}>
      <label htmlFor={`input-${index}`}>{`${value} : `}</label>
      <input type="text" id={`input-${index}`} onChange={(event) => handleChange(event, index)} />
    </div>
  ));

  // For PDFRadioFroups in the PDF
  const radioGroup = responseData?.specificFieldNameArray?.slice(15).map((value, index) => (
    <div className='make-flex' key={index}>
      <label htmlFor={`radio-${index}`}>{`${value} : `}</label>
      <div>
        <label htmlFor={`radio-${index}-YES`}>YES</label>
        <input type="radio" id={`radio-${index}-YES`} name={`radio-${index}`} value="YES" onChange={(event) => handleChange(event, index+16)}/>
      </div>
      <div>
        <label htmlFor={`radio-${index}-NO`}>NO</label>
        <input type="radio" id={`radio-${index}-NO`} name={`radio-${index}`} value="NO" onChange={(event) => handleChange(event, index+16)}/>
      </div>
      <div>
        <label htmlFor={`radio-${index}-UNKNOWN`}>UNKNOWN</label>
        <input type="radio" id={`radio-${index}-UNKNOWN`} name={`radio-${index}`} value="UNKNOWN" onChange={(event) => handleChange(event, index+16)}/>
      </div>
      <div>
        <label htmlFor={`radio-${index}-NA`}>NA</label>
        <input type="radio" id={`radio-${index}-NA`} name={`radio-${index}`} value="NA" onChange={(event) => handleChange(event, index+16)}/>
      </div>
    </div>
  ));

  return (
    <>
      {/* buttons to load and submit pdf form */}
      <div>
        <button onClick={fetchApiData}>Load</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {/* it will load only when responseData have elements */}
      <div>
        {responseData?.specificFieldNameArray?.length > 0 ? (
          <div>
            {inputFields}
            {radioGroup}
          </div>
        ) : (
          <p>NO data available.</p>
        )}
      </div>
    </>
  )
}

export default App
