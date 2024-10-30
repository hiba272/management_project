import React, { useEffect, useState } from 'react';

const ListeEmployes = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/employes/')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  return (
    <div className="max-w-full overflow-x-auto table-wrapper">
      <table className="table w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-4 px-4 font-medium text-black">Name</th>
            <th className="py-4 px-4 font-medium text-black">Position</th>
            <th className="py-4 px-4 font-medium text-black">Department</th>
            <th className="py-4 px-4 font-medium text-black">Telephone</th>
            <th className="py-4 px-4 font-medium text-black">Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border-b py-4 px-4">{employee.user.username}</td>
              <td className="border-b py-4 px-4">{employee.position}</td>
              <td className="border-b py-4 px-4">{employee.department}</td>
              <td className="border-b py-4 px-4">{employee.tel || 'N/A'}</td>
              <td className="border-b py-4 px-4">{employee.user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListeEmployes;
