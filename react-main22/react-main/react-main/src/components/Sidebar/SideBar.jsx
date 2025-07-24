import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser,FaBuilding,FaTasks,FaUserCircle,FaClipboardCheck  } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { BiAnalyse, BiSearch,BiCalendarPlus } from "react-icons/bi";
import { BiCog } from "react-icons/bi";
import { AiFillHeart, AiTwotoneFileExclamation ,AiOutlineCalendar,AiOutlineDashboard,AiOutlineAreaChart} from "react-icons/ai";
import { BsCartCheck } from "react-icons/bs";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import { RiAdminFill,RiBarChartHorizontalLine  } from "react-icons/ri";
import './SideBar.css'
import { FaProjectDiagram } from "react-icons/fa";
import { MdEventNote,MdPlaylistAddCheck } from 'react-icons/md';
const routes = [
  {
    path: "/Admin",
    name: "Dashboard",
   icon: <AiOutlineAreaChart />,
  },
  {
    path: "/attendance",
    name: "Attendance",
   icon: <MdEventNote />,
  },
  {
    path: "/onboarding",
    name: "OnBoarding",
    icon: <MdPlaylistAddCheck />,
  },
  {
    path: "/leave",
    name: "Leaves",
   icon: <AiOutlineCalendar />,
  },
  {
    path: "/organizational",
    name: "Organization",
    icon: <FaBuilding />,
  },
  {
    path: "/projects",
    name: "Projects",
   icon: <FaTasks />,
    exact: true,
  },
  // {
  //   path: "/performance",
  //   name: "Performance",
  //  icon: <RiBarChartHorizontalLine />,
  // },
  {
    path: "/holidays",
    name: "Holidays",
    icon: <BiCalendarPlus />,
    exact: true,
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <FaUserCircle />,
    exact: true,
  },
  {
    path: "/interviews",
    name: "Interview",
    icon: <FaClipboardCheck />,
    exact: true,
  },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const toggle = () => setIsOpen(!isOpen);
  
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: "5px",
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: '0px',
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
            width: isOpen ? "190px" : "50px",
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
                  <RiAdminFill style={{ fontSize: '24px' }} />
                  Admin
                </motion.h1>
              )}
            </AnimatePresence>
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>

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
              );
            })}
          </section>
        </motion.div>
        <main className={isOpen ? 'open' : 'closed'}>{children}</main>
      </div>
    </>
  );
};

export default SideBar;
