import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSettings } from '../Pages/Settings/SettingsSlice.jsx';
import { getUserSettings, updateUserSettings } from '../QueryFunctions';

/**
 * TUTORIAL_STEPS - Configuration for the onboarding tutorial flow
 * 
 * Each step defines:
 * - page: The route path to navigate to
 * - title: Display title shown in the tooltip
 * - message: Description text shown in the tooltip
 * - highlightSelector: CSS selector for element to highlight (optional)
 * 
 * The tutorial walks new users through:
 * 1. WorkoutLogger - Exercise tracking
 * 2. FoodLog - Nutrition logging
 * 3. MeasurementLogger - Body measurements
 * 4. ExploreTasks - Task management
 * 5. Profile - Profile and logout
 */
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

/**
 * useTutorial - Hook to manage first-time user onboarding tutorial
 * 
 * Responsibilities:
 * - Auto-start tutorial when user first logs in (if tutorialComplete is false/undefined)
 * - Track current step in the tutorial
 * - Navigate between tutorial steps
 * - Handle tutorial completion/skipping
 * - Persist tutorial completion status to backend
 * 
 * @returns {Object} Tutorial state and control functions
 */
export function useTutorial() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state selectors
  const user = useSelector((state) => state.auth.user);
  const tutorialComplete = useSelector((state) => state.setting.tutorialComplete);
  
  // Local state for tutorial UI
  const [isActive, setIsActive] = useState(false);      // Whether tutorial overlay is visible
  const [currentStep, setCurrentStep] = useState(0);     // Current step index (0-based)
  
  // UseRef to track if tutorial has auto-started (prevents re-triggering on re-renders)
  // Using useRef instead of useState because we don't want to trigger re-renders
  const hasAutoStarted = useRef(false);

  /**
   * startTutorial - Initiates the tutorial flow
   * 
   * Actions:
   * - Sets isActive to true (shows tutorial overlay)
   * - Resets currentStep to 0 (first step)
   * - Sets hasAutoStarted flag to prevent re-triggering
   * - Navigates to first tutorial step if not already there
   * 
   * Note: Only runs once per app session due to hasAutoStarted check
   */
  const startTutorial = useCallback(() => {
    if (!hasAutoStarted.current) {
      setIsActive(true);
      setCurrentStep(0);
      hasAutoStarted.current = true;
      const firstStep = TUTORIAL_STEPS[0];
      if (firstStep && window.location.pathname !== firstStep.page) {
        navigate(firstStep.page);
      }
    }
  }, [navigate]);

  /**
   * endTutorial - Handles tutorial exit (via skip or completion)
   * 
   * Actions:
   * - Hides the tutorial overlay (isActive = false)
   * - Posts { tutorialComplete: true } to backend database
   * - Fetches fresh settings from backend to ensure sync
   * - Updates Redux store with fresh settings including tutorialComplete: true
   * 
   * @param {boolean} completed - Whether tutorial was completed (true) or skipped (false)
   *                           - Both paths currently result in tutorialComplete: true
   */
  const endTutorial = useCallback(async (completed = true) => {
    setIsActive(false);
    if (user && user._id) {
      try {
        // Step 1: Update backend with tutorial completion status
        await updateUserSettings(user._id, { tutorialComplete: true });
        
        // Step 2: Fetch fresh settings from backend to sync Redux state
        const freshSettings = await getUserSettings(user._id);
        
        // Step 3: Update Redux store with all fresh settings
        dispatch(setSettings({
          theme: freshSettings.displayMode,
          units: freshSettings.units,
          goals: freshSettings.goals ,
          shame: freshSettings.shameLevel ,
          equipment: freshSettings.availableEquipment,
          gender: freshSettings.gender,
          pronouns: freshSettings.pronouns,
          dateOfBirth: freshSettings.dateOfBirth,
          locations: freshSettings.locations,
          tutorialComplete: true
        }));
      } catch (err) {
        console.error("Failed to update tutorial status:", err);
      }
    }
  }, [user, dispatch]);

  /**
   * skipTutorial - Called when user clicks "Skip Tutorial" button
   * Delegates to endTutorial with completed=false
   */
  const skipTutorial = useCallback(() => {
    endTutorial(false);
  }, [endTutorial]);

  /**
   * completeTutorial - Called when user completes the final tutorial step
   * Delegates to endTutorial with completed=true
   */
  const completeTutorial = useCallback(() => {
    endTutorial(true);
  }, [endTutorial]);

  /**
   * nextStep - Advances to the next tutorial step
   * 
   * Logic:
   * - If not on last step: increment currentStep and navigate to next page
   * - If on last step: call completeTutorial() to finish the tutorial
   */
  const nextStep = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      navigate(TUTORIAL_STEPS[nextStepIndex].page);
    } else {
      completeTutorial();
    }
  }, [currentStep, navigate, completeTutorial]);

  /**
   * Auto-start effect - Initiates tutorial on first app load
   * 
   * Conditions for auto-start:
   * - Tutorial has not already auto-started (hasAutoStarted.current === false)
   * - User is logged in (user && user._id exists)
   * - Tutorial has not been completed (tutorialComplete is false or undefined)
   * 
   * Note: hasAutoStarted is a ref (not state) to prevent re-triggering on re-renders
   * without causing additional re-renders itself.
   */
  useEffect(() => {
    if (hasAutoStarted.current) return;
    
    if ((tutorialComplete === false || tutorialComplete === undefined) && user && user._id) {
      startTutorial();
    }
  }, [user, tutorialComplete]);

  /**
   * Returned interface for components using this hook
   * 
   * @returns {Object} {
   *   isActive: boolean - Whether tutorial overlay should be visible
   *   currentStep: number - Current step index (0-based)
   *   totalSteps: number - Total number of tutorial steps
   *   currentStepData: Object - Configuration for current step from TUTORIAL_STEPS
   *   startTutorial: Function - Manual trigger to start tutorial
   *   skipTutorial: Function - Skip the entire tutorial
   *   completeTutorial: Function - Mark tutorial as completed
   *   nextStep: Function - Advance to next tutorial step
   * }
   */
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
