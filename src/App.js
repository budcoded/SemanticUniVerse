import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Content from  './Component/Content';
import './css/content.css';

function App() {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  useEffect(() => {
    async function fetchData() {
      const response = await axios.post('http://localhost:3030/university_combined/query',null, {
        headers: {},
        params: {query: `PREFIX table: <http://www.semanticweb.org/budcoded/ontologies/university/all#>
        SELECT DISTINCT ?subject  WHERE { ?subject table:Hires ?object .}`}
      });
      setData(response.data.results.bindings);
    }
    fetchData();
  }, []);

  // Create an array of options for the dropdown menu
  const options = data.map((row, index) => ({
    value: row.subject.value.split("#")[1],
    label: row.subject.value.split("#")[1]
  }));

  // Handle the dropdown change event
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Render the component based on the selected option
  let content;
  if (selectedOption) {
    content = <Content option={selectedOption} />;
  }

  return (
    <div>
      <div className = "dropdown">
      <select onChange={handleDropdownChange}>
        <option value="">Select University</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      </div>
      <div className="content">
      {content}
      </div>
    </div>
  );
}

export default App;
