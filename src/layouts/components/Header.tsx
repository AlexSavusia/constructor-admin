type HeaderProps = {
    onToggleSidebar: () => void;
};

export function Header({ onToggleSidebar }: HeaderProps) {
    return (
        <nav className="app-header navbar navbar-expand bg-body">
            <div className="container-fluid">
                <ul className="navbar-nav" role="navigation" aria-label="Navigation 1">
                    <li className="nav-item">
                        <button type="button" className="nav-link btn btn-link" onClick={onToggleSidebar}>
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 512 512"
                                className="nav-icon"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeMiterlimit="10"
                                    strokeWidth="32"
                                    d="M80 160h352M80 256h352M80 352h352"
                                ></path>
                            </svg>
                        </button>
                    </li>
                    <li className="nav-item d-none d-md-block">
                        <span className="nav-link">Constructor Admin</span>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto" role="navigation" aria-label="Navigation 2">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="navbar-search" href="#" role="button">
                            <i className="bi bi-search"></i>
                        </a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-bs-toggle="dropdown" href="#">
                            <i className="bi bi-chat-text"></i>
                            <span className="navbar-badge badge text-bg-danger">3</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                            <a href="#" className="dropdown-item">
                                <div className="d-flex">
                                    <div className="flex-shrink-0">
                                        <img
                                            src="./assets/img/user1-128x128.jpg"
                                            alt="User Avatar"
                                            className="img-size-50 rounded-circle me-3"
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h3 className="dropdown-item-title">
                                            Brad Diesel
                                            <span className="float-end fs-7 text-danger">
                                                <i className="bi bi-star-fill"></i>
                                            </span>
                                        </h3>
                                        <p className="fs-7">Call me whenever you can...</p>
                                        <p className="fs-7 text-secondary">
                                            <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item">
                                <div className="d-flex">
                                    <div className="flex-shrink-0">
                                        <img
                                            src="./assets/img/user8-128x128.jpg"
                                            alt="User Avatar"
                                            className="img-size-50 rounded-circle me-3"
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h3 className="dropdown-item-title">
                                            John Pierce
                                            <span className="float-end fs-7 text-secondary">
                                                <i className="bi bi-star-fill"></i>
                                            </span>
                                        </h3>
                                        <p className="fs-7">I got your message bro</p>
                                        <p className="fs-7 text-secondary">
                                            <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item">
                                <div className="d-flex">
                                    <div className="flex-shrink-0">
                                        <img
                                            src="./assets/img/user3-128x128.jpg"
                                            alt="User Avatar"
                                            className="img-size-50 rounded-circle me-3"
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h3 className="dropdown-item-title">
                                            Nora Silvester
                                            <span className="float-end fs-7 text-warning">
                                                <i className="bi bi-star-fill"></i>
                                            </span>
                                        </h3>
                                        <p className="fs-7">The subject goes here</p>
                                        <p className="fs-7 text-secondary">
                                            <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                                        </p>
                                    </div>
                                </div>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item dropdown-footer">
                                See All Messages
                            </a>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-bs-toggle="dropdown" href="#">
                            <i className="bi bi-bell-fill"></i>
                            <span className="navbar-badge badge text-bg-warning">15</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                            <span className="dropdown-item dropdown-header">15 Notifications</span>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item">
                                <i className="bi bi-envelope me-2"></i> 4 new messages
                                <span className="float-end text-secondary fs-7">3 mins</span>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item">
                                <i className="bi bi-people-fill me-2"></i> 8 friend requests
                                <span className="float-end text-secondary fs-7">12 hours</span>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item">
                                <i className="bi bi-file-earmark-fill me-2"></i> 3 new reports
                                <span className="float-end text-secondary fs-7">2 days</span>
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item dropdown-footer">
                                {' '}
                                See All Notifications{' '}
                            </a>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" data-lte-toggle="fullscreen">
                            <i data-lte-icon="maximize" className="bi bi-arrows-fullscreen"></i>
                            <i data-lte-icon="minimize" className="bi bi-fullscreen-exit" style={{ display: 'none' }}></i>
                        </a>
                    </li>
                    <li className="nav-item dropdown user-menu">
                        <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            <i className="me-2 rounded-circle far fa-user" />
                            <span className="d-none d-md-inline">Alexander Pierce</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                            <li className="user-header text-bg-primary">
                                <i className="me-2 rounded-circle  far fa-user" />
                                <p>
                                    Alexander Pierce - Web Developer
                                    <small>Member since Nov. 2023</small>
                                </p>
                            </li>
                            <li className="user-body">
                                <div className="row">
                                    <div className="col-4 text-center">
                                        <a href="#">Followers</a>
                                    </div>
                                    <div className="col-4 text-center">
                                        <a href="#">Sales</a>
                                    </div>
                                    <div className="col-4 text-center">
                                        <a href="#">Friends</a>
                                    </div>
                                </div>
                            </li>
                            <li className="user-footer">
                                <a href="#" className="btn btn-default btn-flat">
                                    Profile
                                </a>
                                <a href="#" className="btn btn-default btn-flat float-end">
                                    Sign out
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
