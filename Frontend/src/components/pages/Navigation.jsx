/*
* Navigation Bar Component 
* AUTHORS: AI Generated
*
* CREATED: 2025-10-30
* UPDATED: 2025-11-12
*/

//imports
import { Link, useLocation } from 'react-router-dom';

export default function Navigation(){

  //Use location to determine active link to highlight
  const location = useLocation();

  //View of Navigation buttons listed to set active link
  const navItems = [
    { path: '/', label: 'Sessions'},
    { path: '/aws-credentials', label: 'AWS Credentials' },
    { path: '/threat-mapping', label: 'Threat Mapping Dashboard' },
  ];

  return (
    <nav className="app-navigation">
      
      {/* Flex Box to Hold Logo and Buttons*/}
      <span className='nav-area'>
        <h2>Logs Don't Lie</h2>

        <ul className="nav-menu">
          {/* Map of Navigation Buttons each with their own link */}
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">

              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2>AWS IAM Checker</h2>

      </span>
    </nav>
  );
};

