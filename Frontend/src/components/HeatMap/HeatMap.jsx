import Body from "react-muscle-highlighter";
import "./HeatMap.css";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const HEAT_COLORS = ["#ef4444"];

const MUSCLE_SLUG_MAP = {
  chest: ["chest"],
  back: ["upper-back", "lower-back"],
  shoulders: ["deltoids"],
  biceps: ["biceps"],
  triceps: ["triceps"],
  forearms: ["forearm"],
  abs: ["abs"],
  obliques: ["obliques"],
  quads: ["quadriceps"],
  hamstrings: ["hamstring"],
  glutes: ["gluteal"],
  calves: ["calves"],
  hip_flexors: ["adductors"],
  traps: ["trapezius"],
  lats: ["upper-back"],
  serratus: ["chest"],
};

function mapTargetMuscleToSlug(targetMuscle) {
  if (!targetMuscle) return [];
  const lower = targetMuscle.toLowerCase().replace(/\s+/g, '_');
  if (MUSCLE_SLUG_MAP[lower]) {
    return MUSCLE_SLUG_MAP[lower];
  }
  if (lower.includes('abs')) return MUSCLE_SLUG_MAP.abs;
  if (lower.includes('chest') || lower.includes('pectoral')) return MUSCLE_SLUG_MAP.chest;
  if (lower.includes('back') && (lower.includes('upper') || lower.includes('lat'))) return ['upper-back'];
  if (lower.includes('back') && lower.includes('lower')) return ['lower-back'];
  if (lower.includes('back')) return MUSCLE_SLUG_MAP.back;
  if (lower.includes('shoulder') || lower.includes('deltoid')) return MUSCLE_SLUG_MAP.shoulders;
  if (lower.includes('bicep')) return MUSCLE_SLUG_MAP.biceps;
  if (lower.includes('tricep')) return MUSCLE_SLUG_MAP.triceps;
  if (lower.includes('forearm')) return MUSCLE_SLUG_MAP.forearms;
  if (lower.includes('oblique')) return MUSCLE_SLUG_MAP.obliques;
  if (lower.includes('quad') || lower.includes('rectus_femoris')) return MUSCLE_SLUG_MAP.quads;
  if (lower.includes('hamstring')) return MUSCLE_SLUG_MAP.hamstrings;
  if (lower.includes('glute')) return MUSCLE_SLUG_MAP.glutes;
  if (lower.includes('calf') || lower.includes('gastroc') || lower.includes('soleus')) return MUSCLE_SLUG_MAP.calves;
  if (lower.includes('hip') && lower.includes('flexor')) return MUSCLE_SLUG_MAP.hip_flexors;
  if (lower.includes('trap')) return MUSCLE_SLUG_MAP.traps;
  if (lower.includes('serratus')) return MUSCLE_SLUG_MAP.serratus;
  if (lower.includes('adductor')) return MUSCLE_SLUG_MAP.hip_flexors;
  return [];
}

function getDateStringFromTimestamp(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function HeatMap({ data = {} }) {
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
  const workouts = useSelector((state) => state.pullWorkout.workouts);
  const exercises = useSelector((state) => state.pullExercise.exercises);
  const personalExercises = useSelector((state) => state.pullPersonalExercise.personalExercises);

  const [highlightedMuscles, setHighlightedMuscles] = useState([]);

  useEffect(() => {
    console.log('========== HEATMAP DEBUG ==========');
    console.log('selectedDate:', selectedDate);
    console.log('workouts:', workouts);
    console.log('exercises:', exercises);
    console.log('personalExercises:', personalExercises);

    if (!selectedDate) {
      setHighlightedMuscles([]);
      return;
    }

    const selectedDateStr = selectedDate.slice(0, 10);
    console.log('selectedDateStr:', selectedDateStr);

    const todaysWorkout = workouts?.find(w => {
      const workoutDateStr = getDateStringFromTimestamp(w?.startTime);
      const match = workoutDateStr === selectedDateStr;
      console.log('Comparing workout:', w?.title, 'date:', workoutDateStr, '===', selectedDateStr, '=', match);
      return match;
    });

    console.log('todaysWorkout:', todaysWorkout);

    if (!todaysWorkout) {
      setHighlightedMuscles([]);
      return;
    }

    const workoutPersonalExercises = personalExercises?.filter(
      pe => pe?.workout_id === todaysWorkout._id
    ) || [];

    console.log('workoutPersonalExercises:', workoutPersonalExercises);

    if (workoutPersonalExercises.length === 0) {
      setHighlightedMuscles([]);
      return;
    }

    const targetMuscles = new Set();

    workoutPersonalExercises.forEach(pe => {
      console.log('pe.exercise_id:', pe.exercise_id, 'type:', typeof pe.exercise_id);
      
      const exercise = exercises?.find(e => {
        console.log('e._id:', e._id, 'type:', typeof e._id, 'match:', e._id === pe.exercise_id);
        return e?._id === pe?.exercise_id;
      });
      console.log('found exercise:', exercise);
      if (exercise && Array.isArray(exercise.targetMuscles)) {
        console.log('targetMuscles:', exercise.targetMuscles);
        exercise.targetMuscles.forEach(tm => {
          const slugs = mapTargetMuscleToSlug(tm);
          console.log('mapped:', tm, '->', slugs);
          slugs.forEach(s => targetMuscles.add(s));
        });
      }
    });

    console.log('final highlightedMuscles:', Array.from(targetMuscles));
    setHighlightedMuscles(Array.from(targetMuscles));
  }, [selectedDate, workouts, exercises, personalExercises]);

  const bodyData = highlightedMuscles.map((slug) => ({
    slug,
    intensity: 1,
  }));

  console.log('HeatMap bodyData:', bodyData);

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
          border="#333"
          defaultFill="#e5e5e5"
          hiddenParts={["hair", "head"]}
        />
      </div>
    </div>
  );
}

export default HeatMap;