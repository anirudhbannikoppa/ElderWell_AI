import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Simple in-memory health records component
// - Allows adding/editing/deleting records locally (no backend)
// - Protects content behind Auth0 authentication
const MyHealthReports = () => {
  // Local state: saved records and the form payload
  const [records, setRecords] = useState([]);
  // We only need authentication state and the login helper here.
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [newRecord, setNewRecord] = useState({
    doctorName: "",
    hospitalName: "",
    date: "",
    diagnosis: "",
    doctorSuggestion: "",
    prescribedMedicines: "",
    testName: "",
    specialNotes: "",
    labReports: [],
  });
  const [editId, setEditId] = useState(null);

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  // Append selected files to `labReports`
  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewRecord({ ...newRecord, labReports: [...newRecord.labReports, ...Array.from(files)] });
  };

  // Submit form: create or update a record
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      setRecords(records.map((record) => (record.id === editId ? { ...record, ...newRecord } : record)));
      setEditId(null);
    } else {
      setRecords([...records, { id: Date.now(), ...newRecord }]);
    }
    resetForm();
  };

  // Delete record after confirmation
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) setRecords(records.filter((record) => record.id !== id));
  };

  // Prepare form for editing a record (clear file inputs)
  const handleEdit = (record) => {
    setNewRecord({ ...record, labReports: [] }); // don't carry old File objects
    setEditId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form to initial state
  const resetForm = () => {
    setNewRecord({ doctorName: "", hospitalName: "", date: "", diagnosis: "", doctorSuggestion: "", prescribedMedicines: "", testName: "", specialNotes: "", labReports: [] });
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="relative h-screen flex justify-center items-center bg-gray-100">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/50"></div>
        <div className="relative z-10 text-center p-8 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">🔒 Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please log in to access your health records securely.</p>
          <button onClick={() => loginWithRedirect()} className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition">Login</button>
        </div>
      </div>
    );
  }

  // Authenticated UI: form to add/update records and a table listing records
  return (
    <div className="p-8">
      <header className="text-center py-1">
        <h1 className="text-2xl font-bold text-customPurple hover:text-blue-600 transition-colors">🩺 My Health Records</h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="doctorName" value={newRecord.doctorName} onChange={handleChange} placeholder="👨‍⚕️ Doctor Name" required className="border border-gray-300 rounded-md px-4 py-2" />
          <input type="text" name="hospitalName" value={newRecord.hospitalName} onChange={handleChange} placeholder="🏥 Hospital / Clinic Name" required className="border border-gray-300 rounded-md px-4 py-2" />
          <input type="date" name="date" value={newRecord.date} onChange={handleChange} required className="border border-gray-300 rounded-md px-4 py-2" />
          <input type="text" name="diagnosis" value={newRecord.diagnosis} onChange={handleChange} placeholder="📝 Diagnosis" className="border border-gray-300 rounded-md px-4 py-2" />
          <input type="text" name="doctorSuggestion" value={newRecord.doctorSuggestion} onChange={handleChange} placeholder="💬 Doctor's Suggestions" className="border border-gray-300 rounded-md px-4 py-2" />
          <input type="text" name="prescribedMedicines" value={newRecord.prescribedMedicines} onChange={handleChange} placeholder="💊 Prescribed Medicines" className="border border-gray-300 rounded-md px-4 py-2" />
          <input type="text" name="testName" value={newRecord.testName} onChange={handleChange} placeholder="🧪 Test / Report Name" required className="border border-gray-300 rounded-md px-4 py-2" />
          <input type="file" name="labReports" accept=".pdf,.doc,.docx,.odt" multiple onChange={handleFileChange} className="border border-gray-300 rounded-md px-4 py-2" />
          <textarea name="specialNotes" value={newRecord.specialNotes} onChange={handleChange} placeholder="🗒️ Special Notes (optional)" className="border border-gray-300 rounded-md px-4 py-2 md:col-span-2" />
        </div>
        <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition mt-4">{editId !== null ? "✏️ Update Record" : "+ Add Report"}</button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-purple-600 text-white text-sm">
              <th className="p-3 border">👨‍⚕️ Doctor</th>
              <th className="p-3 border">🏥 Hospital</th>
              <th className="p-3 border">📅 Date</th>
              <th className="p-3 border">📝 Diagnosis</th>
              <th className="p-3 border">💬 Suggestions</th>
              <th className="p-3 border">💊 Medicines</th>
              <th className="p-3 border">🧪 Test</th>
              <th className="p-3 border">🗒️ Notes</th>
              <th className="p-3 border">📂 Lab Reports</th>
              <th className="p-3 border">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="odd:bg-purple-50 even:bg-white text-sm">
                <td className="p-3 border">{record.doctorName}</td>
                <td className="p-3 border">{record.hospitalName}</td>
                <td className="p-3 border">{record.date}</td>
                <td className="p-3 border">{record.diagnosis}</td>
                <td className="p-3 border">{record.doctorSuggestion}</td>
                <td className="p-3 border">{record.prescribedMedicines}</td>
                <td className="p-3 border">{record.testName}</td>
                <td className="p-3 border">{record.specialNotes}</td>
                <td className="p-3 border">
                  {record.labReports.length > 0 ? (
                    <ul className="space-y-1">
                      {record.labReports.map((file, idx) => (
                        <li key={idx}>
                          <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">
                            📄 {file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No File"
                  )}
                </td>
                <td className="p-3 border flex gap-2 justify-center">
                  <button onClick={() => handleEdit(record)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">✏️ Edit</button>
                  <button onClick={() => handleDelete(record.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">🗑️ Delete</button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center p-6 text-gray-500">No records yet. Please add your first health report!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyHealthReports;
