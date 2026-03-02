//.....New Updated Code..//
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/stepper.css";

export default function WizardForm({
  initialData = null,
  companyId = null,
  onSubmit,
  isEdit = false,
  onClose,
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sameAsRegistered, setSameAsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 - Candidate & Company Info
    name: "",
    email: "",
    phone: "",
    position: "",
    resume: null,
    domainSite: "",
    companyName: "",
    regAddress1: "",
    regAddress2: "",
    city: "",
    state: "",
    gst: "",
    pincode: "",
    authorisedPerson: "",
    designation: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    commAddress1: "",
    commAddress2: "",
    commCity: "",
    commState: "",
    commPincode: "",

    // Step 2 - Contact Persons
    contactPerson1: "",
    designation1: "",
    mobile1: "",
    email1: "",
    contactPerson2: "",
    designation2: "",
    mobile2: "",
    email2: "",
    contactPerson3: "",
    designation3: "",
    mobile3: "",
    email3: "",

    // Step 3 - Files (store File objects instead of strings)
    incorporationCertificate: null,
    panCard: null,
    authorizedAddressProof: null,
    otherDocuments: null,
    billingAddressProof: null,
    authorizedId: null,
    companyLogo: null,

    // Agreement
    termsAccepted: false,
    existingFiles: {},
  });

  // Fetch company data for edit
  // useEffect(() => {
  //   const fetchCompany = async () => {
  //     if (isEdit && companyId) {
  //       try {
  //         const res = await axios.get(
  //           `http://localhost:8000/company/get/${companyId}`
  //         );
  //         if (res.data.status === "success") {
  //           const data = res.data.data;
  //           setFormData((prev) => ({
  //             ...prev,
  //             companyName: data.company_name || "",
  //             regAddress1: data.reg_office_address1 || "",
  //             regAddress2: data.reg_office_address2 || "",
  //             city: data.city || "",
  //             state: data.state || "",
  //             gst: data.gst_no || "",
  //             pincode: data.pincode || "",
  //             authorisedPerson: data.auth_person || "",
  //             designation: data.designation || "",
  //             mobile: data.phone_no || "",
  //             email: data.email || "",
  //             password: data.password || "",
  //             confirmPassword: data.password || "",
  //             commAddress1: data.comm_address1 || "",
  //             commAddress2: data.comm_address2 || "",
  //             commCity: data.comm_city || "",
  //             commState: data.comm_state || "",
  //             commPincode: data.comm_pincode || "",
  //             contactPerson1: data.contact_person1 || "",
  //             designation1: data.cp1_designation || "",
  //             mobile1: data.cp1_phone || "",
  //             email1: data.cp1_email || "",
  //             contactPerson2: data.contact_person2 || "",
  //             designation2: data.cp2_designation || "",
  //             mobile2: data.cp2_phone || "",
  //             email2: data.cp2_email || "",
  //             contactPerson3: data.contact_person3 || "",
  //             designation3: data.cp3_designation || "",
  //             mobile3: data.cp3_phone || "",
  //             email3: data.cp3_email || "",
  //             existingFiles: {
  //               incorporationCertificate:
  //                 data.incorporation_certificate || null,
  //               panCard: data.pancard || null,
  //               authorizedAddressProof:
  //                 data.auth_person_address_prof || null,
  //               otherDocuments: data.other_documents || [],
  //               billingAddressProof: data.bill_address_prof || null,
  //               authorizedId: data.authorized_id_prof || null,
  //               companyLogo: data.company_logo || null,
  //             },
  //             termsAccepted: data.termsAccepted || false,
  //           }));
  //         }
  //       } catch (err) {
  //         console.error("Fetch company error:", err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       setLoading(false);
  //     }
  //   };
  //   fetchCompany();
  // }, [companyId, isEdit]);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        // Step 1 - Company Info
        companyName: initialData.company_name || "",
        regAddress1: initialData.reg_office_address1 || "",
        regAddress2: initialData.reg_office_address2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        gst: initialData.gst_no || "",
        pincode: initialData.pincode || "",
        authorisedPerson: initialData.auth_person || "",
        designation: initialData.designation || "",
        mobile: initialData.phone_no || "",
        email: initialData.email || "",
        password: initialData.password || "", // pre-fill password
        confirmPassword: initialData.password || "", // optional
        commAddress1: initialData.comm_address1 || "",
        commAddress2: initialData.comm_address2 || "",
        commCity: initialData.comm_city || "",
        commState: initialData.comm_state || "",
        commPincode: initialData.comm_pincode || "",

        // Step 2 - Contact Persons
        contactPerson1: initialData.contact_person1 || "",
        designation1: initialData.cp1_designation || "",
        mobile1: initialData.cp1_phone || "",
        email1: initialData.cp1_email || "",
        contactPerson2: initialData.contact_person2 || "",
        designation2: initialData.cp2_designation || "",
        mobile2: initialData.cp2_phone || "",
        email2: initialData.cp2_email || "",
        contactPerson3: initialData.contact_person3 || "",
        designation3: initialData.cp3_designation || "",
        mobile3: initialData.cp3_phone || "",
        email3: initialData.cp3_email || "",

        // Step 3 - Files (cannot pre-fill input, but store URLs for display)
        incorporationCertificate: null,
        panCard: null,
        authorizedAddressProof: null,
        otherDocuments: null,
        billingAddressProof: null,
        authorizedId: null,
        companyLogo: null,
        // file URLs
        existingFiles: {
          incorporationCertificate:
            initialData.incorporation_certificate || null,
          panCard: initialData.pancard || null,
          authorizedAddressProof: initialData.auth_person_address_prof || null,
          otherDocuments: initialData.other_documents || [],
          billingAddressProof: initialData.bill_address_prof || null,
          authorizedId: initialData.authorized_id_prof || null,
          companyLogo: initialData.company_logo || null,
        },

        termsAccepted: initialData.termsAccepted || false,
      }));
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);

  // // OTP modal states
  // const [showOtpModal, setShowOtpModal] = useState(false);
  // const [otpSent, setOtpSent] = useState(false);
  // const [otp, setOtp] = useState("");
  // const [otpError, setOtpError] = useState("");
  // const backupPassword = "123456"; // default password after OTP

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   let newValue = value;

  //   // Restrict digits for mobile & pincode fields
  //   if (name === "mobile") {
  //     newValue = value.replace(/\D/g, "").slice(0, 10);
  //   }
  //   if (name === "pincode" || name === "commPincode") {
  //     newValue = value.replace(/\D/g, "").slice(0, 6);
  //   }

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : newValue,
  //   }));
  //   setErrors({ ...errors, [name]: "" });
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    // Restrict digits for mobile & pincode fields
    if (name.startsWith("mobile")) {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }
    if (name === "pincode" || name === "commPincode") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));

    // Live validation for mobile & email
    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.startsWith("mobile")) {
      if (!mobileRegex.test(newValue)) {
        setErrors((prev) => ({ ...prev, [name]: true }));
      } else {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    } else if (name.startsWith("email")) {
      if (!emailRegex.test(newValue)) {
        setErrors((prev) => ({ ...prev, [name]: true }));
      } else {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    } else {
      // For other fields, just clear error when typing
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation per step
  const validateStep = (step) => {
    let newErrors = {};

    // Step 1 - Company Registration
    if (step === 1) {
      if (!formData.companyName) newErrors.companyName = true;
      if (!formData.regAddress1) newErrors.regAddress1 = true;
      if (!formData.regAddress2) newErrors.regAddress2 = true;
      if (!formData.city) newErrors.city = true;
      if (!formData.state) newErrors.state = true;

      if (!formData.gst) newErrors.gst = true;
      if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = true;

      if (!formData.authorisedPerson) newErrors.authorisedPerson = true;
      if (!formData.designation) newErrors.designation = true;

      if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = true;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = true;

      if (!formData.password) newErrors.password = true;
      if (
        !formData.confirmPassword ||
        formData.password !== formData.confirmPassword
      )
        newErrors.confirmPassword = true;

      if (!formData.commAddress1) newErrors.commAddress1 = true;
      if (!formData.commAddress2) newErrors.commAddress2 = true;
      if (!formData.commCity) newErrors.commCity = true;
      if (!formData.commState) newErrors.commState = true;

      if (!/^\d{6}$/.test(formData.commPincode)) newErrors.commPincode = true;
    }

    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 2) {
      // Contact Person 1 (mandatory)
      // if (!formData.contactPerson1?.trim())
      //   newErrors.contactPerson1 = "Required";
      // if (!formData.designation1?.trim()) newErrors.designation1 = "Required";

      // if (!formData.mobile1?.trim()) newErrors.mobile1 = "Required";
      // else if (!mobileRegex.test(formData.mobile1.trim()))
      //   newErrors.mobile1 = "Must be 10 digits";

      // if (!formData.email1?.trim()) newErrors.email1 = "Required";
      // else if (!emailRegex.test(formData.email1.trim()))
      //   newErrors.email1 = "Invalid email";

      // // Contact Person 2 (optional)
      // if (
      //   formData.contactPerson2?.trim() ||
      //   formData.designation2?.trim() ||
      //   formData.mobile2?.trim() ||
      //   formData.email2?.trim()
      // ) {
      //   if (!formData.contactPerson2?.trim())
      //     newErrors.contactPerson2 = "Required";
      //   if (!formData.designation2?.trim()) newErrors.designation2 = "Required";
      //   if (formData.mobile2 && !mobileRegex.test(formData.mobile2))
      //     newErrors.mobile2 = "Must be 10 digits";
      //   if (formData.email2 && !emailRegex.test(formData.email2))
      //     newErrors.email2 = "Invalid email";
      // }

      // // Contact Person 3 (optional)
      // if (
      //   formData.contactPerson3?.trim() ||
      //   formData.designation3?.trim() ||
      //   formData.mobile3?.trim() ||
      //   formData.email3?.trim()
      // ) {
      //   if (!formData.contactPerson3?.trim())
      //     newErrors.contactPerson3 = "Required";
      //   if (!formData.designation3?.trim()) newErrors.designation3 = "Required";
      //   if (formData.mobile3 && !mobileRegex.test(formData.mobile3))
      //     newErrors.mobile3 = "Must be 10 digits";
      //   if (formData.email3 && !emailRegex.test(formData.email3))
      //     newErrors.email3 = "Invalid email";
      // }
      if (step === 2) {
        // Contact Person 1 (mandatory)
        if (!formData.contactPerson1?.trim()) newErrors.contactPerson1 = true;
        if (!formData.designation1?.trim()) newErrors.designation1 = true;

        if (!/^\d{10}$/.test(formData.mobile1?.trim() || ""))
          newErrors.mobile1 = true;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email1?.trim() || ""))
          newErrors.email1 = true;

        // Contact Person 2 (optional)
        if (
          formData.contactPerson2?.trim() ||
          formData.designation2?.trim() ||
          formData.mobile2?.trim() ||
          formData.email2?.trim()
        ) {
          if (!formData.contactPerson2?.trim()) newErrors.contactPerson2 = true;
          if (!formData.designation2?.trim()) newErrors.designation2 = true;

          if (!/^\d{10}$/.test(formData.mobile2?.trim() || ""))
            newErrors.mobile2 = true;

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email2?.trim() || ""))
            newErrors.email2 = true;
        }

        // Contact Person 3 (optional)
        if (
          formData.contactPerson3?.trim() ||
          formData.designation3?.trim() ||
          formData.mobile3?.trim() ||
          formData.email3?.trim()
        ) {
          if (!formData.contactPerson3?.trim()) newErrors.contactPerson3 = true;
          if (!formData.designation3?.trim()) newErrors.designation3 = true;

          if (!/^\d{10}$/.test(formData.mobile3?.trim() || ""))
            newErrors.mobile3 = true;

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email3?.trim() || ""))
            newErrors.email3 = true;
        }
      }
    }

    // Step 3 - Document Uploads (validate mandatory fields)
    if (step === 3) {
      // if (!formData.panCard) newErrors.panCard = true;
      if (!formData.termsAccepted) newErrors.termsAccepted = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // --- Handle file inputs ---

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files) return;

    if (e.target.multiple) {
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Reusable FileInput component
  // function FileInput({
  //   label,
  //   name,
  //   existingFile,
  //   file,
  //   onChange,
  //   multiple = false,
  // }) {
  //   return (
  //     <div className="mb-3 d-flex align-items-center">
  //       <input
  //         type="text"
  //         className="form-control col"
  //         placeholder={label}
  //         value={file ? file.name : ""}
  //         readOnly
  //       />
  //       <button
  //         type="button"
  //         className="btn btn-outline-primary ms-2"
  //         onClick={() => document.getElementById(name).click()}
  //       >
  //         Choose File
  //       </button>
  //       <input
  //         type="file"
  //         id={name}
  //         name={name}
  //         onChange={onChange}
  //         className="d-none"
  //         accept=".jpg,.jpeg,.png,.gif,.pdf"
  //         multiple={multiple}
  //       />

  //       {/* Show existing file if no new file selected */}
  //       {!file && existingFile && (
  //         <p className="ms-3 mb-0">
  //           Existing:{" "}
  //           {Array.isArray(existingFile) ? (
  //             existingFile.map((f, i) => (
  //               <a
  //                 key={i}
  //                 href={`http://localhost:8000/${f}`}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="me-2"
  //               >
  //                 {f.split("/").pop()}
  //               </a>
  //             ))
  //           ) : (
  //             <a
  //               href={`http://localhost:8000/${existingFile}`}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //             >
  //               {existingFile.split("/").pop()}
  //             </a>
  //           )}
  //         </p>
  //       )}
  //     </div>
  //   );
  // }

  function FileInput({
    label,
    name,
    existingFile,
    file,
    onChange,
    multiple = false,
  }) {
    return (
      <div className="mb-3 d-flex align-items-center">
        <input
          type="text"
          className="form-control col"
          placeholder={label}
          value={file ? file.name : ""}
          readOnly
        />
        <button
          type="button"
          className="btn btn-outline-primary ms-2"
          onClick={() => document.getElementById(name).click()}
        >
          Choose File
        </button>
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          className="d-none"
          accept=".jpg,.jpeg,.png,.gif,.pdf"
          multiple={multiple}
        />

        {/* Show existing file only if single file */}
        {!file && existingFile && !multiple && (
          <p className="ms-3 mb-0">
            Existing:{" "}
            <a
              href={`http://localhost:8000/${existingFile}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {existingFile.split("/").pop()}
            </a>
          </p>
        )}
      </div>
    );
  }

  // --- Final Submit ---
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateStep(step)) return;

  //   try {
  //     const data = new FormData();

  //     // Append non-file fields
  //     Object.keys(formData).forEach((key) => {
  //       const fileFields = [
  //         "incorporationCertificate",
  //         "panCard",
  //         "authorizedAddressProof",
  //         "otherDocuments",
  //         "billingAddressProof",
  //         "authorizedId",
  //         "companyLogo",
  //       ];
  //       if (!fileFields.includes(key) && formData[key] != null)
  //         data.append(key, formData[key]);
  //     });

  //     // Single files
  //     [
  //       "incorporationCertificate",
  //       "panCard",
  //       "authorizedAddressProof",
  //       "billingAddressProof",
  //       "authorizedId",
  //       "companyLogo",
  //     ].forEach((key) => {
  //       if (formData[key]) data.append(key, formData[key]);
  //     });

  //     // Multiple files
  //     if (formData.otherDocuments?.length) {
  //       formData.otherDocuments.forEach((f) =>
  //         data.append("otherDocuments", f)
  //       );
  //     }

  //     // Remove password if empty on edit
  //     let url = "http://localhost:8000/company/register";
  //     let method = "post";
  //     if (isEdit && initialData?.id) {
  //       url = `http://localhost:8000/company/update/${initialData.id}`;
  //       method = "put";
  //       if (!formData.password) {
  //         data.delete("password");
  //         data.delete("confirmPassword");
  //       }
  //     }

  //     const res = await axios({
  //       method,
  //       url,
  //       data,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     alert(
  //       res.data?.message ||
  //         (isEdit ? "Company updated!" : "Company registered!")
  //     );

  //     if (onSubmit) onSubmit(data);
  //     if (onClose) onClose();
  //   } catch (err) {
  //     console.error("Error:", err);
  //     alert("Failed to submit company data.");
  //   }
  // };

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateStep(step)) return;

  //   try {
  //     // Check edit mode and ID
  //     if (isEdit && !initialData?.id) {
  //       alert("Cannot update: Company ID not found.");
  //       return;
  //     }

  //     const data = new FormData();

  //     // Append text fields (ensure names match backend)
  //     const textFields = [
  //       "companyName",
  //       "regAddress1",
  //       "regAddress2",
  //       "city",
  //       "state",
  //       "gst",
  //       "pincode",
  //       "authorisedPerson",
  //       "designation",
  //       "mobile",
  //       "email",
  //       "password",
  //       "confirmPassword",
  //       "commAddress1",
  //       "commAddress2",
  //       "commCity",
  //       "commState",
  //       "commPincode",
  //       "contactPerson1",
  //       "designation1",
  //       "mobile1",
  //       "email1",
  //       "contactPerson2",
  //       "designation2",
  //       "mobile2",
  //       "email2",
  //       "contactPerson3",
  //       "designation3",
  //       "mobile3",
  //       "email3",
  //       "termsAccepted",
  //     ];

  //     textFields.forEach((key) => {
  //       if (formData[key] !== undefined && formData[key] !== null) {
  //         data.append(key, formData[key]);
  //       }
  //     });

  //     // Append single file fields
  //     const singleFileFields = [
  //       "incorporationCertificate",
  //       "panCard",
  //       "authorizedAddressProof",
  //       "billingAddressProof",
  //       "authorizedId",
  //       "companyLogo",
  //     ];

  //     singleFileFields.forEach((key) => {
  //       if (formData[key]) data.append(key, formData[key]);
  //     });

  //     // Append multiple files
  //     if (formData.otherDocuments?.length) {
  //       formData.otherDocuments.forEach((file) =>
  //         data.append("otherDocuments", file)
  //       );
  //     }

  //     // Remove password fields if empty on edit
  //     if (isEdit && (!formData.password || !formData.confirmPassword)) {
  //       data.delete("password");
  //       data.delete("confirmPassword");
  //     }

  //     // Build URL and method
  //     const url = isEdit
  //       ? `http://localhost:8000/company/update/${initialData.id}`
  //       : "http://localhost:8000/company/register";
  //     const method = isEdit ? "put" : "post";

  //     const res = await axios({
  //       method,
  //       url,
  //       data,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     alert(
  //       res.data?.message || (isEdit ? "Company updated!" : "Company registered!")
  //     );

  //     if (onSubmit) onSubmit(data);
  //     if (onClose) onClose();
  //   } catch (err) {
  //     console.error("Error:", err.response || err);
  //     alert(
  //       err.response?.data?.detail || "Failed to submit company data."
  //     );
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate current step
    if (!validateStep(step)) {
      console.log("Validation failed at step:", step, errors);
      return;
    }

    try {
      // Ensure ID exists in edit mode
      if (isEdit && !initialData?.id) {
        alert("Cannot update: Company ID not found.");
        console.error("initialData.id is missing:", initialData);
        return;
      }

      console.log("Submitting formData:", formData);

      const data = new FormData();

      // --- Append text fields ---
      const textFields = [
        "companyName",
        "regAddress1",
        "regAddress2",
        "city",
        "state",
        "gst",
        "pincode",
        "authorisedPerson",
        "designation",
        "mobile",
        "email",
        "password",
        "confirmPassword",
        "commAddress1",
        "commAddress2",
        "commCity",
        "commState",
        "commPincode",
        "contactPerson1",
        "designation1",
        "mobile1",
        "email1",
        "contactPerson2",
        "designation2",
        "mobile2",
        "email2",
        "contactPerson3",
        "designation3",
        "mobile3",
        "email3",
        "termsAccepted",
      ];

      textFields.forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      // --- Append single file fields ---
      const singleFileFields = [
        "incorporationCertificate",
        "panCard",
        "authorizedAddressProof",
        "billingAddressProof",
        "authorizedId",
        "companyLogo",
      ];

      singleFileFields.forEach((key) => {
        if (formData[key]) {
          console.log("Appending file:", key, formData[key].name);
          data.append(key, formData[key]);
        }
      });

      // --- Append multiple files ---
      if (formData.otherDocuments?.length) {
        formData.otherDocuments.forEach((file, idx) => {
          console.log(`Appending otherDocuments[${idx}]:`, file.name);
          data.append("otherDocuments", file);
        });
      }

      // Remove password fields if empty in edit mode
      if (isEdit && (!formData.password || !formData.confirmPassword)) {
        data.delete("password");
        data.delete("confirmPassword");
      }

      // --- Build URL & method ---
      const url = isEdit
        ? `http://localhost:8000/company/update/${initialData.id}`
        : "http://localhost:8000/company/register";
      const method = isEdit ? "put" : "post";

      console.log("Sending request:", method.toUpperCase(), url);

      const res = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", res.data);

      alert(
        res.data?.message ||
          (isEdit ? "Company updated!" : "Company registered!")
      );

      if (onSubmit) onSubmit(data);
      if (onClose) onClose();
    } catch (err) {
      console.error("Submit Error:", err.response || err);
      alert(
        err.response?.data?.detail ||
          err.message ||
          "Failed to submit company data."
      );
    }
  };

  // Handle Next button click -> show OTP modal
  const handleNextClick = () => {
    if (!validateStep(step)) return;
    // setShowOtpModal(true);
    setStep(step + 1);
  };

  useEffect(() => {
    if (sameAsRegistered) {
      setFormData((prev) => ({
        ...prev,
        commAddress1: prev.regAddress1,
        commAddress2: prev.regAddress2,
        commCity: prev.city,
        commState: prev.state,
        commPincode: prev.pincode,
      }));
    }
  }, [
    formData.regAddress1,
    formData.regAddress2,
    formData.city,
    formData.state,
    formData.pincode,
    sameAsRegistered,
  ]);

  // Send OTP API
  // const handleSendOtp = async () => {
  //   try {
  //     const res = await axios.post("http://localhost:8000/company/send-otp", {
  //       mobile: formData.mobile,
  //     });
  //     if (res.data.success) {
  //       setOtpSent(true);
  //       alert("OTP sent successfully!");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to send OTP");
  //   }
  // };

  // Verify OTP and submit form
  // const handleVerifyOtp = async () => {
  //   try {
  //     const res = await axios.post("http://localhost:8000/company/verify-otp", {
  //       mobile: formData.mobile,
  //       otp,
  //     });

  //     if (res.data.success) {
  //       setFormData({
  //         ...formData,
  //         password: "123456", // Backup password
  //         confirmPassword: "123456",
  //       });

  //       // Submit full form
  //       const data = new FormData();
  //       Object.keys(formData).forEach((key) => {
  //         data.append(key, formData[key]);
  //       });

  //       const submitRes = await axios.post(
  //         "http://localhost:8000/company/register",
  //         data,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );

  //       alert(submitRes.data.message || "Company registered successfully!");
  //       setShowOtpModal(false);
  //       setStep(2); // Move to next step
  //     } else {
  //       setOtpError("Invalid OTP");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setOtpError("OTP verification failed");
  //   }
  // };

  // Add this at the top of your component (or in a separate constants file)
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
    "Puducherry",
    "Chandigarh",
    "Andaman & Nicobar Islands",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Lakshadweep",
  ];

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="col-12 mb-6">
          {/* ✅ Common Logo Header */}
          {/* <div
            style={{
              textAlign: "center",
              marginTop: "110px",
              marginBottom: "20px",
            }}
          >
            <img
              src="assets\img\branding\logo.DialDesk.png"
              alt="DialDesk Logo"
              style={{ height: "100px" }}
            />
          </div> */}
          {!isEdit && (
            <div
              style={{
                textAlign: "center",
                marginTop: "110px",
                marginBottom: "20px",
              }}
            >
              <img
                src="assets/img/branding/logo.DialDesk.png"
                alt="DialDesk Logo"
                style={{ height: "100px" }}
              />
            </div>
          )}
          <div className="col-12 mb-6">
            <h4 className="fw-medium">Company Registration</h4>
            <div className="mt-6 max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
              {/* Stepper Header */}

              <div className="bs-stepper">
                <div className="bs-stepper-header">
                  {/* Step 1 */}
                  <div className={`step ${step === 1 ? "active" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="step-trigger"
                    >
                      <span className="bs-stepper-circle">1</span>
                      <span className="bs-stepper-label">
                        <span className="bs-stepper-title">
                          Company Registration
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="line"></div>

                  {/* Step 2 */}
                  <div className={`step ${step === 2 ? "active" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="step-trigger"
                    >
                      <span className="bs-stepper-circle">2</span>
                      <span className="bs-stepper-label">
                        <span className="bs-stepper-title">Contact Person</span>
                      </span>
                    </button>
                  </div>

                  <div className="line"></div>

                  {/* Step 3 */}
                  <div className={`step ${step === 3 ? "active" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="step-trigger"
                    >
                      <span className="bs-stepper-circle">3</span>
                      <span className="bs-stepper-label">
                        <span className="bs-stepper-title">
                          Documents Upload
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stepper Content */}
              <div className="bs-stepper-content mt-4">
                <form onSubmit={handleSubmit}>
                  {/* Step 1 - Company Registration */}
                  {step === 1 && (
                    <div>
                      <h6>Company Registration</h6>
                      <div className="row g-3 mt-3">
                        {/* Left Column */}
                        <div className="col-sm-4">
                          <input
                            type="text"
                            name="companyName"
                            className={`form-control ${
                              errors.companyName ? "is-invalid" : ""
                            }`}
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="regAddress1"
                            className={`form-control mt-2 ${
                              errors.regAddress1 ? "is-invalid" : ""
                            }`}
                            placeholder="Registered Office Address 1"
                            value={formData.regAddress1}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="regAddress2"
                            className={`form-control mt-2 ${
                              errors.regAddress2 ? "is-invalid" : ""
                            }`}
                            placeholder="Registered Office Address 2"
                            value={formData.regAddress2}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="city"
                            className={`form-control mt-2 ${
                              errors.city ? "is-invalid" : ""
                            }`}
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                          />
                          {/* <select
                            name="state"
                            className={`form-select mt-2 ${
                              errors.state ? "is-invalid" : ""
                            }`}
                            value={formData.state}
                            onChange={handleChange}
                          >
                            <option value="">Select State</option>
                            <option>Delhi</option>
                            <option>Maharashtra</option>
                            <option>Karnataka</option>
                            <option>Tamil Nadu</option>
                          </select> */}
                          <select
                            name="state"
                            className={`form-select mt-2 ${
                              errors.state ? "is-invalid" : ""
                            }`}
                            value={formData.state}
                            onChange={handleChange}
                          >
                            <option value="">Select State</option>
                            {indianStates.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            name="gst"
                            className={`form-control mt-2 ${
                              errors.gst ? "is-invalid" : ""
                            }`}
                            placeholder="GST No."
                            value={formData.gst}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="pincode"
                            className={`form-control mt-2 ${
                              errors.pincode ? "is-invalid" : ""
                            }`}
                            placeholder="Pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Middle Column */}
                        <div className="col-sm-4">
                          <input
                            type="text"
                            name="authorisedPerson"
                            className={`form-control ${
                              errors.authorisedPerson ? "is-invalid" : ""
                            }`}
                            placeholder="Authorised Person"
                            value={formData.authorisedPerson}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="designation"
                            className={`form-control mt-2 ${
                              errors.designation ? "is-invalid" : ""
                            }`}
                            placeholder="Designation"
                            value={formData.designation}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="mobile"
                            className={`form-control mt-2 ${
                              errors.mobile ? "is-invalid" : ""
                            }`}
                            placeholder="Mobile No"
                            value={formData.mobile}
                            onChange={handleChange}
                          />
                          <input
                            type="email"
                            name="email"
                            className={`form-control mt-2 ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                          />

                          {/* Password field with toggle */}
                          <div className="input-group mt-2">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className={`form-control ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          </div>

                          {/* Confirm Password field with toggle */}
                          <div className="input-group mt-2">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              className={`form-control ${
                                errors.confirmPassword ? "is-invalid" : ""
                              }`}
                              placeholder="Confirm Password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-sm-4">
                          <div className="d-flex align-items-center mt-3 mb-3">
                            <small className="me-2">
                              Same As Registered Office
                            </small>
                            {/* <input
                              type="checkbox"
                              className="form-check-input"
                            /> */}
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={sameAsRegistered}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSameAsRegistered(isChecked);

                                if (isChecked) {
                                  // Copy left column data into right column
                                  setFormData((prev) => ({
                                    ...prev,
                                    commAddress1: prev.regAddress1,
                                    commAddress2: prev.regAddress2,
                                    commCity: prev.city,
                                    commState: prev.state,
                                    commPincode: prev.pincode,
                                  }));
                                } else {
                                  // Clear right column fields if unchecked
                                  setFormData((prev) => ({
                                    ...prev,
                                    commAddress1: "",
                                    commAddress2: "",
                                    commCity: "",
                                    commState: "",
                                    commPincode: "",
                                  }));
                                }
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            name="commAddress1"
                            className={`form-control mt-2 ${
                              errors.commAddress1 ? "is-invalid" : ""
                            }`}
                            placeholder="Communication Office Address 1"
                            value={formData.commAddress1}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="commAddress2"
                            className={`form-control mt-2 ${
                              errors.commAddress2 ? "is-invalid" : ""
                            }`}
                            placeholder="Communication Office Address 2"
                            value={formData.commAddress2}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="commCity"
                            className={`form-control mt-2 ${
                              errors.commCity ? "is-invalid" : ""
                            }`}
                            placeholder="City"
                            value={formData.commCity}
                            onChange={handleChange}
                          />
                          {/* <select
                            name="commState"
                            className={`form-select mt-2 ${
                              errors.commState ? "is-invalid" : ""
                            }`}
                            value={formData.commState}
                            onChange={handleChange}
                          >
                            <option value="">Select State</option>
                            <option>Delhi</option>
                            <option>Maharashtra</option>
                            <option>Karnataka</option>
                            <option>Tamil Nadu</option>
                          </select> */}
                          <select
                            name="commState"
                            className={`form-select mt-2 ${
                              errors.commState ? "is-invalid" : ""
                            }`}
                            value={formData.commState}
                            onChange={handleChange}
                          >
                            <option value="">Select State</option>
                            {indianStates.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            name="commPincode"
                            className={`form-control mt-2 ${
                              errors.commPincode ? "is-invalid" : ""
                            }`}
                            placeholder="Pincode"
                            value={formData.commPincode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="d-flex justify-content-between mt-4">
                        <button
                          className="btn btn-label-secondary btn-prev"
                          disabled
                        >
                          <i class="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i>
                          Previous
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-next"
                          onClick={handleNextClick} // <- Updated to handle OTP
                        >
                          Next
                          <i className="icon-base ti tabler-arrow-right icon-xs ms-2"></i>
                        </button>
                      </div>

                      {/* OTP Modal */}
                      {/* {showOtpModal && (
                        <div className="modal show d-block" tabIndex="-1">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Enter OTP</h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() => setShowOtpModal(false)}
                                ></button>
                              </div>
                              <div className="modal-body">
                                {!otpSent && (
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleSendOtp}
                                  >
                                    Send OTP to {formData.mobile}
                                  </button>
                                )}
                                {otpSent && (
                                  <>
                                    <input
                                      type="text"
                                      className="form-control mt-2"
                                      placeholder="Enter OTP"
                                      value={otp}
                                      onChange={(e) => setOtp(e.target.value)}
                                    />
                                    {otpError && (
                                      <small className="text-danger">
                                        {otpError}
                                      </small>
                                    )}
                                    <button
                                      className="btn btn-success mt-2"
                                      onClick={handleVerifyOtp}
                                    >
                                      Verify OTP
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )} */}
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div>
                      <h6>Contact Persons</h6>
                      <small>
                        Note - Details of at least one person is mandatory.
                      </small>

                      <div className="row g-3 mt-3">
                        {/* Contact Person 1 */}
                        <div className="col-sm-4">
                          <input
                            type="text"
                            name="contactPerson1"
                            className={`form-control ${
                              errors.contactPerson1 ? "is-invalid" : ""
                            }`}
                            placeholder="Contact Person 1"
                            value={formData.contactPerson1 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="designation1"
                            className={`form-control mt-2 ${
                              errors.designation1 ? "is-invalid" : ""
                            }`}
                            placeholder="Designation"
                            value={formData.designation1 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="mobile1"
                            className={`form-control mt-2 ${
                              errors.mobile1 ? "is-invalid" : ""
                            }`}
                            placeholder="Mobile No"
                            value={formData.mobile1 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="email"
                            name="email1"
                            className={`form-control mt-2 ${
                              errors.email1 ? "is-invalid" : ""
                            }`}
                            placeholder="Email"
                            value={formData.email1 || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Contact Person 2 */}
                        <div className="col-sm-4">
                          <input
                            type="text"
                            name="contactPerson2"
                            className={`form-control ${
                              errors.contactPerson2 ? "is-invalid" : ""
                            }`}
                            placeholder="Contact Person 2"
                            value={formData.contactPerson2 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="designation2"
                            className={`form-control mt-2 ${
                              errors.designation2 ? "is-invalid" : ""
                            }`}
                            placeholder="Designation"
                            value={formData.designation2 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="mobile2"
                            className={`form-control mt-2 ${
                              errors.mobile2 ? "is-invalid" : ""
                            }`}
                            placeholder="Mobile No"
                            value={formData.mobile2 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="email"
                            name="email2"
                            className={`form-control mt-2 ${
                              errors.email2 ? "is-invalid" : ""
                            }`}
                            placeholder="Email"
                            value={formData.email2 || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Contact Person 3 */}
                        <div className="col-sm-4">
                          <input
                            type="text"
                            name="contactPerson3"
                            className={`form-control ${
                              errors.contactPerson3 ? "is-invalid" : ""
                            }`}
                            placeholder="Contact Person 3"
                            value={formData.contactPerson3 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="designation3"
                            className={`form-control mt-2 ${
                              errors.designation3 ? "is-invalid" : ""
                            }`}
                            placeholder="Designation"
                            value={formData.designation3 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="mobile3"
                            className={`form-control mt-2 ${
                              errors.mobile3 ? "is-invalid" : ""
                            }`}
                            placeholder="Mobile No"
                            value={formData.mobile3 || ""}
                            onChange={handleChange}
                          />
                          <input
                            type="email"
                            name="email3"
                            className={`form-control mt-2 ${
                              errors.email3 ? "is-invalid" : ""
                            }`}
                            placeholder="Email"
                            value={formData.email3 || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="d-flex justify-content-between mt-4">
                        <button
                          type="button"
                          className="btn btn-label-secondary btn-prev"
                          onClick={prevStep}
                        >
                          <i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i>
                          Previous
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-next"
                          onClick={nextStep}
                        >
                          Next
                          <i className="icon-base ti tabler-arrow-right icon-xs ms-2"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div>
                      <h6 className="mb-3">Document Uploads</h6>

                      <div className="row g-3">
                        {/* Left Column */}
                        <div className="col-sm-6">
                          {/* Incorporation Certificate */}
                          <FileInput
                            label="Incorporation Certificate"
                            name="incorporationCertificate"
                            existingFile={
                              formData.existingFiles?.incorporationCertificate
                            }
                            file={formData.incorporationCertificate}
                            onChange={handleFileChange}
                          />

                          {/* PAN Card (Mandatory) */}
                          <FileInput
                            label="PAN Card"
                            name="panCard"
                            existingFile={formData.existingFiles?.panCard}
                            file={formData.panCard}
                            onChange={handleFileChange}
                            required
                            error={errors.panCard} // ✅ highlight error like old code
                          />

                          {/* Authorized Address Proof */}
                          <FileInput
                            label="Authorized Address Proof"
                            name="authorizedAddressProof"
                            existingFile={
                              formData.existingFiles?.authorizedAddressProof
                            }
                            file={formData.authorizedAddressProof}
                            onChange={handleFileChange}
                          />

                          {/* Other Documents (multiple) */}
                          <FileInput
                            label="Other Documents"
                            name="otherDocuments"
                            existingFile={
                              formData.existingFiles?.otherDocuments
                            }
                            file={formData.otherDocuments}
                            onChange={handleFileChange}
                            multiple
                          />
                        </div>

                        {/* Right Column */}
                        <div className="col-sm-6">
                          {/* Billing Address Proof */}
                          <FileInput
                            label="Billing Address Proof"
                            name="billingAddressProof"
                            existingFile={
                              formData.existingFiles?.billingAddressProof
                            }
                            file={formData.billingAddressProof}
                            onChange={handleFileChange}
                          />

                          {/* Authorized Person ID */}
                          <FileInput
                            label="Authorized Person ID"
                            name="authorizedId"
                            existingFile={formData.existingFiles?.authorizedId}
                            file={formData.authorizedId}
                            onChange={handleFileChange}
                          />

                          {/* Company Logo - Hide in Edit Mode */}
                          <FileInput
                            label="Company Logo"
                            name="companyLogo"
                            existingFile={formData.existingFiles?.companyLogo}
                            file={formData.companyLogo}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted || false}
                          onChange={handleChange}
                          className={`form-check-input ${
                            errors.termsAccepted ? "is-invalid" : ""
                          }`}
                        />
                        <span className="form-check-label">
                          I accept Terms & Conditions{" "}
                          <span className="text-danger">*</span>
                        </span>
                        {errors.termsAccepted && (
                          <div className="invalid-feedback">
                            You must accept Terms
                          </div>
                        )}
                      </div>

                      <p className="text-muted mt-2">
                        Note - Please use only jpg, gif, png, pdf for upload.
                      </p>

                      {/* Footer Buttons */}
                      <div className="d-flex justify-content-between mt-4">
                        <button
                          type="button"
                          className="btn btn-label-secondary btn-prev"
                          onClick={prevStep}
                        >
                          <i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i>{" "}
                          Previous
                        </button>
                        <button
                          type="submit" // use submit to trigger form behavior
                          className="btn btn-success btn-submit"
                        >
                          {isEdit ? "Update" : "Submit"}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// {step === 3 && (
//                   <div>
//                     <h6 className="mb-3">Document Uploads</h6>

//                     <div className="row g-3">
//                       {/* Left Column */}
//                       <div className="col-sm-6">
//                         {/* Incorporation Certificate */}
//                         <div className="mb-3 d-flex align-items-center">
//                           <input
//                             type="text"
//                             className="form-control col"
//                             placeholder="Incorporation Certificate"
//                             value={
//                               formData.incorporationCertificate
//                                 ? formData.incorporationCertificate.name
//                                 : ""
//                             }
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-outline-primary ms-2"
//                             onClick={() =>
//                               document
//                                 .getElementById("incorporationCertificate")
//                                 .click()
//                             }
//                           >
//                             Choose File
//                           </button>
//                           <input
//                             type="file"
//                             id="incorporationCertificate"
//                             name="incorporationCertificate"
//                             onChange={handleFileChange}
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           />
//                         </div>

//                         {/* PAN Card */}
//                         <div className="mb-3 d-flex align-items-center">
//                           <input
//                             type="text"
//                             className={`form-control col ${
//                               errors.panCard ? "is-invalid" : ""
//                             }`}
//                             placeholder="PAN Card"
//                             value={formData.panCard || ""}
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-outline-primary ms-2"
//                             onClick={() =>
//                               document.getElementById("panCard").click()
//                             }
//                           >
//                             Choose File
//                           </button>
//                           {/* <input
//                             type="file"
//                             id="panCard"
//                             name="panCard"
//                             onChange={handleChange}
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           /> */}
//                           <input
//                             type="file"
//                             id="panCard"
//                             name="panCard"
//                             onChange={handleFileChange} // ✅ Correct
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           />
//                         </div>

//                         {/* Authorized Address Proof */}
//                         <div className="mb-3 d-flex align-items-center">
//                           <input
//                             type="text"
//                             className="form-control col"
//                             placeholder="Authorized Address Proof"
//                             value={formData.authorizedAddressProof || ""}
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-outline-primary ms-2"
//                             onClick={() =>
//                               document
//                                 .getElementById("authorizedAddressProof")
//                                 .click()
//                             }
//                           >
//                             Choose File
//                           </button>
//                           {/* <input
//                             type="file"
//                             id="authorizedAddressProof"
//                             name="authorizedAddressProof"
//                             onChange={handleChange}
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           /> */}
//                           <input
//                             type="file"
//                             id="authorizedAddressProof"
//                             name="authorizedAddressProof"
//                             onChange={handleFileChange} // ✅ Correct
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           />
//                         </div>

//                         {/* Other Documents */}
//                         <div className="mb-3 d-flex align-items-center">
//                           <input
//                             type="text"
//                             className="form-control col"
//                             placeholder="Other Documents"
//                             value={formData.otherDocuments || ""}
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-outline-primary ms-2"
//                             onClick={() =>
//                               document
//                                 .getElementById("otherDocuments")
//                                 .click()
//                             }
//                           >
//                             Choose File
//                           </button>
//                           {/* <input
//                             type="file"
//                             id="otherDocuments"
//                             name="otherDocuments"
//                             onChange={handleChange}
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           /> */}
//                           <input
//                             type="file"
//                             id="otherDocuments"
//                             name="otherDocuments"
//                             multiple
//                             onChange={handleFileChange} // ✅ Correct
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           />
//                         </div>
//                       </div>

//                       {/* Right Column */}
//                       <div className="col-sm-6">
//                         {/* Billing Address Proof */}
//                         <div className="mb-3 d-flex align-items-center">
//                           <input
//                             type="text"
//                             className="form-control col"
//                             placeholder="Billing Address Proof"
//                             value={formData.billingAddressProof || ""}
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-outline-primary ms-2"
//                             onClick={() =>
//                               document
//                                 .getElementById("billingAddressProof")
//                                 .click()
//                             }
//                           >
//                             Choose File
//                           </button>
//                           {/* <input
//                             type="file"
//                             id="billingAddressProof"
//                             name="billingAddressProof"
//                             onChange={handleChange}
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           /> */}
//                           <input
//                             type="file"
//                             id="billingAddressProof"
//                             name="billingAddressProof"
//                             onChange={handleFileChange} // ✅ Correct
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           />
//                         </div>

//                         {/* Authorized Person ID */}
//                         <div className="mb-3 d-flex align-items-center">
//                           <input
//                             type="text"
//                             className="form-control col"
//                             placeholder="Authorized Person ID"
//                             value={formData.authorizedId || ""}
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-outline-primary ms-2"
//                             onClick={() =>
//                               document.getElementById("authorizedId").click()
//                             }
//                           >
//                             Choose File
//                           </button>
//                           {/* <input
//                             type="file"
//                             id="authorizedId"
//                             name="authorizedId"
//                             onChange={handleChange}
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           /> */}
//                           <input
//                             type="file"
//                             id="authorizedId"
//                             name="authorizedId"
//                             onChange={handleFileChange} // ✅ Correct
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           />
//                         </div>

//                         {/* Company Logo */}
//                         <div className="mb-3 d-flex align-items-center">
//                           <input
//                             type="text"
//                             className="form-control col"
//                             placeholder="Company Logo"
//                             value={formData.companyLogo || ""}
//                             readOnly
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-outline-primary ms-2"
//                             onClick={() =>
//                               document.getElementById("companyLogo").click()
//                             }
//                           >
//                             Choose File
//                           </button>
//                           {/* <input
//                             type="file"
//                             id="companyLogo"
//                             name="companyLogo"
//                             onChange={handleChange}
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           /> */}
//                           <input
//                             type="file"
//                             id="companyLogo"
//                             name="companyLogo"
//                             onChange={handleFileChange} // ✅ Correct
//                             className="d-none"
//                             accept=".jpg,.jpeg,.png,.gif,.pdf"
//                           />
//                         </div>

//                         {/* Terms */}
//                         <div className="form-check mt-4">
//                           <input
//                             type="checkbox"
//                             name="termsAccepted"
//                             checked={formData.termsAccepted || false}
//                             onChange={handleChange}
//                             className={`form-check-input ${
//                               errors.termsAccepted ? "is-invalid" : ""
//                             }`}
//                           />
//                           <span className="form-check-label">
//                             I accept Terms & Conditions{" "}
//                             <span className="text-danger">*</span>
//                           </span>
//                           {errors.termsAccepted && (
//                             <div className="invalid-feedback">
//                               You must accept Terms
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Note */}
//                     <p className="text-muted mt-2">
//                       Note - Please use only jpg, gif, png, pdf for upload.
//                     </p>

//                     {/* Footer Buttons */}
//                     <div className="d-flex justify-content-between mt-4">
//                       <button
//                         type="button"
//                         className="btn btn-label-secondary btn-prev"
//                         onClick={prevStep}
//                       >
//                         <i className="icon-base ti tabler-arrow-left icon-xs me-sm-2 me-0"></i>
//                         Previous
//                       </button>
//                       <button
//                         type="submit"
//                         className="btn btn-success btn-submit"
//                       >
//                         Submit
//                         {isEdit ? "Update" : "Submit"}
//                       </button>
//                     </div>
//                   </div>
//                 )}
