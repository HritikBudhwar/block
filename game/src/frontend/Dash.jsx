// import React, { useState, useRef, useEffect } from 'react';

// const Dashboard = ({ onOptionSelect }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const sidebarRef = useRef(null);

//   const toggleSidebar = () => setIsOpen(!isOpen);
//   const closeSidebar = () => setIsOpen(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         closeSidebar();
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleClick = (option) => {
//     if (onOptionSelect) onOptionSelect(option);
//     closeSidebar();
//   };

//   return (
//     <>
//       {/* Hamburger Icon */}
//       <button
//         className="fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-6 focus:outline-none"
//         onClick={toggleSidebar}
//         aria-label="Toggle Dashboard Menu"
//       >
//         <span className="h-1 bg-black rounded transition-transform duration-300 transform" style={{ transform: isOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
//         <span className={`h-1 bg-black rounded transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
//         <span className="h-1 bg-black rounded transition-transform duration-300 transform" style={{ transform: isOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
//       </button>

//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="p-6 pt-16">
//           <h2 className="text-2xl font-bold mb-6 text-white">📋 Dashboard</h2>
//           <nav>
//             <ul className="space-y-4 text-lg">
//               <li>
//                 <button onClick={() => handleClick('Wallet')} className="w-full text-left hover:text-teal-300">
//                   💰 Wallet
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => handleClick('Your Profile')} className="w-full text-left hover:text-teal-300">
//                   🙍‍♂️ Your Profile
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => handleClick('Submission')} className="w-full text-left hover:text-teal-300">
//                   📤 Submission
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => handleClick('Missions')} className="w-full text-left hover:text-teal-300">
//                   🚀 Missions
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>

//       {/* Optional overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-40 z-30"
//           onClick={closeSidebar}
//         ></div>
//       )}
//     </>
//   );
// };

// export default Dashboard;






import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Step 1

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate(); // ✅ Step 2

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (path) => {
    navigate(`/${path}`); // ✅ Step 3
    closeSidebar();
  };

  return (
    <>
      {/* Hamburger Icon */}
      <button
        className="fixed top-4 left-4 z-50 flex flex-col justify-between w-8 h-6 focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle Dashboard Menu"
      >
        <span
          className="h-1 bg-black rounded transition-transform duration-300 transform"
          style={{ transform: isOpen ? 'rotate(45deg) translateY(8px)' : 'none' }}
        />
        <span
          className={`h-1 bg-black rounded transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        />
        <span
          className="h-1 bg-black rounded transition-transform duration-300 transform"
          style={{ transform: isOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }}
        />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-16">
          <h2 className="text-2xl font-bold mb-6 text-white">📋 Dashboard</h2>
          <nav>
            <ul className="space-y-4 text-lg">
              <li>
                <button onClick={() => handleClick('Wallet')} className="w-full text-left hover:text-teal-300">
                  💰 Wallet
                </button>
              </li>
              <li>
                <button onClick={() => handleClick('YourProfile')} className="w-full text-left hover:text-teal-300">
                  🙍‍♂️ Your Profile
                </button>
              </li>
              <li>
                <button onClick={() => handleClick('Submission')} className="w-full text-left hover:text-teal-300">
                  📤 Submission
                </button>
              </li>
              <li>
                <button onClick={() => handleClick('Missions')} className="w-full text-left hover:text-teal-300">
                  🚀 Missions
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-40 z-30" onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default Dashboard;
