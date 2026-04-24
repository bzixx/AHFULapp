import './siteStyles.css';

export function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}
