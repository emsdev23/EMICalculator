import React, { useState,useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styled from 'styled-components';
import './EMICalculator.css';
import { SlCalender } from "react-icons/sl";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { RiArrowDropDownLine } from "react-icons/ri";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Highcharts, { color } from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import { FaToggleOff } from "react-icons/fa6";
import { FaToggleOn } from "react-icons/fa6";
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Box from '@mui/material/Box';



const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
`;

const Input = styled.input`
  width: 40%;
  padding: 8px;
  margin-left:60px;
  margin-bottom: 10px;
  margin-top:10px;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  font-size: 16px;
  background-color:#E3F5E3;
  border-radius:10px;
  &:focus {
    border-bottom-color: #007bff;
    
  }
`;



const Result = styled.div`
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #007bff;
  border-radius: 8px;
  background-color: #e9f5ff;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
`;

function EMICalculatormain() {

  exportingInit(Highcharts);
  exportDataInit(Highcharts);
    


    const [principal, setPrincipal] = useState(500000);
    const [rate, setRate] = useState(15);
    const [tenure, setTenure] = useState(2);
    const[firstEMiDate,setFirstEMiDate]=useState(null)
    const[emiChoice,setEmiChoice]=useState(null)
    const [emiChoiceDate,setEmiChoiceDate]=useState(null)
    const [error, setError] = useState('');
    const[errorCase,setErrorCase]=useState()


    const[additionapaymentamount,setAdditionalpaymentamount]=useState(0)
    const[additionalpaymentdateselect,setAdditionalpaymentdateselect]=useState(null)


    const [emiOverviewData,setEmiOverViewData]=useState([])
    const [emiCalcTable,setEmiCalcTable]=useState([])
  

    const [toggleSelector,setToggleSelector]=useState('OFF')

 

    // additionalone:{}


    
// TotalPayment: 412800
// principal: 400000
// principalp: 97
// totalInterest: 12800
// totalInterestp: 3
let TotalPayment=0
let resposneprincipal=0
let responseprincipalPercentage=0
let totalInterest=0
let totalInterestPercentage=0
let emi=0
let checkValue=0

if(emiOverviewData!=null){
  for(let i=0;i<emiOverviewData.length;i++){
    TotalPayment=emiOverviewData[i].TotalPayment
    resposneprincipal=emiOverviewData[i].principal
    responseprincipalPercentage=emiOverviewData[i].principalp
    totalInterest=emiOverviewData[i].totalInterest
    totalInterestPercentage=emiOverviewData[i].totalInterestp
    emi=Math.round(emiOverviewData[i].emi)
    checkValue=Math.trunc(emiOverviewData[i].checkValue)

  }

}





    const fetchSystemOverViewData = async () => {
        //setLoading(true);
        try {
          const formattedDate = firstEMiDate ? new Date(firstEMiDate.getTime() - firstEMiDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
          const emiDateChoice=emiChoiceDate ? new Date(emiChoiceDate.getTime() - emiChoiceDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
          let dateamountSelector={[emiDateChoice==="" ? formattedDate:emiDateChoice]:emiChoice}
          console.log(dateamountSelector)
          const EMIOverViewresponse = await axios.post("http://192.168.0.236:3001/emi/overall", {principal: principal,rate:rate,year:tenure,firstdate:formattedDate,dateAmount:dateamountSelector});
          const EMITablesDetailsresponse= await axios.post("http://192.168.0.236:3001/emi/CalcEMI", {principal: principal,rate:rate,year:tenure,firstdate:formattedDate,dateAmount:dateamountSelector});
        

    //       "principal":3000000,
    // "emi":null,
    // "rate":4.4,
    // "year": 4.5,
    // "firstdate":"2024-06-17",
    // "dateAmount":{"2025-03-20":60000},
    // "additionalone":{"2024-10-15":50000,"2025-01-01":10000}
          setEmiOverViewData(EMIOverViewresponse.data);
          setEmiCalcTable(EMITablesDetailsresponse.data)
          //setBuildingHighlightsDateFilter(buildingHighlightsResponse.data)
          // setLoading(false);
          console.log(formattedDate)
        } catch (error) {

          console.error(error.data);
          //setLoading(false);
        }
      };

    useEffect(()=>{

        fetchSystemOverViewData()

    },[principal,rate,tenure,emiChoice,emi,emiChoiceDate,additionapaymentamount,additionalpaymentdateselect,firstEMiDate])
    console.log(principal)
    console.log(emiChoiceDate)
  
    console.log(emiOverviewData)
    
    console.log(emiCalcTable.lessEmi)
    const requestObject={"principal":principal,"rate":rate,"year":tenure,"emi":emiChoice,"firstdate":emiChoiceDate, dateAmount: {
      [emiChoiceDate]: emiChoice // Use computed property name
    }}
    console.log(requestObject)


      const columns = [
        // { field: 'recordID', headerName: 'ID', width: 70 ,editable: true,},
          // valueFormatter: (params) => {
          //   // Format the timestamp value as a date (excluding time)
          //   const date = new Date(params.value);
          //   return date.toLocaleDateString(); // Use toLocaleDateString() to display only the date
          // },
        {
          field: 'date',
          headerName:<div style={{ textAlign: 'center' }}>DATE</div>,
          type: 'date',
          width:100
        
        },
        { 
          field: 'EMI', 
          headerName: <div style={{ textAlign: 'start' }}>EMI</div>,
          type: 'number',
          width:200 
        },
        {
          field: 'additionalpayment',
          headerName: 'ADDITIONAL PAYMENT',
          type: 'number',
          width:200
  
        },
        {
          field: 'balance',
          headerName: 'BALANCE',
          type: 'number',
          width:200

        },
        {
          field: 'interest',
          headerName: 'INTEREST',
          type: 'number',
          width:200

        },
        {
          field: 'principal',
          headerName: 'PRINCIPAL',
          type: 'number',
          width:200

        },
      ];


    
  

  
      const rows = Array.isArray(emiCalcTable) ? emiCalcTable.map((log, index) => ({
        id: index + 1,
        date: new Date(log.date),
        EMI: log.EMI,
        additionalpayment: log.additionalpayment,
        balance: log.balance,
        interest: log.interest,
        principal: log.principal,
      })) : [];


      const handleEmiChoiceChange = (e) => {
        setEmiChoice(e.target.value);
      };
    
      const handleInputBlur = () => {
        const value = Number(emiChoice);
        if (value <= checkValue) {
          setError(`EMI must be greater than ${checkValue}`);
        } else {
          setError('');
          setEmiChoice(value)
          //fetchSystemOverViewData(); // Fetch data when input is valid and input loses focus
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleInputBlur();
        }
      };
    
      console.log(emiCalcTable)

    const loanChart= {
      chart: {
          type: 'pie'
      },
      title: {
          text: null
      },
      tooltip: {
          valueSuffix: '%'
      },
      subtitle: {
          text:null
      },
      plotOptions: {
          series: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: [{
                  enabled: true,
                  distance: 20
              }, {
                  enabled: true,
                  distance: -40,
                  format: '{point.percentage:.1f}%',
                  style: {
                      fontSize: '1.2em',
                      textOutline: 'none',
                      opacity: 0.7
                  },
                  filter: {
                      operator: '>',
                      property: 'percentage',
                      value: 10
                  }
              }]
          }
      },
      series: [
          {
              name: 'Percentage',
              colorByPoint: true,
              data: [
                  {
                      name: 'Principal Loan Amount',
                      y: responseprincipalPercentage,
                      color:"#6CBC6F"
                  },
                  {
                      name: 'Total Interest',
                      sliced: true,
                      selected: true,
                      y: totalInterestPercentage,
                      color:"#234425"
                  },
              ]
          }
      ]
  };

    // Define selectorWeekMonthReq outside of useEffect
    const selectorONOFF = () => {
      setToggleSelector((prev) => (prev === "OFF" ? "ON" : "OFF"));
    };
  
    useEffect(() => {
      selectorONOFF()
    }, []);

    console.log(toggleSelector)



  
    
  return (
    <div>

<div class="container"> 
<div class="row">
  <div class="col-12 col-md-6" style={{height:"auto",backgroundColor:"#F3FAF3",borderRadius:"24px",marginBottom:"30px",paddingBottom:"40px"}}>
  <div style={{marginTop:"20px"}}>
        <div className="input" style={{font:"Urbanist",display:"flex",justifyContent:"center",alignItems:"center"}} >
            <span style={{fontSize:"18px",fontWeight:"600"}}>Loan Amount</span> 
            <Input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
        />
        <div style={{width:"30px",height:"41px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-8px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}>₹</div>
        </div>
        <br/>
  
        <Slider
          min={0}
          max={10000000}
          step={50000}
          value={principal}
          onChange={(value) => setPrincipal(value)}
          trackStyle={{ backgroundColor: '#439547', height: 8 }}
          railStyle={{ backgroundColor: '#d3d3d3', height: 8 }}
          handleStyle={{
            borderColor: '#439547',
            height: 18,
            width: 18,
            marginLeft: 8,
            marginTop: -6,
            backgroundColor: 'black',
          }}
        />
        
        <br/>
        <RangeLabels>
          <span>₹0</span>
          <span>₹10,000,000</span>
        </RangeLabels>
      </div>

<br/>

      <div style={{marginTop:"20px"}}>
        <div className="input" style={{font:"Urbanist",display:"flex",justifyContent:"center",alignItems:"center"}} >
         <span style={{fontSize:"18px",fontWeight:"600"}}>Interest Rate (p.a)</span>
            <Input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
        <div style={{width:"30px",height:"41px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-8px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}>%</div>
        </div>
        <br/>
  
        <Slider
         min={1}
         max={20}
         step={0.1}
         value={rate}
          onChange={(value) => setRate(value)}
          trackStyle={{ backgroundColor: '#439547', height: 8 }}
          railStyle={{ backgroundColor: '#d3d3d3', height: 8 }}
          handleStyle={{
            borderColor: '#439547',
            height: 18,
            width: 18,
            marginLeft: 8,
            marginTop: -6,
            backgroundColor: 'black',
          }}
        />
        
        <br/>
        <RangeLabels>
          <span>0</span>
          <span>20%</span>
        </RangeLabels>
      </div>

  

      <br/>

      <div style={{marginTop:"20px"}}>
        <div className="input" style={{font:"Urbanist",display:"flex",justifyContent:"center",alignItems:"center"}} >
        <span style={{fontSize:"18px",fontWeight:"600"}} >Loan tenure</span>
            <Input
          type="number"
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
        />
        <div style={{width:"30px",height:"41px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-8px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}>yr</div>
        </div>
        <br/>
  
        <Slider
        min={1}
        max={30}
        step={0.5}
        value={tenure}
        onChange={(value) => setTenure(value)}
          trackStyle={{ backgroundColor: '#439547', height: 8 }}
          railStyle={{ backgroundColor: '#d3d3d3', height: 8 }}
          handleStyle={{
            borderColor: '#439547',
            height: 18,
            width: 18,
            marginLeft: 8,
            marginTop: -6,
            backgroundColor: 'black',
          }}
        />
        
        <br/>
        <RangeLabels>
          <span>1YR</span>
          <span>30YR</span>
        </RangeLabels>
      </div>

      <div style={{marginTop:"20px"}}> 
      
      <div className="input" style={{font:"Urbanist",display:"flex",justifyContent:"center",alignItems:"center"}} >
      <span style={{fontSize:"18px",fontWeight:"600",marginRight:"60px"}} >Initial  EMI Date</span>
      <DatePicker id="date" className="form-control" selected={firstEMiDate} onChange={(date) => setFirstEMiDate(date)} style={{ width: "100px",height:"100px" }}  placeholderText="dd/mm/yyyy" />
    <div style={{width:"30px",height:"35.3px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-1px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}><SlCalender /></div>
    </div>

      </div>

      <div style={{borderTop:"3px solid #73bf8b",borderBottom:"3px solid #73bf8b",height:"100px",marginTop:"50px",display:"flex",justifyContent:"center",alignItems:"center",width:"90%",marginLeft:"auto",marginRight:"auto"}}>
       <span style={{fontSize:"26px",fontWeight:"600"}}>Calculated EMI</span> <span style={{fontSize:"36px",marginLeft:"30px"}}> ₹ { emi }</span>

        </div>


        <div style={{marginTop:"30px"}}> 
            <span style={{fontSize:"18px",fontWeight:"600",textAlign:"start",alignItems:"start",display:"flex"}}>Enter your own EMI Choice  
            {
              toggleSelector==="OFF"? <span style={{marginLeft:"70px"}}> <FaToggleOff size="40px" color='green' style={{}} onClick={selectorONOFF}  /></span>: <span style={{marginLeft:"70px"}}> <FaToggleOn size="40px" color='green' style={{}} onClick={selectorONOFF}  /></span>
            }
            
           </span> 

           {
            toggleSelector==="OFF"?"":
           

            
            <div className="input" style={{font:"Urbanist",display:"flex",alignItems:"center"}} >


    <Input
      type="number"
      value={emiChoice}
      onChange={handleEmiChoiceChange}
      onBlur={handleInputBlur}
      onKeyDown={handleKeyDown}
      style={{ marginRight: "20px" }}
    />
    <p>{error && <div style={{ color: 'red' }}>{error}</div>}</p>
  
        
         

<DatePicker id="date" className="form-control" selected={emiChoiceDate} onChange={(date) => setEmiChoiceDate(date)} style={{ width: "100px",height:"100px" }}  placeholderText="dd/mm/yyyy"   />
        <div style={{width:"30px",height:"35.3px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-1px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}><SlCalender /></div>
        </div>
        }
        </div>


   
  </div>
  <div class="col-12 col-md-6" style={{height:"100vh",marginLeft:"0px"}}> 
  <p style={{fontSize:"20px",fontWeight:"600"}}>Loan Break-up</p>
  <HighchartsReact highcharts={Highcharts} options={loanChart} />

  <div class="container">
<div class="row">
<div class="col-6 col-md-6" style={{marginLeft:"0px"}}> 
<p style={{fontSize:"18px",fontWeight:"600",whiteSpace:"pre"}}>Principal Loan Amount</p>
<div style={{width:"100%",height:"90%",backgroundColor:"#6CBC6F",alignItems:"center",borderRadius:"5px",display:"flex",justifyContent:"center",fontSize:"20px",color:"#fff"}}>
₹ {resposneprincipal}

</div>
</div>

<div class="col-6 col-md-6" style={{marginLeft:"0px"}}> 
<p style={{fontSize:"18px",fontWeight:"600",whiteSpace:"pre"}}>Total Interest</p>
<div style={{width:"100%",height:"90%",backgroundColor:"#234425",alignItems:"center",borderRadius:"5px",display:"flex",justifyContent:"center",fontSize:"20px",color:"#fff"}}>
₹ {totalInterest}

</div>
</div>

</div>
</div>
  
<div style={{borderTop:"3px solid #73bf8b",height:"100px",marginTop:"100px",display:"flex",justifyContent:"center",alignItems:"center",width:"90%",marginLeft:"auto",marginRight:"auto"}}> 
  <span style={{fontSize:"18px",fontWeight:"600",marginRight:"20px"}}>Total Payment</span> <span style={{fontSize:"27px"}}> ₹ {TotalPayment}</span>
  </div>

  
  </div>
</div>
</div>

<div className='additionalPayment'> 
<div class="container">
<div class="row"> 
<div class="col-12 col-md-12" style={{height:"auto",backgroundColor:"#F3FAF3",borderRadius:"24px",marginBottom:"30px",width:"100%",paddingTop:"50px",paddingBottom:"70px"}}>
 <div class="row"> 
 <p style={{fontSize:"26px",textAlign:"start",fontWeight:"600",marginLeft:"16px"}}>Additional Payment</p> 


 <div class="col-12 col-md-6" style={{marginTop:"70px"}}>
    <p style={{fontSize:"18px",textAlign:"center",fontWeight:"600"}}>Date of Additional Payment</p>

  <div className="input" style={{font:"Urbanist",display:"flex",alignItems:"center",justifyContent:"center"}}>
  <DatePicker id="date" className="form-control" selected={additionalpaymentdateselect} onChange={(date) => setAdditionalpaymentdateselect(date)} style={{ width: "100px",height:"100px" }}  placeholderText="dd/mm/yyyy" />
    <div style={{width:"30px",height:"35.3px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-1px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}><SlCalender /></div>
    </div>
  </div>

 <div class="col-12 col-md-6"> 

  <div style={{textAlign:"start",marginTop:"40px"}}> 
     {/* <span style={{fontSize:"18px",fontWeight:"600"}}>Additional Periodic Payment Frequency</span> */}
<br/>
        <p style={{fontSize:"20px",fontWeight:"600",textAlign:"center"}}>Enter your Additional Amount</p>
     <div className="input" style={{font:"Urbanist",display:"flex",justifyContent:"center",alignItems:"center"}} >

            <Input
          type="number"
          value={additionapaymentamount}
          onChange={(e) => setAdditionalpaymentamount(Number(e.target.value))}
          style={{width:"200px"}}
        />
        <div style={{width:"30px",height:"41px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-8px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}>₹</div>
        </div>
  </div>
  </div>

 

 </div>
</div>
</div>
 

</div>


</div>



<div style={{ height: 400, width: '90%' ,marginLeft:"auto",marginRight:"auto",marginBottom:"50px"}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        pageSizeOptions={[3, 10]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
        classes={{
          row: 'custom-row-class',
          cell: 'custom-cell-class',
        }}
        // style={darkTheme} // Apply the dark theme styles
      />
    </div>


      
    </div>
  )
}

export default EMICalculatormain
