import React from 'react';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'CEO',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'John is the CEO of the company.',
  },
  {
    name: 'Jane Smith',
    role: 'CTO',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Jane is the CTO of the company.',
  },
  {
    name: 'Michael Johnson',
    role: 'CFO',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Michael is the CFO of the company.',
  },
  {
    name: 'Emily Davis',
    role: 'COO',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Emily is the COO of the company.',
  },
  {
    name: 'David Wilson',
    role: 'CMO',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'David is the CMO of the company.',
  },
  {
    name: 'Sophia Brown',
    role: 'CIO',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'Sophia is the CIO of the company.',
  },
];

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <img
              className="w-24 h-24 rounded-full mx-auto mb-4"
              src={member.imageUrl}
              alt={member.name}
            />
            <h2 className="text-xl font-semibold mb-1">{member.name}</h2>
            <p className="text-gray-600">{member.role}</p>
            {/* <p className="text-gray-700">{member.description}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
