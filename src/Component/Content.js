import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/content.css';
// import Table from '@mui/material/Table';
// or
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';

function Content({ option }) {
  const [data, setData] = useState({courses : [], faculties : [], students : []});

  useEffect(() => {
    async function fetchData() {
      const courseResponse = await axios.post('http://localhost:3030/semantic_universe/query', null, {
        headers: {},
        params: {
          query: `PREFIX table: <http://www.semanticweb.org/budcoded/ontologies/university/all#>
          SELECT DISTINCT ?course 
          WHERE {
            ?course table:Enrolled_By ?object .
            ?object table:Admitted_By ?univ .
             FILTER(regex(str(?univ), "${option}", "i")) 
          }`
        }
      });

      const facultyResponse = await axios.post('http://localhost:3030/semantic_universe/query', null, {
        headers: {},
        params: {
          query: `PREFIX table: <http://www.semanticweb.org/budcoded/ontologies/university/all#>
          SELECT DISTINCT ?faculty 
          WHERE {
            ?faculty table:Hired_By ?object .
             FILTER(regex(str(?object), "${option}", "i")) 
          }`
        }
      });

      const studentResponse = await axios.post('http://localhost:3030/semantic_universe/query', null, {
        headers: {},
        params: {
          query: `PREFIX table: <http://www.semanticweb.org/budcoded/ontologies/university/all#>
          SELECT DISTINCT ?student
          WHERE {
            ?student table:Admitted_By ?object .
             FILTER(regex(str(?object), "${option}", "i")) 
          }`
        }
      });

      const courses = courseResponse.data.results.bindings.map(row => row.course.value.split("#")[1]);
      const faculties = facultyResponse.data.results.bindings.map(row => row.faculty.value.split("#")[1]);
      const students = studentResponse.data.results.bindings.map(row => row.student.value.split("#")[1]);
      
      setData({ courses, faculties, students });
    // setData({courses})
    }
    fetchData();
  }, [option]);

  return (
	<div className="grid-container">
	<h2>University: {option}</h2>
		<div className="table-container">
			<TableContainer component={Paper} variant="outlined">
			<Table aria-label="course-table">
				<TableHead>
					<TableRow>
						<TableCell className="table-head">Courses</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
				{data.courses.map((course, index) => (
					<TableRow key={index}>
					<TableCell>{course}</TableCell>
					</TableRow>
				))}
				</TableBody>
			</Table>
			</TableContainer>
		</div>
	
		<div className="table-container">
			<TableContainer component={Paper} variant="outlined">
			<Table aria-label="course-table">
				<TableHead>
				<TableRow>
					<TableCell className="table-head">Faculties</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
				{data.faculties.map((faculty, index) => (
					<TableRow key={index}>
					<TableCell>{faculty}</TableCell>
					</TableRow>
				))}
				</TableBody>
			</Table>
			</TableContainer>
		</div>
	
		<div className="table-container">
			<TableContainer component={Paper} variant="outlined">
			<Table aria-label="course-table">
				<TableHead>
				<TableRow>
					<TableCell className="table-head">Students</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
				{data.students.map((student, index) => (
					<TableRow key={index}>
					<TableCell>{student}</TableCell>
					</TableRow>
				))}
				</TableBody>
			</Table>
			</TableContainer>
		</div>
	</div>
  );
}

export default Content;