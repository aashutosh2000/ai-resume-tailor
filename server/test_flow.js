const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testFullFlow() {
  try {
    console.log('--- 1. Testing User Registration ---');
    const authRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Aashutosh Soni',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    });
    const token = authRes.data.token;
    console.log('✓ JWT Auth Token Received:', token.slice(0, 25) + '...');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n--- 2. Testing Base Resume Parsing ---');
    const resumeRes = await axios.post(`${BASE_URL}/resumes/paste`, {
      title: 'Aashutosh Soni - Full Stack Developer Resume',
      rawText: `AASHUTOSH SONI
Full Stack Developer (MERN) | AI Agent Builder | Technical Trainer
aashutoshsoni2019@gmail.com | +91 9755628076 | Pendra Road, Chhattisgarh, India | linkedin.com/in/aashutosh-soni

PROFESSIONAL SUMMARY
Results-driven Full Stack Developer and Technical Trainer with an MCA background and 2+ years of hands-on experience building scalable MERN Stack web applications, AI Agents, and AI-integrated products.

TECHNICAL SKILLS
Frontend: React.js, Hooks, Context API, HTML5, CSS3, Tailwind CSS, JavaScript (ES6+)
Backend: Node.js, Express.js, RESTful APIs, MVC Architecture, JWT Authentication
Database & Cloud: MongoDB / MongoDB Atlas, SQL, DBMS, Cloudinary, Vercel, Render
AI & Agents: LLM APIs (OpenAI, Gemini, Claude), AI Agent Development, Prompt Engineering
Tools: Git, Axios, Multer, Postman

WORK EXPERIENCE
Account Manager & Technical Trainer | DAV Schools / Codevidhya | Apr 2024 – Mar 2026
• Designed and delivered comprehensive training programs in HTML, CSS, JavaScript, Python, Robotics, and AI across 10+ DAV schools.
• Built and deployed multiple AI Agents using LLM APIs (OpenAI, Gemini, Claude).

Full Stack Mobile App Development Intern | National Informatics Centre (NIC) | Feb 2023 – Jul 2023
• Contributed to product lifecycle of "CG Kisan," a live government agricultural application serving farmers across Chhattisgarh.

EDUCATION
Master of Computer Applications (MCA) | 2023 | 74.13%
Bachelor of Computer Applications (BCA) | 2021 | 71.13%`
    }, { headers });

    const resumeId = resumeRes.data.resume._id;
    console.log('✓ Base Resume Created with ID:', resumeId);
    console.log('  Extracted Technical Skills:', resumeRes.data.resume.parsedData.skills.technical.slice(0, 6).join(', '));

    console.log('\n--- 3. Testing Target Job Description Creation ---');
    const jobRes = await axios.post(`${BASE_URL}/jobs`, {
      title: 'Senior Full Stack Developer (AI & React)',
      company: 'Tech Innovators Inc',
      rawText: 'Looking for a Senior Full Stack Developer proficient in React.js, Node.js, Express.js, MongoDB, RESTful APIs, Tailwind CSS, OpenAI API, Gemini API, and Python. Responsible for building responsive UI components, AI Agent workflows, and cloud deployments.'
    }, { headers });

    const jobId = jobRes.data.job._id;
    console.log('✓ Job Description Saved with ID:', jobId);

    console.log('\n--- 4. Testing Truthful AI Resume Tailoring Engine ---');
    const tailorRes = await axios.post(`${BASE_URL}/tailor/generate`, {
      baseResumeId: resumeId,
      jobId: jobId,
      templateId: 'modern'
    }, { headers });

    const tailoredData = tailorRes.data.tailoredResume;
    console.log('✓ AI Tailoring Complete!');
    console.log('  Overall ATS Match Score:', tailoredData.matchScore.overall + '%');
    console.log('  Skills Match Score:', tailoredData.matchScore.skillsMatch + '%');
    console.log('  Matching Keywords:', tailoredData.matchingKeywords.join(', '));
    console.log('  Missing Skills Count:', tailoredData.missingSkills.length);
    console.log('  Tailored Summary:', tailoredData.tailoredContent.summary.slice(0, 110) + '...');
    console.log('  Cover Letter Opening:', tailoredData.coverLetter.opening.slice(0, 90) + '...');

    console.log('\n--- 5. Testing PDF & DOCX Export Endpoints ---');
    const pdfRes = await axios.get(`${BASE_URL}/export/pdf/${tailoredData._id}`, { headers, responseType: 'arraybuffer' });
    console.log('✓ PDF Export Generated (Buffer size:', pdfRes.data.length, 'bytes)');

    const docxRes = await axios.get(`${BASE_URL}/export/docx/${tailoredData._id}`, { headers, responseType: 'arraybuffer' });
    console.log('✓ DOCX Export Generated (Buffer size:', docxRes.data.length, 'bytes)');

    console.log('\n=====================================================');
    console.log('🎉 ALL END-TO-END SYSTEM TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('=====================================================');
  } catch (err) {
    console.error('❌ Test Failed:', err.response ? err.response.data : err.message);
  }
}

testFullFlow();
