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
    <p style={{fontSize:"18px"}}>An intelligent tool to simulate your loan schedule based on multiple repayment scenarios</p>
    <p style={{fontSize:"18px",marginTop:"-20px"}}>and show the best ways to save your money.</p>
    <br/>

    <main>
      <EMICalculatormain />
    </main>
  </div>

    
  );
}

export default App;
