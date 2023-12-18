import axios from 'axios';
import jwtDecode from 'jwt-decode';

export async function updateProject(userId, projId, token, updateData) {
  const url = `http://localhost:5000/researchers/${userId}/projects/${projId}`;

  try {
    const response = await axios.put(url, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })
    return response;
  } catch (error) {
    throw error;
  }
}

export async function createProject(userId, token, projectData) {
  const url = `http://localhost:5000/researchers/${userId}/projects`;

  try {
    const response = await axios.post(url, projectData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function submitProject(userId, projectId, token) {
  const url = `http://localhost:5000/researchers/${userId}/projects/${projectId}/submit`;

  try {
    const response = await axios.put(url, '', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function withdrawProject(userId, projectId, token) {
  const url = `http://localhost:5000/researchers/${userId}/projects/${projectId}/withdraw`;

  try {
    const response = await axios.put(url, '', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function getToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token not found');
  }
  return token;
}

export function getDecodedToken() {
  const token = getToken();
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Token decoding error');
  }
}

export async function getDocumentsbyId(docId, token) {
  const url = `http://localhost:5000/documents/${docId}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function downloadDocumentsbyId(docId, token) {
  const url = `http://localhost:5000/documents/downloads/${docId}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getVersionsByProjectId(projId, token) {
  const url = `http://localhost:5000/projects/${projId}/versions`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getLatestVersionByProjectId(projId, token) {
  const url = `http://localhost:5000/projects/${projId}/versions`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.all_versions[0];
  } catch (error) {
    throw error;
  }
}

export async function getAllEvaluationWindows(token) {
  const url = `http://localhost:5000/evaluation-window/`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function getProjectsByWindowId(token, windowId) {
  const url = `http://localhost:5000/evaluation-window/${windowId}/projects`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }


}

export async function getReportsByProjectId(token, projectId) {
  const url = `http://localhost:5000/projects/${projectId}/report`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }

}

export async function getProjectsToValue(token) {
  const url = `http://localhost:5000/evaluators/projects`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error
  }

}

export async function getEvaluatorReports(token) {
  const url = `http://localhost:5000/evaluators/reports`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error
  }

}
export async function createEvalautionWindow(token, dateData) {
  const url = `http://localhost:5000/evaluation-window/`;

  try {
    const response = await axios.post(url, dateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
        return response;
  } catch (error) {
    throw error
  }

}

export async function createReport(token, projectId, vote, file){
  const url = `http://localhost:5000/projects/${projectId}/report`;
  const body = {
    vote: Math.floor(vote),
    file: file
  }

  try {
    const response = await axios.post(url,body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    throw error
  }

}
