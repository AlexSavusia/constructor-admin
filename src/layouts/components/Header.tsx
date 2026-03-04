type HeaderProps = {
    onToggleSidebar: () => void;
};

export function Header({ onToggleSidebar }: HeaderProps) {
    return (
        <nav className="app-header navbar navbar-expand bg-body">
            <div className="container-fluid">

                <ul  className="navbar-nav" role="navigation" aria-label="Navigation 1">
                    <li className="nav-item">
                        <button
                            type="button"
                            className="nav-link btn btn-link"
                            onClick={onToggleSidebar}
                        >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512"
                                 className="nav-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"
                                      d="M80 160h352M80 256h352M80 352h352"></path>
                            </svg>
                        </button>
                    </li>

                    <li className="nav-item d-none d-md-block">
          <span className="nav-link">
            Constructor Admin
          </span>
                    </li>
                </ul>

                <ul className="navbar-nav ms-auto" role="navigation" aria-label="Navigation 2" >
                    <li className="nav-item">
                        <div className="input-group input-group-sm me-3">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Поиск..."
                            />
                            <button className="btn btn-outline-secondary">
                                <i className="fas fa-search" />
                            </button>
                        </div>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link btn btn-link">
                            <i className="far fa-bell" />
                        </button>
                    </li>
                    <li className="nav-item">
                  <span className="nav-link d-flex align-items-center gap-2">
                    <i className="far fa-user" />
                    CUCLUS
                  </span>
                    </li>

                </ul>
            </div>
        </nav>
    );
}