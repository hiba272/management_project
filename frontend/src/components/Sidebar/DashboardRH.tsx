import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo/logo.svg';
import SidebarLinkGroup from './SidebarLinkGroup';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const DashboardRH = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );
  const [userRole, setUserRole] = useState({ is_rh: false, is_employe: false, is_candidate: false });

  useEffect(() => {
    const roleData = JSON.parse(localStorage.getItem('UserRole') || '{}');

    if (roleData) {
      setUserRole(roleData);
    }
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          {/* ...SVG icon... */}
        </button>
      </div>

      {/* Welcome message based on user role */}
      {userRole.is_rh && <p>Welcome, HR Manager!</p>}
      {userRole.is_employe && <p>Welcome, Employee! Access your resources here.</p>}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* Menu Group */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* Menu Item Dashboard */}
              {userRole.is_rh && (
                <>
                  {/* Menu Item Dashboard */}
                  <SidebarLinkGroup activeCondition={pathname === '/' || pathname.includes('dashboard')}>
                    {(handleClick, open) => (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/' || pathname.includes('dashboard')) && 'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                          }}
                        >
                          Dashboard RH
                        </NavLink>
                      </React.Fragment>
                    )}
                  </SidebarLinkGroup>

                  
                  {/* Menu Item Employe */}
                  <SidebarLinkGroup activeCondition={pathname === '/employe' || pathname.includes('forms')}>
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              (pathname === '/forms' || pathname.includes('forms')) && 'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                fill=""
                              />
                              <path
                                d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                fill=""
                              />
                            </svg>
                            Employes
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </NavLink>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              <li>
                                <NavLink
                                  to="/addEmploye"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Ajouter un Employe
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/listeEmployes"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Lister les employes
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  {/* Menu Item Employe */}
                  <SidebarLinkGroup activeCondition={pathname === '/employe' || pathname.includes('forms')}>
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              (pathname === '/forms' || pathname.includes('forms')) && 'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                fill=""
                              />
                              <path
                                d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                fill=""
                              />
                            </svg>
                            Offres d'emploi
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </NavLink>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              <li>
                                <NavLink
                                  to="/addEmploye"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Ajouter un offre d'emploi
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/listeEmployes"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Lister les offres
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                </>
              )}
          
            
              {/* Menu Item Dashboard */}
              {userRole.is_employe && (
                <>
                  {/* Menu Item Dashboard */}
                  <SidebarLinkGroup activeCondition={pathname === '/' || pathname.includes('dashboard')}>
                    {(handleClick, open) => (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/' || pathname.includes('dashboard')) && 'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                          }}
                        >
                          Dashboard Employee
                        </NavLink>
                      </React.Fragment>
                    )}
                  </SidebarLinkGroup>

                  {/* Menu Item Employe */}
                  <SidebarLinkGroup activeCondition={pathname === '/employe' || pathname.includes('forms')}>
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              (pathname === '/forms' || pathname.includes('forms')) && 'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                fill=""
                              />
                              <path
                                d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                fill=""
                              />
                            </svg>
                            Conges
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </NavLink>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              <li>
                                <NavLink
                                  to="/demandeConge"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  demander un congé
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/listeEmployes"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  liste de conge 
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  {/* Menu Item Employe */}
                  <SidebarLinkGroup activeCondition={pathname === '/employe' || pathname.includes('forms')}>
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              (pathname === '/forms' || pathname.includes('forms')) && 'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                fill=""
                              />
                              <path
                                d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                fill=""
                              />
                            </svg>
                            Employes
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </NavLink>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              <li>
                                <NavLink
                                  to="/addEmploye"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Ajouter un Employe
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/listeEmployes"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Lister les employes
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default DashboardRH;
