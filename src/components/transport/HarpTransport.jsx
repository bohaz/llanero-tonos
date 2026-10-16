import { useState } from "react";
import TransportSelector from "@/components/transport/TransportSelector";
import TransportResult from "@/components/transport/TransportResult";
import { calculateTransport } from "@/lib/music/transport";

export default function HarpTransport() {
  const [from, setFrom] = useState("RE");
  const [to, setTo] = useState("LA");
  const [steps, setSteps] = useState(null);

  return (
    <div className="space-y-6">
      <TransportSelector
        from={from}
        to={to}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onCalculate={() => setSteps(calculateTransport(from, to))}
      />

      {steps && <TransportResult steps={steps} />}
    </div>
  );
}
