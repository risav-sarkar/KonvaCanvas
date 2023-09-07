import axios from "axios";
export const BaseUrl = "http://192.168.43.11:8000";

export const initialFetch = async (dispatch) => {
  dispatch({ type: "FETCH_USER_START" });
  const token = JSON.parse(localStorage.getItem("MDESIGN_TOKEN")) || null;
  if (token) {
    try {
      dispatch({
        type: "FETCH_USER_SUCCESS",
        payload: { token: token },
      });
    } catch (err) {
      dispatch({ type: "FETCH_USER_FAILURE" });
    }
  }
};

export const signout = (dispatch) => {
  localStorage.removeItem("MDESIGN_TOKEN");

  dispatch({
    type: "USER_SIGNOUT",
  });
};

export const register = async (req, dispatch, navigate, toast) => {
  console.log(req);
  dispatch({ type: "LOGIN_USER_START" });
  try {
    const res = await axios.post(`${BaseUrl}/user/`, req);
    login(
      { email: req.email, password: req.password },
      dispatch,
      navigate,
      toast
    );
    console.log(res.data);
  } catch (err) {
    console.log(err);
    dispatch({ type: "LOGIN_USER_FAILURE", payload: err });
    toast(err.message);
  }
};

export const login = async (req, dispatch, navigate, toast) => {
  console.log("Login Called");
  dispatch({ type: "LOGIN_USER_START" });
  try {
    const res = await axios.post(`${BaseUrl}/user/token/`, req);
    localStorage.setItem("MDESIGN_TOKEN", JSON.stringify(res.data.access));

    console.log(res.data);
    dispatch({
      type: "LOGIN_USER_SUCCESS",
      payload: { token: res.data.access },
    });
    navigate("/");
  } catch (err) {
    console.log(err);
    dispatch({ type: "LOGIN_USER_FAILURE", payload: err });
    toast(err.message);
  }
};

export const postCanvas = async (token, req, setLoading, toast) => {
  try {
    const res = await axios.post(`${BaseUrl}/canvas/`, req, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast("Canvas Saved");
    return res;
  } catch (err) {
    console.log(err);
    toast(err.message);
  } finally {
    setLoading(false);
  }
};

export const patchCanvas = async (token, id, req, setLoading, toast) => {
  try {
    const res = await axios.put(`${BaseUrl}/canvas/${id}`, req, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data);
    toast("Canvas Saved");
  } catch (err) {
    console.log(err);
    toast(err.message);
  } finally {
    setLoading(false);
  }
};

export const deleteCanvas = async (token, id, setLoading, toast, navigate) => {
  try {
    const res = await axios.delete(`${BaseUrl}/canvas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast("Canvas Deleted");
    navigate("/allcanvases");
  } catch (err) {
    console.log(err);
    toast(err.message);
  } finally {
    setLoading(false);
  }
};

export const getAllCanvas = async (params) => {
  const token = params.queryKey[1];
  const res = await axios.get(`${BaseUrl}/canvas/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getCanvas = async (params) => {
  const token = params.queryKey[1];
  const id = params.queryKey[2];
  const res = await axios.get(`${BaseUrl}/canvas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getUserImages = async (params) => {
  const token = params.queryKey[1];

  const res = await axios.get(`${BaseUrl}/image/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getImages = async (params) => {
  const res = await axios.get(`${BaseUrl}/components/`);
  return res.data;
};

export const postImages = async (token, image, toast) => {
  try {
    const data = new FormData();
    data.append("image", image);

    const res = await axios.post(`${BaseUrl}/image/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return "SUCCESS";
  } catch (err) {
    toast("Image upload failed");
    return "FAILED";
  }
};
