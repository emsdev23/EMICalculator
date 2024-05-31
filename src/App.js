import './App.css';
import Emimain from './EMIapp/Emimain';
import EMICalculator from './EMIapp/EMICalculator';
import EMICalculatormain from './EMIapp/EMICalculatormain';
import Navbar from './Navbar/Navbar';

function App() {
  return (
    <div className="App">
    <div>
    <Navbar/>
    </div>
    <p style={{fontSize:"35px",fontWeight:"600",textAlign:"center",color:"#234425"}}>SMART EMI CALCULATOR</p>
    <p style={{marginTop:"-20px",fontSize:"18px",color:"#6CBC6F",textAlign:"center"}}>Pay off faster and Save Big!</p>
    <br/>
    <p style={{fontSize:"18px"}}>When you get a loan, how often do you think about the interest amount you pay as part of your EMI?</p>
    <p style={{fontSize:"18px",marginTop:"0px"}}>Did you know that by smartly planning your repayments as your income grows, you can quickly finish your loan and save a significant  <br/> amount of money that would have otherwise been paid solely as interest?</p>
    <p style={{fontSize:"18px",marginTop:"0px"}}>Have you used tools that can precisely assist you in managing loans efficiently?</p>
    
    <br/>

    <main>
      <EMICalculatormain />
    </main>
  </div>

    
  );
}

export default App;
