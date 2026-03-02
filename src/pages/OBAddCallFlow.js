import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function AddCallFlow() {
  const [form, setForm] = useState({
    language: "",
    campaign: "",
    resolution: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setForm((prev) => ({ ...prev, resolution: content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", form);
  };

  const handleReset = () => {
    setForm({
      language: "",
      campaign: "",
      resolution: "",
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="mb-3">
          <h4>Add Ob Call Flow</h4>
        </div>

        <div className="card">
          <h6 className="card-header">ADD OB CALL FLOW</h6>
          <div className="card-body">
            <h6>DEFINE RESOLUTION</h6>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Language</label>
                <div className="col-sm-4">
                  <select
                    name="language"
                    className="form-select"
                    value={form.language}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    {/* Add more languages if needed */}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Campaign</label>
                <div className="col-sm-4">
                  <select
                    name="campaign"
                    className="form-select"
                    value={form.campaign}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Campaign1">Campaign 1</option>
                    <option value="Campaign2">Campaign 2</option>
                    {/* Add more scenarios as needed */}
                  </select>
                </div>
              </div>

              <div className="row mb-4">
                <label className="col-sm-2 col-form-label">Resolution</label>
                <div className="col-sm-10">
                  <Editor
                    apiKey="your_tinymce_api_key" // Replace or remove if not needed
                    value={form.resolution}
                    init={{
                      height: 300,
                      menubar: true,
                      plugins: "lists link image paste help wordcount",
                      toolbar:
                        "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help",
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-start gap-3">
                <button type="submit" className="btn btn-primary">
                  ADD
                </button>
                <button type="button" onClick={handleReset} className="btn btn-secondary">
                  RESET
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
