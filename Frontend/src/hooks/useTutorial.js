import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSettings } from '../Pages/Settings/SettingsSlice';
import { getUserSettings, updateUserSettings } from '../QueryFunctions';

export const TUTORIAL_STEPS = [
  {
    page: '/WorkoutLogger',
    title: 'Track Your Workouts',
    message: 'Search and add exercises to your workout. Click the "Add Selected Exercises" button to add them to your routine.',
    highlightSelector: '#add-exercises-btn'
  },
  {
    page: '/FoodLog',
    title: 'Log Your Nutrition',
    message: 'Track your meals and nutrition to stay on top of your diet.',
    highlightSelector: null
  },
  {
    page: '/MeasurementLogger',
    title: 'Record Measurements',
    message: 'Keep track of your body measurements to monitor your progress.',
    highlightSelector: null
  },
  {
    page: '/ExploreTasks',
    title: 'Manage Tasks',
    message: 'Stay organized with your daily tasks and goals.',
    highlightSelector: null
  },
  {
    page: '/Profile',
    title: 'Your Profile',
    message: "View your profile information. Don't forget the logout button when you're done!",
    highlightSelector: '#logout-btn'
  }
];

export function useTutorial() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const tutorialComplete = useSelector((state) => state.setting.tutorialComplete);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTutorial = useCallback(() => {
    if (tutorialComplete === false || tutorialComplete === undefined) {
      setIsActive(true);
      setCurrentStep(0);
      const firstStep = TUTORIAL_STEPS[0];
      if (firstStep && window.location.pathname !== firstStep.page) {
        navigate(firstStep.page);
      }
    }
  }, [tutorialComplete, navigate]);

  const endTutorial = useCallback(async (completed = true) => {
    setIsActive(false);
    if (user && user._id) {
      try {
        await updateUserSettings(user._id, { tutorialComplete: true });
        const freshSettings = await getUserSettings(user._id);
        dispatch(setSettings({
          theme: freshSettings.displayMode === "dark" ? "Dark" : "Light",
          units: freshSettings.units ? freshSettings.units.charAt(0).toUpperCase() + freshSettings.units.slice(1) : "Imperial",
          goals: freshSettings.goals || "Lose Fat",
          shame: freshSettings.shameLevel === "low" ? "Off" : "On",
          equipment: freshSettings.availableEquipment || "None",
          gender: freshSettings.gender || "",
          pronouns: freshSettings.pronouns || "",
          dateOfBirth: freshSettings.dateOfBirth || "",
          locations: freshSettings.locations || [],
          tutorialComplete: true
        }));
      } catch (err) {
        console.error("Failed to update tutorial status:", err);
      }
    }
  }, [user, dispatch]);

  const skipTutorial = useCallback(() => {
    endTutorial(false);
  }, [endTutorial]);

  const completeTutorial = useCallback(() => {
    endTutorial(true);
  }, [endTutorial]);

  const nextStep = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      navigate(TUTORIAL_STEPS[nextStepIndex].page);
    } else {
      completeTutorial();
    }
  }, [currentStep, navigate, completeTutorial]);

  useEffect(() => {
    if (tutorialComplete === false || tutorialComplete === undefined) {
      if (user && user._id) {
        startTutorial();
      }
    }
  }, [user, tutorialComplete, startTutorial]);

  return {
    isActive,
    currentStep,
    totalSteps: TUTORIAL_STEPS.length,
    currentStepData: TUTORIAL_STEPS[currentStep],
    startTutorial,
    skipTutorial,
    completeTutorial,
    nextStep
  };
}
