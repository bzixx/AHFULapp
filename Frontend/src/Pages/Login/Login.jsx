import veniceDesktop from "../../../images/Login/venice desktop with overlay.jpg";
import veniceMobile from "../../../images/Login/venice mobile with overlay.jpg";
import "./Login.css";
import "../Dashboard/Dashboard.css";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { handle_google_login, getUserSettings } from "../../QueryFunctions.js";
import { authLogin } from "../../Pages/Login/AuthSlice.jsx";
import { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import { onLoginCache } from "../../components/Cache/OnLoginCache/OnLoginCache.jsx";
import { setSettings } from '../../Pages/Settings/SettingsSlice.jsx'; 
import { StreakCounter } from "../../components/StreakCounter/StreakCounter"; 

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.setting?.theme || "Light");
  const [statusText, setStatusText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showScrollText, setShowScrollText] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const scrollText = "∨ scroll down to learn more ∨";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setShowContent(true);
    const scrollTimer = setTimeout(() => {
      setShowScrollText(true);
      let index = 0;
      const typeInterval = setInterval(() => {
        setTypedText(scrollText.slice(0, index + 1));
        index++;
        if (index >= scrollText.length) {
          clearInterval(typeInterval);
        }
      }, 50);
    }, 2000);
    return () => clearTimeout(scrollTimer);
  }, []);

  const handleTOSClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowTOS(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.email_verified === false) {
        setStatusText(`Logged in as ${user.email}, email not verified`);
        navigate("/NotVerified", { replace: true });
      }
      else {
        setStatusText(`Logged in as ${user.email}`);
        navigate("/Login", { replace: true });
        onLoginCache();
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handle_google_success = async (response) => {
    try {
      setStatusText(`Logging in with Google...`);
      let fetchResponse = await handle_google_login(response);

      if (!fetchResponse || fetchResponse?.ok === false) {
        console.error("Google login failed:", fetchResponse?.error || fetchResponse);
        setStatusText(
          fetchResponse?.error || `Google login failed (${fetchResponse?.status || "unknown"})`,
        );
        return;
      }

      let userSettingsResponse = await getUserSettings();

      if (!userSettingsResponse || userSettingsResponse?.ok === false) {
        console.error("Failed to get user settings:", userSettingsResponse?.error || userSettingsResponse);
        setStatusText(
          userSettingsResponse?.error || `Failed to fetch user settings`,
        );
        return;
      }

      dispatch(authLogin(fetchResponse.user_info));
      dispatch(setSettings(userSettingsResponse));

    } catch (error) {
      console.error("Google login error:", error);
      setStatusText(error.message || "Login failed. Please try again.");
    }
  };

  const handle_google_failure = (error) => {
    console.error("Google Login failed:", error);
    setStatusText("Google login failed. Please try again.");
  };

  // ----- LOGIN Page HTML ---------------------------------------------------------------------------
  return (
    <div className={`login-page ${isScrolled ? 'scrolled' : ''}`}>
      <div className="login-background" style={{ backgroundImage: `url(${isMobile ? veniceMobile : veniceDesktop})` }}></div>
      <div className="login-top-overlay">
        <div className={`login-content ${showContent ? 'fade-in' : ''}`}>
          <div className="login-title">
              <div>
                <h1>AHFUL</h1>
                A Helpful Fitness Utilization Logger App
              </div>
          </div>
          <div className="login-button">
            <GoogleLogin
              size="large"
              width="200"
              text="signin_with"
              theme={theme === "dark" ? "filled_black" : "outline"}
              shape="pill"
              onSuccess={handle_google_success}
              onError={handle_google_failure}
            />
          </div>
          <div className={`scroll-down-text ${showScrollText ? 'fade-in' : ''}`}>
            {typedText}<span className="typing-cursor">|</span>
          </div>
        </div>
      </div>
      <div className="login-tos-button">
        <button onClick={() => setShowTOS(true)} className="tos-link">Terms of Service</button>
      </div>
      <div className="login-dashboard-content">
          <section className="section">
            <div className="solo-page-container">
              <div className="hero-eyebrow">Now in early access</div>
              <h1>Your Personal Fitness, Built for Habit, Now in One AHFUL App.</h1>
              <p>
                AHFUL unites workout & food tracking, body metrics, AI coaching, and
                a real community — turning miserable routines into amazing progress.
                We say it's AHFUL-ly effective.
              </p>
              <div className="streaks-wrapper">
                <StreakCounter count={3} type="workout" loading={false} />
                <StreakCounter count={5} type="food" loading={false} />
              </div>
              <div>
                <a href="#features" className="secondary-cta">
                  Learn More
                </a>
              </div>
            </div>
          </section>
          <section id="features" className="section">
            <div className="solo-page-container">
              <div className="label">What AHFUL does</div>
              <div className="section-title">
                Everything your fitness life needs
              </div>
              <div className="section_grid">
                <div className="section_card">
                  <div className="section_icon">📊</div>
                  <div className="section_name">Track & Log Anything</div>
                  <div className="section_body">
                    Log sets, reps, weights, food, measurements and more.
                  </div>
                </div>
                <div className="section_card">
                  <div className="section_icon">🎯</div>
                  <div className="section_name">Habit Coach</div>
                  <div className="section_body">
                    Micro-goals and reminders to keep momentum every day.
                  </div>
                </div>
                <div className="section_card">
                  <div className="section_icon">🧠</div>
                  <div className="section_name">Smart Programs</div>
                  <div className="section_body">
                    Adaptive plans that respect your schedule and progress.
                  </div>
                </div>
                <div className="section_card">
                  <div className="section_icon">🏋️</div>
                  <div className="section_name">Workout Planning</div>
                  <div className="section_body">
                    Plan, record, and track your fitness journey with precision.
                  </div>
                </div>
                <div className="section_card">
                  <div className="section_icon">🤖</div>
                  <div className="section_name">AI Coaching</div>
                  <div className="section_body">
                    Get personalized workout and nutrition advice from our AI coach.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="login-tos-button">
          <button onClick={() => setShowTOS(true)} className="tos-link">Terms of Service</button>
        </div>
        {showTOS && (
          <div className="tos-modal" onClick={handleTOSClick}>
            <div className="tos-modal-content">
              <button className="tos-close" onClick={() => setShowTOS(false)}>×</button>
              <h1>Terms of Service</h1>
              <p className="tos-intro">These Terms of Service ("Terms") govern your access to and use of the AHFUL app and related services (the "Service"). By accessing or using the Service you agree to be bound by these Terms. If you do not agree to all of the terms, then you may not access the Service.</p>
              <h2>This website is a UW-Stout Student Group Project for Spring 2026</h2>
              <p>The authors of this website are students at the University of Wisconsin-Stout implementing their skills to show off the functional secure website they have built over the semester.</p>
              <h2>1. Using the Service</h2>
              <p>You may use the Service only in compliance with these Terms and all applicable laws. You are responsible for any activity that occurs under your account.</p>
              <h2>2. Accounts</h2>
              <p>Certain features require an account. Keep your account credentials secure. You are responsible for all activity on your account. We may suspend or terminate accounts for violation of these Terms.</p>
              <h2>3. Content</h2>
              <p>You retain ownership of content you submit to the Service. By submitting content you grant the Service a limited license to store, display, and transmit that content as necessary to provide the Service.</p>
              <h2>4. Prohibited Conduct</h2>
              <p>Do not use the Service for illegal activities, harassment, distributing malware, or infringing others' rights. We reserve the right to remove content and restrict accounts for violations.</p>
              <h2>5. Third-Party Links and Integrations</h2>
              <p>The Service may contain links or integrations with third-party services. We are not responsible for third-party content or practices. Your interactions with third parties are solely between you and the third party.</p>
              <h2>6. Disclaimers</h2>
              <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.</p>
              <h2>7. Limitation of Liability</h2>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE SERVICE.</p>
              <h2>8. Changes to These Terms</h2>
              <p>We may update these Terms from time to time. If we make material changes we will provide notice. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
              <h2>9. Contact</h2>
              <p>If you have questions about these Terms, please contact the app owners or maintainers as described on the project repository.</p>
              <h2>10. Contact</h2>
              <p>The Gemini API Additional Terms of Service and the Google Privacy Policy apply. Prompts and responses may be reviewed and used to train Google AI, so don't submit sensitive or personal information. Learn more about data use. Google AI models can make mistakes, so double-check responses before relying on, publishing, or otherwise using generated content.</p>
              <p className="tos-last-updated">Last updated: April 9, 2026</p>
            </div>
          </div>
        )}
    </div>
  );
}