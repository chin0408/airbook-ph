"use client";

const steps = [
  { label: "Search", icon: "🔍" },
  { label: "Select Seat", icon: "💺" },
  { label: "Passenger Info", icon: "📝" },
  { label: "Payment", icon: "💳" },
  { label: "Confirmed", icon: "✅" },
];

export default function BookingProgress({ currentStep = 1 }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0px",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
              {/* Step Circle + Label */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "80px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 700,
                    background: isCompleted
                      ? "#10b981"
                      : isActive
                      ? "#2f5af0"
                      : "#e5e7eb",
                    color: isCompleted || isActive ? "#ffffff" : "#9ca3af",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isCompleted ? "✓" : step.icon}
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 500,
                    color: isCompleted
                      ? "#10b981"
                      : isActive
                      ? "#2f5af0"
                      : "#9ca3af",
                    marginTop: "6px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    width: "40px",
                    height: "3px",
                    background: isCompleted ? "#10b981" : "#e5e7eb",
                    borderRadius: "2px",
                    marginBottom: "20px",
                    transition: "all 0.3s ease",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
