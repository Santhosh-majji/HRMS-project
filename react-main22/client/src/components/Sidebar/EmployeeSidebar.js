import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser,FaTasks } from "react-icons/fa";
import { MdHome, MdMessage,MdEventNote } from "react-icons/md";
import { BiAnalyse, BiSearch, BiLock, BiDollarCircle, BiUser, BiHome,BiTrendingUp,BiCalendarPlus } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { AiFillHeart, AiTwotoneFileExclamation,AiOutlineAreaChart,AiOutlineCalendar } from "react-icons/ai";
import { BsCartCheck } from "react-icons/bs";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import './EmployeeSidebar.css'
import { FaUserTie } from "react-icons/fa6";
const routes = [
  {
    path: "/Employee",
    name: "Dashboard",
    icon: <AiOutlineAreaChart />,
  },
  {
    path: "/employeeProfile", // Path for Employee Profile
    name: "Profile", // Name of the link
    icon: <BiUser />, // Icon for Employee Profile
  },
  // {
  //   path: "/employeePerformance",
  //   name: "Performance",
  //   icon: <BiTrendingUp />,
  // },
  {
    path: "/employeeProjects",
    name: "Projects",
    icon: <FaTasks />,
  },
  {
    path: "/employeeleave",
    name: "Leaves",
   icon: <AiOutlineCalendar />,
  },
  {
    path: "/employeeattendance",
    name: "Attendance",
    icon: <MdEventNote />,
  },
  {
    path: "/employeeholidays",
    name: "Holidays",
    icon: <BiCalendarPlus />,
  },
];
  const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };
  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "180px" : "45px",
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
<FaUserTie style={{fontSize:'24px'}} />
                  Employee
                </motion.h1>
              )}
            </AnimatePresence>
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          {/* <div className="search">
            <div className="search_icon">
              <BiSearch />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.input
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={inputAnimation}
                  type="text"
                  placeholder="Search"
                />
              )}
            </AnimatePresence>
          </div> */}
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    key={index}
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }
              return (
                <div key={index}>
                <NavLink
  to={route.path}
  className="link no-underline" // Apply the no-underline class here
  activeClassName="active"
  onMouseEnter={() => setHoveredIcon(route.name)}
  onMouseLeave={() => setHoveredIcon(null)}
>
  <div className="icon" title={hoveredIcon}>
    {route.icon}
  </div>
  <AnimatePresence>
    {isOpen && (
      <motion.div
        variants={showAnimation}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="link_text"
      >
        {route.name}
      </motion.div>
    )}
  </AnimatePresence>
</NavLink>

                </div>
              );
            })}
          </section>
        </motion.div>
        <main className={isOpen?'open':'closed'}>{children}</main>
      </div>
    </>
  );
};
export default SideBar;
 