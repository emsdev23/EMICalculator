import React, { useState,useEffect} from 'react'

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import { valueToPercent } from '@mui/base';


import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Emimain() {

    const [selectedDate, setSelectedDate] = useState(null);

    const [rangeFilterValue,setRangeFilterValue]=useState("")
    const [amount,setAmount]=useState(0)
    const [intrestRate,setIntrestRate]=useState(0)
    const [termLoan,setTermLoan]=useState(0)

    
    const Amount = [
        {
          value: 0,
          label: '0',
        },
        {
          value: 25,
          label: '25L',
        },
        {
          value: 50,
          label: '50L',
        },
        {
          value: 75,
          label: '75L',
        },
        {
          value: 100,
          label: '100L',
        },
        {
          value: 125,
          label: '125L',
        },
  
        {
          value: 150,
          label: '150L',
        },
  
        {
          value: 175,
          label: '175L',
        },
  
        {
          value: 200,
          label: '200L',
        },
      ];


      const IntrestRate=[
        {
            value:0,
            label:'0%'
        },
        {
            value:1,
            label:'1%'
        },
        {
            value:2,
            label:'2%'
        },
        {
            value:3,
            label:'3%'
        }

      ]

      const TermLoan=[
        {
            value:0.5,
            label:"0.5",
        },
        {
            value:1,
            label:'1',
        },
        {
            value:1.5,
            label:"1.5"
        }
      ]
      

      
      const handleSliderChange = (event, newValue) => {
        setAmount(newValue);
      };
      const handleInputChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value)) {
          setAmount(value);
        }
      };
    
      const valuetext = (value) => `${value}L`;

      function IntrestRateAmount(value) {
        return `${setIntrestRate(parseInt(value))}`;
      }
  

      function TermLoanInsurance(value) {
        return `${setTermLoan(parseInt(value))}`;
      }

    const handleRangeValueChange = (event) => {
        setRangeFilterValue(event.target.value);
      };

  const handleDateChange = (date) => {
      setSelectedDate(date);
    };


      console.log(rangeFilterValue)
      console.log(selectedDate)

const now = new Date();
const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
const [month, day, year] = local.split("/"); // Split the date by "/"
const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month
  return (
    <div>
        <h1 style={{color:"black",textAlign:"center",margin:"5px",background:"#b1eb34",height:"70px"}}>Loan Repayment  Schedule Calculator</h1>

        <div> 
        <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}> 
      <Grid item xs={6} md={8}>
        <select> 
            <option>Home</option>
            <option>Personal</option>
            <option>Education Loan</option>
            <option>Working Captial Loan</option>
        </select>
      </Grid>
      <Grid item xs={6} md={8}>
      <div className="input-group flex-nowrap">
        <span className="input-group-text" id="addon-wrapping">Loan Amount</span>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Amount"
          aria-label="Amount"
          aria-describedby="addon-wrapping"
          value={amount}
          onChange={handleInputChange}
        />
      </div>
      <div style={{ marginLeft: '100px', marginTop: '20px' }}>
        <Slider
          aria-label="Always visible"
          //value={amount}
          defaultValue={0}
          getAriaValueText={valuetext}
          step={0}
          marks={Amount}
          valueLabelDisplay="off"
          onChange={handleSliderChange}
          min={0}
          max={200}
          color='#f57e42'
        />
      </div>

<br/>
<div class="input-group flex-nowrap">
  <span class="input-group-text" id="addon-wrapping">Intrest Rate</span>
  <input type="text" class="form-control" placeholder="Enter Amount" aria-label="Username" aria-describedby="addon-wrapping" value={intrestRate} onChange={handleRangeValueChange}/>
</div> 
     
<div style={{marginLeft:"100px"}}>
<Slider
  aria-label="Always visible"
  defaultValue={0}
  getAriaValueText={IntrestRateAmount}
  step={1}
  marks={IntrestRate}
  valueLabelDisplay="off"
/> 

</div>


<br/>

<div class="input-group flex-nowrap">
  <span class="input-group-text" id="addon-wrapping">Term of Loan In Years</span>
  <input type="text" class="form-control" placeholder="Enter Amount" aria-label="Username" aria-describedby="addon-wrapping" value={termLoan} onChange={handleRangeValueChange}/>
</div> 
     
<div style={{marginLeft:"100px"}}>
<Slider
  aria-label="Always visible"
  defaultValue={0}
  getAriaValueText={TermLoanInsurance}
  step={0.5}
  marks={TermLoan}
  valueLabelDisplay="off"
/> 

</div>


<div className="input-group-prepend" style={{width:"400px",marginLeft:"30px"}}>
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h6 style={{color:"brown",marginTop:"10px"}}><b>First Payment Date</b></h6> &nbsp; &nbsp; <DatePicker id="date" className="form-control" selected={selectedDate} onChange={handleDateChange} style={{ width: "auto" }}  placeholderText={currentdate}  />
        </label>
        
      </div>


<br/>

      <select class="form-select" aria-label="Default select example">
  <option selected>Payment Frequency</option>
  <option value="1">Annual</option>
  <option value="2">semi-Annual</option>
  <option value="3">Quaterly</option>
  <option value="3">Bi-Monthly</option>
  <option value="3">Monthly</option>
  <option value="3">semi-Monthly</option>
  <option value="3">Bi-Weekly</option>
  <option value="3">Weekly</option>
</select>

<br/>


<select class="form-select" aria-label="Default select example">
  <option selected>Compound Period</option>
  <option value="1">Annual</option>
  <option value="2">semi-Annual</option>
  <option value="3">Quaterly</option>
  <option value="3">Bi-Monthly</option>
  <option value="3">Monthly</option>
  <option value="3">semi-Monthly</option>
  <option value="3">Bi-Weekly</option>
  <option value="3">Weekly</option>
</select>


<br/>

<select class="form-select" aria-label="Default select example">
  <option selected>Payment Type</option>
  <option value="1">End of Period</option>
  <option value="2">Beginning of Period</option>
</select>

<br/>

<select class="form-select" aria-label="Default select example">
  <option selected>Rounding Option</option>
  <option value="1">ON</option>
  <option value="2">OFF</option>
</select>



<br/>

<br/>
<br/>

<div>
<span class="input-group-text" id="addon-wrapping">Enter Your Own EMI Choice</span>
  <input type="text" class="form-control" placeholder="Enter Amount" aria-label="Username" aria-describedby="addon-wrapping" value={termLoan} onChange={handleRangeValueChange}/>
</div> 


      </Grid>
      </Grid>
      </Box>

        </div>
      
    </div>
  )
}

export default Emimain
