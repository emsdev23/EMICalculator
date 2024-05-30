// src/EMICalculator.js

import React, { useState,useEffect} from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styled from 'styled-components';

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
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  font-size: 16px;
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

const calculateEMI = (principal, rate, tenure) => {
  rate = rate / (12 * 100); // monthly interest rate
  tenure = tenure * 12; // loan tenure in months
  return (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
};

const EMICalculator = () => {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(null);

  const handleCalculate = () => {
    const calculatedEMI = calculateEMI(principal, rate, tenure);
    setEmi(calculatedEMI.toFixed(2));
  };




  return (
    <Container>
      <Title>EMI Calculator</Title>
      <div>
        <Label>Principal Amount: ₹{principal}</Label>
        <Slider
          min={100000}
          max={10000000}
          step={50000}
          value={principal}
          onChange={(value) => setPrincipal(value)}
        />
        <br/>
        <RangeLabels>
          <span>₹100,000</span>
          <span>₹10,000,000</span>
        </RangeLabels>
      </div>
      <div>
        <Label>Interest Rate: {rate}%</Label>
        <Input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
        <Slider
          min={1}
          max={20}
          step={0.1}
          value={rate}
          onChange={(value) => setRate(value)}
        />
        <br/>
        <RangeLabels>
          <span>1%</span>
          <span>20%</span>
        </RangeLabels>
      </div>
      <div>
        <Label>Loan Tenure: {tenure} years</Label>
        <Slider
          min={1}
          max={30}
          step={0.5}
          value={tenure}
          onChange={(value) => setTenure(value)}
        />
        <br/>
        <RangeLabels>
          <span>1 year</span>
          <span>30 years</span>
        </RangeLabels>
      </div>
      <button onClick={handleCalculate}>Calculate EMI</button>
      {emi && (
        <Result>
          <h3>Calculated EMI: ₹{emi}</h3>
        </Result>
      )}
    </Container>
  );
};

export default EMICalculator;
