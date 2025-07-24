import { NavLink } from "react-router-dom";
import { FaBars, FaCalendarTimes, FaCalendarCheck, FaUserCircle, FaTasks } from "react-icons/fa";
import { BiCalendarPlus } from "react-icons/bi";
import { IoPersonAdd } from "react-icons/io5";
import { AiOutlineAreaChart, AiOutlineCalendar } from "react-icons/ai";
import { MdEventNote, MdOutlineAssignment } from 'react-icons/md';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import './HRSideBar.css';

const routes = [
  {
    path: "/Hr",
    name: "Dashboard",
    icon: <AiOutlineAreaChart />,
  },
  {
    path: "/addemployees",
    name: "Add Employee",
    icon: <IoPersonAdd />,
  },
  {
    path: "/hrProfile",
    name: "Profile",
    icon: <FaUserCircle />,
  },
  {
    path: "/hrattendance",
    name: "Attendance",
    icon: <MdEventNote />,
  },
  {
    path: "/hrLeave",
    name: "Leaves",
    icon: <AiOutlineCalendar />,
  },
  // {
  //   path: "/hrOnboarding",
  //   name: "Onboarding",
  //   icon: <HiOutlineUserAdd />,
  // },
  {
    path: "/hrHolidays",
    name: "Holidays",
    icon: <BiCalendarPlus />,
  },
  {
    path: "/hrInterviewprocess",
    name: "Interviews",
    icon: <MdOutlineAssignment />,
  },
  {
    path: "/hrProjects",
    name: "Projects",
    icon: <FaTasks />,
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const toggle = () => setIsOpen(!isOpen);

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
            width: isOpen ? "200px" : "45px",
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar`}
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
                  HR 
                </motion.h1>
              )}
            </AnimatePresence>
            <div className="bars" onClick={toggle}>
              <FaBars />
            </div>
          </div>
          <section className="routes">
            {routes.map((route, index) => (
              <div key={index}>
                <NavLink
                  to={route.path}
                  className="link"
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
            ))}
          </section>
        </motion.div>
        <main className={isOpen ? 'open' : 'closed'}>{children}</main>
      </div>
    </>
  );
};

export default SideBar;
