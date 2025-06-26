import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaRobot, FaSync } from "react-icons/fa";

const futuristicGlow = keyframes`
  0% { box-shadow: 0 0 10px #00ffe7, 0 0 20px #00ffe7, 0 0 30px #00ffe7; }
  100% { box-shadow: 0 0 30px #00ffe7, 0 0 60px #00ffe7, 0 0 90px #00ffe7; }
`;

const Container = styled.div`
  background: linear-gradient(135deg, #1b1b1b, #232b3b 70%);
  padding: 2rem;
  border-radius: 2rem;
  width: 350px;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${futuristicGlow} 3s alternate infinite;
  border: 2px solid #00ffe7;
`;

const Title = styled.h1`
  color: #00ffe7;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  background: #181c20;
  color: #00ffe7;
  border: 1px solid #00ffe7;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  font-size: 1rem;
  outline: none;
`;

const Input = styled.input`
  background: #181c20;
  color: #00ffe7;
  border: 1px solid #00ffe7;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  width: 120px;
  margin: 0.5rem;
  text-align: right;
`;

const Button = styled.button`
  background: #00ffe7;
  color: #181c20;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  margin-top: 1rem;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #00bfae;
  }
`;

const Result = styled.div`
  color: #fff;
  margin-top: 1.2rem;
  font-size: 1.2rem;
  letter-spacing: 1.1px;
  font-family: 'Orbitron', sans-serif;
`;

interface CurrencyData {
  [key: string]: {
    description: string;
  }
}

const CurrencyConverter: React.FC = () => {
  const [currencies, setCurrencies] = useState<CurrencyData>({});
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch currency symbols
  useEffect(() => {
    fetch("http://api.exchangeratesapi.io/v1/symbols?access_key=97c50ab193f1989aa26e7e380ee4e722")
      .then(res => res.json())
      .then(data => setCurrencies(data.symbols));
  }, []);

  // Convert on button click
  const convert = async () => {
    setLoading(true);
    const res = await fetch(
      `http://api.exchangeratesapi.io/v1/convert?access_key=97c50ab193f1989aa26e7e380ee4e722&from=${from}&to=${to}&amount=${amount}`
    );
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  // Swap currencies
  const swap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  }

  return (
    <Container>
      <Title>
        <FaRobot /> Futuristic Currency Converter
      </Title>
      <div>
        <Input
          type="number"
          value={amount}
          min={1}
          onChange={e => setAmount(+e.target.value)}
        />
        <Select value={from} onChange={e => setFrom(e.target.value)}>
          {Object.entries(currencies).map(([code, data]) =>
            <option key={code} value={code}>
              {code} - {data.description}
            </option>
          )}
        </Select>
      </div>
      <Button onClick={swap} title="Swap Currencies">
        <FaSync /> Swap
      </Button>
      <div>
        <Select value={to} onChange={e => setTo(e.target.value)}>
          {Object.entries(currencies).map(([code, data]) =>
            <option key={code} value={code}>
              {code} - {data.description}
            </option>
          )}
        </Select>
      </div>
      <Button onClick={convert} disabled={loading}>
        {loading ? "Converting..." : "Convert"}
      </Button>
      {result !== null && (
        <Result>
          {amount} {from} ≈ <span style={{ color: "#00ffe7", fontWeight: "bold" }}>{result.toFixed(2)} {to}</span>
        </Result>
      )}
    </Container>
  );
};

export default CurrencyConverter;