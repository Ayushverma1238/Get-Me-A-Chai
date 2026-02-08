import React from 'react'


export default function About() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-6">
          About <span className="text-green-400">Get Me a Chai</span> ☕
        </h1>

        {/* Intro */}
        <p className="text-gray-300 text-center mb-10 leading-relaxed">
          Get Me a Chai is a simple and friendly platform where creators,
          developers, and students can receive support from people who
          appreciate their work — one chai at a time.
        </p>

        {/* Mission Section */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-3">🎯 Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            Our mission is to empower individuals by providing an easy and
            transparent way to receive small contributions. Whether you're
            building open-source projects, creating content, or learning new
            skills, every chai matters.
          </p>
        </div>

        {/* Why Section */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-3">💡 Why Get Me a Chai?</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Simple and secure support system</li>
            <li>No complicated subscriptions</li>
            <li>Perfect for students & creators</li>
            <li>Built with modern web technologies</li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-3">🛠 Tech Stack</h2>
          <p className="text-gray-400">
            This project is built using <span className="text-white">Next.js</span>,{" "}
            <span className="text-white">React</span>,{" "}
            <span className="text-white">Tailwind CSS</span>, and{" "}
            <span className="text-white">MongoDB</span> to ensure performance,
            scalability, and a great user experience.
          </p>
        </div>

        {/* Footer Line */}
        <p className="text-center text-gray-500 mt-10">
          ☕ Built with love, logic, and lots of chai.
        </p>

      </div>
    </div>
  );
}


export const metadata = {
  title: 'About - Get Me A Chai',
  description: 'This is the About page which tell the basic detail of our website',
}