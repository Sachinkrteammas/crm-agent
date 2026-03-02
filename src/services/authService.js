import api from "../api";

export const signup = async (username, email, password) => {
  try {
    const response = await api.post("/signup", {
      username,
      email,
      password,
    });
    return response.data; // contains user object
  } catch (error) {
    throw error.response?.data?.detail || "Signup failed";
  }
};


export const login = async (email, password) => {
  try {
    const response = await api.post("auth/login", {
      email: email,         // must match FastAPI model field
      password: password
    });

    console.log(response, "response==");

    // Save values returned from FastAPI
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("username", response.data.auth_person);  // change key if needed
    localStorage.setItem("company_id", response.data.company_id);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("displayname", response.data.displayname);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("id", response.data.id);

    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Login failed";
  }
};


export const fetchCDRReport = async (payload) => {
  const response = await api.post("/report/cdr_report", payload);
  return response.data;
};



export const getCurrentUser = async () => {
  try {
    const response = await api.get("/me");
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Unable to fetch user";
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};



export const getOBCDRReport = async (payload) => {
  try {
    const response = await api.post("report/ob_cdr_report", payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data?.detail || "Error fetching OB CDR Report";
  }
};


export const getOBSharedCDRReport = async (payload) => {
  try {
    const response = await api.post("/report/ob_shared_cdr_report", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching OB Shared CDR report:", error);
    throw error.response?.data?.detail || "Failed to fetch report";
  }
};


export const getIVRReport = async (payload) => {
  const response = await api.post("/report/ivr_report", payload);
  return response.data;
};

export const getIVRFunnelReport = async (payload) => {
  try {
    const response = await api.post("/report/ivr_funnel_report", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching IVR Funnel Report:", error);
    throw error;
  }
};

export const getDashboardReport = async (payload) => {
    try {
        const response = await api.post("/dashboard/dashboard_report", payload);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard report:", error);
        throw error;
    }
};


export const getActiveServices = async (companyId) => {
    try{
        const response = await api.post("/dashboard/active_services", { company_id: companyId });
        return response.data;
    } catch(error){
        console.error("Error fetching dashboard active services:", error);
        throw error;
    }
};


export const getCallAnalysisReport = async (payload) => {
    try {
        const response = await api.post("/dashboard/call_analysis_report", payload);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard call analysis report:", error);
        throw error;
    }
};


export const getCallDistributionReport = async (payload) => {
    try {
        const response = await api.post("/dashboard/call_distribution_report", payload);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard call distribution report:", error);
        throw error;
    }
};


export const getTicketCaseAnalysis = async (payload) => {
    try{
        const response = await api.post(`/dashboard/ticket_case_analysis?company_id=${payload.company_id}`, payload);
        return response.data;
    } catch(error){
        console.error("Error fetching dashboard ticket case analysis:", error);
        throw error;
    }
};

export const getTicketBySource = async (payload) => {
    try {
        const response = await api.post("/dashboard/ticket_by_source", payload);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard ticket by source report:", error);
        throw error;
    }
};


// Get Out Call Details (GET with params)
export const getOutCallDetails = async (company_id, payload) => {
    try {
        const response = await api.get("/call/outcalls", {
            params: { CLIENT_ID: company_id, ...payload },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching out call details:", error);
        throw error;
    }
};

// Get Campaign Types
export const getCampaignTypes = async (company_id) => {
    try {
        const response = await api.get("/call/types", {
            params: { CLIENT_ID: company_id },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching campaign types:", error);
        throw error;
    }
};

// Get Campaigns for a given parent (campaign type)
export const getCampaigns = async (company_id, parentId) => {
    try {
        const response = await api.get("/call/campaigns", {
            params: { CLIENT_ID: company_id, type: parentId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
    }
};

// Get Allocations for a given campaign
export const getAllocations = async (company_id, campaignId) => {
    try {
        const response = await api.get("/call/allocations", {
            params: { CLIENT_ID: company_id, campaign: campaignId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching allocations:", error);
        throw error;
    }

    
};