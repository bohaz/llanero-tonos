import { useState } from "react";
import TransportSelector from "@/components/transport/TransportSelector";
import TransportResult from "@/components/transport/TransportResult";
import { calculateTransport } from "@/lib/music/transport";

export default function HarpTransport() {
  const [from, setFrom] = useState("RE");
  const [to, setTo] = useState("LA");
  const [result, setResult] = useState(null);

  return (
    <div className="space-y-6">
      <TransportSelector
        from={from}
        to={to}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onCalculate={() =>
          setResult(calculateTransport(from, to))
        }
      />

      {result && <TransportResult result={result} />}
    </div>
  );
}
