import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { downloadFile, getFiles, logout, uploadFile } from "./api";
import { userLogout } from "../store/actions/auth";
import ErrorMessage from "../components/ErrorMessage";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState();
  const [isFileSelected, setIsFileSelected] = useState();
  const [files, setFiles] = useState([]);
  const [needToUpdateFiles, setNeedToUpdateFiles] = useState(true);
  const [error, setError] = useState(null);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (user == null) {
      router.replace("/");
    }
  }, [user]);

  useEffect(() => {
    try {
      const fetchFiles = async () => {
        setLoadingFiles(true);
        const token = localStorage.getItem("token");

        const files = await getFiles(token);

        setFiles(files);

        setNeedToUpdateFiles(false);
        setLoadingFiles(false);
      };

      if (needToUpdateFiles) fetchFiles();
    } catch (e) {
      setError(e);
      setLoadingFiles(false);
    }
  }, [needToUpdateFiles]);

  const onFileSelection = (e) => {
    setSelectedFile(e.target.files[0]);

    setIsFileSelected(true);
  };

  const onFileUpload = async () => {
    try {
      if (isFileSelected) {
        setLoadingUpload(true);

        const token = localStorage.getItem("token");

        const data = await uploadFile(selectedFile, token);

        setIsFileSelected(false);
        setSelectedFile(null);
        setNeedToUpdateFiles(true);
        setLoadingUpload(false);
      }
    } catch (e) {
      setError(e);
      setLoadingUpload(false);
    }
  };

  const onLogout = async () => {
    try {
      setLoadingLogout(true);

      const token = localStorage.getItem("token");

      const data = await logout(token);

      dispatch(userLogout());

      localStorage.setItem("token", null);

      setLoadingLogout(false);
    } catch (e) {
      setError(e);
      setLoadingLogout(false);
    }
  };

  const onFileDownload = async (file) => {
    try {
      const token = localStorage.getItem("token");

      const data = await downloadFile(file, token);

      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);

      document.body.appendChild(link);

      link.click();

      link.parentNode.removeChild(link);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <div className="flex">
      <div className="card">
        <div className="flex my-6 items-center">
          <h1 className="text-xl font-semibold my-2 flex-shrink-0">
            Fazer upload de arquivos
          </h1>
          <button
            onClick={onLogout}
            className="btn bg-red-500 mx-3 text-white"
            disabled={loadingLogout}
          >
            {!loadingLogout ? "Logout" : "Carregando..."}
          </button>
        </div>

        <input type="file" name="file" onChange={onFileSelection}></input>
        {isFileSelected && (
          <button
            className="btn btn-blue"
            onClick={onFileUpload}
            disabled={loadingUpload}
          >
            {!loadingUpload ? "Upload" : "Carregando..."}
          </button>
        )}

        <h2 className="text-xl font-semibold my-6">Arquivos</h2>
        {!loadingFiles && files.length > 0 && (
          <ul className="my-3">
            {files.map((file) => (
              <li className="text-gray-500 text-sm" key={file.id}>
                <div className="md:flex md:items-center border-2 border-gray-100 p-3 my-1 rounded-md">
                  <div className="md:flex-grow break-all">{file.name}</div>
                  <button
                    className="btn md:mx-2 md:w-20"
                    onClick={() => onFileDownload(file)}
                  >
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!loadingFiles && files.length === 0 && <h5>Sem arquivos</h5>}
        {loadingFiles && <h5>Carregando...</h5>}

        <ErrorMessage error={error} />
      </div>
    </div>
  );
};

export default Dashboard;
