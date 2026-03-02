import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // or your preferred date picker
import 'react-datepicker/dist/react-datepicker.css';

export default function CallReports() {
  const reportTypes = [
    { key: 'callMIS', label: 'CALL MIS Reports' },
    { key: 'abendCall', label: 'ABEND CALL MIS Reports' },
    { key: 'answerCall', label: 'ANSWER CALL MIS Reports' },
  ];
  const [activeTab, setActiveTab] = useState('callMIS'); // default selected
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDateChange = (key, date) => {
    setDates(prev => ({ ...prev, [key]: date }));
  };

  const handleAction = (action) => {
    // Example handlers: VIEW or EXPORT
    console.log(action, activeTab, dates);
  };

  return (
  <div className="row">
    <div className="col-12">
      <h3 className="mb-4">Call Reports</h3>
    <div className="card mb-5 shadow-sm">
      {/* Tab headers */}
      <div className="card-header bg-light border-0 pb-0">
        <ul className="nav nav-tabs custom-tabs" role="tablist">
          {reportTypes.map((r) => (
            <li className="nav-item" key={r.key}>
              <button
                className={`nav-link ${activeTab === r.key ? 'active' : ''}`}
                onClick={() => setActiveTab(r.key)}
                type="button"
                role="tab"
                aria-selected={activeTab === r.key}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab content */}
      <div className="card-body pt-4">
        <div className="tab-content">
          <div className="tab-pane fade show active" role="tabpanel">
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">{reportTypes.find(r => r.key === activeTab).label}</h6>
              </div>
              <div className="card-body">
                <div className="row g-4 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label">Start Date</label>
                    <DatePicker
                      selected={dates.startDate}
                      onChange={(date) => handleDateChange('startDate', date)}
                      className="form-control"
                      placeholderText="Start Date"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">End Date</label>
                    <DatePicker
                      selected={dates.endDate}
                      onChange={(date) => handleDateChange('endDate', date)}
                      className="form-control"
                      placeholderText="End Date"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                    <div className="col-md-2">
                      <button
                        className="btn btn-secondary mt-2"
                        onClick={() => handleAction('EXPORT')}
                      >
                        EXPORT
                      </button>
                    </div>
                    <div className="col-md-2">
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleAction('VIEW')}
                      >
                        VIEW
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  );
}
