// src/components/mypage/Support.tsx
import React, { useState } from 'react';

const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 서버로 formData를 전송하는 로직을 추가합니다.
    setIsSubmitted(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Support</h2>
      {isSubmitted ? (
        <p className="text-green-600">
          Your message has been sent successfully!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={4}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Send Message
          </button>
        </form>
      )}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Contact Information</h3>
        <p className="mt-2">
          You can also reach us through the following methods:
        </p>
        <ul className="mt-2 list-disc list-inside">
          <li>Email: support@homesecurity.com</li>
          <li>Phone: 123-456-7890</li>
          <li>Address: 123 Security St, Safe City, SC 12345</li>
        </ul>
      </div>
    </div>
  );
};

export default Support;
