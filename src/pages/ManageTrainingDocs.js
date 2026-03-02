import React, { useState } from "react";

const ManageTrainingDocs = () => {
  const [docs, setDocs] = useState([
    { file: null, description: "" } // default first form
  ]);

  // Handle file change
  const handleFileChange = (index, file) => {
    const updatedDocs = [...docs];
    updatedDocs[index].file = file;
    setDocs(updatedDocs);
  };

  // Handle description change
  const handleDescriptionChange = (index, value) => {
    const updatedDocs = [...docs];
    updatedDocs[index].description = value;
    setDocs(updatedDocs);
  };

  // Add a new form row
  const addDocForm = () => {
    setDocs([...docs, { file: null, description: "" }]);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Uploaded Docs:", docs);
    // TODO: Upload docs to backend
  };

  return (
    <div className="row">
      <div className="col-12">
        <h4 className="mb-4">Manage Training Docs</h4>

        <div className="card mb-4">
          <div className="card-header">MANAGE TRAINING DOCS</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {docs.map((doc, index) => (
                <div
                  className="row g-3 align-items-center mb-3"
                  key={index}
                >
                  <div className="col-md-4">
                    <input
                      type="file"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => handleFileChange(index, e.target.files[0])}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Description"
                      value={doc.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                    />
                  </div>
                  {index === docs.length - 1 && (
                    <div className="col-md-2 d-flex justify-content-start">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={addDocForm}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <small className="text-muted d-block mb-3">
                Note - (Upload only image, excel, msword, pdf)
              </small>

              <button type="submit" className="btn btn-primary">
                UPLOAD
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTrainingDocs;
