import React from "react";

const getBMI = (weight, height) => {
  if (!weight || !height) return null;
  const h = height / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
};

const getColor = (bmi) => {
  if (bmi < 18.5) return "text-blue-500";
  if (bmi < 25) return "text-green-600";
  return "text-red-500";
};

const getLabel = (bmi) => {
  if (bmi < 18.5) return "НЕДОВАГА";
  if (bmi < 25) return "НОРМА";
  return "НАДМІРНА ВАГА";
};

// 180 градусів поділено рівномірно від BMI 16 до 40
const getAngle = (bmi) => {
  if (bmi <= 16) return 0;
  if (bmi <= 18.5) {
    // Недовага (16–18.5) → 0°–60°
    return ((bmi - 16) / (18.5 - 16)) * 60;
  }
  if (bmi <= 25) {
    // Норма (18.5–25) → 60°–120°
    return 60 + ((bmi - 18.5) / (25 - 18.5)) * 60;
  }
  if (bmi <= 40) {
    // Надмірна вага (25–40) → 120°–180°
    return 120 + ((bmi - 25) / (40 - 25)) * 60;
  }
  return 180;
};

const polarToCartesian = (cx, cy, r, angle) => {
  const radians = (angle - 180) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  };
};

const arcPath = (startAngle, endAngle, radius = 90) => {
  const start = polarToCartesian(100, 100, radius, startAngle);
  const end = polarToCartesian(100, 100, radius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? "1" : "0";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ].join(" ");
};

const BMIIndicator = ({ height, weight }) => {
  const bmi = getBMI(weight, height);
  const angle = getAngle(bmi);
  const color = getColor(bmi);
  const label = getLabel(bmi);

  const start = { x: 100, y: 100 };
  const end = polarToCartesian(100, 100, 80, angle);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-48 h-32">
        <svg width="200" height="200" viewBox="0 0 200 150">
          {/* Arc segments */}
          <path d={arcPath(0, 60)} stroke="blue" strokeWidth="12" fill="none" />
          <path d={arcPath(60, 120)} stroke="green" strokeWidth="12" fill="none" />
          <path d={arcPath(120, 180)} stroke="red" strokeWidth="12" fill="none" />

          {/* Arrow definition */}
          <defs>
            <marker
              id="arrow"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" className="fill-black dark:fill-white" />
            </marker>
          </defs>

          {/* Arrow line */}
          {bmi && (
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              strokeWidth="3"
              className="stroke-black dark:stroke-white"
              markerEnd="url(#arrow)"
            />
          )}
        </svg>
      </div>
      {bmi && (
        <>
          <div className={`text-xl font-semibold ${color}`}>{bmi}</div>
          <div className={`text-sm font-medium ${color}`}>{label}</div>
        </>
      )}
    </div>
  );
};

export default BMIIndicator;
