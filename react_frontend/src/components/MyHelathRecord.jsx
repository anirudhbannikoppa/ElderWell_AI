import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const API_BASE = import.meta.env.VITE_API_URL_RECORD;

const MyHealthReports = () => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();

  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  const [newRecord, setNewRecord] = useState({
    doctorName: "",
    hospitalName: "",
    date: "",
    diagnosis: "",
    doctorSuggestion: "",
    prescribedMedicines: "",
    specialNotes: "",
  });

  // ========================
  // FETCH RECORDS (GET)
  // ========================
  const fetchHealthRecords = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: "elderwell-api" },
    });

    const res = await fetch(`${API_BASE}/health-records`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHealthRecords();
    }
  }, [isAuthenticated]);

  // ========================
  // FORM HANDLING
  // ========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const resetForm = () => {
    setNewRecord({
      doctorName: "",
      hospitalName: "",
      date: "",
      diagnosis: "",
      doctorSuggestion: "",
      prescribedMedicines: "",
      specialNotes: "",
    });
  };

  // ========================
  // CREATE / UPDATE
  // ========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await getAccessTokenSilently({
      authorizationParams: { audience: "elderwell-api" },
    });

    if (editId) {
      // UPDATE
      await fetch(`${API_BASE}/health-records/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecord),
      });
      setEditId(null);
    } else {
      // CREATE
      await fetch(`${API_BASE}/health-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecord),
      });
    }

    resetForm();
    fetchHealthRecords();
  };

  // ========================
  // EDIT
  // ========================
  const handleEdit = (record) => {
    setEditId(record.id);
    setNewRecord({
      doctorName: record.doctor_name,
      hospitalName: record.hospital_name,
      date: record.visit_date,
      diagnosis: record.diagnosis || "",
      doctorSuggestion: record.doctor_suggestion || "",
      prescribedMedicines: record.prescribed_medicines || "",
      specialNotes: record.special_notes || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ========================
  // DELETE
  // ========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?",
    );
    if (!confirmDelete) return;

    const token = await getAccessTokenSilently({
      authorizationParams: { audience: "elderwell-api" },
    });

    await fetch(`${API_BASE}/health-records/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchHealthRecords();
  };

  // ========================
  // AUTH GUARD
  // ========================
  if (!isAuthenticated) {
    return (
      <div className="relative h-screen flex justify-center items-center bg-gray-100">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/50"></div>
        <div className="relative z-10 text-center p-8 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            🔒 Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your health records securely.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ========================
  // UI
  // ========================
  return (
    <div className="p-8">
      <header className="text-center py-1">
        <h1 className="text-2xl font-bold text-customPurple">
          🩺 My Health Records
        </h1>
      </header>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="doctorName"
            value={newRecord.doctorName}
            onChange={handleChange}
            placeholder="👨‍⚕️ Doctor Name"
            required
            className="border rounded-md px-4 py-2"
          />
          <input
            name="hospitalName"
            value={newRecord.hospitalName}
            onChange={handleChange}
            placeholder="🏥 Hospital Name"
            required
            className="border rounded-md px-4 py-2"
          />
          <input
            type="date"
            name="date"
            value={newRecord.date}
            onChange={handleChange}
            required
            className="border rounded-md px-4 py-2"
          />
          <input
            name="diagnosis"
            value={newRecord.diagnosis}
            onChange={handleChange}
            placeholder="📝 Diagnosis"
            className="border rounded-md px-4 py-2"
          />
          <input
            name="doctorSuggestion"
            value={newRecord.doctorSuggestion}
            onChange={handleChange}
            placeholder="💬 Doctor Suggestions"
            className="border rounded-md px-4 py-2"
          />
          <input
            name="prescribedMedicines"
            value={newRecord.prescribedMedicines}
            onChange={handleChange}
            placeholder="💊 Medicines"
            className="border rounded-md px-4 py-2"
          />
          <textarea
            name="specialNotes"
            value={newRecord.specialNotes}
            onChange={handleChange}
            placeholder="🗒️ Special Notes"
            className="border rounded-md px-4 py-2 md:col-span-2"
          />
        </div>

        <button className="bg-purple-600 text-white px-8 py-3 rounded-full">
          {editId ? "✏️ Update Record" : "+ Add Report"}
        </button>
      </form>

      {/* TABLE */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-purple-600 text-white">
            <th className="p-2 border">Doctor</th>
            <th className="p-2 border">Hospital</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Diagnosis</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="odd:bg-purple-50">
              <td className="p-2 border">{r.doctor_name}</td>
              <td className="p-2 border">{r.hospital_name}</td>
              <td className="p-2 border">{r.visit_date}</td>
              <td className="p-2 border">{r.diagnosis}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(r)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-6 text-gray-500">
                No records yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyHealthReports;
