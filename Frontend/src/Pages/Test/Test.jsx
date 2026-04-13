import { useSelector } from "react-redux";

export function Test() {
  const pullTemplateState = useSelector((state) => state.pullTemplate);


  return (
    <>
      <h1>Test Page</h1>
      <h2>Templates in Cache:</h2>

      {pullTemplateState.templates && pullTemplateState.templates.length > 0 ? (
        pullTemplateState.templates.map((template, index) => (
          <div key={index}>
            {template.title || template._id || JSON.stringify(template)}
          </div>
        ))
      ) : (
        <p>No templates found</p>
      )}
    </>
  );
}