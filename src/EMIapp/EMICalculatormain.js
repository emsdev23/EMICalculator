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
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";




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
    



 // Get the current date
const now = new Date();

// Extract year, month, and day
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() returns month index (0-11)
const day = String(now.getDate()).padStart(2, '0');

// Format the date as "YYYY-MM-DD"
const currentdate = `${year}-${month}-${day}`;

console.log(currentdate); // Output: e.g., "2024-05-31"


    const [principal, setPrincipal] = useState("500000");
    const [rate, setRate] = useState("15");
    const [tenure, setTenure] = useState("2");
    const[firstEMiDate,setFirstEMiDate]=useState(null)
    const[emiChoice,setEmiChoice]=useState("")
    const [emiChoiceDate,setEmiChoiceDate]=useState(null)
    const [error, setError] = useState('');
    const[errorCase,setErrorCase]=useState()


    const[additionapaymentamount,setAdditionalpaymentamount]=useState(0)
    const[additionalpaymentdateselect,setAdditionalpaymentdateselect]=useState(null)


    const [emiOverviewData,setEmiOverViewData]=useState([])
    const [emiCalcTable,setEmiCalcTable]=useState([])
  

    const [toggleSelector,setToggleSelector]=useState('OFF')
    const [additionalPaymentToogle,setAdditionalPaymentToogle]=useState("OFF")

 
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

console.log(checkValue)




let TotalInterestTable=0
let TotalPrincipalTable=0
let TolatPaymetAmount=0


for(let i=0;i<emiCalcTable.length;i++){
  TotalInterestTable=TotalInterestTable+emiCalcTable[i].interest
}

TolatPaymetAmount=(TotalInterestTable+resposneprincipal)




console.log(TotalInterestTable)
//additional payment code 
const [additionalPayments, setAdditionalPayments] = useState([{ date: null, amount: '' }]);
const [additionalerror, setAdditionalerrorr] = useState('');

const handleAddPayment = () => {
  if (additionalPayments.length < 5) {
    setAdditionalPayments([...additionalPayments, { date: null, amount: '' }]);
  } else {
    setError('You can add up to 5 additional payments only.');
  }
};

// const handleDateChange = (index, date) => {
//   const newPayments = additionalPayments.map((payment, i) =>
//     i === index ? { ...payment, date } : payment
//   );
//   setAdditionalPayments(newPayments);
// };

const handleDateChange = (index, date) => {
  // Format the date as YYYY-MM-DD
  const formattedDate = date!=null?date.toISOString().split('T')[0]:""

  const newPayments = additionalPayments.map((payment, i) =>
    i === index ? { ...payment, date: formattedDate } : payment
  );
  setAdditionalPayments(newPayments);
};

const handleAmountChange = (index, amount) => {
  const newPayments = additionalPayments.map((payment, i) =>
    i === index ? { ...payment, amount } : payment
  );
  setAdditionalPayments(newPayments);
};

console.log(additionalPayments)





    const fetchSystemOverViewData = async () => {
        //setLoading(true);
        try {
          const formattedDate = firstEMiDate ? new Date(firstEMiDate.getTime() - firstEMiDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
          const emiDateChoice=emiChoiceDate ? new Date(emiChoiceDate.getTime() - emiChoiceDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
          let dateamountSelector={[emiDateChoice==="" ? formattedDate:emiDateChoice]:parseInt(emiChoice)}
          console.log(dateamountSelector)
          console.log({principal: principal,rate:rate,year:tenure,firstdate:formattedDate,dateAmount:dateamountSelector,additionalone:additionalPayments})
          const EMIOverViewresponse = await axios.post("http://http://10x.respark.iitm.ac.in/:3001/emi/overall", {principal: parseInt(principal),rate:parseInt(rate),year:parseInt(tenure),firstdate:formattedDate,dateAmount:dateamountSelector,additionalone:additionalPayments});
          const EMITablesDetailsresponse= await axios.post("http://http://10x.respark.iitm.ac.in/:3001/emi/CalcEMI", {principal: parseInt(principal),rate:parseInt(rate),year:parseInt(tenure),firstdate:formattedDate,dateAmount:dateamountSelector,additionalone:additionalPayments});
        

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

    },[principal,rate,tenure,emiChoice,emi,emiChoiceDate,additionapaymentamount,additionalpaymentdateselect,firstEMiDate,additionalPayments])
    console.log(principal)
    console.log(emiChoiceDate)
  
    console.log(emiOverviewData)
    
    console.log(emiCalcTable)
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
        EMI: Math.trunc(log.EMI),
        additionalpayment: log.additionalpayment,
        balance: log.balance,
        interest: log.interest,
        principal: log.principal,
      })) : [];


      // const handleEmiChoiceChange = (e) => {
      //   setEmiChoice(e.target.value);
      // };
    
      // const handleInputBlur = () => {
      //   const value = Number(emiChoice);
      //   if (value <= checkValue) {
      //     setErrorCase(`EMI must be greater than ${checkValue}`);
      //   } else {
      //     setErrorCase('');
      //     setEmiChoice(value)
      //     //fetchSystemOverViewData(); // Fetch data when input is valid and input loses focus
      //   }
      // };

      // const handleKeyDown = (e) => {
      //   if (e.key === 'Enter') {
      //     handleInputBlur();
      //   }
      // };
    console.log(errorCase)
      console.log(emiCalcTable)

    const loanChart= {
      chart: {
          type: 'pie',
      },
      title: {
          text: null
      },
      tooltip: {
          valueSuffix: ''
      },
      subtitle: {
          text:null
      },
      plotOptions: {
          series: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: [ {
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
              name: '',
              colorByPoint: true,
              data: [
                  {
                      name: 'Principal Loan Amount',
                      y: firstEMiDate===null ?500000:resposneprincipal,
                      color:"#6CBC6F"
                  },
                  {
                      name: 'Total Interest',
                      sliced: true,
                      selected: true,
                      y:firstEMiDate===null?81840:TotalInterestTable,
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
    const additionalPaymentToogleSelector=()=>{
      setAdditionalPaymentToogle((prev) => (prev === "OFF" ? "ON" : "OFF"))

    }
  
    useEffect(() => {
      selectorONOFF()
      additionalPaymentToogleSelector()
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
          type="text"
          value={principal}
          onChange={(e) => setPrincipal((e.target.value))}
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
          type="text"
          value={rate}
          onChange={(e) => setRate((e.target.value))}
        />
        <div style={{width:"30px",height:"41px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-8px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}>%</div>
        </div>
        <br/>
  
        <Slider
         min={1}
         max={60}
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
          <span>60%</span>
        </RangeLabels>
      </div>

  

      <br/>

      <div style={{marginTop:"20px"}}>
        <div className="input" style={{font:"Urbanist",display:"flex",justifyContent:"center",alignItems:"center"}} >
        <span style={{fontSize:"18px",fontWeight:"600"}} >Loan tenure</span>
            <Input
          type="text"
          value={tenure}
          onChange={(e) => setTenure((e.target.value))}
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
      <DatePicker id="date" className="form-control" selected={firstEMiDate} onChange={(date) => setFirstEMiDate(date)} style={{ width: "100px",height:"100px" }}  placeholderText="dd-mm-yyyy" />
      
    <div style={{width:"30px",height:"35.3px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-1px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}><SlCalender /></div>
    </div>

      </div>
      {
        firstEMiDate===null?<span style={{color:"red",textAlign:"center"}}> <FiAlertTriangle/> <b>Please select a  Date</b></span>:""
      }

      <div style={{borderTop:"3px solid #73bf8b",borderBottom:"3px solid #73bf8b",height:"100px",marginTop:"50px",display:"flex",justifyContent:"center",alignItems:"center",width:"90%",marginLeft:"auto",marginRight:"auto"}}>
       <span style={{fontSize:"26px",fontWeight:"600"}}>Calculated EMI</span> <span style={{fontSize:"36px",marginLeft:"30px"}}> ₹ { emi }</span>

        </div>


        <div style={{marginTop:"30px"}}> 
            <span style={{fontSize:"18px",fontWeight:"600",textAlign:"start",alignItems:"start",display:"flex"}}>Enter an  EMI  of your Choice  
            {
              toggleSelector==="OFF"? <span style={{marginLeft:"70px"}}> <FaToggleOff size="40px" color='green' style={{}} onClick={selectorONOFF}  /></span>: <span style={{marginLeft:"70px"}}> <FaToggleOn size="40px" color='green' style={{}} onClick={selectorONOFF}  /></span>
            }
            
           </span> 

           {
            toggleSelector==="OFF"?"":
            
           

            
            <div className="input" style={{font:"Urbanist",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"-60px",paddingRight:"40px"}} >
              


    <Input
      type="text"
      value={emiChoice}
      // onChange={handleEmiChoiceChange}
      onChange={(e) => setEmiChoice((e.target.value))}
      // onBlur={handleInputBlur}
      // onKeyDown={handleKeyDown}
      style={{ marginRight: "0px",width:"80%" }}
    />
         <div style={{width:"70px",height:"40px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-30px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}>₹</div>
    <br/>
      {
        emiChoice <= checkValue? <p style={{color:"red",fontSize:"13px",fontWeight:"600",display:"block",marginLeft:"10px",marginRight:"10px",whiteSpace:"pre"}}>EMI <br/>must be  greater <br/>  than {checkValue}</p>:""
      }
   

    {/* <p>{errorCase && <div style={{ color: 'red' }}>{errorCase}</div>}</p> */}
  
        
         

<div style={{ width: "80%",height:"100px",display:"flex",marginTop:"60px"}} >
<DatePicker id="date" className="form-control" selected={emiChoiceDate} onChange={(date) => setEmiChoiceDate(date)}  placeholderText="dd/mm/yyyy"   />

        <div style={{width:"30px",height:"35.3px",background:"#439547",borderBottomRightRadius:"5px",borderTopRightRadius:"5px",marginLeft:"-1px",textAlign:"center",justifyContent:"center",display:"flex",alignItems:"center",color:"#fff",fontSize:"20px"  ,fontWeight:"500"}}><SlCalender /></div>
        </div>
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
₹ { 
  firstEMiDate===null?"500000":resposneprincipal

}

</div>
</div>

<div class="col-6 col-md-6" style={{marginLeft:"0px"}}> 
<p style={{fontSize:"18px",fontWeight:"600",whiteSpace:"pre"}}>Total Interest</p>
<div style={{width:"100%",height:"90%",backgroundColor:"#234425",alignItems:"center",borderRadius:"5px",display:"flex",justifyContent:"center",fontSize:"20px",color:"#fff"}}>
₹ { 

firstEMiDate===null?"81840":TotalInterestTable


}

</div>
</div>

</div>
</div>
  
<div style={{borderTop:"3px solid #73bf8b",height:"100px",marginTop:"100px",display:"flex",justifyContent:"center",alignItems:"center",width:"90%",marginLeft:"auto",marginRight:"auto"}}> 
  <span style={{fontSize:"18px",fontWeight:"600",marginRight:"20px"}}>Total Payment</span> <span style={{fontSize:"27px"}}> ₹ {  firstEMiDate===null?(parseInt(500000+81840)):TolatPaymetAmount}</span>
  </div>

  
  </div>
</div>
</div>

<div className='additionalPayment'> 
<div class="container">
<div class="row"> 
<div
      className="col-12 col-md-12"
      style={{
        height: 'auto',
        backgroundColor: '#F3FAF3',
        borderRadius: '24px',
        marginBottom: '30px',
        width: '100%',
        paddingTop: '50px',
        paddingBottom: '70px',
      }}
    >
      <span style={{fontSize: '26px', textAlign: 'start',fontWeight: '600',}}>Additional Payment
      {
       
       additionalPaymentToogle==="OFF"?<span style={{marginLeft:"70px"}}> <FaToggleOff size="40px" color='green' style={{}} onClick={additionalPaymentToogleSelector}  /></span>:<span style={{marginLeft:"70px"}}> <FaToggleOn size="40px" color='green' style={{}} onClick={additionalPaymentToogleSelector}  /></span>
       
      }  
      
      
      </span>

      {
       
       additionalPaymentToogle==="OFF"?"":
      

      <div className="row">
        <p
          style={{
            fontSize: '18px',
            textAlign: 'end',
            fontWeight: '600',
            marginLeft: '16px',
            cursor: 'pointer',
            paddingRight:"70px",
            marginBottom:"50px"
          }}
          onClick={handleAddPayment}
        >
          Add More Payments <IoMdAddCircleOutline style={{ color: 'green' }} size="30px" />
        </p>
        {error && <div style={{ color: 'red', marginLeft: '16px' }}>{error}</div>}
        <div className="col-6 col-md-6" style={{ marginTop: '0px' }}>
        <p style={{ fontSize: '18px', textAlign: 'center', fontWeight: '600',whiteSpace:"pre" }}>
                Date of Additional <br/> Payment
              </p>
         </div>
         <div className="col-6 col-md-6" style={{ marginTop: '0px' }}>
         <p style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                  Enter your  Additional <br/> Amount
                </p>
        </div>
        {additionalPayments.map((payment, index) => (
          <React.Fragment key={index}>
            <div className="col-6 col-md-6" style={{ marginTop: '10px' }}>
              
              <div
                className="input"
                style={{
                  font: 'Urbanist',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DatePicker
                  id="date"
                  className="form-control"
                  selected={payment.date}
                  onChange={(date) => handleDateChange(index, date)}
                  style={{ width: '100px', height: '100px' }}
                  placeholderText="dd/mm/yyyy"
                />
                <div
                  style={{
                    width: '30px',
                    height: '35.3px',
                    background: '#439547',
                    borderBottomRightRadius: '5px',
                    borderTopRightRadius: '5px',
                    marginLeft: '-1px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: '500',
                  }}
                >
                  <SlCalender />
                </div>
              </div>
            </div>

            <div className="col-6 col-md-6">
              <div style={{ textAlign: 'center', marginRight: '50px' }}>
                
                <div
                  className="input"
                  style={{
                    font: 'Urbanist',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Input
                    type="number"
                    value={payment.amount}
                    onChange={(e) => handleAmountChange(index, Number(e.target.value))}
                    style={{ width: '180px' }}
                  />
                  <div
                    style={{
                      width: '30px',
                      height: '41px',
                      background: '#439547',
                      borderBottomRightRadius: '5px',
                      borderTopRightRadius: '5px',
                      marginLeft: '-8px',
                      textAlign: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#fff',
                      fontSize: '20px',
                      fontWeight: '500',
                    }}
                  >
                    ₹
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      }
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
