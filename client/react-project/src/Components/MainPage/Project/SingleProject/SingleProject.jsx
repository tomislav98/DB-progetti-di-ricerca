import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Chart from 'chart.js/auto'; // Import Chart.js
import feather from 'feather-icons';

function MyDashboard({title=''}) {
    const chartRef = useRef(null);

  useEffect(() => {
    const ctx = document.getElementById('myChart');
    
    feather.replace({ 'aria-hidden': 'true' });

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        datasets: [{
          data: [
            15339,
            21345,
            18483,
            24003,
            23489,
            24092,
            12034
          ],
          tension: 0, // Use 'tension' instead of 'lineTension'
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          borderWidth: 4,
          pointBackgroundColor: '#007bff'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }, []);

    return (
        <main className="col-md-9 col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{title}</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                        <span data-feather="calendar" className="align-text-bottom"></span>
                        This week
                    </button>
                </div>
            </div>

            <canvas className="my-4 w-100" id="myChart" width="900" height="380"></canvas>

            <h2>Project's versions</h2>
            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Header</th>
                            <th scope="col">Header</th>
                            <th scope="col">Header</th>
                            <th scope="col">Header</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1,001</td>
                            <td>random</td>
                            <td>data</td>
                            <td>placeholder</td>
                            <td>text</td>
                        </tr>
                        <tr>
                            <td>1,002</td>
                            <td>placeholder</td>
                            <td>irrelevant</td>
                            <td>visual</td>
                            <td>layout</td>
                        </tr>
                        <tr>
                            <td>1,003</td>
                            <td>data</td>
                            <td>rich</td>
                            <td>dashboard</td>
                            <td>tabular</td>
                        </tr>
                        <tr>
                            <td>1,003</td>
                            <td>information</td>
                            <td>placeholder</td>
                            <td>illustrative</td>
                            <td>data</td>
                        </tr>
                        <tr>
                            <td>1,004</td>
                            <td>text</td>
                            <td>random</td>
                            <td>layout</td>
                            <td>dashboard</td>
                        </tr>
                        <tr>
                            <td>1,005</td>
                            <td>dashboard</td>
                            <td>irrelevant</td>
                            <td>text</td>
                            <td>placeholder</td>
                        </tr>
                        <tr>
                            <td>1,006</td>
                            <td>dashboard</td>
                            <td>illustrative</td>
                            <td>rich</td>
                            <td>data</td>
                        </tr>
                        <tr>
                            <td>1,007</td>
                            <td>placeholder</td>
                            <td>tabular</td>
                            <td>information</td>
                            <td>irrelevant</td>
                        </tr>
                        <tr>
                            <td>1,008</td>
                            <td>random</td>
                            <td>data</td>
                            <td>placeholder</td>
                            <td>text</td>
                        </tr>
                        <tr>
                            <td>1,009</td>
                            <td>placeholder</td>
                            <td>irrelevant</td>
                            <td>visual</td>
                            <td>layout</td>
                        </tr>
                        <tr>
                            <td>1,010</td>
                            <td>data</td>
                            <td>rich</td>
                            <td>dashboard</td>
                            <td>tabular</td>
                        </tr>
                        <tr>
                            <td>1,011</td>
                            <td>information</td>
                            <td>placeholder</td>
                            <td>illustrative</td>
                            <td>data</td>
                        </tr>
                        <tr>
                            <td>1,012</td>
                            <td>text</td>
                            <td>placeholder</td>
                            <td>layout</td>
                            <td>dashboard</td>
                        </tr>
                        <tr>
                            <td>1,013</td>
                            <td>dashboard</td>
                            <td>irrelevant</td>
                            <td>text</td>
                            <td>visual</td>
                        </tr>
                        <tr>
                            <td>1,014</td>
                            <td>dashboard</td>
                            <td>illustrative</td>
                            <td>rich</td>
                            <td>data</td>
                        </tr>
                        <tr>
                            <td>1,015</td>
                            <td>random</td>
                            <td>tabular</td>
                            <td>information</td>
                            <td>text</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default function SingleProject({ projects }) {
    const [projectVersions, setProjectVersions] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [rightValue, setRightValue] = useState(100);

    const navigate = useNavigate();

    const updateRightValue = () => {
        if (rightValue > 0) {
            if (rightValue > 0.1)
                setRightValue(rightValue * 0.90);
            else if (rightValue > 0.1)
                setRightValue(rightValue * 0.66); // Riduci gradualmente il valore di "right"
            else
                setRightValue(0);
        }
    };

    function findCurrentProject(projects) {
        const currentPath = window.location.pathname;
        const segments = currentPath.split('/');
        const projectId = parseInt(segments[segments.length - 1]);
        const current = projects.find((proj) => { return proj.id === projectId })

        console.log(current.id)

        setCurrentProject(current);
    }

    function fetchProjects() {
        let token = null;
        let user_id = null;

        try {
            token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            user_id = decodedToken.user_id;

        } catch (error) {
            navigate('/login')
        }

        axios.get('http://localhost:5000/researchers/' + user_id + '/projects', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
            .then((response) => {
                findCurrentProject(response.data);
                setProjectList(response.data.reverse());
            })
            .catch((error) => {
                console.error('Errore nella chiamata Axios:', error);
            });
    }

    function fetchVersions() {
        let token = null;

        try {
            token = localStorage.getItem('token');
        } catch (error) {
            navigate('/login');
        }

        if (projects.length === 0)
            fetchProjects();
        else {
            setProjectList(projects);
            findCurrentProject(projects);
        }

        const currentPath = window.location.pathname;
        const segments = currentPath.split('/');
        const projectId = segments[segments.length - 1];

        axios({
            method: 'GET',
            url: `http://localhost:5000/projects/${projectId}/versions`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setProjectVersions(response.data);
            })
            .catch((error) => {
                console.error('Errore nella richiesta:', error);
            });
    }

    function handleGoBack() {
        navigate('/mainpage/projects')
    }

    useEffect(() => {
        fetchVersions();

    }, []);

    useEffect(() => {
        const intervalId = setInterval(updateRightValue, 17);

        // Controlla se rightValue è diventato 0, e in tal caso, pulisci l'intervallo
        if (rightValue === 0) {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [rightValue]);

    return (
        <div className="project-slider" style={{ right: `${rightValue}vw` }}>
            <nav className="navbar navbar-light justify-content-start" style={{ height: '10%', paddingLeft: '25px', paddingRight: '25px' }}>
                <FontAwesomeIcon icon={faAngleLeft} style={{ cursor: "pointer" }} onClick={handleGoBack} />
                <Breadcrumbs aria-label="breadcrumb" style={{ marginLeft: '25px' }}>
                    <Link underline="hover" color="inherit" href="/">
                        Mainpage
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/material-ui/getting-started/installation/"
                    >
                        Projects
                    </Link>
                    <Typography color="text.primary">Project {currentProject ? currentProject.id : null} </Typography>
                </Breadcrumbs>
            </nav>

            <div className="container-fluid" style={{ height: '90%', paddingLeft: '25px' }} >
                {
                    currentProject?
                    <MyDashboard title={currentProject.name? currentProject.name : ''}/>
                    :
                    <MyDashboard title={''}/>
                }

            </div>
        </div>
    )
}