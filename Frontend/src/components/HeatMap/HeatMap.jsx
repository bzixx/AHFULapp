import Body from "react-muscle-highlighter";
import "./HeatMap.css";
import { useEffect } from "react";


const HEAT_COLORS = ["#ef4444", "#ef4444", "#ef4444"];

export function HeatMap({ data = {}, onMuscleClick }) {
  const selectedDate = useSelector((state) => state.calendar);
  const muscles = useSelector((state) => state.pullExercise.exercises);
  const workouts = useSelector((state) => state.pullWorkout.workouts);

  const bodyData = Object.entries(data)
    .map(([slug, intensity]) => ({
      slug,
      intensity: Math.min(intensity, 3),
    }))
    .filter((part) => part.intensity > 0);

  const handleClick = (part, side) => {
    if (onMuscleClick) {
      onMuscleClick(part.slug || "", side);
    }
  };

  targetedMuscles

  useEffect(()=>{

  }), [selectedDate];

  return (
    <div className="heatmap-container">
      <div className="heatmap-view">
        <h4 className="heatmap-title">Front</h4>
        <Body
          data={bodyData}
          side="front"
          gender="male"
          scale={1.4}
          colors={HEAT_COLORS}
          onBodyPartPress={handleClick}
          border="#333"
          defaultFill="#e5e5e5"
          hiddenParts={["hair", "head"]}
        />
      </div>

      <div className="heatmap-view">
        <h4 className="heatmap-title">Back</h4>
        <Body
          data={bodyData}
          side="back"
          gender="male"
          scale={1.4}
          colors={HEAT_COLORS}
          onBodyPartPress={handleClick}
          border="#333"
          defaultFill="#e5e5e5"
          hiddenParts={["hair"]}
        />
      </div>
    </div>
  );
}

export default HeatMap;
