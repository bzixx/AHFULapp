import Body from "react-muscle-highlighter";
import "./HeatMap.css";
import { useState } from "react";
import { useSelector } from "react-redux";

const HEAT_COLORS = ["#ef4444"];

export function HeatMap({ data = {}, onMuscleClick }) {
  const [highlightedMuscles, setHighlightedMuscles] = useState([]);
  const pullSelectedDate = useSelector((state) => state.selectedDate);
  const pullExercises = useSelector((state) => state.persistedPullExercises);
  const pullWorkoutTemplates = useSelector((state) => state.persistedPullWorkoutTemplates);
  const pullPersonalExercises = useSelector((state) => state.persistedPullPersonalExercises);

  const handleClick = (part, side) => {
    const slug = part.slug;
    if (!slug) return;

    setHighlightedMuscles((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      return [...prev, slug];
    });

    if (onMuscleClick) {
      onMuscleClick(slug, side);
    }
  };

  const bodyData = highlightedMuscles.map((slug) => ({
    slug,
    intensity: 1,
  }));

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