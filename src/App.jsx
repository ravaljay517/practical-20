
import React, { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const emptyEmployee = {
  name: "",
  email: "",
  department: "",
  salary: "",
};

function EmployeeForm({
  formData,
  setFormData,
  editingId,
  onSubmit,
  onCancel,
  saving,
}) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Employee Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter employee name"
          required
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Department
        </label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Monthly Salary (₹)
        </label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Enter monthly salary"
          min="0"
          step="0.01"
          required
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : editingId !== null
          ? "Update Employee"
          : "Add Employee"}
      </button>

      {editingId !== null && (
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-100"
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}

function EmployeeTable({ employees, onEdit, onDelete, deletingId }) {
  if (employees.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No employees found. Add your first employee.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Employee</th>
            <th className="p-3">Email</th>
            <th className="p-3">Department</th>
            <th className="p-3">Monthly Salary</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="border-b border-gray-100 hover:bg-blue-50"
            >
              <td className="p-3">{employee.id}</td>

              <td className="p-3 font-medium text-gray-800">
                {employee.name}
              </td>

              <td className="p-3 text-gray-600">
                {employee.email}
              </td>

              <td className="p-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                  {employee.department}
                </span>
              </td>

              <td className="p-3 whitespace-nowrap">
                ₹{Number(employee.salary).toLocaleString("en-IN")}
              </td>

              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(employee)}
                    disabled={deletingId === employee.id}
                    className="rounded-md bg-amber-500 px-3 py-2 text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(employee)}
                    disabled={deletingId === employee.id}
                    className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === employee.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // READ: Load employees from the API
  const loadEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load employees.");
      }

      const data = await response.json();

      const employeeData = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        department: ["IT", "HR", "Finance", "Marketing", "Sales"][
          (user.id - 1) % 5
        ],
        salary: String(25000 + user.id * 5000),
      }));

      setEmployees(employeeData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // CREATE and UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department,
      salary: Number(formData.salary),
    };

    try {
      if (editingId !== null) {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Unable to update employee.");
        }

        setEmployees((previous) =>
          previous.map((employee) =>
            employee.id === editingId
              ? { ...employee, ...payload }
              : employee
          )
        );

        setMessage("Employee updated successfully!");
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Unable to add employee.");
        }

        const data = await response.json();

        const newEmployee = {
          ...payload,
          id: data.id || Date.now(),
        };

        setEmployees((previous) => [newEmployee, ...previous]);
        setMessage("Employee added successfully!");
      }

      setFormData(emptyEmployee);
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Request failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Select an employee for editing
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: String(employee.salary),
    });
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE
  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    setDeletingId(employee.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${employee.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete employee.");
      }

      setEmployees((previous) =>
        previous.filter((item) => item.id !== employee.id)
      );

      if (editingId === employee.id) {
        setEditingId(null);
        setFormData(emptyEmployee);
      }

      setMessage("Employee deleted successfully!");
    } catch (err) {
      setError(err.message || "Delete request failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.email} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyEmployee);
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 rounded-2xl bg-blue-700 p-6 text-white shadow-lg sm:p-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-200">
            Employee Administration
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Employee Management System
          </h1>
          <p className="mt-2 text-blue-100">
            Create, view, update, and delete employee records.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total Employees"
            value={employees.length}
            color="blue"
          />
          <SummaryCard
            title="Departments"
            value={new Set(employees.map((item) => item.department)).size}
            color="green"
          />
          <SummaryCard
            title="Filtered Results"
            value={filteredEmployees.length}
            color="purple"
          />
        </div>

        {/* Messages */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
            {employees.length === 0 && (
              <button
                onClick={loadEmployees}
                className="ml-3 font-bold underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700"
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Employee Form */}
          <section className="rounded-xl bg-white p-6 shadow-md lg:col-span-1">
            <h2 className="mb-1 text-xl font-bold text-gray-800">
              {editingId !== null ? "Edit Employee" : "Add Employee"}
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              {editingId !== null
                ? "Update the employee's information below."
                : "Fill in the form to create a new employee."}
            </p>

            <EmployeeForm
              formData={formData}
              setFormData={setFormData}
              editingId={editingId}
              onSubmit={handleSubmit}
              onCancel={cancelEdit}
              saving={saving}
            />
          </section>

          {/* Employee List */}
          <section className="min-w-0 rounded-xl bg-white p-6 shadow-md lg:col-span-2">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Employee List
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your employee records
                </p>
              </div>

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-xs"
              />
            </div>

            {loading ? (
              <p className="py-12 text-center text-blue-600">
                Loading employees...
              </p>
            ) : (
              <EmployeeTable
                employees={filteredEmployees}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            )}
          </section>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          React CRUD Practical · Tailwind CSS · Fetch API
        </footer>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  const colors = {
    blue: "border-blue-500 text-blue-700",
    green: "border-green-500 text-green-700",
    purple: "border-purple-500 text-purple-700",
  };

  return (
    <div
      className={`rounded-xl border-l-4 bg-white p-5 shadow ${colors[color]}`}
    >
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default App;
