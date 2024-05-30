import React from 'react'
import tenxlogo from '../Images/10X_logo.png'
import incubation from '../Images/IITMIC.png'
import researchpark from '../Images/IITM-RP.png'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import './Navbar.css'
function Navbar() {
  return (
    <div>
        <header className='navbar'>
    
<div class="container"> 
<div className='logocontainer logoone'><img src={tenxlogo} alt="logo1" /></div>
<div  className='logocontainer logotwo'><img src={researchpark} alt="logo1" style={{width:"90px",height:"90px"}}/></div>
<div   className='logocontainer logothree'><img src={incubation} alt="logo1" style={{width:"90px",height:"90px"}}/></div> 
</div>
<div className='line'> </div>
        </header>
      
    </div>
  )
}

export default Navbar
