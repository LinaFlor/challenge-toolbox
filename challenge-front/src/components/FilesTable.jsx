import {useState, useEffect} from "react";
import { Table, Spinner} from "react-bootstrap";
import { getFilesData } from "../api/filesClient";
import FilterByName from "./FilterByName";

export default function FilesTable() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({hasError: false, message: "", status: null});
    const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (fileName = "") => {
    setLoading(true);
    try {
      const data = await getFilesData(fileName);
      setFiles(data);
      setError({ hasError: false, message: "", status: null });
    } catch (err) {
      console.error(err);
      setError({
        hasError: true,
        message: err.response?.data.message || "Error fetching files data",
        status: err.response?.status || null,
      });
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchData(filter.trim());
  };

  const handleClear = () => {
    setFilter("");
    fetchData();
  };


    const renderRows = () => {
      return files.map((file) =>
        file.lines?.map((line, index) => (
          <tr key={`${file.file}-${index}`}>
            <td>{file.file}</td>
            <td>{line.text}</td>
            <td>{line.number}</td>
            <td>{line.hex}</td>
          </tr>
        ))
      );
    };


    return (
      <div className="my-4 mx-5">
        <FilterByName 
          filter={filter}
          setFilter={setFilter}
          handleFilter={handleFilter}
          handleClear={handleClear}
        />

        {loading &&
         <div className="text-center my-5">
            <Spinner animation="border" role="status" />
         </div>
        }
        {!loading && error.hasError && (
          <div className="text-center my-5 text-danger">{error.message}</div>
        )}
        {!loading && !error.hasError && (
          <>
            <Table striped bordered hover align="middle">
              <thead className="table-light">
                <tr>
                  <th>File Name</th>
                  <th>Text</th>
                  <th>Number</th>
                  <th>Hex</th>
                </tr>
              </thead>
              <tbody>
                  {renderRows()}
              </tbody>
            </Table>
          </> 
        )}
        {!loading && files.length === 0 && !error.hasError && (
          <div className="text-center my-5">No files available.</div>
        )}
      </div>
    );
};
