import React from 'react';
import hj from '../assets/aboutus/hj.png';
import dw from '../assets/aboutus/dw.png';
import sk from '../assets/aboutus/sk.png';
import hl from '../assets/aboutus/hl.png';
import sh from '../assets/aboutus/sh.png';
import yh from '../assets/aboutus/yh.png';

const teamMembers = [
  {
    name: 'Hosea Kim',
    role: 'A605 Team Leader, Raspberry Pi',
    image: hj,
  },
  {
    name: 'Seonki Hong',
    role: 'Backend Team Leader',
    image: sk,
  },
  {
    name: 'Dongwook Lee',
    role: 'Frontend Team Leader',
    image: dw,
  },
  {
    name: 'Hyolim Lee',
    role: 'Backend Team Member',
    image: hl,
  },
  {
    name: 'Seunghyun Yoo',
    role: 'Backend Team Member',
    image: sh,
  },
  {
    name: 'Yoonha Lee',
    role: 'Frontend Team Member',
    image: yh,
  },
];

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <img
              className="w-24 h-24 rounded-full mx-auto mb-4"
              src={member.image}
              alt={member.name}
            />
            <h2 className="text-xl font-semibold mb-1">{member.name}</h2>
            <p className="text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
