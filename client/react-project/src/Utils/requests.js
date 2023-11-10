import axios from 'axios';
import jwtDecode from 'jwt-decode';

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

export async function getDocumentsbyId(docId,token){
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

export async function downloadDocumentsbyId(docId,token){
  const url = `http://localhost:5000/documents/downloads/${docId}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType:'blob'
    });

    return response.data; 
  } catch (error) {
    throw error;
  }
}

export async function getVersionsByProjectId(projId,token){
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

export async function getLatestVersionByProjectId(projId,token){
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